function doGet(e) {
  var json = e ? e.parameters : {};
  var templateFile = DriveApp.getFileById(json.idDocument);

  var newFile = templateFile.makeCopy(json.novoNome, DriveApp.getFoldersByName("My folder").next());
  newFile.setSharing(DriveApp.Access.DOMAIN_WITH_LINK, DriveApp.Permission.EDIT);
  newFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  var newDoc = DocumentApp.openById(newFile.getId());
  var newDocBody = newDoc.getBody();

  for (var prop in json) {
    newDocBody.replaceText("{" + prop + "}", json[prop]);
  }
  newDocBody.replaceText("\{(.*?)\}", "");

  return ContentService.createTextOutput(newDoc.getId());
}
