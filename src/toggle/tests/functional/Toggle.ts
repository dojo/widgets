const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import { Remote } from 'intern/lib/executors/Node';
import * as css from '../../../theme/toggle.m.css';
import * as checkboxCss from '../../../theme/checkbox.m.css';

// The root class is composed with checkbox's
const cssRoot = css.root.split(' ').join('.');

function getPage(remote: Remote) {
	return remote
		.get('http://localhost:9000/_build/common/example/?module=toggle')
		.setFindTimeout(5000);
}

function nthToggle(n: number) {
	return `#example-${n} .${cssRoot} .${checkboxCss.input}`;
}
registerSuite('Toggle', {
	'toggle should be visible'() {
		return getPage(this.remote)
			.findByCssSelector(nthToggle(1))
			.getSize()
			.then(({ height, width }) => {
				assert.isAbove(height, 0, 'The toggle height should be greater than zero.');
				assert.isAbove(width, 0, 'The toggle width should be greater than zero.');
			})
			.end();
	},

	'toggle label text should be as defined'() {
		return getPage(this.remote)
			.findByCssSelector(`#example-1 .${cssRoot}`)
			.getVisibleText()
			.then(text => {
				// toggle will contain its off label, on label, and main label
				assert.strictEqual(text, 'Off\nOn\nSample toggle that starts checked');
			})
			.end();

	},
	'toggle should be disabled'() {
		return getPage(this.remote)
			.findByCssSelector(nthToggle(2))
			.isEnabled()
			.then(enabled => {
				assert.isTrue(!enabled, 'The toggle should be disabled.');
			})
			.end();
	},
	'toggle should be required'() {
		return getPage(this.remote)
			.findByCssSelector(nthToggle(3))
			.getProperty('required')
			.then((required: boolean) => {
				assert.isTrue(required, 'The toggle should be required.');
			})
			.end();
	},
	'toggle should be toggle-able'() {
		return getPage(this.remote)
			.findByCssSelector(nthToggle(1))
			.isSelected()
			.then(checked => {
				assert.isTrue(checked, 'Initial state should be true');
			})
			.click()
			.isSelected()
			.then(checked => {
				assert.isFalse(checked);
			})
			.click()
			.isSelected()
			.then(checked => {
				assert.isTrue(checked);
			})
			.end();
	},
	'disabled toggle should not be toggle-able'() {
		return getPage(this.remote)
			.findByCssSelector(nthToggle(2))
			.isSelected()
			.then(checked => {
				assert.isFalse(checked, 'Initial state should be false');
			})
			.click()
		// the error callback is needed only in FireFox with Firefox Driver. See: https://github.com/dojo/meta/issues/182
			.then(undefined, () => {})
			.end()

			.findByCssSelector(nthToggle(2))
			.isSelected()
			.then(checked => {
				assert.isFalse(checked);
			})
			.end();
	}
});
