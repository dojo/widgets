const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import { Remote } from 'intern/lib/executors/Node';
import * as css from '../../styles/textinput.m.css';
import * as baseCss from '../../../common/styles/base.m.css';

function getPage(remote: Remote) {
	return remote
		.get('http://localhost:9000/_build/common/example/?module=textinput')
		.setFindTimeout(5000);
}

registerSuite('TextInput', {
	'TextInput should be visible'() {
		return getPage(this.remote)
			.findByCssSelector(`#example-text .${css.root}`)
				.isDisplayed()
				.findByCssSelector(`.${css.inputWrapper}`)
					.isDisplayed()
				.end()

				.findByCssSelector(`.${css.input}`)
					.getSize()
					.then(({ height, width }) => {
						assert.isAbove(height, 0, 'The height of the input should be greater than zero.');
						assert.isAbove(width, 0, 'The width of the input should be greater than zero.');
					})
				.end()
			.end();
	},
	'TextInput label should be as defined'() {
		return getPage(this.remote)
			.findByCssSelector(`#example-text .${css.root}`)
				.getVisibleText()
				.then(text => {
					assert.strictEqual(text, 'Name');
				});
	},
	'TextInput should gain focus when clicking on the label'() {
		const { remote: { session: { capabilities: { browserName } } } } = this;

		return getPage(this.remote)
			.findByCssSelector(`#example-text .${css.root}`)
				.then(element => {
					if (browserName === 'firefox') {
						return this.remote
							.moveMouseTo(element, 5, 5)
							.clickMouseButton(0);
					}
					else {
						return element.click();
					}
				})
			.end()
			.sleep(250)
			.execute(`return document.activeElement === document.querySelector('#example-text .${css.root} .${css.input}');`)
			.then(isEqual => {
				assert.isTrue(isEqual);
			});
	},
	'TextInput should allow input to be typed'() {
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
	'Hidden label should not be displayed'() {
		return getPage(this.remote)
			.findByCssSelector(`#example-hidden-label .${css.root}`)
				.getVisibleText()
				.then(text => {
					assert.isTrue(text && text.length > 0);
				})
				.findByCssSelector(`.${baseCss.visuallyHidden}`)
					.then(element => {
						assert(element, 'element with specified class "visuallyHidden" should exist.`');
					})
				.end()
			.end();
	},
	'Disabled TextInput should not allow input to be typed'() {
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
	'Validated TextInput should update style based on validity'() {
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
				.end()
				.getProperty('className')
				.then((className: string) => {
					assert.notInclude(className, css.invalid);
					assert.include(className, css.valid);
				})
				.findByCssSelector(`.${css.input}`)
					.type(invalidText)
				.end()
				.getProperty('className')
				.then((className: string) => {
					assert.notInclude(className, css.valid);
					assert.include(className, css.invalid);
				})
			.end();
	}
});
