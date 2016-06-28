var QuickDrive = (function (config) {
	var QuickDrive = {};

	QuickDrive.annotationFunctions = {
		REPLACE_TEXT: replaceValue,
		FOR_EACH: processForEach,
		NONE: function (properties) {
			return;
		}
	};
	var annotationType = {
		'=': QuickDrive.annotationFunctions.REPLACE_TEXT,
		'~': QuickDrive.annotationFunctions.FOR_EACH
	};
	var config = {
		folderId: '0ByQE0cDEoa0qLUlPU21xVzNqZVk',
		templateId: '1stc2xmCa3QB61bTR52tomteWUOwlVZ4s8OSKWG5dP_8',
		newDocumentName: 'My new sheet',
		stripeColor: '#EEEEEE',
		stripeFirst: false,
		permissions: [{
			access: DriveApp.Access.ANYONE_WITH_LINK,
			permission: DriveApp.Permission.VIEW
		}]
	};
	QuickDrive.setConfigs = function (newConfig) {
		for (var propertie in newConfig) {
			config[propertie] = newConfig[propertie];
		}
	}

	QuickDrive.getSheetNewDocument = function (json) {
		var templateFile = DriveApp.getFileById(config.templateId);
		var newFile = templateFile.makeCopy(config.newDocumentName, DriveApp.getFolderById(config.folderId));

		for (var i = 0; i < config.permissions.length; i++) {
			newFile.setSharing(config.permissions[i].access, config.permissions[i].permission);
		}

		var ss = SpreadsheetApp.open(newFile);
		return {
			sheet: ss.getSheets()[0],
			fileId: newFile.getId()
		};
	};

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

	QuickDrive.getAnnotationType = function (text) {

		if (isAnottation(text)) {
			if (isValidAnnotation(text.split(':')[0])) {
				return annotationType[text[1]] || QuickDrive.annotationFunctions.NONE;
			} else {
				return QuickDrive.annotationFunctions.NONE;
			}
		} else {
			return QuickDrive.annotationFunctions.NONE;
		}
	};

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
			for (var j = initialColumn + 2; j < endColumn; j++) {
				properties.i = i - 1;
				properties.j = j - 1;
				properties.json[entityName] = array[index];
				QuickDrive.processCell(properties);

			}
			if (config.stripeFirst == !(index % 2)) {
				sheet.getRange(i, 1, 1, sheet.getMaxColumns()).setBackground(config.stripeColor);
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

	QuickDrive.processCell = function (properties) {
		var cellValue = properties.values[properties.i][properties.j];
		var annotationFunction = QuickDrive.getAnnotationType(cellValue)(properties);
	};

	return QuickDrive;
})({}, {});

function doPost(e) {
	var json = e ? JSON.parse(e.parameters.data[0]) : {};
	var config = e ? (e.parameters.config ? JSON.parse(e.parameters.config[0]) : {}) : {};
	var newSpreadSheet = QuickDrive.getSheetNewDocument(json);
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
	QuickDrive.setConfigs(config);
	for (properties.i = 0; properties.i < properties.values.length; properties.i++) {
		for (properties.j = 0; properties.j < properties.values[properties.i].length; properties.j++) {
			QuickDrive.processCell(properties);
		}
	}

	return ContentService.createTextOutput(newSpreadSheet.fileId);
};

if (typeof module !== 'undefined' && module.exports != null) {
	exports.QuickDrive = QuickDrive;
}
