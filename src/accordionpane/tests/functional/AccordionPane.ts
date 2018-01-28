const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import { Remote } from 'intern/lib/executors/Node';
import { services } from '@theintern/a11y';

const axe = services.axe;

function getPage(remote: Remote) {
	return remote
		.get('http://localhost:9000/_build/common/example/?module=accordionpane')
		.setFindTimeout(5000);
}

const DELAY = 750;

registerSuite('AccordionPane', {
	'Child panes should open on click'() {
		return getPage(this.remote)
			.sleep(DELAY)
			.findByCssSelector('#pane > div > :first-child')
				.getSize()
				.then((size: { height: number }) => {
					assert.isBelow(size.height, 50);
				})
				.findByCssSelector('button')
					.click()
				.end()
				.sleep(DELAY)
				.getSize()
				.then((size: { height: number }) => {
					assert.isAbove(size.height, 50);
				});
	},

	'check accessibility'() {
		return getPage(this.remote).then(axe.createChecker());
	}
});
