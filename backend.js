function doGet(e) {
  var output = HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Globe QTR')
    .setFaviconUrl('https://raw.githubusercontent.com/Azurenian/DSCS/refs/heads/main/globe-logo.png')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

  return output;
}

function include(filename) {
  return HtmlService.createTemplateFromFile(filename)
    .evaluate()
    .getContent();
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
    unauthorizedContent: false,
    analyticsContent: false // Add the new container
  };
  
  // Determine which container should be visible
  if (!authStatus.isSetupComplete) {
    visibility.setupContainer = true;
  } else if (!authStatus.isAuthenticated) {
    visibility.unauthorizedContent = true;
  } else if (authStatus.isAdmin) {
    visibility.adminContent = true;
    visibility.analyticsContent = true; // Show analytics to admin
  } else {
    visibility.userContent = true;
    visibility.analyticsContent = true; // Show analytics to authorized users too
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

























// Get script properties for admin view and settings dashboard
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
 * Shows the appropriate content container based on user authentication and role
 * This function is called from the frontend to get visibility settings for containers
 * @return {Object} Visibility settings for content containers
 */
function showContent() {
  return getContentVisibility();
}

/**
 * Loads admin content data when the admin container is shown
 * This function is called from the frontend when admin content is loaded
 * @return {Object} Admin-specific data
 */
function loadAdminContentData() {
  return getAdminContent();
}

/**
 * Loads user content data when the user container is shown
 * This function is called from the frontend when user content is loaded
 * @return {Object} User-specific data
 */
function loadUserContentData() {
  return getUserContent();
}

/**
 * Helper function to check if a specific container should be shown
 * @param {string} containerType - Type of container ('admin', 'user', 'setup', 'unauthorized')
 * @return {boolean} Whether the container should be shown
 */
function shouldShowContainer(containerType) {
  var contentVisibility = getContentVisibility();
  
  switch(containerType.toLowerCase()) {
    case 'admin':
      return contentVisibility.visibility.adminContent;
    case 'user':
      return contentVisibility.visibility.userContent;
    case 'setup':
      return contentVisibility.visibility.setupContainer;
    case 'unauthorized':
      return contentVisibility.visibility.unauthorizedContent;
    case 'analytics':
      return contentVisibility.visibility.analyticsContent;
    default:
      return false;
  }
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


