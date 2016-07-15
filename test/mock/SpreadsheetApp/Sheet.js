var Range = require('./Range').Range;
var Cell = require('./Cell').Cell;
var Formulas = require('./Formulas').Formulas;
var Sheet = function (myMatrix) {
	var matrix = myMatrix || [
		[]
	];

	var setupMatrixLinks = function () {
		for (var i = 0; i < matrix.length; i++) {
			for (var j = 0; j < matrix[i].length; j++) {
				matrix[i][j]._configureLinks({
					top: i != 0 ? matrix[i - 1][j] : undefined,
					right: j != (matrix[i].length - 1) ? matrix[i][j + 1] : undefined,
					bottom: i != (matrix.length - 1) ? matrix[i + 1][j] : undefined,
					left: j != 0 ? matrix[i][j - 1] : undefined
				});
			}
		}

	};

	setupMatrixLinks();
	this.getRange = function (row, col, lines, cols) {
		lines = lines || 1;
		cols = cols || 1;
		if (!row || !col || row <= 0 || col <= 0 || lines > matrix.length || cols > matrix[0].length) {
			throw new Error('Invalid params to range.');
		}
		var newMatrix = [
			[]
		];
		for (var i = 0; i < lines; i++) {
			newMatrix[i] = [];
			for (var j = 0; j < cols; j++) {
				newMatrix[i][j] = matrix[i + row - 1][j + col - 1];
			}
		}
		return new Range(newMatrix);
	};

	var createRow = function (qty) {
		var row = [];
		for (var i = 0; i < qty; i++) {
			row.push(new Cell(''));
		}
		return row;
	};

	this.insertRowsBefore = function (row, qty) {
		var newMatrix = [];
		for (var i = 0; i < row - 1; i++) {
			newMatrix.push(matrix[i]);
		}
		for (var i = 0; i < qty; i++) {
			newMatrix.push(createRow(matrix[0].length));
		}
		for (var i = row - 1; i < matrix.length; i++) {
			newMatrix.push(matrix[i]);
		}

		matrix = newMatrix;
	};

	this.getMaxRows = function () {
		return matrix.length;
	};

	this.getMaxColumns = function () {
		return matrix[0].length;
	};

	this._processFormula = function (cell, formulas) {
		if (cell.getFormula() && !cell.getValue()) {
			cell.setFormula(cell.getFormula().trim());
			var parts = cell.getFormula().split('('),
				formula = parts[0].substring(1),
				params = parts[1].substring(0, parts[1].length - 1).split(','),
				formulaFunction = formulas[formula];
			if (!formulaFunction) {
				throw new Error('Not testable function: ' + formula);
			} else {
				cell.setValue(formulaFunction(params));
			}
		}
	};

	this._processFormulas = function () {
		var formulas = Formulas(this);
		for (var i = 0; i < matrix.length; i++) {
			for (var j = 0; j < matrix[i].length; j++) {
				this._processFormula(matrix[i][j], formulas);
			}
		}
		return this;
	};
};

exports.Sheet = Sheet;
