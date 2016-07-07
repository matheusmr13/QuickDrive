var Spreadsheet = require('./Spreadsheet.js').Spreadsheet;
var SpreadsheetApp = function (mock) {
	return {
		open: function (file) {
			return new Spreadsheet(mock || file);
		}
	}
};

exports.SpreadsheetApp = SpreadsheetApp;
