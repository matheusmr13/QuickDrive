var File = require('./DriveApp/File.js').File;
var Folder = require('./DriveApp/Folder.js').Folder;

var DriveApp = function () {
	return {
		Access: {
			ANYONE: 'ANYONE',
			ANYONE_WITH_LINK: 'ANYONE_WITH_LINK',
			DOMAIN: 'DOMAIN',
			DOMAIN_WITH_LINK: 'DOMAIN_WITH_LINK',
			PRIVATE: 'PRIVATE'
		},
		Permission: {
			COMMENT: 'COMMENT',
			EDIT: 'EDIT',
			NONE: 'NONE',
			OWNER: 'OWNER',
			VIEW: 'VIEW'
		},
		getFileById: function (id) {
			return new File(id);
		},
		getFolderById: function (id) {
			return new Folder(id);
		}
	};
};
exports.DriveApp = DriveApp;
