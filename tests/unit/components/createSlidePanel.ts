import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import createSlidePanel from '../../../src/components/slidePanel/createSlidePanel';

function createEvent(type: string, x: number): any {
	return {
		type,
		stopPropagation() { },
		preventDefault() { },
		pageX: x,
		changedTouches: [{
			screenX: x
		}],
		target: {
			classList: {
				contains() { return true; }
			}
		}
	};
}

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
		let called = false;

		const slidePanel = createSlidePanel({
			properties: {
				onRequestClose() { called = true; }
			}
		});

		slidePanel.onSwipeStart!(createEvent('mousedown', 300));
		slidePanel.onSwipeEnd!(createEvent('mouseup', 300));

		assert.isTrue(called, 'onRequestClose should be called on underlay click');
	},

	'drag to close'() {
		let called = false;

		const slidePanel = createSlidePanel({
			properties: {
				onRequestClose() { called = true; },
				align: 'right'
			}
		});

		slidePanel.onSwipeStart!(createEvent('mousedown', 300));
		slidePanel.onSwipeMove!(createEvent('mousemove', 400));
		slidePanel.onSwipeEnd!(createEvent('mouseup', 500));

		assert.isTrue(called, 'onRequestClose should be called if dragged far enough to close');
	},

	'swipe to close'() {
		let called = false;

		const slidePanel = createSlidePanel({
			properties: {
				onRequestClose() { called = true; },
				width: 256
			}
		});

		slidePanel.onSwipeStart!(createEvent('touchstart', 300));
		slidePanel.onSwipeMove!(createEvent('touchmove', 400));
		slidePanel.onSwipeEnd!(createEvent('touchend', 50));

		assert.isTrue(called, 'onRequestClose should be called if swiped far enough to close');
	},

	'not drag far enough to close'() {
		let called = false;

		const slidePanel = createSlidePanel({
			properties: {
				onRequestClose() { called = true; }
			}
		});

		slidePanel.onSwipeMove!(createEvent('mousemove', 250));
		slidePanel.onSwipeStart!(createEvent('mousedown', 300));
		slidePanel.onSwipeMove!(createEvent('mousemove', 250));
		slidePanel.onSwipeEnd!(createEvent('mouseup', 250));

		assert.isFalse(called, 'onRequestClose should not be called if not dragged far enough to close');
	}
});
