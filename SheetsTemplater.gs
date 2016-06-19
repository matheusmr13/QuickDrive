var FOLDER_NAME = 'Invoices',
	MAX_COLUMNS = 30,
	MAX_LINES = 100,
	INPUT_TYPE = 0,
	FOREACH_TYPE = 1;

function mock() {
	return {
		checkingSystem: 'MY_SYS',
		agencyName: 'Minha agencia',
		NOME_DA_AGENCIA: 'Minha agencia',
      FORMA_DE_PAGAMENTO: 'Cheque Pré-Datado',
		PRODUTOS: [{
			NOME: 'meu nome de produto1',
			VALOR_TOTAL: 'R$23.234,00'
		}, {
			NOME: 'meu nome de produto2',
			VALOR_TOTAL: 'R$23.234,00'
		}, {
			NOME: 'meu nome de produto3',
			VALOR_TOTAL: 'R$23.234,00'
		}],
		PAGAMENTOS: [{
			BANCO: '341',
			NUMERO_CHEQUE: 'AE 000025'
		}, {
			BANCO: '341',
			NUMERO_CHEQUE: 'AE 000026'
		}, {
			BANCO: '341',
			NUMERO_CHEQUE: 'AE 000027'
		}]
	};
};

function getTemplateIdByPaymentType (paymentType) {
	return {'Cheque Pré-Datado' : '1TM7lRN_HOsfYEvGazw3cvPD7D4Xy8YQTCtDRfYH53d0'}[paymentType];
};

function getSheetNewDocument (json) {
	var templateFile = DriveApp.getFileById(getTemplateIdByPaymentType(json.FORMA_DE_PAGAMENTO));
	var newFile = templateFile.makeCopy(json.agencyName, DriveApp.getFoldersByName(FOLDER_NAME).next());
	newFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

	var ss = SpreadsheetApp.open(newFile);
  return {
    sheet: ss.getSheets()[0],
    fileId : newFile.getId()
  };
};

function isAnottation(text) {
	return text[0] == '{' && text[text.length - 1] == '}';
};

function isForEach(text) {
	return text[1] == '~';
};

function processForEach (properties) {
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

    Logger.log(lineToRemove+ '  /  ' + initialColumn+ '  /  ' +  1+ '  /  ' +  propertiesHeader.length);
  Logger.log(initialColumn+ '  /  ' +  (propertiesHeader.length + initialColumn)+ '  /  ' +  (properties.i + 2)+ '  /  ' +  (properties.i + array.length + 1));
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
	sheet.getRange(row, col).setValue(json[command.substring(1, command.length - 1)] || '');
};

function processCell (properties) {
	if (isAnottation(properties.values[properties.i][properties.j])) {
		if (isForEach(properties.values[properties.i][properties.j])) {
			processForEach(properties);
		} else {
			replaceValue(properties.sheet, properties.i + 1, properties.j + 1, properties.json, properties.values[properties.i][properties.j]);
		}
	}
};

function doGet(e) {
	var json = mock();
	//  if (e.parameters.checkingSystem != "COINFO_PAXPRO")
	//    return;
	//  var json = e ? e.parameters : {};

   var newSpreadSheet = getSheetNewDocument(json)
	var sheet = newSpreadSheet.sheet;

	var range = sheet.getRange(1, 1, MAX_LINES, MAX_COLUMNS);
	var values = range.getValues();

  var properties = {
            sheet: sheet,
            json: json,
            values : values,
            i : 0,
            j : 0};
	for (properties.i = 0; properties.i < properties.values.length; properties.i++) {
		for (properties.j = 0; properties.j < properties.values[properties.i].length; properties.j++) {
          processCell(properties);
		}
	}

	return ContentService.createTextOutput(newSpreadSheet.id);
};
