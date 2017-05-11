import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';

function getPage(remote: any) {
	return remote
		.get('http://localhost:9000/_build/common/example/?module=label')
		.setFindTimeout(5000);
}

registerSuite({
	name: 'Label',

	'Label should be visible'(this: any) {
		return getPage(this.remote)
			.findByCssSelector('label:first-of-type')
		// `isDisplayed` is broken in Safari 10, commented out for now. See https://github.com/SeleniumHQ/selenium/issues/3029
		// .isDisplayed()
		// .then((displayed: boolean) => {
		// 	assert.isTrue(displayed, 'The label should be displayed.');
		// })
			.getSize()
			.then(({ height, width }: { height: number; width: number; }) => {
				assert.isAbove(height, 0, 'The label height should be greater than zero.');
				assert.isAbove(width, 0, 'The label width should be greater than zero.');
			})
			.end();
	},
	'Label text should be as defined'(this: any) {
		return getPage(this.remote)
			.findByCssSelector('label:first-of-type')
			.getVisibleText()
			.then((text: string) => {
				assert.strictEqual(text, 'Type something');
			})
			.end();

	},
	'Input box should gain focus when clicking on the label'(this: any) {
		let input: any;
		getPage(this.remote)
			.findByCssSelector('label:first-of-type')
			.then(function(element: any) {
				input = element;
			})
			.click()
			.getActiveElement()
			.then(function(element: any) {
				assert.strictEqual(element, input);
			})
			.end();

	},
	'Hidden label text should not be displayed'(this: any) {
		return getPage(this.remote)
			.findByCssSelector('label:nth-of-type(2)')
			.getVisibleText()
			.then((text: string) => {
				assert.strictEqual(text, 'Can\'t read me!');
			})
				.findByTagName('span')
				.getSize()
				.then(({ height, width }: { height: number; width: number; }) => {
					assert.isAtMost(height, 1, 'The label text height should be no more than 1px.');
					assert.isAtMost(width, 1, 'The label text width should be no more than 1px.');
				})
				.end()
			.end();
	}
});
