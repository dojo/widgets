import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import TextInput from '../../TextInput';
import * as css from '../../styles/textinput.css';

registerSuite({
	name: 'TextInput',

	construction() {
		const textinput = new TextInput();
		textinput.setProperties({
			type: 'text',
			placeholder: 'bar',
			value: 'baz'
		});

		assert.strictEqual(textinput.properties.type, 'text');
		assert.strictEqual(textinput.properties.placeholder, 'bar');
		assert.strictEqual(textinput.properties.value, 'baz');
	},

	'default node attributes'() {
		const textinput = new TextInput();
		let vnode = <VNode> textinput.__render__();

		assert.strictEqual(vnode.children![1].vnodeSelector, 'input');
		assert.strictEqual(vnode.children![1].properties!.type, 'text');

		textinput.setProperties({
			type: 'email'
		});
		vnode = <VNode> textinput.__render__();

		assert.strictEqual(vnode.children![1].properties!.type, 'email');
	},

	'correct node attributes'() {
		const textinput = new TextInput();
		textinput.setProperties({
			describedBy: 'id1',
			disabled: true,
			formId: 'id2',
			label: 'foo',
			maxLength: 50,
			minLength: 5,
			name: 'bar',
			placeholder: 'baz',
			readOnly: true,
			required: true,
			type: 'number',
			value: 'qux'
		});
		vnode = <VNode> textinput.__render__();
		const labelNode = vnode.children![0];
		const inputNode = vnode.children![1];

		assert.strictEqual(inputNode.properties!['aria-describedby'], 'id1');
		assert.isTrue(inputNode.properties!.disabled);
		assert.strictEqual(inputNode.properties!.maxlength, '50');
		assert.strictEqual(inputNode.properties!.minlength, '5');
		assert.strictEqual(inputNode.properties!.name, 'bar');
		assert.strictEqual(inputNode.properties!.placeholder, 'baz');
		assert.isTrue(inputNode.properties!.readOnly);
		assert.strictEqual(inputNode.properties!['aria-readonly'], 'true');
		assert.isTrue(inputNode.properties!.required);
		assert.strictEqual(inputNode.properties!.type, 'number');
		assert.strictEqual(inputNode.properties!.value, 'qux');

		assert.strictEqual(labelNode.properties!.form, 'id2');
		assert.strictEqual(labelNode.properties!.innerHTML, 'foo');
	},

	'invalid state'() {
		const textinput = new TextInput();
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
		assert.isFalse(vnode.properties!.classes![css.invalid]);
	}
});
