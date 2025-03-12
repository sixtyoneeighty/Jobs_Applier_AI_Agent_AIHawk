from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import sys
import yaml
from pathlib import Path
import shutil

# Add parent directory to path so we can import from the main project
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

# Import the necessary modules from the main project
from src.libs.resume_and_cover_builder import ResumeFacade, ResumeGenerator, StyleManager
from src.resume_schemas.job_application_profile import JobApplicationProfile
from src.resume_schemas.resume import Resume
from src.logging import logger
from config import LLM_MODEL_TYPE, LLM_MODEL, LLM_API_URL

# Create FastAPI app
app = FastAPI(
    title="Jobs Applier AI Agent",
    description="A web API for the Jobs Applier AI Agent",
    version="1.0.0"
)

# Add CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path to store user uploads and generated files
UPLOAD_DIR = Path("uploads")
OUTPUT_DIR = Path("output")
UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

# Pydantic models for request and response
class ResumeInfo(BaseModel):
    personal_information: Dict[str, Any]
    education_details: List[Dict[str, Any]]
    experience_details: List[Dict[str, Any]]
    skills: List[Dict[str, Any]]
    languages: List[Dict[str, Any]]
    certifications: List[Dict[str, Any]]
    legal_authorization: Dict[str, Any]

class WorkPreferences(BaseModel):
    remote: bool
    experience_level: Dict[str, bool]
    job_types: Dict[str, bool]
    date: Dict[str, bool]
    positions: List[str]
    locations: List[str]
    location_blacklist: List[str]
    distance: int
    company_blacklist: List[str]
    title_blacklist: List[str]

class APIInfo(BaseModel):
    llm_api_key: str

class JobDescription(BaseModel):
    description: str
    title: str
    company: str

class GeneratedFile(BaseModel):
    filename: str
    file_url: str

# API routes
@app.post("/api/save-resume", response_model=dict)
async def save_resume(resume_info: ResumeInfo):
    """Save resume information to YAML file."""
    try:
        user_data_dir = UPLOAD_DIR / "user_data"
        user_data_dir.mkdir(exist_ok=True)
        
        resume_path = user_data_dir / "plain_text_resume.yaml"
        with open(resume_path, "w") as f:
            yaml.dump(resume_info.dict(), f)
        
        return {"success": True, "message": "Resume information saved successfully"}
    except Exception as e:
        logger.error(f"Error saving resume: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error saving resume: {str(e)}")

@app.post("/api/save-preferences", response_model=dict)
async def save_preferences(preferences: WorkPreferences):
    """Save work preferences to YAML file."""
    try:
        user_data_dir = UPLOAD_DIR / "user_data"
        user_data_dir.mkdir(exist_ok=True)
        
        prefs_path = user_data_dir / "work_preferences.yaml"
        with open(prefs_path, "w") as f:
            yaml.dump(preferences.dict(), f)
        
        return {"success": True, "message": "Work preferences saved successfully"}
    except Exception as e:
        logger.error(f"Error saving preferences: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error saving preferences: {str(e)}")

@app.post("/api/save-api-key", response_model=dict)
async def save_api_key(api_info: APIInfo):
    """Save API key to secrets YAML file."""
    try:
        user_data_dir = UPLOAD_DIR / "user_data"
        user_data_dir.mkdir(exist_ok=True)
        
        secrets_path = user_data_dir / "secrets.yaml"
        with open(secrets_path, "w") as f:
            yaml.dump({"llm_api_key": api_info.llm_api_key}, f)
        
        return {"success": True, "message": "API key saved successfully"}
    except Exception as e:
        logger.error(f"Error saving API key: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error saving API key: {str(e)}")

@app.post("/api/generate-resume", response_model=GeneratedFile)
async def generate_resume():
    """Generate a resume PDF."""
    try:
        user_data_dir = UPLOAD_DIR / "user_data"
        if not user_data_dir.exists():
            raise HTTPException(status_code=400, detail="User data not found. Please save your resume information first.")
        
        # Load yaml files
        resume_path = user_data_dir / "plain_text_resume.yaml"
        secrets_path = user_data_dir / "secrets.yaml"
        
        if not resume_path.exists() or not secrets_path.exists():
            raise HTTPException(status_code=400, detail="Required configuration files not found.")
        
        resume_data = yaml.safe_load(open(resume_path))
        secrets_data = yaml.safe_load(open(secrets_path))
        
        # Create a temporary data folder with the required structure
        temp_data_dir = Path("temp_data")
        temp_data_dir.mkdir(exist_ok=True)
        
        # Copy the files to the temporary directory
        shutil.copy(resume_path, temp_data_dir / "plain_text_resume.yaml")
        shutil.copy(secrets_path, temp_data_dir / "secrets.yaml")
        
        # Create output directory
        temp_output_dir = temp_data_dir / "output"
        temp_output_dir.mkdir(exist_ok=True)
        
        # Import the create_resume_pdf function from the main module
        sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
        from main import create_resume_pdf
        
        # Generate the resume
        output_path = create_resume_pdf(resume_data, secrets_data["llm_api_key"])
        
        # Copy the output file to our output directory
        output_filename = os.path.basename(output_path)
        shutil.copy(output_path, OUTPUT_DIR / output_filename)
        
        # Clean up
        shutil.rmtree(temp_data_dir)
        
        return {"filename": output_filename, "file_url": f"/api/files/{output_filename}"}
    except Exception as e:
        logger.error(f"Error generating resume: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating resume: {str(e)}")

@app.post("/api/generate-tailored-resume", response_model=GeneratedFile)
async def generate_tailored_resume(job: JobDescription):
    """Generate a resume tailored to a specific job description."""
    try:
        user_data_dir = UPLOAD_DIR / "user_data"
        if not user_data_dir.exists():
            raise HTTPException(status_code=400, detail="User data not found. Please save your resume information first.")
        
        # Load yaml files
        resume_path = user_data_dir / "plain_text_resume.yaml"
        secrets_path = user_data_dir / "secrets.yaml"
        
        if not resume_path.exists() or not secrets_path.exists():
            raise HTTPException(status_code=400, detail="Required configuration files not found.")
        
        resume_data = yaml.safe_load(open(resume_path))
        secrets_data = yaml.safe_load(open(secrets_path))
        
        # Add job description to the resume data
        resume_data["job_description"] = job.description
        resume_data["job_title"] = job.title
        resume_data["company"] = job.company
        
        # Create a temporary data folder with the required structure
        temp_data_dir = Path("temp_data")
        temp_data_dir.mkdir(exist_ok=True)
        
        # Copy the files to the temporary directory
        with open(temp_data_dir / "plain_text_resume.yaml", "w") as f:
            yaml.dump(resume_data, f)
        shutil.copy(secrets_path, temp_data_dir / "secrets.yaml")
        
        # Create output directory
        temp_output_dir = temp_data_dir / "output"
        temp_output_dir.mkdir(exist_ok=True)
        
        # Import the create_resume_pdf_job_tailored function from the main module
        sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
        from main import create_resume_pdf_job_tailored
        
        # Generate the tailored resume
        output_path = create_resume_pdf_job_tailored(resume_data, secrets_data["llm_api_key"])
        
        # Copy the output file to our output directory
        output_filename = os.path.basename(output_path)
        shutil.copy(output_path, OUTPUT_DIR / output_filename)
        
        # Clean up
        shutil.rmtree(temp_data_dir)
        
        return {"filename": output_filename, "file_url": f"/api/files/{output_filename}"}
    except Exception as e:
        logger.error(f"Error generating tailored resume: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating tailored resume: {str(e)}")

@app.post("/api/generate-cover-letter", response_model=GeneratedFile)
async def generate_cover_letter(job: JobDescription):
    """Generate a tailored cover letter for a specific job description."""
    try:
        user_data_dir = UPLOAD_DIR / "user_data"
        if not user_data_dir.exists():
            raise HTTPException(status_code=400, detail="User data not found. Please save your resume information first.")
        
        # Load yaml files
        resume_path = user_data_dir / "plain_text_resume.yaml"
        secrets_path = user_data_dir / "secrets.yaml"
        
        if not resume_path.exists() or not secrets_path.exists():
            raise HTTPException(status_code=400, detail="Required configuration files not found.")
        
        resume_data = yaml.safe_load(open(resume_path))
        secrets_data = yaml.safe_load(open(secrets_path))
        
        # Add job description to the resume data
        resume_data["job_description"] = job.description
        resume_data["job_title"] = job.title
        resume_data["company"] = job.company
        
        # Create a temporary data folder with the required structure
        temp_data_dir = Path("temp_data")
        temp_data_dir.mkdir(exist_ok=True)
        
        # Copy the files to the temporary directory
        with open(temp_data_dir / "plain_text_resume.yaml", "w") as f:
            yaml.dump(resume_data, f)
        shutil.copy(secrets_path, temp_data_dir / "secrets.yaml")
        
        # Create output directory
        temp_output_dir = temp_data_dir / "output"
        temp_output_dir.mkdir(exist_ok=True)
        
        # Import the create_cover_letter function from the main module
        sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
        from main import create_cover_letter
        
        # Generate the cover letter
        output_path = create_cover_letter(resume_data, secrets_data["llm_api_key"])
        
        # Copy the output file to our output directory
        output_filename = os.path.basename(output_path)
        shutil.copy(output_path, OUTPUT_DIR / output_filename)
        
        # Clean up
        shutil.rmtree(temp_data_dir)
        
        return {"filename": output_filename, "file_url": f"/api/files/{output_filename}"}
    except Exception as e:
        logger.error(f"Error generating cover letter: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating cover letter: {str(e)}")

@app.get("/api/files/{filename}")
async def get_file(filename: str):
    """Return generated files."""
    file_path = OUTPUT_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)

# Mount static files (for the frontend)
app.mount("/", StaticFiles(directory="../frontend/build", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
