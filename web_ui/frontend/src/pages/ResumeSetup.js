import React, { useState } from 'react';
import { 
  Typography, Box, Paper, Stepper, Step, StepLabel, Button,
  TextField, Grid, IconButton, Divider, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

const ResumeSetup = () => {
  const navigate = useNavigate();
  const { completeSetupStep, showNotification } = useAppContext();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [resumeData, setResumeData] = useState({
    personal_information: {
      name: '',
      surname: '',
      date_of_birth: '',
      country: '',
      city: '',
      address: '',
      zip_code: '',
      phone_prefix: '',
      phone: '',
      email: '',
      github: '',
      linkedin: ''
    },
    education_details: [
      {
        education_level: '',
        institution: '',
        field_of_study: '',
        graduation_year: '',
        start_date: '',
        final_evaluation_grade: ''
      }
    ],
    experience_details: [
      {
        position: '',
        company: '',
        employment_period: '',
        location: '',
        description: ''
      }
    ],
    skills: [
      {
        name: '',
        level: 'Beginner'
      }
    ],
    languages: [
      {
        language: '',
        proficiency: 'Beginner'
      }
    ],
    certifications: [
      {
        name: '',
        issuer: '',
        date: '',
        description: ''
      }
    ],
    legal_authorization: {
      eu_work_authorization: 'No',
      us_work_authorization: 'No',
      requires_us_visa: 'Yes'
    }
  });
  
  // Steps
  const steps = [
    'Personal Information',
    'Education',
    'Experience',
    'Skills & Languages',
    'Certifications',
    'Legal Status'
  ];
  
  // Handle form field changes for personal information
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setResumeData({
      ...resumeData,
      personal_information: {
        ...resumeData.personal_information,
        [name]: value
      }
    });
  };
  
  // Handle form field changes for array-based sections
  const handleArrayFieldChange = (section, index, field, value) => {
    const updatedSection = [...resumeData[section]];
    updatedSection[index] = {
      ...updatedSection[index],
      [field]: value
    };
    
    setResumeData({
      ...resumeData,
      [section]: updatedSection
    });
  };
  
  // Add new item to array-based sections
  const addItemToSection = (section, template) => {
    setResumeData({
      ...resumeData,
      [section]: [...resumeData[section], template]
    });
  };
  
  // Remove item from array-based sections
  const removeItemFromSection = (section, index) => {
    if (resumeData[section].length <= 1) {
      showNotification('You need at least one entry in this section', 'warning');
      return;
    }
    
    const updatedSection = resumeData[section].filter((_, i) => i !== index);
    setResumeData({
      ...resumeData,
      [section]: updatedSection
    });
  };
  
  // Handle legal authorization changes
  const handleLegalAuthChange = (field, value) => {
    setResumeData({
      ...resumeData,
      legal_authorization: {
        ...resumeData.legal_authorization,
        [field]: value
      }
    });
  };
  
  // Validate current step
  const validateStep = () => {
    switch (activeStep) {
      case 0: // Personal Information
        const personal = resumeData.personal_information;
        return personal.name && personal.surname && personal.email;
      
      case 1: // Education
        return resumeData.education_details.every(
          edu => edu.education_level && edu.institution
        );
      
      case 2: // Experience
        return resumeData.experience_details.every(
          exp => exp.position && exp.company
        );
      
      case 3: // Skills & Languages
        return resumeData.skills.some(skill => skill.name) &&
               resumeData.languages.some(lang => lang.language);
      
      case 4: // Certifications
        return true; // Optional
        
      case 5: // Legal Status
        return true; // Always valid
      
      default:
        return true;
    }
  };
  
  // Handle next step
  const handleNext = () => {
    if (validateStep()) {
      setActiveStep(prevStep => prevStep + 1);
    } else {
      showNotification('Please fill in the required fields', 'error');
    }
  };
  
  // Handle back step
  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };
  
  // Handle save and complete
  const handleSave = async () => {
    if (!validateStep()) {
      showNotification('Please fill in the required fields', 'error');
      return;
    }
    
    setLoading(true);
    try {
      await axios.post('/api/save-resume', resumeData);
      completeSetupStep('resume');
      showNotification('Resume information saved successfully', 'success');
      navigate('/setup/preferences');
    } catch (error) {
      console.error('Error saving resume:', error);
      showNotification('Error saving resume information', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Render step content
  const getStepContent = (step) => {
    switch (step) {
      case 0: // Personal Information
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="First Name"
                name="name"
                value={resumeData.personal_information.name}
                onChange={handlePersonalInfoChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Last Name"
                name="surname"
                value={resumeData.personal_information.surname}
                onChange={handlePersonalInfoChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth (DD/MM/YYYY)"
                name="date_of_birth"
                value={resumeData.personal_information.date_of_birth}
                onChange={handlePersonalInfoChange}
                placeholder="e.g., 01/01/1990"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={resumeData.personal_information.country}
                onChange={handlePersonalInfoChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={resumeData.personal_information.city}
                onChange={handlePersonalInfoChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={resumeData.personal_information.address}
                onChange={handlePersonalInfoChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ZIP Code"
                name="zip_code"
                value={resumeData.personal_information.zip_code}
                onChange={handlePersonalInfoChange}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Phone Prefix"
                name="phone_prefix"
                value={resumeData.personal_information.phone_prefix}
                onChange={handlePersonalInfoChange}
                placeholder="e.g., +1"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={resumeData.personal_information.phone}
                onChange={handlePersonalInfoChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Email"
                name="email"
                type="email"
                value={resumeData.personal_information.email}
                onChange={handlePersonalInfoChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="GitHub URL"
                name="github"
                value={resumeData.personal_information.github}
                onChange={handlePersonalInfoChange}
                placeholder="e.g., https://github.com/yourusername"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="LinkedIn URL"
                name="linkedin"
                value={resumeData.personal_information.linkedin}
                onChange={handlePersonalInfoChange}
                placeholder="e.g., https://linkedin.com/in/yourusername"
              />
            </Grid>
          </Grid>
        );
        
      case 1: // Education
        return (
          <>
            {resumeData.education_details.map((education, index) => (
              <Box key={index} mb={3}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="h6">
                    Education #{index + 1}
                  </Typography>
                  <IconButton 
                    color="error" 
                    onClick={() => removeItemFromSection('education_details', index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Degree/Education Level"
                      value={education.education_level}
                      onChange={(e) => handleArrayFieldChange('education_details', index, 'education_level', e.target.value)}
                      placeholder="e.g., Bachelor's Degree"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Institution"
                      value={education.institution}
                      onChange={(e) => handleArrayFieldChange('education_details', index, 'institution', e.target.value)}
                      placeholder="e.g., University of Example"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Field of Study"
                      value={education.field_of_study}
                      onChange={(e) => handleArrayFieldChange('education_details', index, 'field_of_study', e.target.value)}
                      placeholder="e.g., Computer Science"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Start Year"
                      value={education.start_date}
                      onChange={(e) => handleArrayFieldChange('education_details', index, 'start_date', e.target.value)}
                      placeholder="e.g., 2016"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Graduation Year"
                      value={education.graduation_year}
                      onChange={(e) => handleArrayFieldChange('education_details', index, 'graduation_year', e.target.value)}
                      placeholder="e.g., 2020"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Final Grade/GPA"
                      value={education.final_evaluation_grade}
                      onChange={(e) => handleArrayFieldChange('education_details', index, 'final_evaluation_grade', e.target.value)}
                      placeholder="e.g., 3.8/4.0 or First Class Honors"
                    />
                  </Grid>
                </Grid>
                
                {index < resumeData.education_details.length - 1 && (
                  <Divider sx={{ my: 2 }} />
                )}
              </Box>
            ))}
            
            <Box mt={2}>
              <Button
                startIcon={<AddIcon />}
                onClick={() => addItemToSection('education_details', {
                  education_level: '',
                  institution: '',
                  field_of_study: '',
                  graduation_year: '',
                  start_date: '',
                  final_evaluation_grade: ''
                })}
              >
                Add Education
              </Button>
            </Box>
          </>
        );
        
      case 2: // Experience
        return (
          <>
            {resumeData.experience_details.map((experience, index) => (
              <Box key={index} mb={3}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="h6">
                    Experience #{index + 1}
                  </Typography>
                  <IconButton 
                    color="error" 
                    onClick={() => removeItemFromSection('experience_details', index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Position/Title"
                      value={experience.position}
                      onChange={(e) => handleArrayFieldChange('experience_details', index, 'position', e.target.value)}
                      placeholder="e.g., Software Engineer"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Company/Organization"
                      value={experience.company}
                      onChange={(e) => handleArrayFieldChange('experience_details', index, 'company', e.target.value)}
                      placeholder="e.g., ABC Technologies"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Employment Period"
                      value={experience.employment_period}
                      onChange={(e) => handleArrayFieldChange('experience_details', index, 'employment_period', e.target.value)}
                      placeholder="e.g., 03/2018 - 05/2020"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={experience.location}
                      onChange={(e) => handleArrayFieldChange('experience_details', index, 'location', e.target.value)}
                      placeholder="e.g., New York, NY"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Description/Responsibilities"
                      value={experience.description}
                      onChange={(e) => handleArrayFieldChange('experience_details', index, 'description', e.target.value)}
                      placeholder="Describe your responsibilities and achievements"
                    />
                  </Grid>
                </Grid>
                
                {index < resumeData.experience_details.length - 1 && (
                  <Divider sx={{ my: 2 }} />
                )}
              </Box>
            ))}
            
            <Box mt={2}>
              <Button
                startIcon={<AddIcon />}
                onClick={() => addItemToSection('experience_details', {
                  position: '',
                  company: '',
                  employment_period: '',
                  location: '',
                  description: ''
                })}
              >
                Add Experience
              </Button>
            </Box>
          </>
        );
        
      case 3: // Skills & Languages
        return (
          <>
            <Typography variant="h6" gutterBottom>
              Skills
            </Typography>
            
            {resumeData.skills.map((skill, index) => (
              <Box key={index} mb={2} display="flex" alignItems="center">
                <TextField
                  sx={{ flexGrow: 1, mr: 2 }}
                  required
                  label="Skill"
                  value={skill.name}
                  onChange={(e) => handleArrayFieldChange('skills', index, 'name', e.target.value)}
                  placeholder="e.g., JavaScript"
                />
                <TextField
                  sx={{ width: '180px', mr: 2 }}
                  select
                  label="Level"
                  value={skill.level}
                  onChange={(e) => handleArrayFieldChange('skills', index, 'level', e.target.value)}
                  SelectProps={{
                    native: true
                  }}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </TextField>
                <IconButton 
                  color="error" 
                  onClick={() => removeItemFromSection('skills', index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            
            <Box mt={2} mb={4}>
              <Button
                startIcon={<AddIcon />}
                onClick={() => addItemToSection('skills', {
                  name: '',
                  level: 'Beginner'
                })}
              >
                Add Skill
              </Button>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Languages
            </Typography>
            
            {resumeData.languages.map((language, index) => (
              <Box key={index} mb={2} display="flex" alignItems="center">
                <TextField
                  sx={{ flexGrow: 1, mr: 2 }}
                  required
                  label="Language"
                  value={language.language}
                  onChange={(e) => handleArrayFieldChange('languages', index, 'language', e.target.value)}
                  placeholder="e.g., English"
                />
                <TextField
                  sx={{ width: '180px', mr: 2 }}
                  select
                  label="Proficiency"
                  value={language.proficiency}
                  onChange={(e) => handleArrayFieldChange('languages', index, 'proficiency', e.target.value)}
                  SelectProps={{
                    native: true
                  }}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Native">Native</option>
                  <option value="Fluent">Fluent</option>
                </TextField>
                <IconButton 
                  color="error" 
                  onClick={() => removeItemFromSection('languages', index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            
            <Box mt={2}>
              <Button
                startIcon={<AddIcon />}
                onClick={() => addItemToSection('languages', {
                  language: '',
                  proficiency: 'Beginner'
                })}
              >
                Add Language
              </Button>
            </Box>
          </>
        );
        
      case 4: // Certifications
        return (
          <>
            <Alert severity="info" sx={{ mb: 3 }}>
              Certifications are optional but can enhance your resume.
            </Alert>
            
            {resumeData.certifications.map((certification, index) => (
              <Box key={index} mb={3}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="h6">
                    Certification #{index + 1}
                  </Typography>
                  <IconButton 
                    color="error" 
                    onClick={() => removeItemFromSection('certifications', index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Certification Name"
                      value={certification.name}
                      onChange={(e) => handleArrayFieldChange('certifications', index, 'name', e.target.value)}
                      placeholder="e.g., AWS Certified Solutions Architect"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Issuing Organization"
                      value={certification.issuer}
                      onChange={(e) => handleArrayFieldChange('certifications', index, 'issuer', e.target.value)}
                      placeholder="e.g., Amazon Web Services"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Date"
                      value={certification.date}
                      onChange={(e) => handleArrayFieldChange('certifications', index, 'date', e.target.value)}
                      placeholder="e.g., March 2020"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      value={certification.description}
                      onChange={(e) => handleArrayFieldChange('certifications', index, 'description', e.target.value)}
                      placeholder="Brief description of the certification"
                    />
                  </Grid>
                </Grid>
                
                {index < resumeData.certifications.length - 1 && (
                  <Divider sx={{ my: 2 }} />
                )}
              </Box>
            ))}
            
            <Box mt={2}>
              <Button
                startIcon={<AddIcon />}
                onClick={() => addItemToSection('certifications', {
                  name: '',
                  issuer: '',
                  date: '',
                  description: ''
                })}
              >
                Add Certification
              </Button>
            </Box>
          </>
        );
        
      case 5: // Legal Status
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                This information helps tailor your job search to positions you're legally eligible for.
              </Alert>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="EU Work Authorization"
                value={resumeData.legal_authorization.eu_work_authorization}
                onChange={(e) => handleLegalAuthChange('eu_work_authorization', e.target.value)}
                SelectProps={{
                  native: true
                }}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="US Work Authorization"
                value={resumeData.legal_authorization.us_work_authorization}
                onChange={(e) => handleLegalAuthChange('us_work_authorization', e.target.value)}
                SelectProps={{
                  native: true
                }}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Requires US Visa Sponsorship"
                value={resumeData.legal_authorization.requires_us_visa}
                onChange={(e) => handleLegalAuthChange('requires_us_visa', e.target.value)}
                SelectProps={{
                  native: true
                }}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </TextField>
            </Grid>
          </Grid>
        );
        
      default:
        return <Typography>Unknown step</Typography>;
    }
  };
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Resume Setup
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Enter your resume information to get started. This will be used to generate tailored resumes and cover letters.
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box>
          {/* Step content */}
          {getStepContent(activeStep)}
          
          {/* Navigation buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save & Continue'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ResumeSetup;
