var DriveApp = function () {
	var DriveFolder = function (newId) {
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

	var DriveFile = function (newId) {
		var properties = {
			id: newId || '',
			name: ''
		};

		this.setSharing = function () {};
		this.getId = function () {
			return properties.id;
		};
		this.makeCopy = function (name, folder) {
			var newFile = new DriveFile();
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
		this._setProperties = function(newProperties) {
			for (var propertie in newProperties) {
				properties[propertie] = newProperties[propertie];
			}
		};
	};

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
			return new DriveFile(id);
		},
		getFolderById: function (id) {
			return new DriveFolder(id);
		}
	};
};

var SpreadsheetApp = function () {
	var SpreadSheetMock = function (mySheets) {
		var sheets = mySheets || [];

		this.getSheets = function () {
			return sheets;
		};
		var SheetMock = function (myMatrix) {
			var matrix = myMatrix || [
				[]
			];

			var CellMock = function () {
				var value = "";
				this.setValue = function (newValue) {
					this.value = newValue;
				};

				this.getValue = function () {
					return value;
				};
			};

			var CellGroupMock = function (matrix) {
				var matrix = matrix || [
					[]
				];

				this.getValues = function () {
					var values = [];
					for (var i = row; i < lines; i++) {
						values[i] = [];
						for (var j = col; j < cols; j++) {
							values[i][j] = matrix[i][j];
						}
					}
					return values;
				};

				this.setValue = function (value) {
					for (var i = 0; i < matrix.length; i++) {
						for (var j = 0; j < matrix.length; j++) {
							matrix[i][j] = value;
						}
					}
				};
			};

			SheetMock.getRange = function (row, col, lines, cols) {
				var newMatrix = [
					[]
				];
				for (var i = row; i < lines; i++) {
					newMatrix[i] = [];
					for (var j = col; j < cols; j++) {
						newMatrix[i][j];
					}
				}
				return new CellGroupMock(newMatrix);
			};
		};
	};

	return {
		open: function (file) {
			return new SpreadSheetMock();
		}
	}
};

exports.DriveAppMock = {
	DriveApp: DriveApp,
	SpreadsheetApp: SpreadsheetApp
};
