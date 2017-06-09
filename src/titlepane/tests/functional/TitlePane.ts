import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';

function getPage(remote: any) {
	return remote
		.get('http://localhost:9000/_build/common/example/?module=titlepane')
		.setFindTimeout(5000);
}

const DELAY = 400;

registerSuite({
	name: 'TitlePane',

	'Should be fully visible when `open`'(this: any) {
		return getPage(this.remote)
			.findByCssSelector('#titlePane2 > div > :last-child')
				.getComputedStyle('margin-top')
				.then((marginTop: string) => {
					assert.strictEqual(marginTop, '0px');
				});
	},

	'Should be hidden when not `open`'(this: any) {
		let height: number;

		return getPage(this.remote)
			.findByCssSelector('#titlePane2 > div > :last-child')
				.getSize()
					.then((size: { height: number }) => {
						height = size.height;
					})
				.end()
			.findByCssSelector('#titlePane2 > div > :first-child')
				.click()
				.end()
			.sleep(DELAY)
			.findByCssSelector('#titlePane2 > div > :last-child')
				.getComputedStyle('margin-top')
				.then((marginTop: string) => {
					assert.closeTo(parseInt(marginTop, 10), -height, 2);
				});
	}
});
