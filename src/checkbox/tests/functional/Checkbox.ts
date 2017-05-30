import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as css from '../../styles/checkbox.m.css';

function getPage(remote: any) {
	return remote
		.get('http://localhost:9000/_build/common/example/?module=checkbox')
		.setFindTimeout(5000);
}

function nthCheckbox(n: number) {
	return `#example-${n} .${css.root} .${css.input}`;
}
registerSuite({
	name: 'Checkbox',

	'checkbox should be visible'(this: any) {
		return getPage(this.remote)
			.findByCssSelector(nthCheckbox(1))
			.getSize()
			.then(({ height, width }: { height: number; width: number; }) => {
				assert.isAbove(height, 0, 'The checkbox height should be greater than zero.');
				assert.isAbove(width, 0, 'The checkbox width should be greater than zero.');
			})
			.end();
	},

	'checkbox label text should be as defined'(this: any) {
		return getPage(this.remote)
			.findByCssSelector(`#example-1 .${css.root}`)
			.getVisibleText()
			.then((text: string) => {
				assert.strictEqual(text, 'Sample checkbox that starts checked');
			})
			.end();

	},
	'checkbox should be disabled'(this: any) {
		return getPage(this.remote)
			.findByCssSelector(nthCheckbox(2))
			.isEnabled()
			.then((enabled: boolean) => {
				assert.isTrue(!enabled, 'The checkbox should be disabled.');
			})
			.end();
	},
	'checkbox should be required'(this: any) {
		return getPage(this.remote)
			.findByCssSelector(nthCheckbox(3))
			.getProperty('required')
			.then((required: boolean) => {
				assert.isTrue(required, 'The checkbox should be required.');
			})
			.end();
	},
	'checkbox should be toggle-able'(this: any) {
		return getPage(this.remote)
			.findByCssSelector(nthCheckbox(1))
			.isSelected()
			.then((checked: boolean) => {
				assert.isTrue(checked, 'Initial state should be true');
			})
			.click()
			.isSelected()
			.then((checked: boolean) => {
				assert.isFalse(checked);
			})
			.click()
			.isSelected()
			.then((checked: boolean) => {
				assert.isTrue(checked);
			})
			.end();
	},
	'`toggle` mode checkbox should be toggle-able'(this: any) {
		return getPage(this.remote)
			.findByCssSelector(nthCheckbox(4))
			.isSelected()
			.then((checked: boolean) => {
				assert.isFalse(checked, 'Initial state should be false');
			})
			.click()
			.isSelected()
			.then((checked: boolean) => {
				assert.isTrue(checked);
			})
			.click()
			.isSelected()
			.then((checked: boolean) => {
				assert.isFalse(checked);
			})
			.end();
	},

	'disabled checkbox should not be toggle-able'(this: any) {
		return getPage(this.remote)
			.findByCssSelector(nthCheckbox(2))
			.isSelected()
			.then((checked: boolean) => {
				assert.isFalse(checked, 'Initial state should be false');
			})
			.click()
		// the error callback is needed only in FireFox with Firefox Driver. See: https://github.com/dojo/meta/issues/182
			.then(undefined, (err: Error) => {})
			.isSelected()
			.then((checked: boolean) => {
				assert.isFalse(checked);
			})
			.end();
	}
});
