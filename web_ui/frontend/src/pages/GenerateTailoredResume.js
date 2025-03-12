import React, { useState } from 'react';
import { 
  Typography, Box, Paper, Button, Alert, 
  CircularProgress, Card, CardContent, Link,
  TextField, Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import axios from 'axios';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const GenerateTailoredResume = () => {
  const navigate = useNavigate();
  const { isSetupComplete, addGeneratedFile, showNotification } = useAppContext();
  
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    description: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  // Redirect to setup if not completed
  React.useEffect(() => {
    if (!isSetupComplete()) {
      showNotification('Please complete the setup process first', 'warning');
      navigate('/setup/resume');
    }
  }, [isSetupComplete, navigate, showNotification]);
  
  const handleInputChange = (field, value) => {
    setJobData({
      ...jobData,
      [field]: value
    });
  };
  
  const validateForm = () => {
    if (!jobData.title.trim()) {
      showNotification('Please enter the job title', 'error');
      return false;
    }
    
    if (!jobData.company.trim()) {
      showNotification('Please enter the company name', 'error');
      return false;
    }
    
    if (!jobData.description.trim()) {
      showNotification('Please enter the job description', 'error');
      return false;
    }
    
    return true;
  };
  
  const handleGenerateResume = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await axios.post('/api/generate-tailored-resume', jobData);
      setResult(response.data);
      addGeneratedFile(response.data);
      showNotification('Tailored resume generated successfully', 'success');
    } catch (error) {
      console.error('Error generating tailored resume:', error);
      setError(error.response?.data?.detail || 'Error generating tailored resume');
      showNotification('Error generating tailored resume', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    setJobData({
      title: '',
      company: '',
      description: ''
    });
    setResult(null);
    setError(null);
  };
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Generate Tailored Resume
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Create a resume customized for a specific job posting by providing the job details below.
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        {!loading && !result && (
          <>
            <Alert severity="info" sx={{ mb: 3 }}>
              Enter the job details to create a resume that highlights your most relevant experiences and skills for this specific position.
            </Alert>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Job Title"
                  value={jobData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Senior Software Engineer"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Company Name"
                  value={jobData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="e.g., Acme Corporation"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={10}
                  label="Job Description"
                  value={jobData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Paste the full job description here..."
                  helperText="Include the complete job description for best results. The AI will use this to tailor your resume."
                />
              </Grid>
            </Grid>
            
            <Box display="flex" justifyContent="center" mt={4}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleGenerateResume}
                sx={{ px: 4, py: 1.5 }}
              >
                Generate Tailored Resume
              </Button>
            </Box>
          </>
        )}
        
        {loading && (
          <Box textAlign="center" py={6}>
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" mt={3}>
              Generating Your Tailored Resume...
            </Typography>
            <Typography variant="body2" color="textSecondary" mt={1}>
              This may take a few minutes as our AI analyzes the job description and optimizes your resume.
            </Typography>
          </Box>
        )}
        
        {error && (
          <Box mb={3}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
            <Box display="flex" justifyContent="center" mb={3}>
              <ErrorIcon sx={{ fontSize: 80, color: 'error.main' }} />
            </Box>
            <Box textAlign="center">
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateResume}
                sx={{ mr: 2 }}
              >
                Try Again
              </Button>
              <Button
                variant="outlined"
                onClick={resetForm}
              >
                Reset Form
              </Button>
            </Box>
          </Box>
        )}
        
        {result && (
          <Box>
            <Alert severity="success" sx={{ mb: 3 }}>
              Your tailored resume has been successfully generated!
            </Alert>
            
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Tailored Resume Generated
                  </Typography>
                </Box>
                
                <Typography variant="body1" mb={1}>
                  <strong>Job:</strong> {jobData.title} at {jobData.company}
                </Typography>
                
                <Typography variant="body2" paragraph>
                  Filename: {result.filename}
                </Typography>
                
                <Button
                  variant="contained"
                  color="primary"
                  component="a"
                  href={result.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mr: 2 }}
                >
                  View Resume
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={resetForm}
                >
                  Create Another
                </Button>
              </CardContent>
            </Card>
            
            <Box mt={4}>
              <Typography variant="subtitle1" gutterBottom>
                What's Next?
              </Typography>
              <Typography variant="body2" paragraph>
                Complete your application with a matching cover letter:
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  navigate('/generate/cover-letter');
                }}
              >
                Generate Cover Letter for This Job
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default GenerateTailoredResume;
