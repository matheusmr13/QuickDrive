var QuickDrive = function (DriveApp, SpreadsheetApp, newConfig) {
	var annotationFunctions = {
		REPLACE_TEXT: replaceValue,
		FOR_EACH: processForEach,
		INSERT_FORMULA: insertFormula,
		COMPLETE_CELL: completeCell,
		NONE: function (properties) {
			return;
		}
	};
	this.annotationFunctions = annotationFunctions;
	var annotationType = {
		'=': annotationFunctions.REPLACE_TEXT,
		'~': annotationFunctions.FOR_EACH,
		'#': annotationFunctions.INSERT_FORMULA,
		'*': annotationFunctions.COMPLETE_CELL

	};
	var _config = {
		folderId: '0B8cJhvYlR-sCcGR4d3VYWGZaYWM',
		templateId: '1l7sMxfD-qh4sbeu6Ax0z6v84YdahXDTG8hlPcE_vkEo',
		newDocumentName: 'My new sheet',
		stripeColor: '#EEEEEE',
		stripeFirst: false,
		permissions: [{
			access: DriveApp.Access.ANYONE_WITH_LINK,
			permission: DriveApp.Permission.VIEW
		}]
	};
	this._config = _config;
	var validateConfig = function (config) {
		if (config.folderId && (typeof config.folderId != 'string' || config.folderId.length != 18)) {
			throw new Error('invalid-folder-id');
		}

		if (config.templateId && (typeof config.templateId != 'string' || config.templateId.length != 45)) {
			throw new Error('invalid-file-id');
		}

		if (config.newDocumentName && (typeof config.newDocumentName != 'string')) {
			throw new Error('invalid-file-name');
		}

		if (config.stripeColor && (typeof config.stripeColor != 'string' ||
				(config.stripeColor[0] == '#' && (config.stripeColor.length != 4 && config.stripeColor.length != 7) ||
					(config.stripeColor[0] != '#' && !(config.stripeColor[0] == 'r' && config.stripeColor[1] == 'g' && config.stripeColor[2] == 'b'))
				))) {
			throw new Error('invalid-stripe-color');
		}
	};

	if (newConfig) {
		validateConfig(newConfig);
		for (var propertie in newConfig) {
			_config[propertie] = newConfig[propertie];
		}
	}

	var getSheetNewDocument = function () {
		var templateFile = DriveApp.getFileById(_config.templateId);
		var newFile = templateFile.makeCopy(_config.newDocumentName, DriveApp.getFolderById(_config.folderId));

		for (var i = 0; i < _config.permissions.length; i++) {
			newFile.setSharing(_config.permissions[i].access, _config.permissions[i].permission);
		}

		var ss = SpreadsheetApp.open(newFile);
		return {
			sheet: ss.getSheets()[0],
			fileId: newFile.getId()
		};
	};
	this.getSheetNewDocument = getSheetNewDocument;

	function isAnottation(text) {
		return text[0] == '{' && text[text.length - 1] == '}';
	};

	var isValidAnnotation = function (text) {
		if (text.length < 4) {
			return false;
		}
		var insideText = text.substring(2, text.length - 1),
			textParts = insideText.split('.'),
			validRegex = /^\w+$/;

		for (var i = 0; i < textParts.length; i++) {
			if (!textParts[i]) {
				return false;
			}
			if (!validRegex.test(textParts[i])) {
				return false;
			}
		}
		return true;
	};

	var getAnnotationType = function (text) {

		if (isAnottation(text)) {
			if (isValidAnnotation(text.split(':')[0])) {
				return annotationType[text[1]] || annotationFunctions.NONE;
			} else {
				return annotationFunctions.NONE;
			}
		} else {
			return annotationFunctions.NONE;
		}
	};
	this.getAnnotationType = getAnnotationType;

	var getValueOnJson = function (jsonObject, path) {
		var pathSplit = path.split('.');
		if (typeof jsonObject === 'undefined') {
			jsonObject = {};
		}
		if (pathSplit.length == 1) {
			return jsonObject[path] || '';
		} else if (pathSplit.length > 1) {
			var jsonParent = jsonObject[pathSplit[0]];
			var key = pathSplit.shift();
			return getValueOnJson(jsonParent, pathSplit.toString().replace(/\,/g, '.'));
		}
	}

	function processForEach(properties) {
		var sheet = properties.sheet;
		var initialLine = properties.i;
		var initialColumn = properties.j;
		var command = properties.values[properties.i][properties.j];
		var loopName = command.substring(2, command.length - 1);

		var loopSplit = loopName.split(':');
		var arrayName = loopSplit[0].trim();
		var entityName = loopSplit[1].trim();
		var originalJson = properties.json;
		var array = getValueOnJson(properties.json, arrayName);

		var endColumn = properties.j;
		for (; properties.values[properties.i][endColumn] != '{~}'; endColumn++) {}

		if (!array) {
			sheet.getRange(initialLine + 1, initialColumn + 1).setValue('');
			sheet.getRange(initialLine + 1, endColumn + 1).setValue('');
			return;
		}
		var endLine = properties.i + array.length - 1;

		properties.j++;
		sheet.insertRowsBefore(properties.i + 1, array.length - 1);

		for (var i = 0; i < array.length; i++) {
			sheet.getRange(properties.i + array.length, initialColumn + 2, 1, endColumn - initialColumn - 1).copyTo(sheet.getRange(properties.i + array.length - i, initialColumn + 2, 1, endColumn - initialColumn - 1));
		}
		sheet.getRange(endLine + 1, initialColumn + 1).setValue('');
		sheet.getRange(endLine + 1, endColumn + 1).setValue('');
		properties.values = sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns()).getValues();
		for (var i = initialLine + 1, index = 0; i < endLine + 2; i++, index++) {
			for (var j = initialColumn + 2; j < endColumn + 1; j++) {
				properties.i = i - 1;
				properties.j = j - 1;
				properties.json[entityName] = array[index];
				processCell(properties);

			}
			if (_config.stripeFirst == !(index % 2)) {
				sheet.getRange(i, 1, 1, sheet.getMaxColumns()).setBackground(_config.stripeColor);
			}
		}

		properties.i = endLine;
		properties.j = endColumn + 1;
		properties.json[entityName] = undefined;
	};

	function replaceValue(properties) {
		var row = properties.i + 1,
			col = properties.j + 1,
			command = properties.values[properties.i][properties.j],
			sheet = properties.sheet,
			json = properties.json;
		sheet.getRange(row, col).setValue(getValueOnJson(json, command.substring(2, command.length - 1)));
	};

	function completeCell(properties) {
		var row = properties.i + 1,
			col = properties.j + 1,
			command = properties.values[properties.i][properties.j],
			sheet = properties.sheet,
			json = properties.json,
			cellProperties = getValueOnJson(json, command.substring(2, command.length - 1)),
			range = sheet.getRange(row, col);
		range.setValue(cellProperties.value);
		if (cellProperties.backgroundColor) {
			range.setBackground(cellProperties.backgroundColor);
		}
		if (cellProperties.fontSize) {
			range.setFontSize(cellProperties.fontSize);
		}
		if (cellProperties.fontColor) {
			range.setFontColor(cellProperties.fontColor);
		}
		if (cellProperties.borderStyle && cellProperties.borderColor) {
			range.setBorder(true, true, true, true, cellProperties.borderColor, SpreadsheetApp.BorderStyle[cellProperties.borderStyle]);
		}
	};

	function insertFormula(properties) {
		var row = properties.i + 1,
			col = properties.j + 1,
			command = properties.values[properties.i][properties.j],
			sheet = properties.sheet,
			json = properties.json;
		sheet.getRange(row, col).setFormula('=' + getValueOnJson(json, command.substring(2, command.length - 1)));
	};

	var processCell = function (properties) {
		var cellValue = properties.values[properties.i][properties.j];
		var annotationFunction = getAnnotationType(cellValue)(properties);
	};

	this.processSheet = function (json) {

		var newSpreadSheet = getSheetNewDocument();
		var sheet = newSpreadSheet.sheet;
		var range = sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns());
		var values = range.getValues();
		var myThis = {};
		myThis['this'] = json;
		var properties = {
			sheet: sheet,
			json: myThis,
			values: values,
			i: 0,
			j: 0
		};
		for (properties.i = 0; properties.i < properties.values.length; properties.i++) {
			for (properties.j = 0; properties.j < properties.values[properties.i].length; properties.j++) {
				processCell(properties);
			}
		}
		return newSpreadSheet;
	};
};

function doPost(e) {
	var json = e ? JSON.parse(e.parameters.data[0]) : {};
	var config = e ? (e.parameters.config ? JSON.parse(e.parameters.config[0]) : {}) : {};
	var QuickDriveObj = new QuickDrive(DriveApp, SpreadsheetApp, config);
	var newFile = QuickDriveObj.processSheet(json);
	return ContentService.createTextOutput(newFile.fileId);
};

if (typeof module !== 'undefined' && module.exports != null) {
	exports.QuickDrive = QuickDrive;
}
