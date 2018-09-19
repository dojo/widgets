const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import { Remote } from 'intern/lib/executors/Node';
import * as css from '../../../theme/button.m.css';
import { services } from '@theintern/a11y';

const axe = services.axe;

function getPage(remote: Remote) {
	return remote
		.get('http://localhost:9000/_build/common/example/?module=button')
		.setFindTimeout(5000);
}

const DELAY = 750;

registerSuite('Button', {
	'button should be visible'() {
		return getPage(this.remote)
			.findByCssSelector(`#example-1 .${css.root}`)
			.getSize()
			.then(({ height, width }: { height: number; width: number; }) => {
				assert.isAbove(height, 0, 'The button height should be greater than zero.');
				assert.isAbove(width, 0, 'The button width should be greater than zero.');
			})
			.end();
	},

	'button text should be as defined'() {
		return getPage(this.remote)
			.findByCssSelector(`#example-1 .${css.root}`)
			.getVisibleText()
			.then((text: string) => {
				assert.strictEqual(text, 'Basic Button');
			})
			.end();

	},
	'button should be disabled'() {
		return getPage(this.remote)
			.findByCssSelector(`#example-2 .${css.root}`)
			.isEnabled()
			.then(enabled => {
				assert.isTrue(!enabled, 'The button should be disabled.');
			})
			.end();
	},
	'button should be toggle-able'() {
		return getPage(this.remote)
			.findByCssSelector(`#example-4 .${css.root}`)
				.getAttribute('aria-pressed')
				.then((pressed: string) => {
					assert.isNull(pressed, 'Initial state should be null');
				})
				.click()
				.sleep(DELAY)
			.end()
			.findByCssSelector(`#example-4 .${css.root}`)
				.getAttribute('aria-pressed')
				.then((pressed: string) => {
					assert.strictEqual(pressed, 'true');
				})
				.click()
				.sleep(DELAY)
			.end()
			.findByCssSelector(`#example-4 .${css.root}`)
				.getAttribute('aria-pressed')
				.then((pressed: string) => {
					assert.strictEqual(pressed, 'false');
				})
			.end();
	},

	'check accessibility'() {
		return getPage(this.remote).then(axe.createChecker());
	}
});
