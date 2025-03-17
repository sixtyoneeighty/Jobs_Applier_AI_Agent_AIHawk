// Common script for the AIHawk Jobs Applier UI mockup
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all form submission handlers
    initializeFormSubmissions();
    
    // Initialize document action buttons
    initializeDocumentActions();
    
    // Initialize notification system
    initializeNotifications();

    // Handle dashboard document actions
    setupDashboardDocuments();
});

// Form handling
function initializeFormSubmissions() {
    const allForms = document.querySelectorAll('form');
    
    allForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show success notification
            showNotification('Success!', 'Your request has been processed successfully.', 'success');
            
            // Handle specific form submissions
            const formId = this.getAttribute('id');
            
            // Process based on form id
            if (formId === 'loginForm') {
                // Redirect to dashboard after short delay
                setTimeout(() => window.location.href = 'dashboard.html', 1500);
            } else if (formId === 'resumeForm') {
                // Simulate resume generation
                setTimeout(() => window.location.href = 'dashboard.html', 3000);
            } else if (formId === 'tailoredResumeForm') {
                // Simulate tailored resume generation
                setTimeout(() => window.location.href = 'dashboard.html', 3000);
            } else if (formId === 'coverLetterForm') {
                // Simulate cover letter generation
                setTimeout(() => window.location.href = 'dashboard.html', 3000);
            } else if (formId && formId.includes('profile')) {
                // For profile forms, just show success and stay on page
                // Do nothing after notification
            } else {
                // Default behavior for other forms - go to dashboard
                setTimeout(() => window.location.href = 'dashboard.html', 1500);
            }
        });
    });
}

// Document actions
function initializeDocumentActions() {
    // Handle view and download actions
    const actionButtons = document.querySelectorAll('.icon-button, .form-button, .card-button');
    
    actionButtons.forEach(button => {
        // Skip buttons with href already set
        if (button.getAttribute('href') && !button.getAttribute('href').startsWith('#')) {
            return;
        }
        
        button.addEventListener('click', function(e) {
            if (!button.getAttribute('href') || button.getAttribute('href') === '#') {
                e.preventDefault();
            }
            
            // Get button title or text
            const action = button.getAttribute('title') || button.textContent.trim();
            
            if (action === 'View' || action.includes('View')) {
                // Simulate document viewing
                showNotification('Document Viewer', 'Opening document viewer...', 'info');
                // In a real app, this would open a document preview
            } else if (action === 'Download' || action.includes('Download')) {
                // Simulate document download
                showNotification('Download Started', 'Your document is being downloaded...', 'info');
                // In a real app, this would start a file download
            } else if (action === 'Update Status' || action.includes('Update')) {
                // Show status update options
                showNotification('Status Update', 'Status updated successfully', 'success');
            } else if (action === 'Edit' || action.includes('Edit')) {
                // Simulate edit functionality
                showNotification('Edit Mode', 'Edit mode activated', 'info');
            } else if (action === 'Delete' || action.includes('Delete')) {
                // Simulate delete with confirmation
                if (confirm('Are you sure you want to delete this item?')) {
                    showNotification('Deleted', 'Item has been deleted', 'success');
                    
                    // Remove item from DOM if in a list
                    const listItem = button.closest('.application-item, .document-item');
                    if (listItem) {
                        listItem.style.opacity = '0';
                        setTimeout(() => listItem.remove(), 300);
                    }
                }
            }
        });
    });
}

// Setup dashboard specific functionality
function setupDashboardDocuments() {
    // Add click handlers to document items
    const documentItems = document.querySelectorAll('.document-item');
    
    documentItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Only handle clicks on the item itself, not on action buttons
            if (!e.target.closest('.document-actions')) {
                showNotification('Document Selected', 'Opening document details...', 'info');
            }
        });
    });
    
    // Make application items in history clickable
    const applicationItems = document.querySelectorAll('.application-item');
    
    applicationItems.forEach(item => {
        const header = item.querySelector('.application-header');
        if (header) {
            header.style.cursor = 'pointer';
            header.addEventListener('click', function(e) {
                // Toggle expanded view
                const details = item.querySelector('.application-details');
                if (details) {
                    details.style.display = details.style.display === 'none' ? 'flex' : 'none';
                }
            });
        }
    });
}

// Notification system
function initializeNotifications() {
    // Create notification container if it doesn't exist
    if (!document.querySelector('.notification')) {
        const notificationHTML = `
            <div class="notification" id="notification" style="display: none;">
                <div class="notification-icon success">✓</div>
                <div class="notification-content">
                    <div class="notification-title">Notification</div>
                    <div class="notification-message">Message goes here</div>
                </div>
            </div>
        `;
        
        const notificationContainer = document.createElement('div');
        notificationContainer.innerHTML = notificationHTML;
        document.body.appendChild(notificationContainer.firstElementChild);
    }
}

function showNotification(title, message, type = 'success') {
    const notification = document.getElementById('notification');
    
    if (!notification) {
        console.error('Notification element not found');
        return;
    }
    
    const iconElement = notification.querySelector('.notification-icon');
    const titleElement = notification.querySelector('.notification-title');
    const messageElement = notification.querySelector('.notification-message');
    
    // Set content
    titleElement.textContent = title;
    messageElement.textContent = message;
    
    // Set icon based on type
    if (iconElement) {
        iconElement.className = 'notification-icon ' + type;
        
        if (type === 'success') {
            iconElement.textContent = '✓';
        } else if (type === 'error') {
            iconElement.textContent = '✕';
        } else if (type === 'warning') {
            iconElement.textContent = '⚠';
        } else if (type === 'info') {
            iconElement.textContent = 'ℹ';
        }
    }
    
    // Show notification
    notification.style.display = 'flex';
    
    // Hide after 3 seconds
    setTimeout(function() {
        notification.style.display = 'none';
    }, 3000);
}
