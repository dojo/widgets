import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
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
		const slidePane = new SlidePane();
		slidePane.setProperties({
			key: 'foo',
			underlay: false
		});
		let vnode = <VNode> slidePane.__render__();
		assert.strictEqual(vnode.vnodeSelector, 'div', 'tagname should be div');
		assert.lengthOf(vnode.children, 1);

		slidePane.setProperties({
			open: true,
			underlay: true,
			align: Align.right,
			width: 256
		});
		vnode = <VNode> slidePane.__render__();
		assert.lengthOf(vnode.children, 2);
	},

	onOpen() {
		let called = false;

		const slidePane = new SlidePane();
		slidePane.setProperties({
			open: true,
			onOpen: () => {
				called = true;
			}
		});
		<VNode> slidePane.__render__();

		assert.isTrue(called, 'onOpen should be called');
	},

	'change property to close'() {
		const slidePane = new SlidePane();
		slidePane.setProperties({
			open: true
		});
		<VNode> slidePane.__render__();
		slidePane.setProperties({ open: false });
		<VNode> slidePane.__render__();

		assert.isFalse(slidePane.properties.open, 'open property should be false when changed via `setProperties`');
	},

	'click underlay to close'() {
		let called = false;

		const slidePane = new SlidePane();
		slidePane.setProperties({
			onRequestClose() {
				called = true;
			}
		});

		(<any> slidePane)._onSwipeStart(createEvent('mousedown', 300));
		(<any> slidePane)._onSwipeEnd(createEvent('mouseup', 300));

		assert.isTrue(called, 'onRequestClose should be called on underlay click');
	},

	'tap underlay to close'() {
		let called = false;

		const slidePane = new SlidePane();
		slidePane.setProperties({
			onRequestClose() {
				called = true;
			}
		});

		(<any> slidePane)._onSwipeStart(createEvent('touchstart', 300));
		(<any> slidePane)._onSwipeEnd(createEvent('touchend', 300));

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

		(<any> slidePane)._afterCreate(<any> {
			addEventListener() {},
			classList: {
				add() {}
			},
			style: {}
		});

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

		(<any> slidePane)._afterCreate(<any> {
			addEventListener() {},
			classList: {
				add() {}
			},
			style: {}
		});

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

		(<any> slidePane)._afterCreate(<any> {
			addEventListener() {},
			classList: {
				add() {}
			},
			style: {}
		});

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

		(<any> slidePane)._afterCreate(element);
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
