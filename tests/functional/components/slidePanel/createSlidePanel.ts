import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { Require } from '@dojo/interfaces/loader';
declare const require: Require;

registerSuite({
	name: 'createSlidePanel',

	'panel does not slide past screen edge'(this: any) {
		return this.remote
			.get(require.toUrl('./index.html'))
			.findByCssSelector('#button')
				.click()
				.end()
			.sleep(500)
			.moveMouseTo(300, 10)
			.pressMouseButton()
			.moveMouseTo(100, 0)
			.releaseMouseButton()
			.sleep(500)
			.findByCssSelector('[data-open]')
				.getAttribute('data-open')
				.then((attr: true) => {
					assert.strictEqual(attr, 'true');
				});
	},

	'panel stays open if not swiped far enough'(this: any) {
		return this.remote
			.get(require.toUrl('./index.html'))
			.findByCssSelector('#button')
				.click()
				.end()
			.sleep(500)
			.moveMouseTo(300, 10)
			.pressMouseButton()
			.moveMouseTo(-50, 0)
			.releaseMouseButton()
			.sleep(500)
			.findByCssSelector('[data-open]')
				.getAttribute('data-open')
				.then((attr: true) => {
					assert.strictEqual(attr, 'true');
				});
	},

	'click underlay to close (left align)'(this: any) {
		return this.remote
			.get(require.toUrl('./index.html'))
			.findByCssSelector('#button')
				.click()
				.end()
			.sleep(500)
			.moveMouseTo(300, 10)
			.clickMouseButton()
			.sleep(500)
			.findByCssSelector('[data-open]')
				.getAttribute('data-open')
				.then((attr: true) => {
					assert.strictEqual(attr, 'false');
				});
	},

	'click underlay to close (right align)'(this: any) {
		return this.remote
			.get(require.toUrl('./index.html'))
			.findByCssSelector('#alignRight')
				.click()
				.end()
			.findByCssSelector('#button')
				.click()
				.end()
			.sleep(500)
			.moveMouseTo(10, 10)
			.clickMouseButton()
			.sleep(500)
			.findByCssSelector('[data-open]')
				.getAttribute('data-open')
				.then((attr: true) => {
					assert.strictEqual(attr, 'false');
				});
	},

	'move mouse to close (left align)'(this: any) {
		return this.remote
			.get(require.toUrl('./index.html'))
			.findByCssSelector('#button')
				.click()
				.end()
			.sleep(500)
			.moveMouseTo(300, 10)
			.pressMouseButton()
			.moveMouseTo(-200, 0)
			.releaseMouseButton()
			.sleep(500)
			.findByCssSelector('[data-open]')
				.getAttribute('data-open')
				.then((attr: true) => {
					assert.strictEqual(attr, 'false');
				});
	},

	'move mouse to close (right align)'(this: any) {
		return this.remote
			.get(require.toUrl('./index.html'))
			.findByCssSelector('#alignRight')
				.click()
				.end()
			.findByCssSelector('#button')
				.click()
				.end()
			.sleep(500)
			.moveMouseTo(10, 10)
			.pressMouseButton()
			.moveMouseTo(200, 0)
			.releaseMouseButton()
			.sleep(500)
			.findByCssSelector('[data-open]')
				.getAttribute('data-open')
				.then((attr: true) => {
					assert.strictEqual(attr, 'false');
				});
	}
});
