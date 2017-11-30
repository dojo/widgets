const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import { Remote } from 'intern/lib/executors/Node';

function getPage(remote: Remote) {
	return remote
		.get('http://localhost:9000/_build/common/example/?module=toolbar')
		.setFindTimeout(5000);
}

const DELAY = 400;
const HEIGHT = 500;
const WIDTH = 500;

registerSuite('Toolbar', {
	'Should show menu when button is clicked'() {
		return getPage(this.remote)
			.setWindowSize(WIDTH, HEIGHT)
			.findByCssSelector('#fixed > div > button')
				.click()
			.end()
			.sleep(DELAY)
			.findByCssSelector('#fixed > div > div:nth-child(2) > div:last-child')
				.isDisplayed()
				.then(displayed => {
					assert.isTrue(displayed);
				});
	},

	'Should close menu when button is clicked'() {
		return getPage(this.remote)
			.setWindowSize(WIDTH, HEIGHT)
			.findByCssSelector('#fixed > div > button')
				.click()
			.end()
			.sleep(DELAY)
			.findByCssSelector('#fixed > div > div:nth-child(2) > div:last-child button')
				.click()
			.end()
			.sleep(DELAY)
			.findByCssSelector('#fixed > div > div:nth-child(2) > div:last-child')
				.isDisplayed()
				.then(displayed => {
					assert.isFalse(displayed);
				});
	}
});
