var Sheet = require('./Sheet.js').Sheet
var Spreadsheet = function (mock) {
	var sheets = [new Sheet(mock)];

	this.getSheets = function () {
		return sheets;
	};
};
exports.Spreadsheet = Spreadsheet;
