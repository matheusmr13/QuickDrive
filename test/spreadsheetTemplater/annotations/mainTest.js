var DriveApp = require('./../../mock/DriveApp.js').DriveApp;
var Cell = require('./../../mock/SpreadsheetApp/Cell.js').Cell;
var SpreadsheetApp = require('./../../mock/SpreadsheetApp.js').SpreadsheetApp;
var QuickDriveConstructor = require('./../../../src/SheetsTemplater.js').QuickDrive;
var QuickDrive = new QuickDriveConstructor(DriveApp(), SpreadsheetApp());
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

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
	it('it should set matrix annotation', function () {
		assert.equal(QuickDrive.annotationFunctions.SET_MATRIX, QuickDrive.getAnnotationType('{+myMatrix}'));
		assert.equal(QuickDrive.annotationFunctions.SET_MATRIX, QuickDrive.getAnnotationType('{+my.matrix}'));
		assert.equal(QuickDrive.annotationFunctions.SET_MATRIX, QuickDrive.getAnnotationType('{+foo.bar.with.many.properties.myMatrix}'));
	});
});

describe('Testing annottations', function () {
	require('./allProperties.js');
	require('./forEach.js');
});