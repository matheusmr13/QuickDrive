var File = function (newId) {
	var properties = {
		id: newId || '',
		name: ''
	};

	this.setSharing = function () {};
	this.getId = function () {
		return properties.id;
	};
	this.makeCopy = function (name, folder) {
		var newFile = new File();
		newFile._setProperties(properties);
		newFile.setName(name);
		folder.addFile(newFile);
		return newFile;
	};
	this.getName = function () {
		return properties.name;
	};
	this.setName = function (newName) {
		properties.name = newName;
	};
	this._setProperties = function (newProperties) {
		for (var propertie in newProperties) {
			properties[propertie] = newProperties[propertie];
		}
	};
};

exports.File = File;
