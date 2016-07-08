var Folder = function (newId) {
	var files = [],
		id = newId || '';
	this.getId = function () {
		return id;
	};
	this.addFile = function (file) {
		files.push(file);
	};
	this.getFiles = function () {
		return files;
	};
};

exports.Folder = Folder;
