import React from 'react';
import { Typography, Box, Card, CardContent, Button, Grid, Alert, Paper, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ArticleIcon from '@mui/icons-material/Article';
import DescriptionIcon from '@mui/icons-material/Description';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import GeneratedFilesList from '../components/GeneratedFilesList';

const Dashboard = () => {
    const navigate = useNavigate();
    const { setupCompleted, isSetupComplete, generatedFiles } = useAppContext();
    
    const setupItems = [
        {
            title: 'Resume Information',
            completed: setupCompleted.resume,
            path: '/setup/resume',
            description: 'Enter your personal information, education, work experience, and skills.',
            icon: <ArticleIcon fontSize="large" color={setupCompleted.resume ? "success" : "action"} />
        },
        {
            title: 'Work Preferences',
            completed: setupCompleted.preferences,
            path: '/setup/preferences',
            description: 'Configure your job preferences, location, and other work-related settings.',
            icon: <DescriptionIcon fontSize="large" color={setupCompleted.preferences ? "success" : "action"} />
        },
        {
            title: 'API Key Setup',
            completed: setupCompleted.apiKey,
            path: '/setup/api-key',
            description: 'Add your language model API key for generating personalized content.',
            icon: <EmailIcon fontSize="large" color={setupCompleted.apiKey ? "success" : "action"} />
        }
    ];
    
    const actions = [
        {
            title: 'Generate Resume',
            description: 'Create a professional resume based on your information',
            path: '/generate/resume',
            icon: <ArticleIcon fontSize="large" color="primary" />
        },
        {
            title: 'Tailored Resume',
            description: 'Create a resume customized for a specific job description',
            path: '/generate/tailored-resume',
            icon: <DescriptionIcon fontSize="large" color="primary" />
        },
        {
            title: 'Cover Letter',
            description: 'Generate a cover letter for a specific job application',
            path: '/generate/cover-letter',
            icon: <EmailIcon fontSize="large" color="primary" />
        }
    ];
    
    return (
        <Box>
            <Box mb={4} textAlign="center">
                <Typography variant="h3" component="h1" gutterBottom>
                    Welcome to AIHawk Jobs Applier
                </Typography>
                <Typography variant="h6" color="textSecondary">
                    Your AI-powered assistant for job applications
                </Typography>
            </Box>
            
            {!isSetupComplete() && (
                <Box mb={6}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Complete Setup
                    </Typography>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Please complete the setup process before generating documents.
                    </Alert>
                    <Grid container spacing={3}>
                        {setupItems.map((item) => (
                            <Grid item xs={12} md={4} key={item.title}>
                                <Card 
                                    sx={{ 
                                        height: '100%',
                                        transition: 'transform 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                                        }
                                    }}
                                >
                                    <CardContent sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <Box mb={2}>{item.icon}</Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                                            <Typography variant="h6" component="h3">
                                                {item.title}
                                            </Typography>
                                            {item.completed && <CheckCircleIcon color="success" sx={{ ml: 1 }} />}
                                        </Box>
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                                            {item.description}
                                        </Typography>
                                        <Box sx={{ flexGrow: 1 }} />
                                        <Button 
                                            variant={item.completed ? "outlined" : "contained"} 
                                            color={item.completed ? "success" : "primary"}
                                            onClick={() => navigate(item.path)}
                                            fullWidth
                                        >
                                            {item.completed ? "Update" : "Complete"}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
            
            {isSetupComplete() && (
                <Box mb={6}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Generate Documents
                    </Typography>
                    <Grid container spacing={3}>
                        {actions.map((action) => (
                            <Grid item xs={12} md={4} key={action.title}>
                                <Card 
                                    sx={{ 
                                        height: '100%',
                                        transition: 'transform 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                                        } 
                                    }}
                                >
                                    <CardContent sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <Box mb={2}>{action.icon}</Box>
                                        <Typography variant="h6" component="h3" gutterBottom>
                                            {action.title}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                                            {action.description}
                                        </Typography>
                                        <Box sx={{ flexGrow: 1 }} />
                                        <Button 
                                            variant="contained" 
                                            color="primary"
                                            onClick={() => navigate(action.path)}
                                            fullWidth
                                        >
                                            Start
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
            
            {isSetupComplete() && (
                <Box mb={4}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Your Documents
                    </Typography>
                    <GeneratedFilesList />
                </Box>
            )}
        </Box>
    );
};

export default Dashboard;
