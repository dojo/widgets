import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as css from '../../styles/textinput.m.css';
import * as baseCss from '../../../common/styles/base.m.css';
import * as keys from 'leadfoot/keys';

function getPage(remote: any) {
	return remote
		.get('http://localhost:9000/_build/common/example/?module=textinput')
		.setFindTimeout(5000);
}

registerSuite({
	name: 'TextInput',
	'TextInput should be visible'(this: any) {
		return getPage(this.remote)
			.findByCssSelector(`#example-text .${css.root}`)
			.isDisplayed()
			.findByCssSelector(`.${css.inputWrapper}`)
			.isDisplayed()
			.end()

			.findByCssSelector(`.${css.input}`)
			.getSize()
			.then(({ height, width }: { height: number; width: number; }) => {
				assert.isAbove(height, 0, 'The height of the input should be greater than zero.');
				assert.isAbove(width, 0, 'The width of the input should be greater than zero.');
			})
			.end()
			.end();
	},
	'TextInput label should be as defined'(this: any) {
		return getPage(this.remote)
			.findByCssSelector(`#example-text .${css.root}`)
			.getVisibleText()
			.then((text: string) => {
				assert.strictEqual(text, 'Name');
			});
	},
	'TextInput should gain focus when clicking on the label'(this: any) {
		let elementClassName: string;
		return getPage(this.remote)
			.findByCssSelector(`#example-text .${css.root}`)
			.findByCssSelector(`.${css.input}`)
			.getProperty('className')
			.then(function(className: string) {
				elementClassName = className;
			})
			.end()
			.click()
			.getActiveElement()
			.then(function(element: any) {
				element
					.getProperty('className')
					.then(function(className: string) {
						assert.strictEqual(className, elementClassName);
					});
			})
			.end();
	},
	'TextInput should allow input to be typed'(this: any) {
		const testInput = 'test text';
		return getPage(this.remote)
			.findByCssSelector(`#example-hidden-label .${css.root}`)
			.click()
				.findByCssSelector(`.${css.input}`)
				.type(testInput)
				.getProperty('value')
				.then((value: string) => {
					assert.strictEqual(value, testInput);
				})
				.end()
			.end();
	},
	'Hidden label should not be displayed'(this: any) {
		return getPage(this.remote)
			.findByCssSelector(`#example-hidden-label .${css.root}`)
			.getVisibleText()
			.then((text: string) => {
				assert.isTrue(text && text.length > 0);
			})
				.findByCssSelector(`.${baseCss.visuallyHidden}`)
				.getSize()
				.then(({ height, width }: { height: number; width: number; }) => {
					assert.isAtMost(height, 1, 'The label text height should be no more than 1px.');
					assert.isAtMost(width, 1, 'The label text width should be no more than 1px.');
				})
				.end()
			.end();
	},
	'Disabled TextInput should not allow input to be typed'(this: any) {
		const initValue = 'Initial value';
		return getPage(this.remote)
			.findByCssSelector(`#example-disabled .${css.root} .${css.input}`)
			.click()
			.then(null, () => {})
			.type('text')
			.then(null, () => {})
			.getProperty('value')
			.then((value: string) => {
				assert.strictEqual(value, initValue);
			})
			.end();
	},
	'Validated TextInput should update style based on validaty'(this: any) {
		const validText = 'foo';
		const invalidText = 'foobar';
		return getPage(this.remote)
			.findByCssSelector(`#example-validated .${css.root}`)
			.getProperty('className')
			.then((className: string) => {
				assert.notInclude(className, css.invalid);
				assert.notInclude(className, css.valid);
			})
			.findByCssSelector(`.${css.input}`)
			.click()
			.type(validText)
			.pressKeys(keys.TAB)
			.end()
			.click()
			.then(function(this: any) {
				this.getProperty('className')
					.then((className: string) => {
						assert.notInclude(className, css.invalid);
						assert.include(className, css.valid);
					});
			})
			.findByCssSelector(`.${css.input}`)
			.click()
			.type(invalidText)
			.pressKeys(keys.TAB)
			.end()
			.click()
			.then(function(this: any) {
				this.getProperty('className')
					.then((className: string) => {
						assert.notInclude(className, css.valid);
						assert.include(className, css.invalid);
					});
			})
			.end();
	}
});
