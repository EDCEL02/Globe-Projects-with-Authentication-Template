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