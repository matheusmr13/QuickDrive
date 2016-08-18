describe('getAnnotationType', function () {
	it('it should return none annotation, just simple text', function () {
		assert.equal(SheetTemplater.annotationFunctions.NONE, SheetTemplater.getAnnotationType('==simple text with no annotation=='));
		assert.equal(SheetTemplater.annotationFunctions.NONE, SheetTemplater.getAnnotationType('{another simple'));
		assert.equal(SheetTemplater.annotationFunctions.NONE, SheetTemplater.getAnnotationType('another one}'));
		assert.equal(SheetTemplater.annotationFunctions.NONE, SheetTemplater.getAnnotationType('{with no action}'));
	});
	it('it should return none annotation (invalid annotation present)', function () {
		assert.equal(SheetTemplater.annotationFunctions.NONE, SheetTemplater.getAnnotationType('{=@foo.bar}'));
		assert.equal(SheetTemplater.annotationFunctions.NONE, SheetTemplater.getAnnotationType('{=@bar}'));
		assert.equal(SheetTemplater.annotationFunctions.NONE, SheetTemplater.getAnnotationType('{=foo..bar}'));
		assert.equal(SheetTemplater.annotationFunctions.NONE, SheetTemplater.getAnnotationType('{=.foo.bar}'));
		assert.equal(SheetTemplater.annotationFunctions.NONE, SheetTemplater.getAnnotationType('{=.foobar}'));
		assert.equal(SheetTemplater.annotationFunctions.NONE, SheetTemplater.getAnnotationType('{=foobar.}'));
		assert.equal(SheetTemplater.annotationFunctions.NONE, SheetTemplater.getAnnotationType('{=foo@bar}'));
	});
	it('it should return simple replace text', function () {
		assert.equal(SheetTemplater.annotationFunctions.REPLACE_TEXT, SheetTemplater.getAnnotationType('{=foo.bar}'));
		assert.equal(SheetTemplater.annotationFunctions.REPLACE_TEXT, SheetTemplater.getAnnotationType('{=foo}'));
		assert.equal(SheetTemplater.annotationFunctions.REPLACE_TEXT, SheetTemplater.getAnnotationType('{=foo.bar.text.with.many.properties}'));
	});
	it('it should return for each annotation', function () {
		assert.equal(SheetTemplater.annotationFunctions.FOR_EACH, SheetTemplater.getAnnotationType('{~mylist}'));
		assert.equal(SheetTemplater.annotationFunctions.FOR_EACH, SheetTemplater.getAnnotationType('{~foo.myList}'));
		assert.equal(SheetTemplater.annotationFunctions.FOR_EACH, SheetTemplater.getAnnotationType('{~foo.bar.with.many.properties.myList}'));
	});
	it('it should insert formula annotation', function () {
		assert.equal(SheetTemplater.annotationFunctions.INSERT_FORMULA, SheetTemplater.getAnnotationType('{#myFormula}'));
		assert.equal(SheetTemplater.annotationFunctions.INSERT_FORMULA, SheetTemplater.getAnnotationType('{#my.formula}'));
		assert.equal(SheetTemplater.annotationFunctions.INSERT_FORMULA, SheetTemplater.getAnnotationType('{#foo.bar.with.many.properties.myList}'));
	});
	it('it should set matrix annotation', function () {
		assert.equal(SheetTemplater.annotationFunctions.SET_MATRIX, SheetTemplater.getAnnotationType('{+myMatrix}'));
		assert.equal(SheetTemplater.annotationFunctions.SET_MATRIX, SheetTemplater.getAnnotationType('{+my.matrix}'));
		assert.equal(SheetTemplater.annotationFunctions.SET_MATRIX, SheetTemplater.getAnnotationType('{+foo.bar.with.many.properties.myMatrix}'));
	});
});

describe('Testing annottations', function () {
	require('./allProperties.js');
	require('./forEach.js');
});