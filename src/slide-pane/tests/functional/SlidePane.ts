const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import { Remote } from 'intern/lib/executors/Node';
import Command from '@theintern/leadfoot/Command';
import { services } from '@theintern/a11y';
import * as css from '../../../theme/slide-pane.m.css';
import * as fixedCss from '../../styles/slide-pane.m.css';
import { uuid } from '@dojo/framework/core/util';

const axe = services.axe;
const DELAY = 400;

function openSlidePane(remote: Remote, alignRight?: boolean) {
	let promise = remote
		.get(`http://localhost:9000/_build/common/example/?id=${uuid()}#slide-pane`)
		.setFindTimeout(5000)
		.findById('underlay')
		.click()
		.end();

	if (alignRight) {
		promise = promise
			.findById('alignRight')
			.click()
			.end();
	}

	return promise
		.findById('button')
		.click()
		.end()
		.sleep(DELAY);
}

function swipeSlidePane(remote: Remote): Command<any>;
function swipeSlidePane(remote: Remote, alignRight: boolean): Command<any>;
function swipeSlidePane(remote: Remote, distance: number, alignRight?: boolean): Command<any>;
function swipeSlidePane(remote: Remote, distance?: number | boolean, alignRight?: boolean) {
	if (typeof distance === 'boolean') {
		alignRight = distance;
		distance = 250;
	} else if (typeof distance === 'undefined') {
		alignRight = undefined;
		distance = 250;
	}

	const { mouseEnabled } = remote.session.capabilities;
	const initialX = alignRight ? 10 : 300;

	if (mouseEnabled) {
		const finalX = alignRight ? distance : -distance;
		return openSlidePane(remote, alignRight)
			.moveMouseTo(undefined, initialX, 10)
			.pressMouseButton()
			.moveMouseTo(undefined, finalX, 0)
			.releaseMouseButton()
			.sleep(DELAY);
	}

	const finalX = alignRight ? initialX + distance : initialX - distance;
	return openSlidePane(remote, alignRight)
		.pressFinger(initialX, 10)
		.moveFinger(finalX, 10)
		.releaseFinger(finalX, 10)
		.sleep(DELAY);
}

registerSuite('SlidePane', {
	'the underlay should cover the screen'() {
		let viewportSize: { height: number; width: number };

		return openSlidePane(this.remote)
			.getWindowSize()
			.then(({ height, width }) => {
				viewportSize = { height, width };
			})
			.findByCssSelector(`.${fixedCss.underlay}`)
			.getSize()
			.then(({ height, width }) => {
				assert.closeTo(height, viewportSize.height, viewportSize.height * 0.2);
				assert.closeTo(width, viewportSize.width, viewportSize.width * 0.2);
			});
	},

	'the underlay should not be destroyed when the slidepane is clicked'() {
		return openSlidePane(this.remote)
			.findByCssSelector(`.${css.content}`)
			.click()
			.end()
			.sleep(DELAY)
			.findByCssSelector(`.${fixedCss.underlay}`)
			.getAttribute('class')
			.then((className: string) => {
				assert.match(
					className,
					new RegExp(fixedCss.underlay),
					'the underlay should not be removed.'
				);
			});
	},

	'the slidepane should not be hidden when it is clicked'() {
		return openSlidePane(this.remote)
			.findByCssSelector(`.${css.content}`)
			.click()
			.sleep(DELAY)
			.getPosition()
			.then(({ x }) => {
				assert.strictEqual(x, 0, 'The slidepane should be visible.');
			});
	},

	'a left-aligned slidepane should close when swiping from right to left'() {
		const { browserName = '', mouseEnabled, touchEnabled } = this.remote.session.capabilities;

		if (!mouseEnabled && !touchEnabled) {
			this.skip('Test requires mouse or touch interactions.');
		}

		if (
			browserName.toLowerCase() === 'microsoftedge' ||
			browserName.toLowerCase() === 'internet explorer'
		) {
			// TODO: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/11469232/
			this.skip('Edge driver does not handle mouse movements correctly.');
		}

		let width = 0;
		return swipeSlidePane(this.remote)
			.findByCssSelector(`.${css.content}`)
			.getSize()
			.then((size) => {
				width = size.width;
			})
			.getPosition()
			.then(({ x }) => {
				assert.closeTo(x, -width, 15);
			});
	},

	'a right-aligned slidepane should close when swiping from left to right'() {
		const { browserName = '', mouseEnabled, touchEnabled } = this.remote.session.capabilities;

		if (!mouseEnabled && !touchEnabled) {
			this.skip('Test requires mouse or touch interactions.');
		}

		if (
			browserName.toLowerCase() === 'microsoftedge' ||
			browserName.toLowerCase() === 'internet explorer'
		) {
			// TODO: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/11469232/
			this.skip('Edge driver does not handle mouse movements correctly.');
		}

		let viewportWidth = 0;
		return swipeSlidePane(this.remote, true)
			.getWindowSize()
			.then(({ width }) => {
				viewportWidth = width;
			})
			.findByCssSelector(`.${css.content}`)
			.getPosition()
			.then(({ x }) => {
				// Edge/IE11/Chrome on Windows visually hide the slidepane correctly, but the position
				// is slightly less than expected (the viewport width).
				const expected = viewportWidth * 0.95;
				assert.isAtLeast(x, expected, 'The slidepane should be hidden off to the right.');
			});
	},

	'minor swipe movements should not close the slidepane'() {
		const { browserName = '', mouseEnabled, touchEnabled } = this.remote.session.capabilities;

		if (!mouseEnabled && !touchEnabled) {
			this.skip('Test requires mouse or touch interactions.');
		}

		if (browserName.toLowerCase() === 'microsoftedge') {
			// TODO: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/11469232/
			this.skip('Edge driver does not handle mouse movements correctly.');
		}

		return swipeSlidePane(this.remote, 50)
			.findByCssSelector(`.${css.content}`)
			.getPosition()
			.then(({ x }) => {
				assert.strictEqual(x, 0, 'The slidepane should be open.');
			});
	},

	'check accessibility'() {
		return openSlidePane(this.remote).then(axe.createChecker());
	}
});
