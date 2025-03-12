import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Header = () => {
  const { isSetupComplete } = useAppContext();
  
  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'white',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            AIHawk Jobs Applier
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color="inherit"
              component={RouterLink}
              to="/"
            >
              Dashboard
            </Button>
            
            {!isSetupComplete() && (
              <Button
                color="inherit"
                component={RouterLink}
                to="/setup/resume"
              >
                Setup
              </Button>
            )}
            
            {isSetupComplete() && (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/generate/resume"
                >
                  Create Resume
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/generate/tailored-resume"
                >
                  Tailored Resume
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/generate/cover-letter"
                >
                  Cover Letter
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
