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
    default:
      return false;
  }
}