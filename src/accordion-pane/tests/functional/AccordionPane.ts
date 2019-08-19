const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import { Remote } from 'intern/lib/executors/Node';
import { services } from '@theintern/a11y';
import { uuid } from '@dojo/framework/core/util';
import * as css from '../../../theme/title-pane.m.css';

const axe = services.axe;

function getPage(remote: Remote) {
	return remote
		.get(`http://localhost:9000/dist/dev/src/common/example/?id=${uuid()}#accordion-pane`)
		.setFindTimeout(5000)
		.setExecuteAsyncTimeout(750);
}

registerSuite('AccordionPane', {
	'Child panes should open on click'() {
		return getPage(this.remote)
			.findByCssSelector('#pane > div > :first-child')
			.getSize()
			.then((size: { height: number }) => {
				assert.isBelow(size.height, 50);
			})
			.findByCssSelector('button')
			.click()
			.end()
			.end()
			.findByCssSelector(`.${css.open}`);
	},

	'check accessibility'() {
		return getPage(this.remote).then(axe.createChecker());
	}
});
