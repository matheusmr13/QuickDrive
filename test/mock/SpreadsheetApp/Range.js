var Range = function (myMatrix) {
	var matrix = myMatrix || [
		[]
	];
	this.getValues = function () {
		var values = [];
		for (var i = 0; i < matrix.length; i++) {
			values[i] = [];
			for (var j = 0; j < matrix[i].length; j++) {
				values[i][j] = matrix[i][j].getValue();
			}
		}
		return values;
	};

	this._getCells = function() {
		return matrix;
	};
	this.copyTo = function (anotherRange) {
		var firstCell = anotherRange._getCells()[0][0];
		var actualLineCell = firstCell;
		for (var i = 0; i < matrix.length; i++) {
			actualCell = actualLineCell;
			for (var j = 0; j < matrix[0].length; j++) {
				actualCell.setValue(matrix[i][j].getValue());
				actualCell = actualCell._right();
			}
			actualLineCell = actualLineCell._bottom();
		}
	};

	this.setBackground = function (background) {
		setSomeValue(background, 'Background');
	};
	this.setValue = function (value) {
		setSomeValue(value, 'Value');
	};
	this.setFormula = function (formula) {
		setSomeValue(formula, 'Formula');
	};
	this.setTextSize = function (textSize) {
		setSomeValue(textSize, 'TextSize');
	};
	this.setColor = function (color) {
		setSomeValue(color, 'Color');
	};
	this.setBorderStyle = function (borderStyle) {
		setSomeValue(borderStyle, 'BorderStyle');
	};
	this.setBorderColor = function (borderColor) {
		setSomeValue(borderColor, 'BorderColor');
	};
	var setSomeValue = function(value, propertie) {
		for (var i = 0; i < matrix.length; i++) {
			for (var j = 0; j < matrix[0].length; j++) {
				matrix[i][j]['set' + propertie](value);
			}
		}
	};

	this.getCells = function() {
		return matrix;
	};
};

exports.Range = Range;
