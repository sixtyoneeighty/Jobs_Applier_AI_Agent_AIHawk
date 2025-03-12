import React, { useState } from 'react';
import { 
  Typography, Box, Paper, Button, Alert, 
  CircularProgress, Card, CardContent, Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import axios from 'axios';
import ArticleIcon from '@mui/icons-material/Article';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const GenerateResume = () => {
  const navigate = useNavigate();
  const { isSetupComplete, addGeneratedFile, showNotification } = useAppContext();
  
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
  
  const handleGenerateResume = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await axios.post('/api/generate-resume');
      setResult(response.data);
      addGeneratedFile(response.data);
      showNotification('Resume generated successfully', 'success');
    } catch (error) {
      console.error('Error generating resume:', error);
      setError(error.response?.data?.detail || 'Error generating resume');
      showNotification('Error generating resume', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Generate Resume
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Create a professional resume based on your information.
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        {!loading && !result && !error && (
          <>
            <Alert severity="info" sx={{ mb: 3 }}>
              Click the button below to generate your resume. This will create a professional PDF document
              based on the information you provided during setup.
            </Alert>
            
            <Box display="flex" justifyContent="center" mb={3}>
              <ArticleIcon sx={{ fontSize: 100, color: 'primary.main', opacity: 0.8 }} />
            </Box>
            
            <Box textAlign="center">
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleGenerateResume}
                sx={{ px: 4, py: 1.5 }}
              >
                Generate Resume
              </Button>
            </Box>
          </>
        )}
        
        {loading && (
          <Box textAlign="center" py={6}>
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" mt={3}>
              Generating Your Resume...
            </Typography>
            <Typography variant="body2" color="textSecondary" mt={1}>
              This may take a minute or two as we craft your professional document.
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
              >
                Try Again
              </Button>
            </Box>
          </Box>
        )}
        
        {result && (
          <Box>
            <Alert severity="success" sx={{ mb: 3 }}>
              Your resume has been successfully generated!
            </Alert>
            
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Resume Generated
                  </Typography>
                </Box>
                
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
                  onClick={handleGenerateResume}
                >
                  Generate Again
                </Button>
              </CardContent>
            </Card>
            
            <Box mt={4}>
              <Typography variant="subtitle1" gutterBottom>
                What's Next?
              </Typography>
              <Typography variant="body2" paragraph>
                Now that you have your resume, you might want to:
              </Typography>
              <ul>
                <li>
                  <Link component="button" onClick={() => navigate('/generate/tailored-resume')}>
                    Create a tailored resume for a specific job
                  </Link>
                </li>
                <li>
                  <Link component="button" onClick={() => navigate('/generate/cover-letter')}>
                    Generate a matching cover letter
                  </Link>
                </li>
              </ul>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default GenerateResume;
