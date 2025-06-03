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