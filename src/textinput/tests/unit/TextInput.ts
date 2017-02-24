import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import TextInput from '../../TextInput';
import * as css from '../../styles/textinput.css';

registerSuite({
	name: 'TextInput',

	construction() {
		const textinput = new TextInput({
			type: 'text',
			placeholder: 'bar',
			value: 'baz'
		});

		assert.strictEqual(textinput.properties.type, 'text');
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

	'invalid state'() {
		const textinput = new TextInput({});
		let vnode = <VNode> textinput.__render__();

		assert.isFalse(vnode.properties!.classes![css.valid]);
		assert.isFalse(vnode.properties!.classes![css.invalid]);

		textinput.setProperties({
			invalid: true
		});
		vnode = <VNode> textinput.__render__();
		assert.isTrue(vnode.properties!.classes![css.invalid]);

		textinput.setProperties({
			invalid: false
		});
		vnode = <VNode> textinput.__render__();
		assert.isTrue(vnode.properties!.classes![css.valid]);
	}
});
