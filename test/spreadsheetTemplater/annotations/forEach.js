var DriveApp = require('./../../mock/DriveApp.js').DriveApp;
var Cell = require('./../../mock/SpreadsheetApp/Cell.js').Cell;
var SpreadsheetApp = require('./../../mock/SpreadsheetApp.js').SpreadsheetApp;
var QuickDriveConstructor = require('../../../src/SheetsTemplater.js').QuickDrive;
var QuickDrive = QuickDriveConstructor(DriveApp(), SpreadsheetApp());
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

var matrixMockWithReplaceAnnotations = [
	[new Cell('Languages that he likes'), new Cell(''), new Cell(''), new Cell('')],
	[new Cell('{~this.curriculum.languagesThatLikes : languages}'), new Cell('{=languages}'), new Cell('{~}'), new Cell('text that will stay on last line')],
	[new Cell('-'), new Cell('-'), new Cell('-'), new Cell('-')],
];

var jsonMock = {
	curriculum: {
		languagesThatLikes: [
			'Java',
			'JavaScript',
			'CSS',
			'HTML',
			'Python'
		]
	}
};
describe('forEach annotation', function () {
	it('it should return sheet forEach replaced', function () {
		var QuickDriveMock = new QuickDriveConstructor(DriveApp(), SpreadsheetApp(matrixMockWithReplaceAnnotations));
		var file = QuickDriveMock.processSheet(jsonMock);
		assert.equal(JSON.stringify([
			['Languages that he likes', '', '', ''],
			['', 'Java', '', ''],
			['', 'JavaScript', '', ''],
			['', 'CSS', '', ''],
			['', 'HTML', '', ''],
			['', 'Python', '', 'text that will stay on last line'],
			['-', '-', '-', '-']
		]), JSON.stringify(file.sheet._processFormulas().getRange(1, 1, file.sheet.getMaxRows(), file.sheet.getMaxColumns()).getValues()));
	});
});
