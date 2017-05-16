import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as css from '../../styles/dialog.m.css';

interface Options {
	closeable?: boolean;
	modal?: boolean;
	underlay?: boolean;
}

const CONTAINER_SELECTOR = 'div > div';
const DELAY = 400;

function openDialog(remote: any, options: Options = {}) {
	const { closeable = true, modal, underlay } = options;
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
			.end();
}

function clickUnderlay(remote: any, options: Options = { underlay: true }) {
	const { browser, touchEnabled } = remote.session.capabilities;
	const promise = openDialog(remote, options);

	if (touchEnabled) {
		return promise
			.moveFinger(0, 0)
			.pressFinger(0, 0)
			.releaseFinger(0, 0)
			.end();
	}

	// TODO: The iPhone driver does not support touch events:
	// https://github.com/theintern/intern/issues/602
	if (browser && browser.toLowerCase() === 'iphone') {
		return promise
			.findByCssSelector(`.${css.underlay}`)
				.click()
				.end();
	}

	// `click` clicks the center of the element, which in this case is where the dialog node is.
	return promise
		.moveMouseTo(null, 0, 0)
		.clickMouseButton()
		.end();
}

registerSuite({
	name: 'Dialog',

	'The dialog should be visibly centered by default'(this: any) {
		let dialogSize: { height: number; width: number };
		let viewportSize: { height: number; width: number };

		return openDialog(this.remote)
			.sleep(DELAY)
			.getWindowSize()
				.then(({ height, width }: { height: number; width: number; }) => {
					viewportSize = { height, width };
				})
			.findByCssSelector(`.${css.main}`)
				.getSize()
					.then(({ height, width }: { height: number; width: number; }) => {
						dialogSize = { height, width };
					})
				.getPosition()
					.then(({ x, y }: { x: number; y: number; }) => {
						const expectedX = (viewportSize.width - dialogSize.width) / 2;
						const expectedY = (viewportSize.height - dialogSize.height) / 2;

						assert.closeTo(x, expectedX, expectedX * 0.2);
						assert.closeTo(y, expectedY, expectedY * 0.2);
					});
	},

	'The underlay should cover the entire visible screen'(this: any) {
		let viewportSize: { height: number; width: number };

		return openDialog(this.remote, { underlay: true })
			.getWindowSize()
				.then(({ height, width }: { height: number; width: number; }) => {
					viewportSize = { height, width };
				})
				.end()
			.sleep(DELAY)
			.findByCssSelector(`.${css.underlay}`)
				.getSize()
				.then(({ height, width }: { height: number; width: number; }) => {
					assert.isAtLeast(height, viewportSize.height * 0.8);
					assert.isAtLeast(width, viewportSize.width * 0.9);
				});
	},

	'Clicking the underlay should destroy the dialog'(this: any) {
		return clickUnderlay(this.remote)
			.sleep(DELAY)
			.findByCssSelector(CONTAINER_SELECTOR)
				.getProperty('children')
				.then((children: HTMLElement[]) => {
					assert.lengthOf(children, 0);
				});
	},

	'Clicking the underlay should not destroy the dialog when "modal" is true'(this: any) {
		return clickUnderlay(this.remote, { underlay: true, modal: true })
			.sleep(DELAY)
			.findByCssSelector(CONTAINER_SELECTOR)
				.getProperty('children')
				.then((children: HTMLElement[]) => {
					assert.lengthOf(children, 2);
				});
	},

	'The dialog should not be closeable when "closeable" is false'(this: any) {
		return clickUnderlay(this.remote, { underlay: true, closeable: false })
			.sleep(DELAY)
			.findByCssSelector(CONTAINER_SELECTOR)
				.getProperty('children')
				.then((children: HTMLElement[]) => {
					assert.lengthOf(children, 2, 'The dialog should not be destroyed when the underlay is clicked.');
				});
	}
});
