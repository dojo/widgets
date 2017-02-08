import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import createSlidePanel from '../../src/slidePanel/createSlidePanel';
import * as css from '../../src/slidePanel/styles/slidePanel.css';

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

	'change property to close'() {
		const slidePanel = createSlidePanel({
			properties: { open: true }
		});
		<VNode> slidePanel.__render__();
		slidePanel.setProperties({ open: false });
		<VNode> slidePanel.__render__();

		assert.isFalse(slidePanel.properties.open, 'open property should be false when changed via `setProperties`');
	},

	'click underlay to close'() {
		let called = false;

		const slidePanel = createSlidePanel({
			properties: {
				onRequestClose() {
					called = true;
				}
			}
		});

		slidePanel.onSwipeStart(createEvent('mousedown', 300));
		slidePanel.onSwipeEnd(createEvent('mouseup', 300));

		assert.isTrue(called, 'onRequestClose should be called on underlay click');
	},

	'tap underlay to close'() {
		let called = false;

		const slidePanel = createSlidePanel({
			properties: {
				onRequestClose() {
					called = true;
				}
			}
		});

		slidePanel.onSwipeStart(createEvent('touchstart', 300));
		slidePanel.onSwipeEnd(createEvent('touchend', 300));

		assert.isTrue(called, 'onRequestClose should be called on underlay tap');
	},

	'drag to close'() {
		let called = false;

		const slidePanel = createSlidePanel({
			properties: {
				onRequestClose() {
					called = true;
				}
			}
		});

		slidePanel.onSwipeStart(createEvent('mousedown', 300));
		slidePanel.onSwipeMove(createEvent('mousemove', 150));
		slidePanel.onSwipeEnd(createEvent('mouseup', 50));

		assert.isTrue(called, 'onRequestClose should be called if dragged far enough');
	},

	'swipe to close'() {
		let called = false;

		const slidePanel = createSlidePanel({
			properties: {
				onRequestClose() {
					called = true;
				}
			}
		});

		slidePanel.afterCreate(<any> {
			addEventListener() {},
			classList: {
				add() {}
			},
			style: {}
		});

		slidePanel.onSwipeMove(createEvent('touchmove', 150));
		slidePanel.onSwipeStart(createEvent('touchstart', 300));
		slidePanel.onSwipeMove(createEvent('touchmove', 150));
		slidePanel.onSwipeEnd(createEvent('touchend', 50));

		assert.isTrue(called, 'onRequestClose should be called if swiped far enough');
	},

	'swipe to close right'() {
		let called = false;

		const slidePanel = createSlidePanel({
			properties: {
				onRequestClose() {
					called = true;
				},
				width: 256,
				align: 'right'
			}
		});

		slidePanel.afterCreate(<any> {
			addEventListener() {},
			classList: {
				add() {}
			},
			style: {}
		});

		slidePanel.onSwipeStart(createEvent('touchstart', 300));
		slidePanel.onSwipeMove(createEvent('touchmove', 400));
		slidePanel.onSwipeEnd(createEvent('touchend', 500));

		assert.isTrue(called, 'onRequestClose should be called if swiped far enough to close right');
	},

	'not dragged far enough to close'() {
		let called = false;

		const slidePanel = createSlidePanel({
			properties: {
				onRequestClose() {
					called = true;
				}
			}
		});

		slidePanel.afterCreate(<any> {
			addEventListener() {},
			classList: {
				add() {}
			},
			style: {}
		});

		slidePanel.onSwipeStart(createEvent('touchstart', 300));
		slidePanel.onSwipeMove(createEvent('touchmove', 250));
		slidePanel.onSwipeEnd(createEvent('touchend', 250));

		assert.isFalse(called, 'onRequestClose should not be called if not swiped far enough to close');
	},

	'panel cannot be moved past screen edge'() {
		const slidePanel = createSlidePanel({});

		const element: any = {
			addEventListener() {},
			classList: {
				add() {}
			},
			style: { transform: '' }
		};

		slidePanel.afterCreate(element);
		slidePanel.onSwipeStart(createEvent('touchstart', 300));
		slidePanel.onSwipeMove(createEvent('touchmove', 400));
		slidePanel.onSwipeEnd(createEvent('touchmove', 500));

		assert.strictEqual(element.style.transform, '', 'trnasform should not be applied if panel is at screen edge');
	},

	'classes and transform removed after transition'() {
		let called = false;

		const event: any = {
			target: {
				addEventListener() {},
				classList: {
					remove() {
						called = true;
						assert.strictEqual(arguments[0], css.slideIn, 'slideIn class should be removed after transition');
						assert.strictEqual(arguments[1], css.slideOut, 'slideOut class should be removed after transition');
					}
				},
				style: { transform: 'foobar' }
			}
		};

		const slidePanel = createSlidePanel({});
		slidePanel.onTransitionEnd(event);

		assert.strictEqual(event.target.style.transform, '');
		assert.isTrue(called, `Element.classList.remove should be called when transition finishes`);
	},

	'last transform is applied on next render if being swiped closed'() {
		const slidePanel = createSlidePanel({
			properties: { open: true }
		});
		<VNode> slidePanel.__render__();
		slidePanel.setProperties({ open: false });
		slidePanel.onSwipeStart(createEvent('touchstart', 300));
		slidePanel.onSwipeMove(createEvent('touchmove', 150));
		slidePanel.onSwipeEnd(createEvent('touchend', 50));
		const vnode = <VNode> slidePanel.__render__();

		assert.isDefined(vnode.children![0].properties!.styles!['transform'], 'transform should be applied');
	},

	'last transform is applied on next render if being swiped closed right'() {
		const slidePanel = createSlidePanel({
			properties: { open: true }
		});
		<VNode> slidePanel.__render__();
		slidePanel.setProperties({
			open: false,
			align: 'right'
		});
		slidePanel.onSwipeStart(createEvent('touchstart', 300));
		slidePanel.onSwipeMove(createEvent('touchmove', 400));
		slidePanel.onSwipeEnd(createEvent('touchend', 500));
		const vnode = <VNode> slidePanel.__render__();

		assert.isDefined(vnode.children![0].properties!.styles!['transform'], 'transform should be applied');
	}
});
