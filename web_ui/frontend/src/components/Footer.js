import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: (theme) => theme.palette.grey[100]
            }}
        >
            <Container maxWidth="lg">
                <Typography variant="body2" color="text.secondary" align="center">
                    {'© '}
                    {new Date().getFullYear()}
                    {' AIHawk Jobs Applier | '}
                    <Link color="inherit" href="https://github.com/feder-cr/Jobs_Applier_AI_Agent_AIHawk" target="_blank" rel="noopener">
                        GitHub
                    </Link>
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;
