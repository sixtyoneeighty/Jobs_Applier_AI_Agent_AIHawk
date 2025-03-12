import React from 'react';
import { 
  Typography, Box, Paper, List, ListItem, ListItemIcon, 
  ListItemText, IconButton, Card, CardContent, Divider
} from '@mui/material';
import { useAppContext } from '../context/AppContext';
import ArticleIcon from '@mui/icons-material/Article';
import EmailIcon from '@mui/icons-material/Email';
import DownloadIcon from '@mui/icons-material/Download';
import LaunchIcon from '@mui/icons-material/Launch';
import EmptyStateIcon from '@mui/icons-material/FolderOpen';

const GeneratedFilesList = ({ maxItems = 5 }) => {
  const { generatedFiles } = useAppContext();
  
  // Helper to determine icon based on filename
  const getFileIcon = (filename) => {
    if (filename.toLowerCase().includes('cover')) {
      return <EmailIcon color="primary" />;
    }
    return <ArticleIcon color="primary" />;
  };
  
  // Format date from filename (assuming format like resume_2023-10-15_12-30-45.pdf)
  const formatDate = (filename) => {
    try {
      // Try to extract date from filename
      const dateMatch = filename.match(/\d{4}-\d{2}-\d{2}/);
      if (dateMatch) {
        return new Date(dateMatch[0]).toLocaleDateString();
      }
      
      // If no date in filename, return empty string
      return '';
    } catch (e) {
      return '';
    }
  };
  
  // Generate descriptive name
  const getFileDescription = (file) => {
    const name = file.filename.toLowerCase();
    
    if (name.includes('cover') && name.includes('tailored')) {
      return 'Tailored Cover Letter';
    } else if (name.includes('cover')) {
      return 'Cover Letter';
    } else if (name.includes('tailored')) {
      return 'Tailored Resume';
    } else {
      return 'Resume';
    }
  };
  
  // If there are no files
  if (generatedFiles.length === 0) {
    return (
      <Card variant="outlined">
        <CardContent sx={{ textAlign: 'center', py: 3 }}>
          <EmptyStateIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.7, mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No documents generated yet
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Your generated resumes and cover letters will appear here.
          </Typography>
        </CardContent>
      </Card>
    );
  }
  
  // Get the most recent files, limited by maxItems
  const recentFiles = [...generatedFiles]
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    .slice(0, maxItems);
  
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recently Generated Documents
        </Typography>
        <List disablePadding>
          {recentFiles.map((file, index) => (
            <React.Fragment key={file.filename || index}>
              {index > 0 && <Divider component="li" />}
              <ListItem
                disablePadding
                secondaryAction={
                  <Box>
                    <IconButton 
                      edge="end" 
                      aria-label="open"
                      href={file.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LaunchIcon />
                    </IconButton>
                    <IconButton 
                      edge="end" 
                      aria-label="download"
                      href={file.file_url}
                      download
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Box>
                }
                sx={{ py: 1.5 }}
              >
                <ListItemIcon>
                  {getFileIcon(file.filename || '')}
                </ListItemIcon>
                <ListItemText 
                  primary={getFileDescription(file)}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'block' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {file.filename}
                      </Typography>
                      {formatDate(file.filename || '') && (
                        <Typography
                          sx={{ display: 'block' }}
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          Generated on {formatDate(file.filename || '')}
                        </Typography>
                      )}
                    </React.Fragment>
                  }
                />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default GeneratedFilesList;
