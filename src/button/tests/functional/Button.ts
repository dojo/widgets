import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';

function getPage(remote: any) {
	return remote
		.get('http://localhost:9000/_build/common/example/?module=button')
		.setFindTimeout(5000);
}

registerSuite({
	name: 'Button',

	'button should be visible'(this: any) {
		return getPage(this.remote)
			.findByCssSelector('button:first-of-type')
			.getSize()
			.then(({ height, width }: { height: number; width: number; }) => {
				assert.isAbove(height, 0, 'The button height should be greater than zero.');
				assert.isAbove(width, 0, 'The button width should be greater than zero.');
			})
			.end();
	},

	'button text should be as defined'(this: any) {
		return getPage(this.remote)
			.findByCssSelector('button:first-of-type')
			.getVisibleText()
			.then((text: string) => {
				assert.strictEqual(text, 'Basic Button');
			})
			.end();

	},
	'button should be disabled'(this: any) {
		return getPage(this.remote)
			.findByCssSelector('button:nth-of-type(2)')
			.isEnabled()
			.then((enabled: boolean) => {
				assert.isTrue(!enabled, 'The button should be disabled.');
			})
			.end();
	},
	'button should be toggle-able'(this: any) {
		return getPage(this.remote)
			.findByCssSelector('button:nth-of-type(3)')
			.getAttribute('aria-pressed')
			.then((pressed: string) => {
				assert.isNull(pressed, 'Initial state should be null');
			})
			.click()
			.then(function (this: any) {
				// `getAttribute` needs to be placed in then callback, rather than being
				// directly chainable after `click()` - it won't wait until `click is done`
				this.getAttribute('aria-pressed')
					.then((pressed: string) => {
						assert.strictEqual(pressed, 'true');
					});
			})
			.click()
			.then(function (this: any) {
				this.getAttribute('aria-pressed')
					.then((pressed: string) => {
						assert.strictEqual(pressed, 'false');
					});
			})
			.end();
	}
});
