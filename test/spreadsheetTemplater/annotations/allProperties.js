var DriveApp = require('./../../mock/DriveApp.js').DriveApp;
var Cell = require('./../../mock/SpreadsheetApp/Cell.js').Cell;
var Range = require('./../../mock/SpreadsheetApp/Range.js').Range;
var SpreadsheetApp = require('./../../mock/SpreadsheetApp.js').SpreadsheetApp;
var QuickDriveConstructor = require('../../../src/SheetsTemplater.js').QuickDrive;
var QuickDrive = QuickDriveConstructor(DriveApp(), SpreadsheetApp(), new Range());
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

var matrixMockWithReplaceAnnotations = [
	[new Cell('{*this.propertyCell}'), new Cell('{*this.anotherPropertyCell}')],
	[new Cell('{*this.long.obj.reference.cell}'), new Cell('')]
];

var jsonMock = {
	propertyCell: {
		value: 'The value',
		backgroundColor: 'rgb(100,100,100)',
		fontColor: '#F00',
		fontSize: 23,
		borderStyle: 'DOTTED',
		borderColor: '#00F'
	},
	anotherPropertyCell: {
		value: 'my second value',
		fontColor: '#F00',
		borderColor: '#00F'
	},
	long: {
		obj: {
			reference: {
				cell: {
					value: '',
					fontSize: 10,
					borderColor: '#00F'
				}
			}
		}
	}
};

describe('test specific annotations', function () {
	it('all properties annotation', function () {
		var QuickDriveMock = new QuickDriveConstructor(DriveApp(), SpreadsheetApp(matrixMockWithReplaceAnnotations));
		var file = QuickDriveMock.processSheet(jsonMock);
		var range = file.sheet._processFormulas().getRange(1,1,2,2).getCells();
		var firstCell = range[0][0];
		var secondCell = range[0][1];
		var thirdCell = range[1][0];
		assert.equal('The value', firstCell.getValue());
		assert.equal('rgb(100,100,100)', firstCell.getBackground());
		assert.equal('#F00', firstCell.getFontColor());
		assert.equal(23, firstCell.getFontSize());
		assert.equal('DOTTED', firstCell.getBorderStyle());
		assert.equal('#00F', firstCell.getBorderColor());

		assert.equal('my second value', secondCell.getValue());
		assert.equal('default', secondCell.getBackground());
		assert.equal('#F00', secondCell.getFontColor());
		assert.equal('default', secondCell.getFontSize());
		assert.equal('default', secondCell.getBorderStyle());
		assert.equal('default', secondCell.getBorderColor());

		assert.equal('', thirdCell.getValue());
		assert.equal('default', thirdCell.getBackground());
		assert.equal('default', thirdCell.getFontColor());
		assert.equal(10, thirdCell.getFontSize());
		assert.equal('default', thirdCell.getBorderStyle());
		assert.equal('default', thirdCell.getBorderColor());
	});
	});
