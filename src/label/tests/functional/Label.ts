const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import { Remote } from 'intern/lib/executors/Node';
import * as css from '../../styles/label.m.css';

function getPage(remote: Remote) {
	return remote
		.get('http://localhost:9000/_build/common/example/?module=label')
		.setFindTimeout(5000);
}

registerSuite('Label', {
	'Label should be visible'() {
		return getPage(this.remote)
			.findByCssSelector(`#example-1 .${css.root}`)
			.getSize()
			.then(({ height, width }: { height: number; width: number; }) => {
				assert.isAbove(height, 0, 'The label height should be greater than zero.');
				assert.isAbove(width, 0, 'The label width should be greater than zero.');
			})
			.end();
	},
	'Label text should be as defined'() {
		return getPage(this.remote)
			.findByCssSelector(`#example-1 .${css.root}`)
				.getVisibleText()
				.then((text: string) => {
					assert.strictEqual(text, 'Type something');
				})
			.end();

	},
	'Input box should gain focus when clicking on the label'() {
		return getPage(this.remote)
			.findByCssSelector(`#example-1 .${css.root}`)
				.click()
			.end()
			.sleep(250)
			.execute(`return document.activeElement === document.querySelector('#example-1 .${css.root} input');`)
			.then(isEqual => {
				assert.isTrue(isEqual);
			});
	},
	'Hidden label text should not be displayed'() {
		return getPage(this.remote)
			.findByCssSelector(`#example-2 .${css.root}`)
				.getVisibleText()
				.then((text: string) => {
					assert.strictEqual(text, 'Can\'t read me!');
				})
				.findByTagName('span')
					.getSize()
					.then(({ height, width }: { height: number; width: number; }) => {
						assert.isAtMost(height, 1, 'The label text height should be no more than 1px.');
						assert.isAtMost(width, 1, 'The label text width should be no more than 1px.');
					})
				.end()
			.end();
	}
});
