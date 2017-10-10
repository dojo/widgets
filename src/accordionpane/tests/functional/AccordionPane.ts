import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';

function getPage(remote: any) {
	return remote
		.get('http://localhost:9000/_build/common/example/?module=accordionpane')
		.setFindTimeout(5000);
}

const DELAY = 750;

registerSuite({
	name: 'AccordionPane',

	'Child panes should open on click'(this: any) {
		return getPage(this.remote)
			.sleep(DELAY)
			.findByCssSelector('#pane > div > :first-child')
				.getSize()
					.then((size: { height: number }) => {
						assert.isBelow(size.height, 50);
					})
				.click()
				.sleep(DELAY)
				.getSize()
					.then((size: { height: number }) => {
						assert.isAbove(size.height, 50);
					});
	}
});
