var Cell = function (firstValue) {
	var value = firstValue || '',
		backgroundColor = 'default',
		borderStyle = 'default',
		color = 'default',
		textSize = 'default',
		borderColor = 'default';

	var links = {};

	this.getValue = function () {
		return value;
	};
	this.setValue = function (newValue) {
		value = newValue;
	};
	this.setFormula = function (newValue) {
		value = newValue;
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
	this.getColor = function () {
		return color;
	};
	this.setColor = function (newColor) {
		color = newColor;
	};
	this.getTextSize = function () {
		return textSize;
	};
	this.setTextSize = function (newTextSize) {
		textSize = newTextSize;
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
