var Range = require('./Range').Range;
var Cell = require('./Cell').Cell;
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

		// for (var i =0; i < newMatrix.length;i++) {
		// 	var a = '';
		// 	for(var j =0;j < newMatrix[i].length;j++) {
		// 		a = a + '    ' + newMatrix[i][j].getValue();
		// 	}
		// 	console.info(a);
		// }
		// console.info(newMatrix.length);
		// console.info(newMatrix[0].length);
		matrix = newMatrix;
	};

	this.getMaxRows = function () {
		return matrix.length;
	};

	this.getMaxColumns = function () {
		return matrix[0].length;
	};
};

exports.Sheet = Sheet;
