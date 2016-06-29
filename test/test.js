var DriveApp = require('./mock/DriveAppMock.js').DriveAppMock.DriveApp;
var QuickDrive = require('../src/SheetsTemplater.gs').QuickDrive(DriveApp());
var assert = require('chai').assert;

describe('QuickDrive', function () {
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
	});
	describe('merge configs', function () {
		it('it should keep default config', function () {
			var config = QuickDrive.confi
		});
	});
});
