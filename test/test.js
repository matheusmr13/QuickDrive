describe('SpreadsheetTemplater tests', function(){
	before(function (){
		var chai = require('chai');
		global.assert = chai.assert;
		global.expect = chai.expect;

		global.DriveApp = require('./mock/DriveApp.js').DriveApp();
		global.SpreadsheetApp = require('./mock/SpreadsheetApp.js').SpreadsheetApp();
		global.Cell = require('./mock/SpreadsheetApp/Cell.js').Cell;

		var QuickDriveConstructor = require('./../src/QuickDrive.js').QuickDrive,
			QuickDrive = new QuickDriveConstructor(DriveApp, SpreadsheetApp);
		
		global.SheetTemplater = QuickDrive.SheetTemplater();
	});
	require('./spreadsheetTemplater/mainTest.js');
});