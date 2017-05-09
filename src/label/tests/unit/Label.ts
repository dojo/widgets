import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { v } from '@dojo/widget-core/d';
import { VNode } from '@dojo/interfaces/vdom';
import Label from '../../Label';
import * as baseCss from '../../../common/styles/base.m.css';

let label: Label;

registerSuite({
	name: 'Label',

	'Render label with correct properties'() {
		label = new Label();
		label.__setProperties__({
			formId: 'foo',
			extraClasses: label.classes(baseCss.visuallyHidden),
			label: 'baz'
		});
		const vnode = <VNode> label.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'label', 'tagname should be label');
		assert.strictEqual(vnode.properties!.form, 'foo');
		assert.strictEqual(vnode.children![0].properties!.innerHTML, 'baz');
	},

	'Render correct children': {
		beforeEach() {
			label = new Label();
			label.__setChildren__([
				v('div', {}, ['First']),
				v('div', {}, ['Second'])
			]);
		},

		'label before'() {
			label.__setProperties__({
				label: {
					content: 'foo',
					before: true,
					hidden: false
				}
			});
			const vnode = <VNode> label.__render__();

			assert.strictEqual(vnode.children!.length, 3);
			assert.strictEqual(vnode.children![0].properties!.innerHTML, 'foo');
			assert.strictEqual(vnode.children![1].vnodeSelector, 'div');
			assert.strictEqual(vnode.children![2].vnodeSelector, 'div');
		},

		'label after'() {
			label.__setProperties__({
				label: {
					content: 'foo',
					before: false,
					hidden: false
				}
			});
			const vnode = <VNode> label.__render__();

			assert.strictEqual(vnode.children!.length, 3);
			assert.strictEqual(vnode.children![2].properties!.innerHTML, 'foo');
			assert.strictEqual(vnode.children![0].vnodeSelector, 'div');
			assert.strictEqual(vnode.children![1].vnodeSelector, 'div');
		}
	}
});
