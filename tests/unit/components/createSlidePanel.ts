import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import createSlidePanel from '../../../src/components/slidePanel/createSlidePanel';

registerSuite({
	name: 'createSlidePanel',

	'Should construct SlidePanel with passed properties'() {
		const slidePanel = createSlidePanel({
			properties: {
				id: 'foo',
				align: 'left',
				open: true,
				underlay: true
			}
		});
		assert.strictEqual(slidePanel.properties.id, 'foo');
		assert.strictEqual(slidePanel.properties.align, 'left');
		assert.isTrue(slidePanel.properties.open);
		assert.isTrue(slidePanel.properties.underlay);
	},

	'Outer node should have correct attributes'() {
		const slidePanel = createSlidePanel({
			properties: {
				id: 'foo',
				underlay: false
			}
		});
		let vnode = <VNode> slidePanel.__render__();
		assert.strictEqual(vnode.vnodeSelector, 'div', 'tagname should be div');
		assert.strictEqual(vnode.properties!['data-underlay'], 'false');
		assert.strictEqual(vnode.properties!['data-open'], 'false');
		assert.strictEqual(vnode.properties!['data-align'], 'left');

		slidePanel.setProperties({
			open: true,
			underlay: true,
			align: 'right'
		});
		vnode = <VNode> slidePanel.__render__();
		assert.strictEqual(vnode.properties!['data-underlay'], 'true');
		assert.strictEqual(vnode.properties!['data-open'], 'true');
		assert.strictEqual(vnode.properties!['data-align'], 'right');
		assert.lengthOf(vnode.children, 2);
	},

	onOpen() {
		let called = false;

		const slidePanel = createSlidePanel({
			properties: {
				open: true,
				onOpen: () => {
					called = true;
				}
			}
		});
		<VNode> slidePanel.__render__();
		assert.isTrue(called, 'onOpen should be called');
	},

	'click underlay to close'() {
		const slidePanel = createSlidePanel({});
		<VNode> slidePanel.__render__();
		// assert.isTrue(called, 'onOpen should be called');
	}
});
