import React from 'react';
import { Backdrop, CircularProgress, Typography, Box, Paper } from '@mui/material';
import { useAppContext } from '../context/AppContext';

const LoadingOverlay = () => {
  const { loading } = useAppContext();

  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      open={loading.isLoading}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 2,
          backgroundColor: 'background.paper',
          width: 300,
          maxWidth: '90%'
        }}
      >
        <CircularProgress size={60} thickness={4} sx={{ mb: 3, color: 'primary.main' }} />
        <Typography variant="h6" color="text.primary" sx={{ mb: 1 }}>
          {loading.message}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please wait while we process your request...
        </Typography>
      </Paper>
    </Backdrop>
  );
};

export default LoadingOverlay;
