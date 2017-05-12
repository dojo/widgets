import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as css from '../../styles/radio.m.css';

function getPage(remote: any) {
	return remote
		.get('http://localhost:9000/_build/common/example/?module=radio')
		.setFindTimeout(5000);
}

registerSuite({
	name: 'Radio Button',

	'radio button should be visible'(this: any) {
		return getPage(this.remote)
			.findByCssSelector(`#example-1 .${css.root}:first-of-type`)
			.getSize()
			.then(({ height, width }: { height: number; width: number; }) => {
				assert.isAbove(height, 0, 'The radio button height should be greater than zero.');
				assert.isAbove(width, 0, 'The radio width should be greater than zero.');
			})
			.end();
	},

	'radio button label text should be as defined'(this: any) {
		return getPage(this.remote)
			.findByCssSelector(`#example-1 .${css.root}:first-of-type`)
			.getVisibleText()
			.then((text: string) => {
				assert.strictEqual(text, 'First option');
			})
			.end();

	},
	'radio button can be selected by clicking on its label'(this: any) {
		return getPage(this.remote)
			.findByCssSelector(`#example-1 .${css.root}:first-of-type`)
			.click()
				.findByCssSelector(`.${css.input}`)
				.isSelected()
				.then((selected: boolean) => {
					assert.isTrue(selected, '2nd radio button should be selected.');
				})
				.end()
			.end();
	},
	'radio buttons should be selectable'(this: any) {
		return getPage(this.remote)
			.findByCssSelector('#example-1')
				.findByCssSelector(`.${css.root}:first-of-type .${css.input}`)
				.isSelected()
				.then((checked: boolean) => {
					assert.isTrue(checked, 'Initially the first radio button should be selected');
				})
				.end()

				.findByCssSelector(`.${css.root}:nth-of-type(3) .${css.input}`)
				.isSelected()
				.then((checked: boolean) => {
					assert.isFalse(checked, 'Initially the 3rd radio button should not be selected');
				})
				.click()
				.isSelected()
				.then((checked: boolean) => {
					assert.isTrue(checked);
				})
				.end()

				.findByCssSelector(`.${css.root}:first-of-type .${css.input}`)
				.isSelected()
				.then((checked: boolean) => {
					assert.isFalse(checked);
				})
				.end()
			.end();
	},
	'disabled radio buttons should not be selectable'(this: any) {
		return getPage(this.remote)
			.findByCssSelector('#example-2')
				.findByCssSelector(`.${css.root}:first-of-type .${css.input}`)
				.isSelected()
				.then((checked: boolean) => {
					assert.isFalse(checked, 'Initially the first radio button should not be selected');
				})
				.click()
				.then(undefined, (err: Error) => {})
				.isSelected()
				.then((checked: boolean) => {
					assert.isFalse(checked);
				})
			.end();
	}
});
