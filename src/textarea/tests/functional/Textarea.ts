const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import { Remote } from 'intern/lib/executors/Node';
import keys from '@theintern/leadfoot/keys';
import * as css from '../../styles/textarea.m.css';
import * as baseCss from '../../../common/styles/base.m.css';

function getPage(remote: Remote) {
	return remote
		.get('http://localhost:9000/_build/common/example/?module=textarea')
		.setFindTimeout(5000);
}

registerSuite('Textarea', {
	'should be visible'() {
		return getPage(this.remote)
			.findByCssSelector(`#example-t1 .${css.root}`)
				.isDisplayed()
				.findByCssSelector(`.${css.input}`)
					.getSize()
					.then(({ height, width }) => {
						assert.isAbove(height, 0, 'The height of the textarea should be greater than zero.');
						assert.isAbove(width, 0, 'The width of the textarea should be greater than zero.');
					})
				.end()
			.end();
	},
	'label should be as defined'() {
		const { browserName = '' } = this.remote.session.capabilities;
		if (browserName.toLowerCase() === 'internet explorer') {
			this.skip('Label is including textarea placeholder.');
		}

		return getPage(this.remote)
			.findByCssSelector(`#example-t1 .${css.root}`)
				.getVisibleText()
				.then(text => {
					assert.strictEqual(text, 'Type Something');
				})
			.end();
	},
	'should gain focus when clicking on the label'() {
		const { browserName } = this.remote.session.capabilities;
		if (browserName === 'firefox') {
			this.skip('Firefox is not locating the input.');
		}

		return getPage(this.remote)
			.findByCssSelector(`#example-t1 .${css.root} label`)
				.click()
				.sleep(1000)
			.end()
			.execute(`return document.activeElement === document.querySelector('#example-t1 .${css.input}');`)
			.then(isEqual => {
				assert.isTrue(isEqual);
			});
	},
	'should allow input to be typed'() {
		const { browserName } = this.remote.session.capabilities;
		if (browserName === 'firefox') {
			this.skip('Firefox is not locating the input.');
		}

		const testInput = 'test text';
		return getPage(this.remote)
			.findByCssSelector(`#example-t1 .${css.root}`)
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
	'disabled should not allow input to be typed'() {
		const initValue = 'Initial value';
		return getPage(this.remote)
			.findByCssSelector(`#example-t2 .${css.root} .${css.input}`)
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
	'validated should update style based on validity'() {
		const { browserName, version } = this.remote.session.capabilities;
		if (browserName === 'safari') {
			this.skip('Classes are not being updated for this unit test in Safari 9 ' + version);
		}

		const validText = 'exists';
		const backspaces = [];
		for (let i = 0; i < validText.length; i++) {
			backspaces.push(keys.BACKSPACE);
		}

		return getPage(this.remote)
			.findByCssSelector(`#example-t3 .${css.root}`)
				.getProperty('className')
				.then((className: string) => {
					assert.notInclude(className, css.invalid);
					assert.notInclude(className, css.valid);
				})
				.findByCssSelector(`.${css.input}`)
					.click()
					.type(validText)
				.end()
			.end()
			// focus another input
			.findByCssSelector(`#example-t1 .${css.root} .${css.input}`)
				.click()
			.end()
			.sleep(500)
			// enter invalid value
			.findByCssSelector(`#example-t3 .${css.root}`)
				.getProperty('className')
				.then((className: string) => {
					assert.notInclude(className, css.invalid);
					assert.include(className, css.valid);
				})
				.findByCssSelector(`.${css.input}`)
					.click()
					.type(backspaces)
				.end()
			.end()
			// focus another input
			.findByCssSelector(`#example-t1 .${css.root} .${css.input}`)
				.click()
			.end()
			.sleep(500)
			.findByCssSelector(`#example-t3 .${css.root}`)
				.getProperty('className')
				.then((className: string) => {
					assert.notInclude(className, css.valid);
					assert.include(className, css.invalid);
				})
			.end();
	},
	'hidden label should not be displayed'() {
		return getPage(this.remote)
			.findByCssSelector(`#example-t4 .${css.root}`)
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
	}
});
