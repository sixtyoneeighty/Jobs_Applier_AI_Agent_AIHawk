// API configuration for different environments

// Production environment (Netlify)
const PROD_API_URL = process.env.REACT_APP_API_URL || 'https://your-production-api.com';

// Development environment (local)
const DEV_API_URL = 'http://localhost:8000';

// Determine which API URL to use based on environment
const API_URL = process.env.NODE_ENV === 'production' ? PROD_API_URL : DEV_API_URL;

export default {
  baseURL: API_URL,
  endpoints: {
    // User authentication
    login: '/auth/login',
    register: '/auth/register',
    
    // Resume endpoints
    saveResume: '/resume/save',
    generateResume: '/resume/generate',
    generateTailoredResume: '/resume/generate-tailored',
    
    // Cover letter endpoints
    generateCoverLetter: '/cover-letter/generate',
    
    // Application history
    applications: '/applications',
    
    // User profile & settings
    profile: '/profile',
    preferences: '/preferences',
    apiSettings: '/settings/api',
    
    // Document management
    documents: '/documents',
  },
  
  // Request timeout in milliseconds
  timeout: 30000,
};
