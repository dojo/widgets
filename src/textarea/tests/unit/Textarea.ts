import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import Textarea from '../../Textarea';
import * as css from '../../styles/textarea.css';

registerSuite({
	name: 'Textarea',

	construction() {
		const textarea = new Textarea({
			columns: 30,
			rows: 10,
			wrapText: 'hard',
			placeholder: 'bar',
			value: 'baz'
		});

		assert.strictEqual(textarea.properties.columns, 30);
		assert.strictEqual(textarea.properties.rows, 10);
		assert.strictEqual(textarea.properties.wrapText, 'hard');
		assert.strictEqual(textarea.properties.placeholder, 'bar');
		assert.strictEqual(textarea.properties.value, 'baz');
	},

	'correct node attributes'() {
		const textarea = new Textarea({});
		let vnode = <VNode> textarea.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'textarea');
		assert.isNull(vnode.properties!.cols);
		assert.isNull(vnode.properties!.rows);
		assert.isNull(vnode.properties!.wrap);

		textarea.setProperties({
			columns: 30,
			rows: 10,
			wrapText: 'hard',
			placeholder: 'foo',
			value: 'bar'
		});
		vnode = <VNode> textarea.__render__();

		assert.strictEqual(vnode.properties!.cols, '30');
		assert.strictEqual(vnode.properties!.rows, '10');
		assert.strictEqual(vnode.properties!.wrap, 'hard');
		assert.strictEqual(vnode.properties!.placeholder, 'foo');
		assert.strictEqual(vnode.properties!.value, 'bar');
	},

	'invalid state'() {
		const textarea = new Textarea({});
		let vnode = <VNode> textarea.__render__();

		assert.isFalse(vnode.properties!.classes![css.valid]);
		assert.isFalse(vnode.properties!.classes![css.invalid]);

		textarea.setProperties({
			invalid: true
		});
		vnode = <VNode> textarea.__render__();
		assert.isTrue(vnode.properties!.classes![css.invalid]);

		textarea.setProperties({
			invalid: false
		});
		vnode = <VNode> textarea.__render__();
		assert.isTrue(vnode.properties!.classes![css.valid]);
	}
});
