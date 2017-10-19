const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import { Remote } from 'intern/lib/executors/Node';
import keys from '@theintern/leadfoot/keys';
import * as css from '../../styles/dialog.m.css';

interface Options {
	closeable?: boolean;
	modal?: boolean;
	underlay?: boolean;
}

const DELAY = 400;

function openDialog(remote: Remote, { closeable = true, modal, underlay }: Options = {}) {
	let promise = remote
		.get('http://localhost:9000/_build/common/example/?module=dialog')
		.setFindTimeout(5000);

	if (!closeable) {
		promise = promise
			.findById('closeable')
				.click()
				.end();
	}

	if (modal) {
		promise = promise
			.findById('modal')
				.click()
				.end();
	}

	if (underlay) {
		promise = promise
			.findById('underlay')
				.click()
				.end();
	}

	return promise
		.findById('button')
			.click()
			.end()
		.sleep(DELAY);
}

function clickUnderlay(remote: Remote, options: Options = { underlay: true }) {
	const { mouseEnabled } = remote.session.capabilities;

	if (mouseEnabled) {
		// `click` clicks the center of the element, which in this case is where the dialog node is.
		return openDialog(remote, options)
			.moveMouseTo(0, 0)
			.clickMouseButton(0)
			.sleep(DELAY);
	}

	return openDialog(remote, options)
		.moveFinger(0, 0)
		.pressFinger(0, 0)
		.sleep(100)
		.releaseFinger(0, 0)
		.sleep(DELAY);
}

registerSuite('Dialog', {
	'The dialog should be visibly centered by default'() {
		let dialogSize: { height: number; width: number };
		let viewportSize: { height: number; width: number };

		return openDialog(this.remote)
			.getWindowSize()
				.then(({ height, width }) => {
					viewportSize = { height, width };
				})
			.findByCssSelector(`.${css.main}`)
				.getSize()
					.then(({ height, width }) => {
						dialogSize = { height, width };
					})
				.getPosition()
					.then(({ x, y }) => {
						const expectedX = (viewportSize.width - dialogSize.width) / 2;
						const expectedY = (viewportSize.height - dialogSize.height) / 2;

						assert.closeTo(x, expectedX, expectedX * 0.2);
						assert.closeTo(y, expectedY, expectedY * 0.2);
					});
	},

	'The underlay should cover the entire visible screen'() {
		let viewportSize: { height: number; width: number };

		return openDialog(this.remote, { underlay: true })
			.getWindowSize()
				.then(({ height, width }) => {
					viewportSize = { height, width };
				})
			.sleep(DELAY)
			.findByCssSelector(`.${css.underlay}`)
				.getSize()
				.then(({ height, width }) => {
					assert.isAtLeast(height, viewportSize.height * 0.8);
					assert.isAtLeast(width, viewportSize.width * 0.9);
				});
	},

	'Clicking the underlay should destroy the dialog'() {
		return clickUnderlay(this.remote)
			.findByCssSelector(`.${css.root}`)
				.getProperty('children')
				.then((children: HTMLElement[]) => {
					assert.lengthOf(children, 0);
				});
	},

	'Clicking the underlay should not destroy the dialog when "modal" is true'() {
		return clickUnderlay(this.remote, { underlay: true, modal: true })
			.findByCssSelector(`.${css.root}`)
				.getProperty('children')
				.then((children: HTMLElement[]) => {
					assert.lengthOf(children, 2);
				});
	},

	'The dialog should not be closeable when "closeable" is false'() {
		return clickUnderlay(this.remote, { underlay: true, closeable: false })
			.findByCssSelector(`.${css.root}`)
				.getProperty('children')
				.then((children: HTMLElement[]) => {
					assert.lengthOf(children, 2, 'The dialog should not be destroyed when the underlay is clicked.');
				});
	},

	'The dialog should be hidden when the close button is clicked'() {
		return openDialog(this.remote)
			.findByCssSelector(`.${css.close}`)
				.click()
				.sleep(DELAY)
				.end()
			.findByCssSelector(`.${css.root}`)
				.getProperty('children')
				.then((children: HTMLElement[]) => {
					assert.lengthOf(children, 0);
				});
	},

	'The dialog should be hidden when the close button is activated with the enter key'() {
		if (this.remote.session.capabilities.browserName === 'safari') {
			// TODO: https://github.com/seleniumhq/selenium-google-code-issue-archive/issues/5403
			this.skip('SafariDriver does not move focus with tab key.');
		}

		return openDialog(this.remote)
			.pressKeys(keys.TAB)
			.pressKeys(keys.ENTER)
			.sleep(DELAY)
			.findByCssSelector(`.${css.root}`)
				.getProperty('children')
				.then((children: HTMLElement[]) => {
					assert.lengthOf(children, 0);
				});
	}
});
