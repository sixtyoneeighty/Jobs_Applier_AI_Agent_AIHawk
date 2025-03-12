import React, { useState } from 'react';
import { 
  Typography, Box, Paper, Button, Grid, TextField, Switch,
  FormControlLabel, Chip, IconButton, FormGroup, MenuItem,
  Divider, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const PreferencesSetup = () => {
  const navigate = useNavigate();
  const { completeSetupStep, showNotification } = useAppContext();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [preferences, setPreferences] = useState({
    remote: false,
    experience_level: {
      internship: false,
      entry: false,
      associate: false,
      mid_senior_level: false,
      director: false,
      executive: false
    },
    job_types: {
      full_time: true,
      contract: false,
      part_time: false,
      temporary: false,
      internship: false,
      other: false,
      volunteer: false
    },
    date: {
      all_time: true,
      month: false,
      week: false,
      24_hours: false
    },
    positions: [''],
    locations: [''],
    location_blacklist: [],
    distance: 10,
    company_blacklist: [],
    title_blacklist: []
  });
  
  // New item input state
  const [newItem, setNewItem] = useState({
    position: '',
    location: '',
    blockedLocation: '',
    blockedCompany: '',
    blockedTitle: ''
  });
  
  // Handle switch changes
  const handleSwitchChange = (section, field) => (event) => {
    setPreferences({
      ...preferences,
      [section]: {
        ...preferences[section],
        [field]: event.target.checked
      }
    });
  };
  
  // Handle general changes
  const handleChange = (field, value) => {
    setPreferences({
      ...preferences,
      [field]: value
    });
  };
  
  // Handle array item changes
  const handleArrayItemChange = (field, index, value) => {
    const newArray = [...preferences[field]];
    newArray[index] = value;
    setPreferences({
      ...preferences,
      [field]: newArray
    });
  };
  
  // Add item to array
  const addItem = (field, value) => {
    if (!value.trim()) {
      showNotification('Please enter a value', 'warning');
      return;
    }
    
    setPreferences({
      ...preferences,
      [field]: [...preferences[field], value]
    });
    
    // Clear input field
    const inputField = field === 'positions' ? 'position' : 
                      field === 'locations' ? 'location' :
                      field === 'location_blacklist' ? 'blockedLocation' :
                      field === 'company_blacklist' ? 'blockedCompany' : 'blockedTitle';
    
    setNewItem({
      ...newItem,
      [inputField]: ''
    });
  };
  
  // Remove item from array
  const removeItem = (field, index) => {
    // For positions and locations, ensure at least one empty field remains
    if ((field === 'positions' || field === 'locations') && preferences[field].length <= 1) {
      setPreferences({
        ...preferences,
        [field]: ['']
      });
      return;
    }
    
    const newArray = preferences[field].filter((_, i) => i !== index);
    setPreferences({
      ...preferences,
      [field]: newArray
    });
  };
  
  // Validate form
  const validateForm = () => {
    if (preferences.positions.length === 0 || !preferences.positions.some(p => p.trim())) {
      showNotification('Please add at least one job position', 'error');
      return false;
    }
    
    if (preferences.locations.length === 0 || !preferences.locations.some(l => l.trim())) {
      showNotification('Please add at least one location', 'error');
      return false;
    }
    
    return true;
  };
  
  // Handle save
  const handleSave = async () => {
    if (!validateForm()) return;
    
    // Clean up empty values in arrays
    const cleanedPreferences = {
      ...preferences,
      positions: preferences.positions.filter(p => p.trim()),
      locations: preferences.locations.filter(l => l.trim())
    };
    
    setLoading(true);
    try {
      await axios.post('/api/save-preferences', cleanedPreferences);
      completeSetupStep('preferences');
      showNotification('Work preferences saved successfully', 'success');
      navigate('/setup/api-key');
    } catch (error) {
      console.error('Error saving preferences:', error);
      showNotification('Error saving work preferences', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Work Preferences
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Configure your job search preferences to help find the most relevant opportunities.
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Basic Preferences
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={preferences.remote} 
                    onChange={(e) => handleChange('remote', e.target.checked)}
                  />
                }
                label="Include remote jobs"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Maximum Commute Distance"
                value={preferences.distance}
                onChange={(e) => handleChange('distance', parseInt(e.target.value))}
              >
                <MenuItem value={0}>No preference</MenuItem>
                <MenuItem value={5}>5 miles</MenuItem>
                <MenuItem value={10}>10 miles</MenuItem>
                <MenuItem value={25}>25 miles</MenuItem>
                <MenuItem value={50}>50 miles</MenuItem>
                <MenuItem value={100}>100 miles</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Experience Level
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Select all experience levels that apply to your job search.
          </Typography>
          
          <FormGroup>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={preferences.experience_level.internship} 
                      onChange={handleSwitchChange('experience_level', 'internship')}
                    />
                  }
                  label="Internship"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={preferences.experience_level.entry} 
                      onChange={handleSwitchChange('experience_level', 'entry')}
                    />
                  }
                  label="Entry Level"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={preferences.experience_level.associate} 
                      onChange={handleSwitchChange('experience_level', 'associate')}
                    />
                  }
                  label="Associate"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={preferences.experience_level.mid_senior_level} 
                      onChange={handleSwitchChange('experience_level', 'mid_senior_level')}
                    />
                  }
                  label="Mid-Senior Level"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={preferences.experience_level.director} 
                      onChange={handleSwitchChange('experience_level', 'director')}
                    />
                  }
                  label="Director"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={preferences.experience_level.executive} 
                      onChange={handleSwitchChange('experience_level', 'executive')}
                    />
                  }
                  label="Executive"
                />
              </Grid>
            </Grid>
          </FormGroup>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Job Types
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Select all job types that you're interested in.
          </Typography>
          
          <FormGroup>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={preferences.job_types.full_time} 
                      onChange={handleSwitchChange('job_types', 'full_time')}
                    />
                  }
                  label="Full-time"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={preferences.job_types.contract} 
                      onChange={handleSwitchChange('job_types', 'contract')}
                    />
                  }
                  label="Contract"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={preferences.job_types.part_time} 
                      onChange={handleSwitchChange('job_types', 'part_time')}
                    />
                  }
                  label="Part-time"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={preferences.job_types.temporary} 
                      onChange={handleSwitchChange('job_types', 'temporary')}
                    />
                  }
                  label="Temporary"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={preferences.job_types.internship} 
                      onChange={handleSwitchChange('job_types', 'internship')}
                    />
                  }
                  label="Internship"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={preferences.job_types.other} 
                      onChange={handleSwitchChange('job_types', 'other')}
                    />
                  }
                  label="Other"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={preferences.job_types.volunteer} 
                      onChange={handleSwitchChange('job_types', 'volunteer')}
                    />
                  }
                  label="Volunteer"
                />
              </Grid>
            </Grid>
          </FormGroup>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Date Posted
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Select when you want to see jobs posted.
          </Typography>
          
          <FormGroup>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={preferences.date.all_time} 
                      onChange={handleSwitchChange('date', 'all_time')}
                    />
                  }
                  label="All Time"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={preferences.date.month} 
                      onChange={handleSwitchChange('date', 'month')}
                    />
                  }
                  label="Past Month"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={preferences.date.week} 
                      onChange={handleSwitchChange('date', 'week')}
                    />
                  }
                  label="Past Week"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={preferences.date['24_hours']} 
                      onChange={handleSwitchChange('date', '24_hours')}
                    />
                  }
                  label="Last 24 Hours"
                />
              </Grid>
            </Grid>
          </FormGroup>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Job Positions
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Enter the job titles you're interested in.
          </Typography>
          
          {preferences.positions.map((position, index) => (
            <Box key={index} display="flex" alignItems="center" mb={2}>
              <TextField
                fullWidth
                label={`Position ${index + 1}`}
                value={position}
                onChange={(e) => handleArrayItemChange('positions', index, e.target.value)}
                placeholder="e.g., Software Engineer"
                sx={{ mr: 2 }}
              />
              <IconButton 
                color="error" 
                onClick={() => removeItem('positions', index)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          
          <Box display="flex" alignItems="center" mt={2}>
            <TextField
              fullWidth
              label="Add Position"
              value={newItem.position}
              onChange={(e) => setNewItem({ ...newItem, position: e.target.value })}
              placeholder="e.g., Data Scientist"
              sx={{ mr: 2 }}
            />
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => addItem('positions', newItem.position)}
            >
              Add
            </Button>
          </Box>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Locations
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Enter the locations where you want to work.
          </Typography>
          
          {preferences.locations.map((location, index) => (
            <Box key={index} display="flex" alignItems="center" mb={2}>
              <TextField
                fullWidth
                label={`Location ${index + 1}`}
                value={location}
                onChange={(e) => handleArrayItemChange('locations', index, e.target.value)}
                placeholder="e.g., New York, NY"
                sx={{ mr: 2 }}
              />
              <IconButton 
                color="error" 
                onClick={() => removeItem('locations', index)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          
          <Box display="flex" alignItems="center" mt={2}>
            <TextField
              fullWidth
              label="Add Location"
              value={newItem.location}
              onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
              placeholder="e.g., San Francisco, CA"
              sx={{ mr: 2 }}
            />
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => addItem('locations', newItem.location)}
            >
              Add
            </Button>
          </Box>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Blacklists
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Exclude specific locations, companies, or job titles from your search.
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>
                Blocked Locations
              </Typography>
              
              <Box mb={2}>
                {preferences.location_blacklist.map((location, index) => (
                  <Chip
                    key={index}
                    label={location}
                    onDelete={() => removeItem('location_blacklist', index)}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
              
              <Box display="flex" alignItems="center">
                <TextField
                  fullWidth
                  size="small"
                  label="Block Location"
                  value={newItem.blockedLocation}
                  onChange={(e) => setNewItem({ ...newItem, blockedLocation: e.target.value })}
                  placeholder="e.g., Detroit, MI"
                  sx={{ mr: 1 }}
                />
                <Button
                  size="small"
                  onClick={() => addItem('location_blacklist', newItem.blockedLocation)}
                >
                  Add
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>
                Blocked Companies
              </Typography>
              
              <Box mb={2}>
                {preferences.company_blacklist.map((company, index) => (
                  <Chip
                    key={index}
                    label={company}
                    onDelete={() => removeItem('company_blacklist', index)}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
              
              <Box display="flex" alignItems="center">
                <TextField
                  fullWidth
                  size="small"
                  label="Block Company"
                  value={newItem.blockedCompany}
                  onChange={(e) => setNewItem({ ...newItem, blockedCompany: e.target.value })}
                  placeholder="e.g., ABC Corp"
                  sx={{ mr: 1 }}
                />
                <Button
                  size="small"
                  onClick={() => addItem('company_blacklist', newItem.blockedCompany)}
                >
                  Add
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>
                Blocked Job Titles
              </Typography>
              
              <Box mb={2}>
                {preferences.title_blacklist.map((title, index) => (
                  <Chip
                    key={index}
                    label={title}
                    onDelete={() => removeItem('title_blacklist', index)}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
              
              <Box display="flex" alignItems="center">
                <TextField
                  fullWidth
                  size="small"
                  label="Block Title"
                  value={newItem.blockedTitle}
                  onChange={(e) => setNewItem({ ...newItem, blockedTitle: e.target.value })}
                  placeholder="e.g., Sales Associate"
                  sx={{ mr: 1 }}
                />
                <Button
                  size="small"
                  onClick={() => addItem('title_blacklist', newItem.blockedTitle)}
                >
                  Add
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
        
        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button
            variant="outlined"
            onClick={() => navigate('/setup/resume')}
          >
            Back
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save & Continue'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default PreferencesSetup;
