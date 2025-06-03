// Backend functions for initial setup and authentication

// Check if initial setup is complete
function isSetupComplete() {
  var scriptProperties = PropertiesService.getScriptProperties();
  return scriptProperties.getProperty('SETUP_DATE') !== null;
}

// Perform initial setup with provided values
function performInitialSetup(adminEmail, authorizedUsers, sheetsLink) {
  try {
    // Validate inputs
    if (!adminEmail || !authorizedUsers || !sheetsLink) {
      return { success: false, message: "All fields are required" };
    }
    
    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail)) {
      return { success: false, message: "Invalid admin email format" };
    }
    
    // Validate Google Sheets link
    try {
      var spreadsheet = SpreadsheetApp.openByUrl(sheetsLink);
      if (!spreadsheet) {
        throw new Error("Invalid spreadsheet URL");
      }
    } catch (e) {
      return { success: false, message: "Invalid Google Sheets URL or insufficient permissions" };
    }
    
    // Create script properties
    var scriptProperties = PropertiesService.getScriptProperties();
    scriptProperties.setProperty('ADMIN_EMAIL', adminEmail);
    scriptProperties.setProperty('AUTHORIZED_USERS', authorizedUsers);
    scriptProperties.setProperty('GOOGLE_SHEETS_LINK', sheetsLink);
    scriptProperties.setProperty('SETUP_DATE', new Date().toISOString());
    
    return { success: true, message: "Setup completed successfully" };
  } catch (error) {
    return { success: false, message: "Setup failed: " + error.message };
  }
}

// Get user authentication status and role
function getUserAuthStatus() {
  var scriptProperties = PropertiesService.getScriptProperties();
  
  // Check if setup is complete
  if (!isSetupComplete()) {
    return { isSetupComplete: false };
  }
  
  var currentUser = Session.getActiveUser().getEmail();
  var adminEmail = scriptProperties.getProperty('ADMIN_EMAIL');
  var authorizedUsersString = scriptProperties.getProperty('AUTHORIZED_USERS');
  var authorizedUsers = authorizedUsersString ? authorizedUsersString.split(',').map(email => email.trim()) : [];
  
  var isAdmin = (currentUser === adminEmail);
  var isAuthorizedUser = authorizedUsers.includes(currentUser);
  
  return {
    isSetupComplete: true,
    isAuthenticated: isAdmin || isAuthorizedUser,
    isAdmin: isAdmin,
    userEmail: currentUser
  };
}


// Get script properties for admin view
function getScriptProperties() {
  var userStatus = getUserAuthStatus();
  
  if (!userStatus.isAuthenticated || !userStatus.isAdmin) {
    return { success: false, message: "Unauthorized access" };
  }
  
  var scriptProperties = PropertiesService.getScriptProperties();
  
  return {
    success: true,
    properties: {
      adminEmail: scriptProperties.getProperty('ADMIN_EMAIL'),
      authorizedUsers: scriptProperties.getProperty('AUTHORIZED_USERS'),
      sheetsLink: scriptProperties.getProperty('GOOGLE_SHEETS_LINK'),
      setupDate: scriptProperties.getProperty('SETUP_DATE')
    }
  };
}

/**
 * Get the appropriate content to show based on user's role and authentication status
 * This is the main function for determining which content container to display
 * @return {Object} Object containing container IDs and visibility status
 */
function getContentVisibility() {
  var authStatus = getUserAuthStatus();
  
  // Create the base visibility object
  var visibility = {
    setupContainer: false,
    adminContent: false,
    userContent: false,
    unauthorizedContent: false
  };
  
  // Determine which container should be visible
  if (!authStatus.isSetupComplete) {
    visibility.setupContainer = true;
  } else if (!authStatus.isAuthenticated) {
    visibility.unauthorizedContent = true;
  } else if (authStatus.isAdmin) {
    visibility.adminContent = true;
  } else {
    visibility.userContent = true;
  }
  
  return {
    visibility: visibility,
    userInfo: {
      email: authStatus.userEmail || '',
      isAdmin: authStatus.isAdmin || false,
      isAuthenticated: authStatus.isAuthenticated || false
    }
  };
}

/**
 * Get admin-specific data and content
 * This function is for loading any admin-specific data that should be displayed in the admin container
 * @return {Object} Object containing admin data and status
 */
function getAdminContent() {
  var userStatus = getUserAuthStatus();
  
  if (!userStatus.isAuthenticated || !userStatus.isAdmin) {
    return { success: false, message: "Unauthorized access" };
  }
  
  var scriptProps = getScriptProperties();
  if (!scriptProps.success) {
    return scriptProps; // Return the error message
  }
  
  // Here you can add any additional admin data that needs to be loaded
  // For example, statistics, user management data, etc.
  
  return {
    success: true,
    content: {
      properties: scriptProps.properties,
      // Add more admin-specific content here
      stats: {
        totalUsers: scriptProps.properties.authorizedUsers.split(',').length,
        setupDate: new Date(scriptProps.properties.setupDate).toLocaleDateString()
      }
    }
  };
}

/**
 * Get user-specific data and content
 * This function is for loading any user-specific data that should be displayed in the user container
 * @return {Object} Object containing user data and status
 */
function getUserContent() {
  var userStatus = getUserAuthStatus();
  
  if (!userStatus.isAuthenticated) {
    return { success: false, message: "Unauthorized access" };
  }
  
  // Here you can add any additional user data that needs to be loaded
  
  return {
    success: true,
    content: {
      userEmail: userStatus.userEmail,
      // Add more user-specific content here
    }
  };
}

/**
 * Reset the application by clearing all script properties
 * This would be used for testing or when a complete reset is needed
 * Requires admin authentication
 * @return {Object} Status of the reset operation
 */
function resetApplication() {
  var userStatus = getUserAuthStatus();
  
  if (!userStatus.isAuthenticated || !userStatus.isAdmin) {
    return { success: false, message: "Unauthorized access" };
  }
  
  try {
    var scriptProperties = PropertiesService.getScriptProperties();
    scriptProperties.deleteAllProperties();
    return { success: true, message: "Application reset successfully" };
  } catch (error) {
    return { success: false, message: "Failed to reset application: " + error.message };
  }
}