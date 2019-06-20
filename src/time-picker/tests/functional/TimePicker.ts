const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import { Remote } from 'intern/lib/executors/Node';
import Command from '@theintern/leadfoot/Command';
import Element from '@theintern/leadfoot/Element';
import keys from '@theintern/leadfoot/keys';
import { services } from '@theintern/a11y';
import * as comboboxCss from '../../../theme/combobox.m.css';
import * as listboxCss from '../../../theme/listbox.m.css';
import * as textinputCss from '../../../theme/text-input.m.css';
import { uuid } from '@dojo/framework/core/util';

const axe = services.axe;
const DELAY = 1000;

function getPage(remote: Remote, exampleId: string) {
	return remote
		.get(`http://localhost:9000/_build/common/example/?id=${uuid()}#time-picker`)
		.setFindTimeout(5000)
		.findById(exampleId);
}

function testDisabledPicker(remote: Remote, exampleId: string, readOnly = false) {
	return getPage(remote, exampleId)
		.findByCssSelector(`.${comboboxCss.controls} .${textinputCss.input}`)
		.click()
		.sleep(DELAY)
		.execute(
			`return document.activeElement === document.querySelector('#${exampleId} .${
				comboboxCss.controls
			} .${textinputCss.input}');`
		)
		.then(function(this: Command<Element>, isEqual) {
			if (isEqual) {
				return (<Command<Element>>this.parent)
					.type('1')
					.sleep(DELAY)
					.getProperty('value')
					.then((value) => {
						assert.strictEqual(value, '', 'The input should not allow text entry.');
					});
			}
		})
		.end()
		.setFindTimeout(100)
		.findAllByCssSelector(`.${comboboxCss.dropdown}`)
		.then((elements) => {
			assert.strictEqual(elements.length, 0);
		})
		.end()
		.setFindTimeout(5000)
		.findByCssSelector(`.${comboboxCss.controls} .${comboboxCss.trigger}`)
		.click()
		.end()
		.sleep(DELAY)
		.execute(
			`return document.activeElement === document.querySelector('#${exampleId} .${
				comboboxCss.controls
			} .${textinputCss.input}');`
		)
		.then((isEqual) => {
			if (!readOnly) {
				assert.isFalse(
					isEqual,
					'Input should not gain focus when dropdown trigger is clicked.'
				);
			}
		})
		.setFindTimeout(100)
		.findAllByCssSelector(`.${comboboxCss.dropdown}`)
		.then((elements) => {
			assert.strictEqual(elements.length, 0);
		})
		.end();
}

registerSuite('TimePicker', {
	'picker opens on input'() {
		const exampleId = 'example-filter-on-input';
		return getPage(this.remote, exampleId)
			.findByCssSelector(`.${comboboxCss.controls} .${textinputCss.input}`)
			.type('1')
			.end()
			.sleep(DELAY)
			.execute(
				`return document.activeElement === document.querySelector('#${exampleId} .${
					comboboxCss.controls
				} .${textinputCss.input}');`
			)
			.then((isEqual) => {
				assert.isTrue(isEqual);
			})
			.findByCssSelector(`.${comboboxCss.dropdown}`)
			.getSize()
			.then(({ height }) => {
				assert.isAbove(height, 0);
			})
			.end();
	},
	'picker opens on focus'() {
		const { browserName = '' } = this.remote.session.capabilities;
		if (browserName.toLowerCase() === 'microsoftedge') {
			this.skip('Edge driver does not handle focus on click');
		}

		const exampleId = 'example-open-on-focus';
		return getPage(this.remote, exampleId)
			.findByCssSelector(`.${comboboxCss.controls} .${textinputCss.input}`)
			.click()
			.end()
			.sleep(DELAY)
			.execute(
				`return document.activeElement === document.querySelector('#${exampleId} .${
					comboboxCss.controls
				} .${textinputCss.input}');`
			)
			.then((isEqual) => {
				assert.isTrue(isEqual);
			})
			.findByCssSelector(`.${comboboxCss.dropdown}`)
			.getSize()
			.then(({ height }) => {
				assert.isAbove(height, 0);
			})
			.end();
	},
	'disabled menu items cannot be clicked'() {
		const exampleId = 'example-disabled-items';
		return getPage(this.remote, exampleId)
			.findByCssSelector(`.${comboboxCss.controls} .${comboboxCss.trigger}`)
			.click()
			.end()
			.sleep(DELAY)
			.execute(
				`return document.activeElement === document.querySelector('#${exampleId} .${
					comboboxCss.controls
				} .${textinputCss.input}');`
			)
			.then((isEqual) => {
				assert.isTrue(isEqual);
			})
			.setFindTimeout(DELAY)
			.findByCssSelector(`.${comboboxCss.dropdown}`)
			.getSize()
			.then(({ height }) => {
				assert.isAbove(height, 0);
			})
			.end()
			.findByCssSelector(`.${comboboxCss.dropdown} .${listboxCss.disabledOption}`)
			.click()
			.end()
			.findByCssSelector(`.${comboboxCss.controls} .${textinputCss.input}`)
			.getProperty('value')
			.then((value) => {
				assert.strictEqual(
					value,
					'',
					'The input value should not contain the disabled value.'
				);
			})
			.end();
	},
	'disabled timepickers cannot be opened'() {
		const { browserName } = this.remote.session.capabilities;
		if (browserName === 'firefox') {
			this.skip('Firefox does not like clicking on disabled things.');
		}

		return testDisabledPicker(this.remote, 'example-disabled');
	},
	'readonly timepickers cannot be opened'() {
		return testDisabledPicker(this.remote, 'example-readonly', true);
	},
	'validated inputs update on input'() {
		const { browserName } = this.remote.session.capabilities;
		if (browserName === 'internet explorer') {
			this.skip('Test does not work on Internet Explorer');
		}

		const exampleId = 'example-required-validated';
		return getPage(this.remote, exampleId)
			.findByCssSelector(`.${comboboxCss.controls} .${textinputCss.root}`)
			.findByCssSelector(`.${textinputCss.input}`)
			.click()
			.end()
			.sleep(DELAY)
			.getProperty('className')
			.then((className: string) => {
				assert.notInclude(className, textinputCss.invalid);
			})
			.findByCssSelector(`.${textinputCss.input}`)
			.type('1')
			.end()
			.sleep(DELAY)
			.getProperty('className')
			.then((className: string) => {
				assert.notInclude(className, textinputCss.invalid);
			})
			.findByCssSelector(`.${textinputCss.input}`)
			.type(keys.BACKSPACE)
			.end()
			.sleep(DELAY)
			.getProperty('className')
			.then((className: string) => {
				assert.include(className, textinputCss.invalid);
			})
			.end();
	},
	'validated inputs update on focus change'() {
		const { browserName = '' } = this.remote.session.capabilities;
		if (browserName.toLowerCase() === 'microsoftedge') {
			this.skip('Edge driver does not handle focus on click');
		}
		if (browserName === 'internet explorer') {
			this.skip('Test does not work on Internet Explorer');
		}

		const exampleId = 'example-required-validated';
		return getPage(this.remote, exampleId)
			.findByCssSelector(`.${comboboxCss.controls} .${textinputCss.root}`)
			.findByCssSelector(`.${textinputCss.input}`)
			.click()
			.end()
			.sleep(DELAY)
			.getProperty('className')
			.then((className: string) => {
				assert.notInclude(className, textinputCss.invalid);
			})
			.end()
			.end()
			.findByCssSelector(
				`#example-filter-on-input .${comboboxCss.controls} .${textinputCss.root}`
			)
			.click()
			.end()
			.sleep(DELAY)
			.findById(exampleId)
			.findByCssSelector(`.${comboboxCss.controls} .${textinputCss.root}`)
			.getProperty('className')
			.then((className: string) => {
				assert.include(className, textinputCss.invalid);
			})
			.end();
	},

	'check accessibility'() {
		const exampleId = 'example-filter-on-input';
		return getPage(this.remote, exampleId).then(axe.createChecker());
	}
});
