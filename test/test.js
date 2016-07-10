var DriveApp = require('./mock/DriveApp.js').DriveApp;
var Cell = require('./mock/SpreadsheetApp/Cell.js').Cell;
var SpreadsheetApp = require('./mock/SpreadsheetApp.js').SpreadsheetApp;
var QuickDriveConstructor = require('../src/SheetsTemplater.gs').QuickDrive;
var QuickDrive = new QuickDriveConstructor(DriveApp(), SpreadsheetApp());
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe('QuickDrive functions', function () {
	describe('getAnnotationType', function () {
		it('it should return none annotation, just simple text', function () {
			assert.equal(QuickDrive.annotationFunctions.NONE, QuickDrive.getAnnotationType('==simple text with no annotation=='));
			assert.equal(QuickDrive.annotationFunctions.NONE, QuickDrive.getAnnotationType('{another simple'));
			assert.equal(QuickDrive.annotationFunctions.NONE, QuickDrive.getAnnotationType('another one}'));
			assert.equal(QuickDrive.annotationFunctions.NONE, QuickDrive.getAnnotationType('{with no action}'));
		});
		it('it should return none annotation (invalid annotation present)', function () {
			assert.equal(QuickDrive.annotationFunctions.NONE, QuickDrive.getAnnotationType('{=@foo.bar}'));
			assert.equal(QuickDrive.annotationFunctions.NONE, QuickDrive.getAnnotationType('{=@bar}'));
			assert.equal(QuickDrive.annotationFunctions.NONE, QuickDrive.getAnnotationType('{=foo..bar}'));
			assert.equal(QuickDrive.annotationFunctions.NONE, QuickDrive.getAnnotationType('{=.foo.bar}'));
			assert.equal(QuickDrive.annotationFunctions.NONE, QuickDrive.getAnnotationType('{=.foobar}'));
			assert.equal(QuickDrive.annotationFunctions.NONE, QuickDrive.getAnnotationType('{=foobar.}'));
			assert.equal(QuickDrive.annotationFunctions.NONE, QuickDrive.getAnnotationType('{=foo@bar}'));
		});
		it('it should return simple replace text', function () {
			assert.equal(QuickDrive.annotationFunctions.REPLACE_TEXT, QuickDrive.getAnnotationType('{=foo.bar}'));
			assert.equal(QuickDrive.annotationFunctions.REPLACE_TEXT, QuickDrive.getAnnotationType('{=foo}'));
			assert.equal(QuickDrive.annotationFunctions.REPLACE_TEXT, QuickDrive.getAnnotationType('{=foo.bar.text.with.many.properties}'));
		});
		it('it should return for each annotation', function () {
			assert.equal(QuickDrive.annotationFunctions.FOR_EACH, QuickDrive.getAnnotationType('{~mylist}'));
			assert.equal(QuickDrive.annotationFunctions.FOR_EACH, QuickDrive.getAnnotationType('{~foo.myList}'));
			assert.equal(QuickDrive.annotationFunctions.FOR_EACH, QuickDrive.getAnnotationType('{~foo.bar.with.many.properties.myList}'));
		});
		it('it should insert formula annotation', function () {
			assert.equal(QuickDrive.annotationFunctions.INSERT_FORMULA, QuickDrive.getAnnotationType('{#myFormula}'));
			assert.equal(QuickDrive.annotationFunctions.INSERT_FORMULA, QuickDrive.getAnnotationType('{#my.formula}'));
			assert.equal(QuickDrive.annotationFunctions.INSERT_FORMULA, QuickDrive.getAnnotationType('{#foo.bar.with.many.properties.myList}'));
		});
	});
	describe('validateConfig', function () {
		var createQuickDriveWithConfig = function (propertie, value) {
			var obj = {};
			obj[propertie] = value;
			return function () {
				QuickDriveConstructor(DriveApp(), SpreadsheetApp(), obj);
			};
		};
		it('it should have default config with no error', function () {
			QuickDriveConstructor(DriveApp(), QuickDrive._config);
		});
		it('it should validate fileId', function () {
			assert.throws(createQuickDriveWithConfig('templateId', 'myshortid'), Error, 'invalid-file-id');
			assert.throws(createQuickDriveWithConfig('templateId', 2313123), Error, 'invalid-file-id');
			assert.throws(createQuickDriveWithConfig('templateId', true), Error, 'invalid-file-id');
			createQuickDriveWithConfig('fileId', '123456789012345678901234567890123456789012345')();
		});
		it('it should validate folderId', function () {
			assert.throws(createQuickDriveWithConfig('folderId', 'myshortid'), Error, 'invalid-folder-id');
			assert.throws(createQuickDriveWithConfig('folderId', 2313123), Error, 'invalid-folder-id');
			assert.throws(createQuickDriveWithConfig('folderId', true), Error, 'invalid-folder-id');
			createQuickDriveWithConfig('folderId', '123456789012345678')();
		});
		it('it should validate file name', function () {
			assert.throws(createQuickDriveWithConfig('newDocumentName', 2313123), Error, 'invalid-file-name');
			assert.throws(createQuickDriveWithConfig('newDocumentName', true), Error, 'invalid-file-name');
			createQuickDriveWithConfig('newDocumentName', 'my new name')();
		});
		it('it should validate stripe color', function () {
			assert.throws(createQuickDriveWithConfig('stripeColor', 2313123), Error, 'invalid-stripe-color');
			assert.throws(createQuickDriveWithConfig('stripeColor', true), Error, 'invalid-stripe-color');
			assert.throws(createQuickDriveWithConfig('stripeColor', '#3333'), Error, 'invalid-stripe-color');
			assert.throws(createQuickDriveWithConfig('stripeColor', '3333'), Error, 'invalid-stripe-color');
			createQuickDriveWithConfig('stripeColor', '#333333')();
			createQuickDriveWithConfig('stripeColor', '#333')();
			createQuickDriveWithConfig('stripeColor', 'rgb(123,123,123)')();
		});
	});
});

var matrixMockWithReplaceAnnotations = [
	[new Cell('{=this.reportHeader}'), new Cell('My random text'), new Cell('another random text'), new Cell('')],
	[new Cell('{=this.user.name}'), new Cell('{=this.user.lastName}'), new Cell('{=this.user.age}'), new Cell('My user')],
	[new Cell('{=this.user.address.cep}'), new Cell('{=this.user.address.city.name}'), new Cell('{=this.user.address.city.state.name}'), new Cell('{=this.user.address.city.state.country.name}')],
	[new Cell('{#this.myFormula}'), new Cell(''), new Cell(''), new Cell('')],
	[new Cell('Languages that he likes'), new Cell(''), new Cell(''), new Cell('')],
	[new Cell('{~this.curriculum.languagesThatLikes : languages}'), new Cell('{=languages}'), new Cell('{~}'), new Cell('text that will stay on last line')]
];

var jsonMock = {
	reportHeader: 'My cool header',
	myFormula: 'SUM(10,30)',
	user: {
		name: 'Matheus',
		lastName: 'Martins do Rego',
		age: 20,
		address: {
			cep: '12345-678',
			city: {
				name: 'Campinas',
				state: {
					name: 'São Paulo',
					country: {
						name: 'Brasil'
					}
				}
			}
		}
	},
	curriculum: {
		yearsWorking: 3,
		languagesThatLikes: [
			'Java',
			'JavaScript',
			'CSS',
			'HTML',
			'Python'
		]
	}
};
describe('QuickDrive functions', function () {
	describe('get new sheet', function () {
		it('it should return sheet with text replaced', function () {
			var QuickDriveMock = new QuickDriveConstructor(DriveApp(), SpreadsheetApp(matrixMockWithReplaceAnnotations));
			var file = QuickDriveMock.processSheet(jsonMock);
			assert.equal(JSON.stringify([
				['My cool header', 'My random text', 'another random text', ''],
				['Matheus', 'Martins do Rego', 20, 'My user'],
				['12345-678', 'Campinas', 'São Paulo', 'Brasil'],
				['=SUM(10,30)', '','',''],
				['Languages that he likes', '', '', ''],
				['', 'Java', '', ''],
				['', 'JavaScript', '', ''],
				['', 'CSS', '', ''],
				['', 'HTML', '', ''],
				['', 'Python', '', 'text that will stay on last line']
			]), JSON.stringify(file.sheet.getRange(1, 1, file.sheet.getMaxRows(), file.sheet.getMaxColumns()).getValues()));
		});
	});
});
