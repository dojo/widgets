const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import { Remote } from 'intern/lib/executors/Node';

function getPage(remote: Remote) {
	return remote.get('http://localhost:9000/_build/common/example/?module=titlepane').setFindTimeout(5000);
}

const DELAY = 400;

registerSuite('TitlePane', {
	'Should be fully visible when `open`'() {
		return getPage(this.remote)
			.findByCssSelector('#titlePane2 > div > :last-child')
			.getComputedStyle('margin-top')
			.then((marginTop) => {
				assert.strictEqual(marginTop, '0px');
			});
	},

	'Should be hidden when not `open`'() {
		let height: number;

		return getPage(this.remote)
			.findByCssSelector('#titlePane2 > div > :last-child')
			.getSize()
			.then((size) => {
				height = size.height;
			})
			.end()
			.findByCssSelector('#titlePane2 button')
			.click()
			.end()
			.sleep(DELAY)
			.findByCssSelector('#titlePane2 > div > :last-child')
			.getComputedStyle('margin-top')
			.then((marginTop) => {
				assert.closeTo(parseInt(marginTop, 10), -height, 2);
			});
	}
});
