import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as css from '../../styles/label.m.css';

function getPage(remote: any) {
	return remote
		.get('http://localhost:9000/_build/common/example/?module=label')
		.setFindTimeout(5000);
}

registerSuite({
	name: 'Label',

	'Label should be visible'(this: any) {
		return getPage(this.remote)
			.findByCssSelector(`.${css.root}.label1`)
			.getSize()
			.then(({ height, width }: { height: number; width: number; }) => {
				assert.isAbove(height, 0, 'The label height should be greater than zero.');
				assert.isAbove(width, 0, 'The label width should be greater than zero.');
			})
			.end();
	},
	'Label text should be as defined'(this: any) {
		return getPage(this.remote)
			.findByCssSelector(`.${css.root}.label1`)
			.getVisibleText()
			.then((text: string) => {
				assert.strictEqual(text, 'Type something');
			})
			.end();

	},
	'Input box should gain focus when clicking on the label'(this: any) {
		let input: any;
		getPage(this.remote)
			.findByCssSelector(`.${css.root}.label1`)
			.then(function(element: any) {
				input = element;
			})
			.click()
			.getActiveElement()
			.then(function(element: any) {
				assert.strictEqual(element, input);
			})
			.end();

	},
	'Hidden label text should not be displayed'(this: any) {
		return getPage(this.remote)
			.findByCssSelector(`.${css.root}.label2`)
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
