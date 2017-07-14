import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as css from '../../styles/slidePane.m.css';

const DELAY = 400;

function openSlidePane(remote: any, alignRight?: boolean) {
	let promise = remote
		.get('http://localhost:9000/_build/common/example/?module=slidepane')
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

function swipeSlidePane(remote: any, distance = 250, alignRight?: boolean) {
	const { mouseEnabled } = remote.environmentType;
	const initialX = alignRight ? 10 : 300;

	if (mouseEnabled) {
		const finalX = alignRight ? distance : -distance;
		return openSlidePane(remote, alignRight)
			.moveMouseTo(null, initialX, 10)
			.pressMouseButton()
			.moveMouseTo(null, finalX, 0)
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

registerSuite({
	name: 'SlidePane',

	'the underlay should cover the screen'(this: any) {
		let viewportSize: { height: number; width: number; };

		return openSlidePane(this.remote)
			.getWindowSize()
				.then(({ height, width }: { height: number; width: number; }) => {
					viewportSize = { height, width };
				})
			.findByCssSelector(`.${css.underlay}`)
				.getSize()
				.then(({ height, width }: { height: number; width: number; }) => {
					assert.closeTo(height, viewportSize.height, viewportSize.height * 0.2);
					assert.closeTo(width, viewportSize.width, viewportSize.width * 0.2);
				});
	},

	'the underlay should not be destroyed when the slidepane is clicked'(this: any) {
		return openSlidePane(this.remote)
			.findByCssSelector(`.${css.content}`)
				.click()
				.end()
			.sleep(DELAY)
			.findByCssSelector(`.${css.underlay}`)
				.getAttribute('class')
				.then((className: string) => {
					assert.match(className, /slidePane-m__underlay/, 'the underlay should not be removed.');
				});
	},

	'the slidepane should not be hidden when it is clicked'(this: any) {
		return openSlidePane(this.remote)
			.findByCssSelector(`.${css.content}`)
				.click()
				.sleep(DELAY)
				.getPosition()
					.then(({ x }: { x: number; }) => {
						assert.strictEqual(x, 0, 'The slidepane should be visible.');
					});
	},

	'a left-aligned slidepane should close when swiping from right to left'(this: any) {
		const { browserName, mouseEnabled, touchEnabled } = this.remote.environmentType;

		if (!mouseEnabled && !touchEnabled) {
			this.skip('Test requires mouse or touch interactions.');
		}

		if (browserName.toLowerCase() === 'microsoftedge') {
			// TODO: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/11469232/
			this.skip('Edge driver does not handle mouse movements correctly.');
		}

		let width = 0;
		return swipeSlidePane(this.remote)
			.findByCssSelector(`.${css.content}`)
				.getSize()
					.then((size: { width: number; }) => {
						width = size.width;
					})
				.getPosition()
					.then(({ x }: { x: number; }) => {
						assert.closeTo(x, -width, 15);
					});
	},

	'a right-aligned slidepane should close when swiping from left to right'(this: any) {
		const { browserName, mouseEnabled, touchEnabled } = this.remote.environmentType;

		if (!mouseEnabled && !touchEnabled) {
			this.skip('Test requires mouse or touch interactions.');
		}

		if (browserName.toLowerCase() === 'microsoftedge') {
			// TODO: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/11469232/
			this.skip('Edge driver does not handle mouse movements correctly.');
		}

		let viewportWidth = 0;
		return swipeSlidePane(this.remote, undefined, true)
			.getWindowSize()
				.then(({ width }: { width: number }) => {
					viewportWidth = width;
				})
			.findByCssSelector(`.${css.content}`)
				.getPosition()
				.then(({ x }: { x: number; }) => {
					// Edge/IE11/Chrome on Windows visually hide the slidepane correctly, but the position
					// is slightly less than expected (the viewport width).
					const expected = viewportWidth * 0.95;
					assert.isAtLeast(x, expected, 'The slidepane should be hidden off to the right.');
				});
	},

	'minor swipe movements should not close the slidepane'(this: any) {
		const { browserName, mouseEnabled, touchEnabled } = this.remote.environmentType;

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
					.then(({ x }: { x: number; }) => {
						assert.strictEqual(x, 0, 'The slidepane should be open.');
					});
	}
});
