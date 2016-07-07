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

	this.setValue = function (value) {
		for (var i = 0; i < matrix.length; i++) {
			for (var j = 0; j < matrix.length; j++) {
				matrix[i][j].setValue(value);
			}
		}
	};
};

exports.Range = Range;
