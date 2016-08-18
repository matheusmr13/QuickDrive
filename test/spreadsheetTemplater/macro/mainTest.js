var matrixMockWithReplaceAnnotations = function() {
	return [
		[new Cell('{=this.reportHeader}'), new Cell('My random text'), new Cell('another random text'), new Cell('')],
		[new Cell('{=this.user.name}'), new Cell('{=this.user.lastName}'), new Cell('{=this.user.age}'), new Cell('My user')],
		[new Cell('{=this.user.address.cep}'), new Cell('{=this.user.address.city.name}'), new Cell('{=this.user.address.city.state.name}'), new Cell('{=this.user.address.city.state.country.name}')],
		[new Cell('{#this.myFormula}'), new Cell(''), new Cell(''), new Cell('')],
		[new Cell('Languages that he likes'), new Cell(''), new Cell(''), new Cell('')],
		[new Cell('{~this.curriculum.languagesThatLikes : languages}'), new Cell('{=languages}'), new Cell('{~}'), new Cell('text that will stay on last line')]
	];
};

var jsonMock = {
	reportHeader: 'My cool header',
	myFormula: 'SUM(10,30)',
	user: {
		name: 'Matheus',
		lastName: 'Martins do Rego',
		age: 20,
		address: {
			cep: '12345-678',
			city: {
				name: 'Campinas',
				state: {
					name: 'São Paulo',
					country: {
						name: 'Brasil'
					}
				}
			}
		}
	},
	curriculum: {
		yearsWorking: 3,
		languagesThatLikes: [
			'Java',
			'JavaScript',
			'CSS',
			'HTML',
			'Python'
		]
	}
};
describe('QuickDrive functions', function () {
	describe('get new sheet', function () {
		it('it should return sheet with text replaced', function () {
			SpreadsheetApp._setupMock(matrixMockWithReplaceAnnotations());
			var file = SheetTemplater.processSheet(jsonMock);
			assert.equal(JSON.stringify([
				['My cool header', 'My random text', 'another random text', ''],
				['Matheus', 'Martins do Rego', '20', 'My user'],
				['12345-678', 'Campinas', 'São Paulo', 'Brasil'],
				['40', '','',''],
				['Languages that he likes', '', '', ''],
				['', 'Java', '', ''],
				['', 'JavaScript', '', ''],
				['', 'CSS', '', ''],
				['', 'HTML', '', ''],
				['', 'Python', '', 'text that will stay on last line']
			]), JSON.stringify(file.sheet._processFormulas().getRange(1, 1, file.sheet.getMaxRows(), file.sheet.getMaxColumns()).getValues()));
		});
	});
});
