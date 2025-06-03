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





