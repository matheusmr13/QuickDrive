var Spreadsheet = require('./SpreadsheetApp/Spreadsheet.js').Spreadsheet;
var SpreadsheetApp = function (mock) {
	var _mock = mock;
	return {
		_setupMock: function(mock) {
			_mock = mock;
		},
		BorderStyle: {
			DOTTED: 'DOTTED',
			DASHED: 'DASHED',
			SOLID: 'SOLID'
		},
		open: function (file) {
			return new Spreadsheet(_mock || file);
		}
	}
};

exports.SpreadsheetApp = SpreadsheetApp;
