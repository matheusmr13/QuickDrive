var SpreadsheetApp = require('./mock/SpreadsheetApp.js').SpreadsheetApp();
var DriveApp = require('./mock/DriveApp.js').DriveApp();
var assert = require('chai').assert;

describe('DriveApp sheet mock test', function () {
	describe('copy of file with name in folder', function () {
		it('it should return file with specified id', function () {
			var file = DriveApp.getFileById('myFileId');
			assert.equal('myFileId', file.getId());
		});
		it('it should return folder with specified id', function () {
			var folder = DriveApp.getFolderById('myFolderId');
			assert.equal('myFolderId', folder.getId());
		});
		it('it should return file and folder should have one file', function () {
			var folder = DriveApp.getFolderById('myFolderId');
			var file = DriveApp.getFileById('myFileId');
			var newFile = file.makeCopy('my new file name', folder);
			assert.equal('my new file name', newFile.getName());
			assert.equal(1, folder.getFiles().length);
		});
	});
});
