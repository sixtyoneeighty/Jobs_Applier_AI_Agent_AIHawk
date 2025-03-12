import React, { useState } from 'react';
import { 
  Typography, Box, Paper, Button, TextField, Alert,
  FormControl, InputLabel, OutlinedInput, InputAdornment,
  IconButton, Link, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from 'axios';

const ApiKeySetup = () => {
  const navigate = useNavigate();
  const { completeSetupStep, showNotification } = useAppContext();
  
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleToggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
  };
  
  const handleSave = async () => {
    if (!apiKey.trim()) {
      showNotification('Please enter an API key', 'error');
      return;
    }
    
    setLoading(true);
    try {
      await axios.post('/api/save-api-key', { llm_api_key: apiKey });
      completeSetupStep('apiKey');
      showNotification('API key saved successfully', 'success');
      navigate('/');
    } catch (error) {
      console.error('Error saving API key:', error);
      showNotification('Error saving API key', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        API Key Setup
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Enter your language model API key to enable the AI features of the application.
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Your API key is used to access the AI language model that powers the resume and cover letter generation.
          We store this securely and only use it for the specified purposes.
        </Alert>
        
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            OpenAI API Key
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            You'll need an OpenAI API key to use GPT models. 
            <Link 
              href="https://platform.openai.com/account/api-keys" 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ ml: 1 }}
            >
              Get your API key here.
            </Link>
          </Typography>
          
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel htmlFor="api-key-input">API Key</InputLabel>
            <OutlinedInput
              id="api-key-input"
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleToggleShowApiKey}
                    edge="end"
                  >
                    {showApiKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              }
              label="API Key"
            />
          </FormControl>
          
          <Alert severity="warning" sx={{ mb: 2 }}>
            Important: Your API key should begin with "sk-" followed by a string of characters. You'll need to 
            have a payment method set up in your OpenAI account, as the API is not free to use.
          </Alert>
          
          <Typography variant="body2" color="textSecondary">
            Alternative models: The system also supports Ollama, Claude, and Gemini models. For these, you'll need to 
            update the config.py file manually. By default, the system uses OpenAI GPT models.
          </Typography>
        </Box>
        
        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button
            variant="outlined"
            onClick={() => navigate('/setup/preferences')}
          >
            Back
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Saving...' : 'Complete Setup'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ApiKeySetup;
