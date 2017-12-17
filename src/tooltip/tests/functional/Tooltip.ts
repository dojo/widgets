const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import { Remote } from 'intern/lib/executors/Node';

function getPage(remote: Remote) {
	return remote.get('http://localhost:9000/_build/common/example/?module=tooltip').setFindTimeout(5000);
}

const DELAY = 750;

registerSuite('Tooltip', {
	'should render when triggered'() {
		return getPage(this.remote)
			.sleep(DELAY)
			.findByCssSelector('#example-1 button')
			.click()
			.sleep(DELAY)
			.end()
			.findByCssSelector('#example-1 > div:first-child > div:last-child')
			.getVisibleText()
			.then((text: string) => {
				assert.strictEqual(
					text,
					'This is a right-oriented tooltip that opens and closes based on child click.'
				);
			});
	}
});
