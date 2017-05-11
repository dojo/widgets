import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';

function getPage(remote: any) {
	return remote
		.get('http://localhost:9000/_build/common/example/?module=radio')
		.setFindTimeout(5000);
}

registerSuite({
	name: 'Radio Button',

	'radio button should be visible'(this: any) {
		return getPage(this.remote)
			.findByCssSelector('fieldset:first-of-type input[type="radio"]:first-of-type')
		// `isDisplayed` is broken in Safari 10, commented out for now. See https://github.com/SeleniumHQ/selenium/issues/3029
		// .isDisplayed()
		// .then((displayed: boolean) => {
		// 	assert.isTrue(displayed, 'The radio button should be displayed.');
		// })
			.getSize()
			.then(({ height, width }: { height: number; width: number; }) => {
				assert.isAbove(height, 0, 'The radio button height should be greater than zero.');
				assert.isAbove(width, 0, 'The radio width should be greater than zero.');
			})
			.end();
	},

	'radio button label text should be as defined'(this: any) {
		return getPage(this.remote)
			.findByCssSelector('fieldset:first-of-type label:first-of-type')
			.getVisibleText()
			.then((text: string) => {
				assert.strictEqual(text, 'First option');
			})
			.end();

	},
	'radio button can be selected by clicking on its label'(this: any) {
		return getPage(this.remote)
			.findByCssSelector('fieldset:first-of-type label:first-of-type')
			.click()
				.findByCssSelector('input[type="radio"]')
				.isSelected()
				.then((selected: boolean) => {
					assert.isTrue(selected, '2nd radio button should be selected.');
				})
				.end()
			.end();
	},
	'radio buttons should be selectable'(this: any) {
		return getPage(this.remote)
			.findByCssSelector('fieldset:first-of-type')
				.findByCssSelector('label:first-of-type input[type="radio"]')
				.isSelected()
				.then((checked: boolean) => {
					assert.isTrue(checked, 'Initially the first radio button should be selected');
				})
				.end()

				.findByCssSelector('label:nth-of-type(3) input[type="radio"]')
				.isSelected()
				.then((checked: boolean) => {
					assert.isFalse(checked, 'Initially the 3rd radio button should not be selected');
				})
				.click()
				.isSelected()
				.then((checked: boolean) => {
					assert.isTrue(checked);
				})
				.end()

				.findByCssSelector('label:first-of-type input[type="radio"]')
				.isSelected()
				.then((checked: boolean) => {
					assert.isFalse(checked);
				})
				.end()
			.end();
	},
	'disabled radio buttons should not be selectable'(this: any) {
		return getPage(this.remote)
			.findByCssSelector('fieldset:nth-of-type(2)')
				.findByCssSelector('label:first-of-type input[type="radio"]')
				.isSelected()
				.then((checked: boolean) => {
					assert.isFalse(checked, 'Initially the first radio button should not be selected');
				})
				.click()
				.then(undefined, (err: Error) => {})
				.isSelected()
				.then((checked: boolean) => {
					assert.isFalse(checked);
				})
			.end();
	}
});
