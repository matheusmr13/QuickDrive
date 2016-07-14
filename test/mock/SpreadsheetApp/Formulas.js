var Formulas = function (sheet) {

	return {
		SUM: function (params) {
			var sum = 0,
				range = sheet.getRange(1,1,sheet.getMaxRows(),sheet.getMaxColumns());

			if (params) {
				var oldParams = params;
				params = []
				for (var i =0;i<oldParams.length;i++) {
					if (!isNaN(oldParams[i])) {
						sum += parseInt(oldParams[i]);
					} else {
						params.push(oldParams[i]);
					}
				}
			}

			if (!params.length) {
				return sum;
			}
			if (typeof params == 'string' && params && isNaN(params[0])) {
				var parts = number1.split(':');
				range = sheet.getRange(params[0], params[1]);
			}
			var matrix = range.getCells();

			for (var i = 0; i < matrix.length; i++) {
				for (var j = 0; j < matrix[i].length; j++) {
					sum += matrix[i][j].getNumberValue();
				}
			}
			return sum;
		}
	}
};

exports.Formulas = Formulas;
