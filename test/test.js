
var  SheetMock = function(matrix) {
	var matrix = matrix || [[]];

	var CellMock = function() {
		var value = "";
		this.setValue = function(newValue) {
			this.value = newValue;
		};

		this.getValue = function() {
			return value;
		};
	};

	var CellGroupMock = function(matrix) {
		var matrix = matrix || [[]];

		this.getValues = function() {
			var values = [];
			for (var i = row; i < lines;i++) {
				values[i] = [];
				for (var j = col; j < cols; j++) {
					values[i][j] = matrix[i][j];
				}
			}
			return values;
		};

		this.setValue = function(value) {
			for (var i = 0; i < matrix.length;i++) {
				for (var j = 0; j < matrix.length; j++) {
					matrix[i][j] = value;
				}
			}
		};
	};

	SheetMock.getRange = function(row, col, lines, cols) {
		var newMatrix = [[]];
		for (var i = row; i < lines;i++) {
			newMatrix[i] = [];
			for (var j = col; j < cols; j++) {
				newMatrix[i][j];
			}
		}
		return new CellGroupMock(newMatrix);
	};
};



DriveApp = {};
DriveApp.Access = {};
DriveApp.Permission = {};

var QuickDrive = require('../SheetsTemplater.gs').QuickDrive;
console.info(QuickDrive);
var assert = require('chai').assert;
describe('QuickDrive', function () {
	describe('getAnnotationType', function () {
		it('it should return none annotation, just simple text', function () {
			assert.equal(QuickDrive.annotationFunctions.NONE, QuickDrive.getAnnotationType('==simple text with no annotation=='));
			assert.equal(QuickDrive.annotationFunctions.NONE, QuickDrive.getAnnotationType('{another simple'));
			assert.equal(QuickDrive.annotationFunctions.NONE, QuickDrive.getAnnotationType('another one}'));
			assert.equal(QuickDrive.annotationFunctions.NONE, QuickDrive.getAnnotationType('{with no action}'));
		});
		it('it should return simple replace text', function () {
			assert.equal(QuickDrive.annotationFunctions.REPLACE_TEXT, QuickDrive.getAnnotationType('{=foo.bar}'));
			assert.equal(QuickDrive.annotationFunctions.REPLACE_TEXT, QuickDrive.getAnnotationType('{=foo}'));
		});
		it('it should return for each annotation', function () {
			assert.equal(QuickDrive.annotationFunctions.FOR_EACH, QuickDrive.getAnnotationType('{~mylist}'));
			assert.equal(QuickDrive.annotationFunctions.FOR_EACH, QuickDrive.getAnnotationType('{~foo.myList}'));
		});

	});
});
