var Cell = function (firstValue) {
	var value = firstValue || "";
	this.setValue = function (newValue) {
		value = newValue;
	};
	this.getValue = function () {
		return value;
	};
};

exports.Cell = Cell;
