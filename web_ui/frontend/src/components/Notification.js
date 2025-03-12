import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useAppContext } from '../context/AppContext';

const Notification = () => {
  const { notification, closeNotification } = useAppContext();
  
  return (
    <Snackbar
      open={notification.open}
      autoHideDuration={6000}
      onClose={closeNotification}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert 
        onClose={closeNotification} 
        severity={notification.severity || 'info'} 
        variant="filled"
        sx={{ width: '100%' }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
