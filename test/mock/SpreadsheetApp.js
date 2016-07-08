var Spreadsheet = require('./SpreadsheetApp/Spreadsheet.js').Spreadsheet;
var SpreadsheetApp = function (mock) {
	return {
		BorderStyle: {
			DOTTED: 'DOTTED',
			DASHED: 'DASHED',
			SOLID: 'SOLID'
		},
		open: function (file) {
			return new Spreadsheet(mock || file);
		}
	}
};

exports.SpreadsheetApp = SpreadsheetApp;
