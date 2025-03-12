import React, { createContext, useContext, useState } from 'react';

// Create the app context
const AppContext = createContext();

// Custom hook to use the app context
export const useAppContext = () => useContext(AppContext);

// Provider component that wraps the entire app
export const AppProvider = ({ children }) => {
    // State for tracking setup completion
    const [setupCompleted, setSetupCompleted] = useState({
        resume: false,
        preferences: false,
        apiKey: false
    });

    // State for tracking generated files
    const [generatedFiles, setGeneratedFiles] = useState([]);
    
    // State for notifications
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'info' // 'error', 'warning', 'info', 'success'
    });
    
    // State for loading indicators
    const [loading, setLoading] = useState({
        isLoading: false,
        message: 'Loading...'
    });

    // Show notification helper
    const showNotification = (message, severity = 'info') => {
        setNotification({
            open: true,
            message,
            severity
        });
    };

    // Close notification helper
    const closeNotification = () => {
        setNotification({
            ...notification,
            open: false
        });
    };

    // Add a generated file to the list
    const addGeneratedFile = (file) => {
        setGeneratedFiles((prevFiles) => [...prevFiles, file]);
    };

    // Mark a setup step as completed
    const completeSetupStep = (step) => {
        setSetupCompleted({
            ...setupCompleted,
            [step]: true
        });
    };

    // Check if all setup is completed
    const isSetupComplete = () => {
        return setupCompleted.resume && setupCompleted.preferences && setupCompleted.apiKey;
    };

    // Show loading indicator
    const showLoading = (message = 'Loading...') => {
        setLoading({
            isLoading: true,
            message
        });
    };

    // Hide loading indicator
    const hideLoading = () => {
        setLoading({
            isLoading: false,
            message: 'Loading...'
        });
    };

    // Context value
    const value = {
        setupCompleted,
        completeSetupStep,
        isSetupComplete,
        generatedFiles,
        addGeneratedFile,
        notification,
        showNotification,
        closeNotification,
        loading,
        showLoading,
        hideLoading
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
