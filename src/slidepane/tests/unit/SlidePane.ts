import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import TestHarness from '@dojo/intern-helper/widgets/TestHarness';
import SlidePane, { Align } from '../../SlidePane';
import * as css from '../../styles/slidePane.css';

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
	name: 'createSlidePane',

	'Should construct SlidePane with passed properties'() {
		const slidePane = new SlidePane();
		slidePane.setProperties({
			key: 'foo',
			align: Align.left,
			open: true,
			underlay: true
		});

		assert.strictEqual(slidePane.properties.key, 'foo');
		assert.strictEqual(slidePane.properties.align, Align.left);
		assert.isTrue(slidePane.properties.open);
		assert.isTrue(slidePane.properties.underlay);
	},

	'Render correct children'() {
		const harness = new TestHarness(SlidePane, {
			key: 'foo',
			underlay: false
		});

		harness.addRenderAssertion((render: any) => {
			assert.strictEqual(render.vnodeSelector, 'div', 'tagname should be div');
			assert.lengthOf(render.children, 1);

			harness.setWidgetProperties({
				open: true,
				underlay: true,
				align: Align.right,
				width: 256
			});
		}, (render: any) => {
			assert.lengthOf(render.children, 2);
		});

		return harness.startRender();
	},

	onOpen() {
		let called = false;
		const harness = new TestHarness(SlidePane, {
			open: true,
			onOpen() {
				called = true;
			}
		});

		harness.addRenderAssertion(() => {
			assert.isTrue(called, 'onOpen should be called');
		});

		return harness.startRender();
	},

	'change property to close'() {
		const harness = new TestHarness(SlidePane, {
			open: true
		});

		harness.addRenderAssertion((render: any) => {
			assert.lengthOf(render.children, 2, 'should have two children nodes');

			harness.setWidgetProperties({
				open: false
			});
		}, (render: any) => {
			assert.lengthOf(render.children, 1, 'should have one child node');
		});

		return harness.startRender();
	},

	'click underlay to close'() {
		let called = false;

		const harness = new TestHarness(SlidePane, {
			onRequestClose() {
				called = true;
			}
		});

		harness.addRenderAssertion(() => {
			harness.sendEvent('mousedown', 'CustomEvent', {
				eventInit: <MouseEventInit> {
					bubbles: true,
					pageX: 300,
					changedTouches: [ { screenX: 300 } ]
				},

				selector: ':first-child'
			});

			/* using MouseEvent here causes issues between pepjs and jsdom, therefore we will use custom event */
			harness.sendEvent('mouseup', 'CustomEvent', {
				eventInit: <MouseEventInit> {
					bubbles: true,
					pageX: 300,
					changedTouches: [ { screenX: 300 } ]
				},

				selector: ':first-child'
			});

			assert.isTrue(called, 'onRequestClose should be called on underlay click');
		});

		return harness.startRender();
	},

	'tap underlay to close'() {
		let called = false;

		const slidePane = new SlidePane();
		slidePane.setProperties({
			onRequestClose() {
				called = true;
			}
		});

		slidePane.onSwipeStart(createEvent('touchstart', 300));
		slidePane.onSwipeEnd(createEvent('touchend', 300));

		assert.isTrue(called, 'onRequestClose should be called on underlay tap');
	},

	'drag to close'() {
		let called = false;

		const slidePane = new SlidePane();
		slidePane.setProperties({
			onRequestClose() {
				called = true;
			}
		});

		slidePane.onSwipeStart(createEvent('mousedown', 300));
		slidePane.onSwipeMove(createEvent('mousemove', 150));
		slidePane.onSwipeEnd(createEvent('mouseup', 50));

		assert.isTrue(called, 'onRequestClose should be called if dragged far enough');
	},

	'swipe to close'() {
		let called = false;

		const slidePane = new SlidePane();
		slidePane.setProperties({
			onRequestClose() {
				called = true;
			}
		});

		slidePane.afterCreate(<any> {
			addEventListener() {},
			classList: {
				add() {}
			},
			style: {}
		});

		slidePane.onSwipeMove(createEvent('touchmove', 150));
		slidePane.onSwipeStart(createEvent('touchstart', 300));
		slidePane.onSwipeMove(createEvent('touchmove', 150));
		slidePane.onSwipeEnd(createEvent('touchend', 50));

		assert.isTrue(called, 'onRequestClose should be called if swiped far enough');
	},

	'swipe to close right'() {
		let called = false;

		const slidePane = new SlidePane();
		slidePane.setProperties({
			onRequestClose() {
				called = true;
			},
			width: 256,
			align: Align.right
		});

		slidePane.afterCreate(<any> {
			addEventListener() {},
			classList: {
				add() {}
			},
			style: {}
		});

		slidePane.onSwipeStart(createEvent('touchstart', 300));
		slidePane.onSwipeMove(createEvent('touchmove', 400));
		slidePane.onSwipeEnd(createEvent('touchend', 500));

		assert.isTrue(called, 'onRequestClose should be called if swiped far enough to close right');
	},

	'not dragged far enough to close'() {
		let called = false;

		const slidePane = new SlidePane();
		slidePane.setProperties({
			onRequestClose() {
				called = true;
			}
		});

		slidePane.afterCreate(<any> {
			addEventListener() {},
			classList: {
				add() {}
			},
			style: {}
		});

		slidePane.onSwipeStart(createEvent('touchstart', 300));
		slidePane.onSwipeMove(createEvent('touchmove', 250));
		slidePane.onSwipeEnd(createEvent('touchend', 250));

		assert.isFalse(called, 'onRequestClose should not be called if not swiped far enough to close');
	},

	'pane cannot be moved past screen edge'() {
		const slidePane = new SlidePane();

		const element: any = {
			addEventListener() {},
			classList: {
				add() {}
			},
			style: { transform: '' }
		};

		slidePane.afterCreate(element);
		slidePane.onSwipeStart(createEvent('touchstart', 300));
		slidePane.onSwipeMove(createEvent('touchmove', 400));
		slidePane.onSwipeEnd(createEvent('touchmove', 500));

		assert.strictEqual(element.style.transform, '', 'trnasform should not be applied if pane is at screen edge');
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

		const slidePane = new SlidePane();
		slidePane.onTransitionEnd(event);

		assert.strictEqual(event.target.style.transform, '');
		assert.isTrue(called, `Element.classList.remove should be called when transition finishes`);
	},

	'last transform is applied on next render if being swiped closed'() {
		const slidePane = new SlidePane();
		slidePane.setProperties({
			open: true
		});
		<VNode> slidePane.__render__();
		slidePane.setProperties({ open: false });
		slidePane.onSwipeStart(createEvent('touchstart', 300));
		slidePane.onSwipeMove(createEvent('touchmove', 150));
		slidePane.onSwipeEnd(createEvent('touchend', 50));
		const vnode = <VNode> slidePane.__render__();

		assert.isDefined(vnode.children![0].properties!.styles!['transform'], 'transform should be applied');
	},

	'last transform is applied on next render if being swiped closed right'() {
		const slidePane = new SlidePane();
		slidePane.setProperties({
			open: true
		});
		<VNode> slidePane.__render__();
		slidePane.setProperties({
			open: false,
			align: Align.right
		});
		slidePane.onSwipeStart(createEvent('touchstart', 300));
		slidePane.onSwipeMove(createEvent('touchmove', 400));
		slidePane.onSwipeEnd(createEvent('touchend', 500));
		const vnode = <VNode> slidePane.__render__();

		assert.isDefined(vnode.children![0].properties!.styles!['transform'], 'transform should be applied');
	}
});
