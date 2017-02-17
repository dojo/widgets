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

	onInput() {
		let input = false;
		const textinput = new TextInput({
			onInput: () => {
				input = true;
			}
		});
		textinput.onInput(<Event> {});

		assert.isTrue(input, 'properties.onInput should be called');
	}
});
