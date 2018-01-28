const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import { Remote } from 'intern/lib/executors/Node';
import { services } from '@theintern/a11y';
import * as css from '../../../theme/radio/radio.m.css';

const axe = services.axe;

function getPage(remote: Remote) {
	return remote
		.get('http://localhost:9000/_build/common/example/?module=radio')
		.setFindTimeout(5000);
}

registerSuite('Radio Button', {

	'radio button should be visible'() {
		return getPage(this.remote)
			.findByCssSelector(`#example-1 .${css.root}:first-of-type`)
			.getSize()
			.then(({ height, width }) => {
				assert.isAbove(height, 0, 'The radio button height should be greater than zero.');
				assert.isAbove(width, 0, 'The radio width should be greater than zero.');
			})
			.end();
	},

	'radio button label text should be as defined'() {
		return getPage(this.remote)
			.findByCssSelector(`#example-1 .${css.root}:first-of-type`)
			.getVisibleText()
			.then(text => {
				assert.strictEqual(text, 'First option');
			})
			.end();

	},
	'radio button can be selected by clicking on its label'() {
		return getPage(this.remote)
			.findByCssSelector(`#example-1 .${css.root}:first-of-type`)
			.click()
				.findByCssSelector(`.${css.input}`)
				.isSelected()
				.then(selected => {
					assert.isTrue(selected, '2nd radio button should be selected.');
				})
				.end()
			.end();
	},
	'radio buttons should be selectable'() {
		return getPage(this.remote)
			.findByCssSelector('#example-1')
				.findByCssSelector(`.${css.root}:first-of-type .${css.input}`)
				.isSelected()
				.then(checked => {
					assert.isTrue(checked, 'Initially the first radio button should be selected');
				})
				.end()

				.findByCssSelector(`.${css.root}:nth-of-type(3) .${css.input}`)
				.isSelected()
				.then(checked => {
					assert.isFalse(checked, 'Initially the 3rd radio button should not be selected');
				})
				.click()
				.isSelected()
				.then(checked => {
					assert.isTrue(checked);
				})
				.end()

				.findByCssSelector(`.${css.root}:first-of-type .${css.input}`)
				.isSelected()
				.then(checked => {
					assert.isFalse(checked);
				})
				.end()
			.end();
	},
	'disabled radio buttons should not be selectable'() {
		return getPage(this.remote)
			.findByCssSelector('#example-2')
				.findByCssSelector(`.${css.root}:first-of-type .${css.input}`)
				.isSelected()
				.then(checked => {
					assert.isFalse(checked, 'Initially the first radio button should not be selected');
				})
				.click()
				.then(undefined, (err: Error) => {})
				.isSelected()
				.then(checked => {
					assert.isFalse(checked);
				})
			.end();
	},

	'check accessibility'() {
		return getPage(this.remote).then(axe.createChecker());
	}
});
