function doPost(e) {
	var json = e ? JSON.parse(e.parameters.data[0]) : {};
	var config = e ? (e.parameters.config ? JSON.parse(e.parameters.config[0]) : {}) : {};
	var QuickDriveObj = new QuickDrive(DriveApp, SpreadsheetApp, config);
	var newFile = QuickDriveObj.processSheet(json);
	return ContentService.createTextOutput(newFile.fileId);
};
