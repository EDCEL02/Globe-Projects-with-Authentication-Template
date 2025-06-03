# Globe Authentication Template Documentation

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Authentication System Architecture](#authentication-system-architecture)
4. [Project Structure](#project-structure)
5. [Technical Implementation](#technical-implementation)
6. [Prerequisites](#prerequisites)
7. [Deployment Instructions](#deployment-instructions)
8. [User Guide](#user-guide)
9. [Development Guide](#development-guide)
10. [UI Framework and Styling](#ui-framework-and-styling)
11. [Application Flow Diagram](#application-flow-diagram)
12. [How to Extend the Application](#how-to-extend-the-application)
13. [Troubleshooting](#troubleshooting)
14. [Security Considerations](#security-considerations)
15. [Frequently Asked Questions (FAQ)](#frequently-asked-questions-faq)
16. [Future Enhancements](#future-enhancements)
17. [Conclusion](#conclusion)
18. [License](#license)

## Overview
This Google Apps Script web application template provides a role-based authentication system that displays different content based on user roles (admin, authorized user, or unauthorized). The template uses Google's Script Properties for configuration storage and Google Sheets for data management, and can be easily customized for various Globe projects.

## Features
- **Role-Based Access Control**: Differentiated access for admin and regular users
- **Secure Authentication**: Leverages Google's built-in authentication
- **Initial Setup Wizard**: Easy configuration for first-time use
- **Analytics Dashboard**: Visual representation of organization data
- **Responsive Design**: Works on desktop and mobile devices
- **Persistent Configuration**: Settings stored in Script Properties

## Authentication System Architecture

### 1. Initial Setup
When first accessed, the application checks if it's been configured. If not, it presents an initial setup form that collects:
- Admin Email
- Authorized User Emails (comma-separated)
- Google Sheets Link

These values are stored securely in Script Properties once setup is completed.

### 2. Role-Based Authentication
The system recognizes three distinct user types:
- **Admin**: The email specified during setup with full administrative access
- **Authorized User**: Any email that was included in the authorized users list
- **Unauthorized**: Any other user not meeting the above criteria

### 3. Content Visibility Mechanism
The core of the system relies on conditional display of HTML containers based on user roles:

```
┌─────────────────┐
│                 │
│  setupContainer │ ← Shown during initial setup only
│                 │
└─────────────────┘

┌─────────────────┐
│                 │
│  adminContent   │ ← Shown to admin users only
│                 │
└─────────────────┘

┌─────────────────┐
│                 │
│  userContent    │ ← Shown to authorized users
│                 │
└─────────────────┘

┌─────────────────┐
│                 │
│ unauthorizedContent │ ← Shown to unauthorized users
│                 │
└─────────────────┘

┌─────────────────┐
│                 │
│ analyticsContent │ ← Shown to both admin and authorized users
│                 │
└─────────────────┘
```

## Project Structure

```
├── .clasp.json           # CLASP configuration for Google Apps Script
├── appsscript.json       # Google Apps Script manifest file
├── backend.js            # Main backend logic
├── backend-initialSetup.js # Setup-related backend functions
├── index.html            # Main entry point HTML file
├── appstyles.html        # CSS styles for the application
├── dashb-containers.html # Dashboard UI containers
├── dashb-initialization.html # Initial setup form UI
├── frontend-js.html      # Main JavaScript for the frontend
└── frontend-initialization-js.html # Setup-specific JavaScript
```

## Technical Implementation

### Backend Components

1. **Script Properties Functions** (`backend-initialSetup.js`):
   - `isSetupComplete()`: Checks if initial setup has been done
   - `performInitialSetup()`: Validates and saves setup information

2. **Authentication & Content Functions** (`backend.js`):
   - `doGet(e)`: Entry point for web app, serves the main HTML
   - `include(filename)`: Helper to include HTML templates
   - `getUserAuthStatus()`: Determines user's authentication status and role
   - `getContentVisibility()`: Returns which content containers should be shown
   - `showContent()`: Main function called from frontend to determine what to display
   - `loadAdminContentData()`: Loads admin dashboard data
   - `loadUserContentData()`: Loads user dashboard data
   - `shouldShowContainer()`: Helper to check if a specific container should be shown
   - `getScriptProperties()`: Retrieves stored properties (admin-only)
   - `resetApplication()`: Admin function to reset the application

### Frontend Components

1. **Main JavaScript** (`frontend-js.html`):
   - `initializeApp()`: Main entry point that checks auth status on page load
   - `handleContentVisibility()`: Processes the visibility response
   - `handleError()`: Error handling function
   - `showLoading()`: Controls loading indicator visibility

2. **Setup JavaScript** (`frontend-initialization-js.html`):
   - `submitSetupForm()`: Processes initial setup form submission
   - `handleSetupResult()`: Handles server response after setup
   - `handleSetupError()`: Handles setup failures
   - `showSetupMessage()`: Displays setup status messages

3. **Dashboard Functions** (`dashb-containers.html`):
   - `loadAdminData()`: Loads data for admin dashboard
   - `loadUserData()`: Loads data for user dashboard
   - `displayAdminData()`: Populates admin UI with data
   - `displayUserData()`: Populates user UI with data

### HTML Structure
The application is divided into several HTML container sections:
- `setupContainer`: Initial setup form (in `dashb-initialization.html`)
- `adminContent`: Admin dashboard (in `dashb-containers.html`)
- `userContent`: User dashboard (in `dashb-containers.html`)
- `unauthorizedContent`: Access denied message (in `dashb-containers.html`)
- `analyticsContent`: Analytics dashboard (in `dashb-containers.html`)

## Prerequisites

- Google account with access to Google Apps Script
- Google Spreadsheet for data storage
- Basic knowledge of HTML, JavaScript, and Google Apps Script
- [clasp](https://github.com/google/clasp) CLI tool (for development)

## Deployment Instructions

### Option 1: Using the Google Apps Script Editor

1. Create a new Google Apps Script project at [script.google.com](https://script.google.com)
2. Copy each file from this repository into the appropriate file in the Apps Script editor
3. Save all files
4. Click on "Deploy" > "New deployment"
5. Choose "Web app" as the deployment type
6. Set "Execute as" to "User accessing the web app"
7. Set "Who has access" to "Anyone" or appropriate access level
8. Click "Deploy" and copy the web app URL

### Option 2: Using clasp CLI

1. Install clasp globally (if not already installed):
   ```
   npm install -g @google/clasp
   ```

2. Login to your Google account:
   ```
   clasp login
   ```

3. Clone this repository and navigate to the project directory

4. Create a new script project or use existing scriptId in `.clasp.json`
   ```
   clasp create --title "Globe Authentication Template" --rootDir .
   ```
   
   OR if using an existing scriptId:
   ```
   # .clasp.json already contains: "scriptId": "1tEgi3qmwfhy3MQrXsClJ8a2v9yNOIuuZBc5PGKdlkMVBNIorI2sbrZBh"
   ```

5. Push the code to Google Apps Script:
   ```
   clasp push
   ```

6. Open the script in the browser:
   ```
   clasp open
   ```

7. Deploy as web app via the Google Apps Script editor as described in Option 1

## User Guide

### Initial Setup Process

1. After deployment, open the web app URL in your browser
2. If you're the first person accessing the application, you'll see the setup form:   ```
   ┌──────────────────────────────────────────────────┐
   │ Globe Authentication Template Setup              │
   ├──────────────────────────────────────────────────┤
   │                                                  │
   │  Admin Email: [                            ]     │
   │                                                  │
   │  Authorized User Emails:                         │
   │  [                                         ]     │
   │                                                  │
   │  Google Sheets Link:                             │
   │  [                                         ]     │   │                                                  │
   │  [           Complete Setup                ]     │
   │                                                  │
   └──────────────────────────────────────────────────┘
   ```

3. Fill in the required information:
   - **Admin Email**: Enter your Google account email (e.g., admin@gmail.com)
   - **Authorized User Emails**: Enter comma-separated list of emails that should have access (e.g., user1@gmail.com, user2@gmail.com)
   - **Google Sheets Link**: Paste the complete URL to a Google Sheet you've created for this application
   
4. Click "Complete Setup" and wait for confirmation

### Admin User Experience

As an admin, you'll see the admin dashboard after logging in:

1. **Dashboard Overview**: Shows system status and key information
2. **User Management**: Review and modify authorized users list
3. **Settings**: Configure application settings
4. **Analytics**: Access the analytics dashboard (if implemented)

Admins can perform admin-specific actions:
- Reset the application if necessary
- Update authorized users
- Access all available data

### Regular User Experience

Regular users (those in the authorized users list) will see:

1. **User Dashboard**: Shows user-specific information
2. **Analytics**: Access to data visualization (if implemented)
3. **Limited Functionality**: Cannot access admin settings

### Unauthorized Users

Users whose emails are not in the authorized list will see:

1. **Access Denied**: Message indicating they don't have permission
2. **Contact Information**: Details about how to request access

## Security Considerations

- The app uses Google's built-in authentication to identify users
- Script Properties are used to store sensitive configuration securely
- Access control is implemented at both frontend and backend levels
- Validation is performed on all user inputs

## Contributing

To contribute to this project:

1. Fork the repository
2. Make your changes
3. Push to your fork
4. Submit a pull request

## Troubleshooting

- **Setup Issues**: Ensure the Google Sheets URL is accessible to the web app
- **Access Problems**: Verify email addresses are entered correctly and without spaces
- **Dashboard Not Loading**: Check browser console for errors and ensure authenticated user has proper permissions
- **Reset Application**: Admin users can reset the application if needed through the admin dashboard

## Future Enhancements

Possible improvements for future versions:
- Two-factor authentication for added security
- Custom role definitions beyond admin/user
- Export functionality for reports and data
- Enhanced data visualization capabilities
- User management interface for admins
- Activity logging and audit trails

## Frequently Asked Questions (FAQ)

### General Questions

**Q: What is the Globe Authentication Template?**  
A: The Globe Authentication Template is a web application built on Google Apps Script that provides role-based access control for different types of users. It serves as a starting point for creating secure Globe applications with proper authentication mechanisms.

**Q: Who can access the application?**  
A: Only users explicitly added to the authorized users list during setup (or later by the admin) can access the application.

**Q: How do I request access to the application?**  
A: Contact the administrator (the email specified during setup) to request access to the system.

**Q: Is my data secure in this application?**  
A: Yes. The application leverages Google's security infrastructure, uses HTTPS for all communication, and implements proper access controls.

### Technical Questions

**Q: What if I need to reset the application?**  
A: Admin users have access to a reset function that will clear all script properties. This will require going through the setup process again.

**Q: Can I integrate this with other systems?**  
A: The application can be extended to integrate with other Google services or external APIs through further development.

**Q: How can I back up the configuration?**  
A: The configuration is stored in Script Properties. Admins can view and manually back up these values.

**Q: What if the Google Sheet is deleted?**  
A: If the linked Google Sheet is deleted, you'll need to create a new one and update the sheet link in the admin settings.

## Conclusion

The Globe Authentication Template demonstrates a practical implementation of role-based access control in Google Apps Script web applications. By leveraging Google's authentication system and Script Properties storage, it provides a secure, scalable, and maintainable foundation for building Globe applications.

This template can be used as a starting point for various internal tools and applications that require different levels of access based on user roles. The modular design makes it easy to add new features or customize existing ones without disrupting the core authentication and access control mechanisms. Developers can focus on building business-specific functionality while leveraging the secure authentication framework provided by this template.

## License

This project is proprietary and confidential. Copyright © 2025 Globe. All Rights Reserved.

---

*Documentation last updated: June 4, 2025*  
*Created by: Globe OJT Development Team*

## UI Framework and Styling

The application uses:
- **Bootstrap 5.3.2** for responsive UI components
- **Font Awesome 6.4.0** for icons 
- **Chart.js 4.2.1** for data visualization
- Custom CSS animations for container transitions
- Mobile-responsive design for all dashboard views

Key styling features (`appstyles.html`):
```css
/* Fade-in animation for content containers */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Applied to content containers */
#setupContainer, #adminContent, #userContent, 
#unauthorizedContent, #analyticsContent {
  opacity: 0;
  animation: fadeIn 0.5s ease-in forwards;
}
```

## Application Flow Diagram

```
┌─────────────┐     ┌────────────────┐     ┌───────────────────┐
│             │     │                │     │                   │
│  Page Load  ├────►│ initializeApp()├────►│ Backend: showContent()
│             │     │                │     │                   │
└─────────────┘     └────────────────┘     └──────────┬────────┘
                                                      │
                                                      ▼
┌─────────────────────┐     ┌─────────────────┐     ┌───────────────────┐
│                     │     │                 │     │                   │
│ Load Container Data │◄────┤ Show Container  │◄────┤ Return Visibility │
│                     │     │                 │     │                   │
└─────────────────────┘     └─────────────────┘     └───────────────────┘
```

### Authentication Flow

```
┌─────────────────┐     ┌────────────────────────┐
│                 │     │                        │
│  getUserAuthStatus  ├────►│ Check Script Properties │
│                 │     │                        │
└────────┬────────┘     └────────────┬───────────┘
         │                           │
         ▼                           ▼
┌─────────────────┐     ┌────────────────────────┐     ┌─────────────┐
│                 │     │                        │     │             │
│  Get User Email ├────►│ Compare with Admin and ├────►│ Return Role │
│                 │     │ Authorized User Lists  │     │             │
└─────────────────┘     └────────────────────────┘     └─────────────┘
```

## How to Extend the Application

### Adding New Content Containers
1. Add a new HTML container to `dashb-containers.html`
2. Update `getContentVisibility()` in `backend.js` to include the new container
3. Update `handleContentVisibility()` in `frontend-js.html` to handle the new container

#### Example: Adding a New Content Container

Here's an example of adding an analytics dashboard container that's visible to both admins and users:

**Step 1:** Add the container HTML to `dashb-containers.html`:
```html
<div id="analyticsContent" class="container mt-5" style="display: none;">
  <div class="card">
    <div class="card-header bg-primary text-white">
      <h4 class="mb-0">Analytics Dashboard</h4>
    </div>
    <div class="card-body">
      <!-- Content goes here -->
    </div>
  </div>
</div>
```

**Step 2:** Update visibility settings in `backend.js`:
```javascript
var visibility = {
  setupContainer: false,
  adminContent: false,
  userContent: false,
  unauthorizedContent: false,
  analyticsContent: false // Add the new container
};

// Later in the code:
if (authStatus.isAdmin) {
  visibility.adminContent = true;
  visibility.analyticsContent = true; // Show to admin
} else if (authStatus.isAuthenticated) {
  visibility.userContent = true;
  visibility.analyticsContent = true; // Show to users
}
```

**Step 3:** Add loading logic in `frontend-js.html`:
```javascript
// Add a function to load data for the container
function loadAnalyticsData() {
  google.script.run
    .withSuccessHandler(displayAnalyticsData)
    .withFailureHandler(handleError)
    .loadAnalyticsData();
}

// Handle the content visibility
if (visibility.analyticsContent) {
  loadAnalyticsData();
}
```

**Step 4:** Create backend function in `backend.js`:
```javascript
function loadAnalyticsData() {
  return getAnalyticsData();
}
```

### Adding User-Specific Features
1. Enhance `getUserContent()` in backend to include new data
2. Update `loadUserData()` and `displayUserData()` in frontend to use this data

### Adding Admin-Specific Features
1. Enhance `getAdminContent()` in backend to include new data
2. Update `loadAdminData()` and `displayAdminData()` in frontend to use this data

## Development Guide

### Project Setup for Developers

1. **Clone the Repository**:   ```powershell
   git clone https://github.com/your-username/globe-auth-template.git
   cd globe-auth-template
   ```

2. **Install CLASP** (if not already installed):
   ```powershell
   npm install -g @google/clasp
   ```

3. **Login to Google Account**:
   ```powershell
   clasp login
   ```

4. **Setup Project Configuration**:   - Either create a new project:
     ```powershell
     clasp create --title "Globe Authentication Template" --rootDir .
     ```
   - Or use the existing project:
     ```powershell
     # Use existing .clasp.json with scriptId: "1tEgi3qmwfhy3MQrXsClJ8a2v9yNOIuuZBc5PGKdlkMVBNIorI2sbrZBh"
     ```

5. **Push Code to Google Apps Script**:
   ```powershell
   clasp push
   ```

6. **Open in Browser**:
   ```powershell
   clasp open
   ```

### Best Practices for Development

1. **Separation of Concerns**:
   - Keep backend logic in `.js` files
   - Keep frontend logic in HTML files with `<script>` tags
   - Use include files for modularizing HTML

2. **Error Handling**:
   - Always use try-catch blocks for error handling in backend functions
   - Use `withSuccessHandler` and `withFailureHandler` for all `google.script.run` calls

3. **Security Guidelines**:
   - Never store sensitive data in client-side code
   - Always validate inputs on the server side
   - Use Script Properties for configuration data
   - Implement proper access controls

4. **Debugging**:
   - Use `Logger.log()` for server-side debugging
   - Use `console.log()` for client-side debugging
   - Check Stackdriver logs for production errors

### Version Control Strategy

1. **Branching Strategy**:
   - `main`: Production-ready code
   - `develop`: Integration branch
   - `feature/*`: New features
   - `bugfix/*`: Bug fixes

2. **Release Process**:
   - Merge feature branches to `develop`
   - Test thoroughly in `develop`
   - Create release branches `release/vX.Y.Z`
   - Merge to `main` when ready to deploy

## Security Considerations

- **Authentication**: Based on Google account emails, leveraging Google's secure authentication system
- **Data Storage**: Script properties are securely stored in Google's infrastructure
- **Access Control**: Implemented at both frontend and backend levels
- **Input Validation**: All user inputs are validated to prevent injection attacks
- **Session Management**: Uses Google's secure session management
- **Execution Context**: App runs in the security context of the accessing user ("USER_ACCESSING")
- **Data Transmission**: All communication uses HTTPS encryption

<!-- This is redundant with the earlier Project Structure section, so it's being removed -->
