const extendGlobal = require('app-script-mock');

describe('SpreadsheetTemplater tests', function(){
	before(function (){
		var chai = require('chai');
		global.assert = chai.assert;
		global.expect = chai.expect;

		extendGlobal(global)

		var QuickDriveConstructor = require('./../src/QuickDrive.js').QuickDrive,
			QuickDrive = new QuickDriveConstructor(DriveApp, SpreadsheetApp);
		
		global.SheetTemplater = QuickDrive.SheetTemplater();
	});
	require('./spreadsheetTemplater/mainTest.js');
});