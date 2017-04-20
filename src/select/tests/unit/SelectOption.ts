import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import SelectOption from '../../SelectOption';
import * as css from '../../styles/select.m.css';

registerSuite({
	name: 'SelectOption',

	'Render correct properties'() {
		const option = new SelectOption();
		option.__setProperties__({
			index: 2,
			optionData: {
				disabled: true,
				id: 'foo',
				label: '',
				selected: false,
				value: 'baz'
			}
		});
		const vnode = <VNode> option.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'div');
		assert.strictEqual(vnode.properties!.role, 'option');
		assert.strictEqual(vnode.properties!.id, 'foo', 'Custom id from option.id should be used');
		assert.isTrue(vnode.properties!.classes![css.option], 'All options should have the class css.option');
		assert.strictEqual(vnode.properties!['aria-disabled'], 'true');
		assert.strictEqual(vnode.properties!['aria-selected'], 'false');
	},

	renderLabel() {
		const option = new SelectOption();
		option.__setProperties__({
			index: 0,
			optionData: {
				label: 'bar',
				value: ''
			}
		});
		const vnode = <VNode> option.__render__();

		assert.strictEqual(vnode.text, 'bar', 'renderLabel returns label property');
	},

	'State classes'() {
		const option = new SelectOption();
		option.__setProperties__({
			focused: true,
			index: 0,
			optionData: {
				disabled: true,
				selected: true,
				label: '',
				value: ''
			}
		});
		let vnode = <VNode> option.__render__();

		assert.isTrue(vnode.properties!.classes![css.focused]);
		assert.isTrue(vnode.properties!.classes![css.selected]);
		assert.isTrue(vnode.properties!.classes![css.disabledOption]);

		option.__setProperties__({
			focused: false,
			index: 0,
			optionData: {
				disabled: false,
				selected: false,
				label: '',
				value: ''
			}
		});
		vnode = <VNode> option.__render__();

		assert.isFalse(vnode.properties!.classes![css.focused]);
		assert.isFalse(vnode.properties!.classes![css.selected]);
		assert.isFalse(vnode.properties!.classes![css.disabledOption]);
	},

	'click events'() {
		let mouseDown = false;
		let clickedIndex;
		const option = new SelectOption();
		option.__setProperties__({
			index: 3,
			optionData: {
				label: '',
				value: ''
			},
			onMouseDown: () => mouseDown = true,
			onClick: (event, index) => clickedIndex = index
		});

		(<any> option)._onMouseDown();
		assert.isTrue(mouseDown, 'onMouseDown property called');

		(<any> option)._onClick(<any> {}, option.properties.index);
		assert.strictEqual(clickedIndex, 3, 'onClick property called with correct index');
	}
});
