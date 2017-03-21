import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import TestHarness from '@dojo/intern-helper/widgets/TestHarness';
import SlidePane, { Align, SlidePaneProperties } from '../../SlidePane';
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

/* for some reasons, it is "difficult" to explicitly type mixin class instance, so creating an
 * instance just to extract type information */
let harness = new TestHarness(SlidePane);

registerSuite({
	name: 'createSlidePane',

	beforeEach() {
		harness = new TestHarness(SlidePane);
	},

	afterEach() {
		harness.destroy();
	},

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
		harness.setProperties({
			key: 'foo',
			underlay: false
		});

		harness.addRenderAssertion((render: any) => {
			assert.strictEqual(render.vnodeSelector, 'div', 'tagname should be div');
			assert.lengthOf(render.children, 1);

			harness.setProperties({
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

		harness.setProperties({
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
		harness.setProperties({
			open: true
		});

		harness.addRenderAssertion((render: any) => {
			assert.lengthOf(render.children, 2, 'should have two children nodes');

			harness.setProperties({
				open: false
			});
		}, (render: any) => {
			assert.lengthOf(render.children, 1, 'should have one child node');
		});

		return harness.startRender();
	},

	async 'click underlay to close'() {
		let called = false;

		harness.setProperties({
			open: true,

			onRequestClose() {
				called = true;
			}
		});

		await harness.append();

		harness.sendEvent('mousedown', 'CustomEvent', {
			eventInit: <MouseEventInit> {
				bubbles: true,
				pageX: 300
			},

			selector: ':first-child'
		});

		/* using MouseEvent here causes issues between pepjs and jsdom, therefore we will use custom event */
		harness.sendEvent('mouseup', 'CustomEvent', {
			eventInit: <MouseEventInit> {
				bubbles: true,
				pageX: 300
			},

			selector: ':first-child'
		});

		assert.isTrue(called, 'onRequestClose should be called on underlay click');
	},

	async 'tap underlay to close'() {
		let called = false;

		harness.setProperties({
			open: true,

			onRequestClose() {
				called = true;
			}
		});

		await harness.append();

		harness.sendEvent('touchstart', 'CustomEvent', {
			eventInit: <MouseEventInit> {
				bubbles: true,
				changedTouches: [ { screenX: 300 } ]
			},

			selector: ':first-child'
		});

		harness.sendEvent('touchend', 'CustomEvent', {
			eventInit: <MouseEventInit> {
				bubbles: true,
				changedTouches: [ { screenX: 300 } ]
			},

			selector: ':first-child'
		});

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

		(<any> slidePane)._onSwipeStart(createEvent('mousedown', 300));
		(<any> slidePane)._onSwipeMove(createEvent('mousemove', 150));
		(<any> slidePane)._onSwipeEnd(createEvent('mouseup', 50));

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

		(<any> slidePane).onElementCreated(null, 'foo');
		(<any> slidePane).onElementCreated(<any> {
			addEventListener() {},
			classList: {
				add() {}
			},
			style: {}
		}, 'content');

		(<any> slidePane)._onSwipeMove(createEvent('touchmove', 150));
		(<any> slidePane)._onSwipeStart(createEvent('touchstart', 300));
		(<any> slidePane)._onSwipeMove(createEvent('touchmove', 150));
		(<any> slidePane)._onSwipeEnd(createEvent('touchend', 50));

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

		(<any> slidePane).onElementCreated(<any> {
			addEventListener() {},
			classList: {
				add() {}
			},
			style: {}
		}, 'content');

		(<any> slidePane)._onSwipeStart(createEvent('touchstart', 300));
		(<any> slidePane)._onSwipeMove(createEvent('touchmove', 400));
		(<any> slidePane)._onSwipeEnd(createEvent('touchend', 500));

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

		(<any> slidePane).onElementCreated(<any> {
			addEventListener() {},
			classList: {
				add() {}
			},
			style: {}
		}, 'content');

		(<any> slidePane)._onSwipeStart(createEvent('touchstart', 300));
		(<any> slidePane)._onSwipeMove(createEvent('touchmove', 250));
		(<any> slidePane)._onSwipeEnd(createEvent('touchend', 250));

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

		(<any> slidePane).onElementCreated(element, 'content');
		(<any> slidePane)._onSwipeStart(createEvent('touchstart', 300));
		(<any> slidePane)._onSwipeMove(createEvent('touchmove', 400));
		(<any> slidePane)._onSwipeEnd(createEvent('touchmove', 500));

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
		(<any> slidePane)._onTransitionEnd(event);

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
		(<any> slidePane)._onSwipeStart(createEvent('touchstart', 300));
		(<any> slidePane)._onSwipeMove(createEvent('touchmove', 150));
		(<any> slidePane)._onSwipeEnd(createEvent('touchend', 50));
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
		(<any> slidePane)._onSwipeStart(createEvent('touchstart', 300));
		(<any> slidePane)._onSwipeMove(createEvent('touchmove', 400));
		(<any> slidePane)._onSwipeEnd(createEvent('touchend', 500));
		const vnode = <VNode> slidePane.__render__();

		assert.isDefined(vnode.children![0].properties!.styles!['transform'], 'transform should be applied');
	}
});
