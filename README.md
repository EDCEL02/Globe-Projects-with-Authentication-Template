# Globe QTR System Documentation

## Overview
This Google Apps Script web application provides a role-based authentication system that displays different content based on user roles (admin, authorized user, or unauthorized). The system uses Google's Script Properties for configuration storage and Google Sheets for data management.

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
```

## Technical Implementation

### Backend Components (`backend-initial-setup.js` and `Code.js`)

1. **Script Properties Functions**:
   - `isSetupComplete()`: Checks if initial setup has been done
   - `performInitialSetup()`: Validates and saves setup information
   - `getUserAuthStatus()`: Determines user's authentication status and role
   - `getScriptProperties()`: Retrieves stored properties (admin-only)

2. **Content Visibility Functions**:
   - `getContentVisibility()`: Returns which content containers should be shown
   - `getAdminContent()`: Loads admin-specific data
   - `getUserContent()`: Loads user-specific data
   - `shouldShowContainer()`: Helper to check if a specific container should be shown

3. **Content Management**:
   - `showContent()`: Main function called from frontend to determine what to display
   - `loadAdminContentData()`: Loads admin dashboard data
   - `loadUserContentData()`: Loads user dashboard data

### Frontend Components (`frontend-js-updated.html`)

1. **Initialization**:
   - `initializeApp()`: Main entry point that checks auth status on page load
   - `handleContentVisibility()`: Processes the visibility response

2. **Content Display**:
   - Shows/hides containers based on user role
   - Updates user interface elements with appropriate data
   - Animates transitions between views

3. **Form Handling**:
   - `submitSetupForm()`: Processes initial setup form submission
   - Form validation and error handling

### HTML Structure (`dashb-initial-setup.html`)
Contains all the main content containers:
- `setupContainer`: Initial setup form
- `adminContent`: Admin dashboard
- `userContent`: User dashboard
- `unauthorizedContent`: Access denied message

### Styling (`appstyles.html`)
- Bootstrap-based responsive design
- Custom animations for container transitions
- UI components styled for consistent appearance

## Content Visibility Flow

```
1. Page Load
│
└─► initializeApp() calls backend showContent()
    │
    └─► Backend determines user role & returns visibility object
        │
        └─► Frontend shows appropriate container
            │
            └─► If admin/user content shown, additional data is loaded
```

## How to Extend the Application

### Adding New Content Containers
1. Add a new HTML container to `dashb-initial-setup.html`
2. Update `getContentVisibility()` in `backend-initial-setup.js` to include the new container
3. Update `handleContentVisibility()` in `frontend-js-updated.html` to handle the new container

### Adding User-Specific Features
1. Enhance `getUserContent()` in backend to include new data
2. Update `loadUserData()` and `displayUserData()` in frontend to use this data

### Adding Admin-Specific Features
1. Enhance `getAdminContent()` in backend to include new data
2. Update `loadAdminData()` and `displayAdminData()` in frontend to use this data

## Deployment Guide
1. Open the Google Apps Script editor
2. Set the deployment type as "Web app"
3. Set "Execute as" to "User accessing the web app"
4. Set "Who has access" to "Anyone"
5. Deploy and copy the web app URL

## Security Considerations
- Authentication is based on Google account emails
- Script properties are securely stored in Google's infrastructure
- The app requires users to be logged into their Google accounts

## File Structure
```
├── appsscript.json       # Project configuration
├── appstyles.html        # CSS styles
├── backend-initial-setup.js # Backend logic for authentication
├── Code.js               # Main entry point and utility functions
├── dashb-initial-setup.html # HTML containers for different views
├── frontend-initial-setup-js.html # Original frontend JS (deprecated)
├── frontend-js-updated.html # Current frontend JavaScript
└── index.html            # Main HTML template
```
