var SheetTemplater = require('./SheetTemplater.js').SheetTemplater;

var QuickDrive = function (DriveApp, SpreadsheetApp) {
	this.SheetTemplater = function(config) {
		return new SheetTemplater(DriveApp, SpreadsheetApp, config);
	};
};

if (typeof module !== 'undefined' && module.exports != null) {
	exports.QuickDrive = QuickDrive;
}
