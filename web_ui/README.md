# AIHawk Jobs Applier Web UI

This is the web-based user interface for the AIHawk Jobs Applier, providing a user-friendly way to create tailored resumes and cover letters for job applications.

## Project Structure

The project is divided into two main parts:

- **Frontend**: React-based user interface built with Material UI
- **Backend**: FastAPI application that interfaces with the core AI functionality

## Getting Started

### Prerequisites

- Node.js 14+ and npm
- Python 3.9+
- An OpenAI API key or other supported language model API key

### Installation

#### Backend Setup

1. Navigate to the backend directory:
   ```
   cd web_ui/backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```
     source venv/bin/activate
     ```

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

#### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd web_ui/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

### Running the Application

#### Start the Backend Server

1. From the backend directory with your virtual environment activated:
   ```
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

#### Start the Frontend Development Server

1. From the frontend directory:
   ```
   npm start
   ```

2. Access the application at http://localhost:3000

## Usage Guide

### Setup Process

Before generating documents, you need to complete the setup process:

1. **Resume Information**: Enter your personal information, education, work experience, and skills.
2. **Work Preferences**: Configure your job preferences, location, and other work-related settings.
3. **API Key Setup**: Add your language model API key for generating personalized content.

### Generating Documents

Once setup is complete, you can generate:

- **Basic Resume**: A professional resume based on your information
- **Tailored Resume**: A resume customized for a specific job description
- **Cover Letter**: A cover letter for a specific job application

## Production Deployment

For production deployment:

1. Build the frontend:
   ```
   cd web_ui/frontend
   npm run build
   ```

2. Copy the build directory to the backend/static directory.

3. Run the backend server:
   ```
   cd web_ui/backend
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

4. Access the application at http://your-server-ip:8000

## Features

- Multi-step form for resume information entry
- Job preference configuration
- API key management
- Resume generation (basic)
- Tailored resume generation (job-specific)
- Cover letter generation
- Document management
- Responsive design with Material UI

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the same license as the main AIHawk Jobs Applier project.
