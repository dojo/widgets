import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import TextInput from '../../TextInput';

registerSuite({
	name: 'TextInput',

	construction() {
		const textinput = new TextInput({
			type: 'foo',
			placeholder: 'bar',
			value: 'baz'
		});

		assert.strictEqual(textinput.properties.type, 'foo');
		assert.strictEqual(textinput.properties.placeholder, 'bar');
		assert.strictEqual(textinput.properties.value, 'baz');
	},

	'correct node attributes'() {
		const textinput = new TextInput({});
		let vnode = <VNode> textinput.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'input');
		assert.strictEqual(vnode.properties!.type, 'text');

		textinput.setProperties({
			type: 'email'
		});
		vnode = <VNode> textinput.__render__();

		assert.strictEqual(vnode.properties!.type, 'email');
	},

	events: {
		onInput() {
			const textinput = new TextInput({
				value: 'foo',
				onInput: () => {
					textinput.setProperties({ value: 'bar' });
				}
			});
			let vnode = <VNode> textinput.__render__();

			assert.strictEqual(vnode.properties!.value, 'foo');

			textinput.onInput(<Event> {});
			vnode = <VNode> textinput.__render__();
			assert.strictEqual(vnode.properties!.value, 'bar');
		},
		onChange() {
			const textinput = new TextInput({
				value: 'foo',
				onChange: () => {
					textinput.setProperties({ value: 'bar' });
				}
			});
			let vnode = <VNode> textinput.__render__();

			assert.strictEqual(vnode.properties!.value, 'foo');

			textinput.onChange(<Event> {});
			vnode = <VNode> textinput.__render__();
			assert.strictEqual(vnode.properties!.value, 'bar');
		},
		onFocus() {
			let focused = false;
			const textinput = new TextInput({
				onFocus: () => {
					focused = true;
				}
			});
			textinput.onFocus(<FocusEvent> {});
			assert.isTrue(focused, 'onFocus called');
		},
		onBlur() {
			let blurred = false;
			const textinput = new TextInput({
				onBlur: () => {
					blurred = true;
				}
			});
			textinput.onBlur(<FocusEvent> {});
			assert.isTrue(blurred, 'onFocus called');
		}
	}
});
