var matrixMockWithReplaceAnnotations = function() {
	return [
		[new Cell('Languages that he likes'), new Cell(''), new Cell(''), new Cell('')],
		[new Cell('{~this.curriculum.languagesThatLikes : languages}'), new Cell('{=languages}'), new Cell('{~}'), new Cell('text that will stay on last line')],
		[new Cell('-'), new Cell('-'), new Cell('-'), new Cell('-')],
	];
};

var jsonMock = {
	curriculum: {
		languagesThatLikes: [
			'Java',
			'JavaScript',
			'CSS',
			'HTML',
			'Python'
		]
	}
};
describe('forEach annotation', function () {
	it('it should return sheet forEach replaced', function () {
		SpreadsheetApp._setupMock(matrixMockWithReplaceAnnotations());
		var file = SheetTemplater.processSheet(jsonMock);
		assert.equal(JSON.stringify([
			['Languages that he likes', '', '', ''],
			['', 'Java', '', ''],
			['', 'JavaScript', '', ''],
			['', 'CSS', '', ''],
			['', 'HTML', '', ''],
			['', 'Python', '', 'text that will stay on last line'],
			['-', '-', '-', '-']
		]), JSON.stringify(file.sheet._processFormulas().getRange(1, 1, file.sheet.getMaxRows(), file.sheet.getMaxColumns()).getValues()));
	});
});
