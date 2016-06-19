var QuickDrive = (function (config, json) {
	var QuickDrive = {};

	QuickDrive.annotationFunctions = {
		REPLACE_TEXT: replaceValue,
		FOR_EACH: processForEach,
		NONE: function(properties) {
			return;
		}
	};
	var annotationType = {
		'=': QuickDrive.annotationFunctions.REPLACE_TEXT,
		'~': QuickDrive.annotationFunctions.FOR_EACH
	};
	var config = {
		folderName: 'QuickDriveFolder',
		templateId: '1l7sMxfD-qh4sbeu6Ax0z6v84YdahXDTG8hlPcE_vkEo',
		newDocumentName: 'My new sheet',
		permissions: [{
			access: DriveApp.Access.ANYONE_WITH_LINK,
			permission: DriveApp.Permission.VIEW
		}]
	};

	function getSheetNewDocument(json) {
		var templateFile = DriveApp.getFileById(config.templateId);
		var newFile = templateFile.makeCopy(config.newDocumentName, DriveApp.getFoldersByName(config.folderName).next());

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

	QuickDrive.getAnnotationType = function(text) {
		if (isAnottation(text)) {
			return annotationType[text[1]] || QuickDrive.annotationFunctions.NONE;
		} else {
			return QuickDrive.annotationFunctions.NONE;
		}
	};

	function processForEach(properties) {
		return;
		var sheet = properties.sheet;
		var lineToRemove = properties.i;
		var initialColumn = properties.j;
		var loopName = properties.values[properties.i][properties.j].substring(2, properties.values[properties.i][properties.j].length - 1);
		properties.j++;
		var loopSplit = loopName.split(':');
		var arrayName = loopSplit[0].trim();
		var entityName = loopSplit[1].trim();
		var array = properties.json[arrayName];
		var propertiesHeader = [];

		sheet.insertRows(properties.i + 2, array.length - 1);
		for (; properties.values[properties.i][properties.j] != '{~}'; properties.j++) {
			properties.actualValue = properties.values[properties.i][properties.j];
			if (properties.actualValue != '') {
				if (properties.actualValue.indexOf('.') == -1) {
					for (var columnFixedIndex = 0; columnFixedIndex < array.length; columnFixedIndex++) {
						sheet.getRange(properties.i + 1 + columnFixedIndex, properties.j + 1).setValue(properties.json[properties.actualValue.substring(1, properties.actualValue.length - 1)] || '');
					}
				} else {
					propertiesHeader.push({
						j: properties.j,
						value: properties.actualValue.substring(1, properties.actualValue.length - 1)
					});
				}
			}
		}

		Logger.log(lineToRemove + '  /  ' + initialColumn + '  /  ' + 1 + '  /  ' + propertiesHeader.length);
		Logger.log(initialColumn + '  /  ' + (propertiesHeader.length + initialColumn) + '  /  ' + (properties.i + 2) + '  /  ' + (properties.i + array.length + 1));
		properties.i++;
		for (var k = 0; k < array.length; k++) {
			for (var h = 0; h < propertiesHeader.length; h++) {
				var propertie = propertiesHeader[h];
				var propertieValue = propertie.value.split('.')[1];
				Logger.log(propertie + '   ' + array[k][propertie]);

				var arrayCell = sheet.getRange(properties.i + k, propertie.j + 1).setValue(array[k][propertieValue] || '');
			}
		}
		//  sheet.getRange(lineToRemove, initialColumn + 1, 1, propertiesHeader.length).copyFormatToRange(sheet, initialColumn + 1, propertiesHeader.length + initialColumn, i + 1, i + array.length);
		sheet.getRange(lineToRemove + 1, initialColumn + 1).setValue('');
		sheet.getRange(lineToRemove + 1, properties.j + 1).setValue('');
	};

	function replaceValue(sheet, row, col, json, command) {
		sheet.getRange(row, col).setValue(json[command.split('.')[1].substring(0, command.split('.')[1].length - 1)] || '');
	};

	function processCell(properties) {
		var cellValue = properties.values[properties.i][properties.j];
		var annotationFunction = getAnnotationType(cellValue)(properties);
		//
		// if (isAnottation(properties.values[properties.i][properties.j])) {
		// 	if (isForEach(properties.values[properties.i][properties.j])) {
		// 		processForEach(properties);
		// 	} else {
		// 		replaceValue(properties.sheet, properties.i + 1, properties.j + 1, properties.json, properties.values[properties.i][properties.j]);
		// 	}
		// }
	};

	return QuickDrive;
})({}, {});

function doGet(e) {
	var json = e ? e.parameters : {};
	var newSpreadSheet = QuickDrive.getSheetNewDocument(json);
	var sheet = newSpreadSheet.sheet;

	var range = sheet.getRange(1, 1, sheet.getMaxLines(), sheet.getMaxColumns());
	var values = range.getValues();

	var properties = {
		sheet: sheet,
		json: json,
		values: values,
		i: 0,
		j: 0
	};
	for (properties.i = 0; properties.i < properties.values.length; properties.i++) {
		for (properties.j = 0; properties.j < properties.values[properties.i].length; properties.j++) {
			processCell(properties);
		}
	}

	return ContentService.createTextOutput(newSpreadSheet.id);
};

if (typeof module !== 'undefined' && module.exports != null) {
    exports.QuickDrive = QuickDrive;
}
