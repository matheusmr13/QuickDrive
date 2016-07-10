var Cell = function (firstValue) {
	var value = firstValue || '',
		backgroundColor = 'white',
		borderStyle = 'SOLID';

	var links = {};

	this.setValue = function (newValue) {
		value = newValue;
	};
	this.setFormula = function (newValue) {
		value = newValue;
	};
	this.getValue = function () {
		return value;
	};

	this.setBackground = function(newBackground) {
		backgroundColor = newBackground;
	};
	this._configureLinks = function(newLinks) {
		links = newLinks;
	};
	this._left = function() {
		return links.left;
	};
	this._bottom = function() {
		return links.bottom;
	};
	this._right = function() {
		return links.right;
	};
	this._top = function() {
		return links.top;
	};
};

exports.Cell = Cell;
