var Cell = function (firstValue) {
	var value = firstValue || '',
		formula = '',
		backgroundColor = 'default',
		borderStyle = 'default',
		fontColor = 'default',
		fontSize = 'default',
		borderColor = 'default';

	var links = {};

	this.getValue = function () {
		return value + '';
	};
	this.getNumberValue = function() {
		if (isNaN(value)) {
			return 0;
		} else {
			return parseInt(value || 0);
		}
	};
	this.setValue = function (newValue) {
		value = newValue;
	};
	this.getFormula = function () {
		return formula;
	};
	this.setFormula = function (newFormula) {
		value = '';
		formula = newFormula;
	};
	this.getBackground = function () {
		return backgroundColor;
	};
	this.setBackground = function (newBackground) {
		backgroundColor = newBackground;
	};
	this.getBorderColor = function () {
		return borderColor;
	};
	this.setBorderColor = function (newBorderColor) {
		borderColor = newBorderColor;
	};
	this.getBorderStyle = function () {
		return borderStyle;
	};
	this.setBorderStyle = function (newBorderStyle) {
		borderStyle = newBorderStyle;
	};
	this.getFontColor = function () {
		return fontColor;
	};
	this.setFontColor = function (newFontColor) {
		fontColor = newFontColor;
	};
	this.getFontSize = function () {
		return fontSize;
	};
	this.setFontSize = function (newFontSize) {
		fontSize = newFontSize;
	};
	this._configureLinks = function (newLinks) {
		links = newLinks;
	};
	this._left = function () {
		return links.left;
	};
	this._bottom = function () {
		return links.bottom;
	};
	this._right = function () {
		return links.right;
	};
	this._top = function () {
		return links.top;
	};
};

exports.Cell = Cell;
