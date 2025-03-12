import React from 'react';
import { CircularProgress, Typography, Box, Paper } from '@mui/material';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 4, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 2,
        textAlign: 'center',
        minHeight: 200
      }}
    >
      <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
      <Typography variant="h6" color="text.secondary">
        {message}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        This may take a few moments...
      </Typography>
    </Paper>
  );
};

export default Loading;
