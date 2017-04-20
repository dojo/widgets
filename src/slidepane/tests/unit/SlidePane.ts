import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';

import has from '@dojo/has/has';
import harness, { assignProperties, assignChildProperties, Harness, replaceChild } from '@dojo/test-extras/harness';
import { v } from '@dojo/widget-core/d';

import SlidePane, { Align, SlidePaneProperties } from '../../SlidePane';
import * as css from '../../styles/slidePane.m.css';
import * as animations from '../../../common/styles/animations.m.css';

const hasTouch = (function (): boolean {
	/* Since jsdom will fake it anyways, no problem pretending we can do touch in NodeJS */
	return Boolean('ontouchstart' in window || has('host-node'));
})();

let widget: Harness<SlidePaneProperties, typeof SlidePane>;

const GREEKING = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
	Quisque id purus ipsum. Aenean ac purus purus.
	Nam sollicitudin varius augue, sed lacinia felis tempor in.`;

registerSuite({
	name: 'SlidePane',

	beforeEach() {
		widget = harness(SlidePane);
	},

	afterEach() {
		widget.destroy();
	},

	'Should construct SlidePane with passed properties'() {
		widget.setProperties({
			key: 'foo',
			align: Align.left,
			open: true,
			underlay: true
		});

		widget.setChildren([ GREEKING ]);

		widget.expectRender(v('div', {
			onmousedown: widget.listener,
			onmousemove: widget.listener,
			onmouseup: widget.listener,
			ontouchend: widget.listener,
			ontouchmove: widget.listener,
			ontouchstart: widget.listener,
			classes: widget.classes(css.root)
		}, [
			v('div', {
				afterCreate: widget.listener,
				afterUpdate: widget.listener,
				classes: widget.classes(css.underlay, css.underlayVisible),
				enterAnimation: animations.fadeIn,
				exitAnimation: animations.fadeOut,
				key: 'underlay'
			}),
			v('div', {
				key: 'content',
				afterCreate: widget.listener,
				afterUpdate: widget.listener,
				classes: widget.classes(css.content, css.left, css.open, css.slideIn),
				styles: {
					width: '256px'
				}
			}, [ GREEKING ])
		]));
	},

	'Render correct children'() {
		widget.setProperties({
			key: 'foo',
			underlay: false
		});

		widget.expectRender(v('div', {
			onmousedown: widget.listener,
			onmousemove: widget.listener,
			onmouseup: widget.listener,
			ontouchend: widget.listener,
			ontouchmove: widget.listener,
			ontouchstart: widget.listener,
			classes: widget.classes(css.root)
		}, [
			null,
			v('div', {
				key: 'content',
				afterCreate: widget.listener,
				afterUpdate: widget.listener,
				classes: widget.classes(css.content, css.left),
				styles: {
					width: '256px'
				}
			}, [])
		]));
	},

	onOpen() {
		let called = false;

		widget.setProperties({
			open: true,
			onOpen() {
				called = true;
			}
		});

		widget.getRender();

		assert.isTrue(called, 'onOpen should be called');
	},

	'change property to close'() {
		widget.setProperties({
			open: true
		});

		widget.expectRender(v('div', {
			onmousedown: widget.listener,
			onmousemove: widget.listener,
			onmouseup: widget.listener,
			ontouchend: widget.listener,
			ontouchmove: widget.listener,
			ontouchstart: widget.listener,
			classes: widget.classes(css.root)
		}, [
			v('div', {
				afterCreate: widget.listener,
				afterUpdate: widget.listener,
				classes: widget.classes(css.underlay),
				enterAnimation: animations.fadeIn,
				exitAnimation: animations.fadeOut,
				key: 'underlay'
			}),
			v('div', {
				key: 'content',
				afterCreate: widget.listener,
				afterUpdate: widget.listener,
				classes: widget.classes(css.content, css.left, css.open, css.slideIn),
				styles: {
					width: '256px'
				}
			}, [])
		]));

		widget.setProperties({
			open: false
		});

		widget.expectRender(v('div', {
			onmousedown: widget.listener,
			onmousemove: widget.listener,
			onmouseup: widget.listener,
			ontouchend: widget.listener,
			ontouchmove: widget.listener,
			ontouchstart: widget.listener,
			classes: widget.classes(css.root)
		}, [
			null,
			v('div', {
				key: 'content',
				afterCreate: widget.listener,
				afterUpdate: widget.listener,
				classes: widget.classes(css.content, css.left, css.slideOut),
				styles: {
					width: '256px'
				}
			}, [])
		]));
	},

	'click underlay to close'() {
		let called = false;

		widget.setProperties({
			open: true,
			onRequestClose() {
				called = true;
			}
		});

		widget.sendEvent('mousedown', {
			eventInit: <MouseEventInit> {
				pageX: 300
			},
			selector: ':first-child' /* this should be the underlay */
		});

		widget.sendEvent('mouseup', {
			eventInit: <MouseEventInit> {
				pageX: 300
			},
			selector: ':first-child' /* this should be the underlay */
		});

		assert.isTrue(called, 'onRequestClose should have been called');
	},

	'tap underlay to close'(this: any) {
		if (!hasTouch) {
			this.skip('Environment not support touch events');
		}

		let called = false;

		widget.setProperties({
			open: true,
			onRequestClose() {
				called = true;
			}
		});

		widget.sendEvent('touchstart', {
			eventInit: <MouseEventInit> {
				changedTouches: [ { screenX: 300 } ]
			},
			selector: ':first-child' /* this should be the underlay */
		});

		widget.sendEvent('touchend', {
			eventInit: <MouseEventInit> {
				changedTouches: [ { screenX: 300 } ]
			},

			selector: ':first-child' /* this should be the underlay */
		});

		assert.isTrue(called, 'onRequestClose should be called on underlay tap');
	},

	'drag to close'() {
		let called = false;

		widget.setProperties({
			open: true,
			onRequestClose() {
				called = true;
			}
		});

		widget.sendEvent('mousedown', {
			eventInit: <MouseEventInit> {
				pageX: 300
			}
		});

		widget.sendEvent('mousemove', {
			eventInit: <MouseEventInit> {
				pageX: 150
			}
		});

		widget.sendEvent('mouseup', {
			eventInit: <MouseEventInit> {
				pageX: 50
			}
		});

		assert.isTrue(called, 'onRequestClose should be called if dragged far enough');
	},

	'swipe to close'(this: any) {
		if (!hasTouch) {
			this.skip('Environment not support touch events');
		}

		let called = false;

		widget.setProperties({
			open: true,
			onRequestClose() {
				called = true;
			}
		});

		widget.sendEvent('touchmove', {
			eventInit: <MouseEventInit> {
				changedTouches: [ { screenX: 150 } ]
			}
		});

		widget.sendEvent('touchstart', {
			eventInit: <MouseEventInit> {
				changedTouches: [ { screenX: 300 } ]
			}
		});

		widget.sendEvent('touchmove', {
			eventInit: <MouseEventInit> {
				changedTouches: [ { screenX: 150 } ]
			}
		});

		widget.sendEvent('touchend', {
			eventInit: <MouseEventInit> {
				changedTouches: [ { screenX: 50 } ]
			}
		});

		assert.isTrue(called, 'onRequestClose should be called if swiped far enough');
	},

	'swipe to close right'(this: any) {
		if (!hasTouch) {
			this.skip('Environment not support touch events');
		}

		let called = false;

		widget.setProperties({
			align: Align.right,
			open: true,
			width: 256,

			onRequestClose() {
				called = true;
			}
		});

		widget.sendEvent('touchstart', {
			eventInit: <MouseEventInit> {
				changedTouches: [ { screenX: 300 } ]
			}
		});

		widget.sendEvent('touchmove', {
			eventInit: <MouseEventInit> {
				changedTouches: [ { screenX: 400 } ]
			}
		});

		widget.sendEvent('touchend', {
			eventInit: <MouseEventInit> {
				changedTouches: [ { screenX: 500 } ]
			}
		});

		assert.isTrue(called, 'onRequestClose should be called if swiped far enough to close right');
	},

	'not dragged far enough to close'() {
		let called = false;

		widget.setProperties({
			open: true,

			onRequestClose() {
				called = true;
			}
		});

		widget.sendEvent('mousedown', {
			eventInit: <MouseEventInit> {
				pageX: 300
			}
		});

		widget.sendEvent('mousemove', {
			eventInit: <MouseEventInit> {
				pageX: 250
			}
		});

		widget.sendEvent('mouseup', {
			eventInit: <MouseEventInit> {
				pageX: 250
			}
		});

		assert.isFalse(called, 'onRequestClose should not be called if not swiped far enough to close');
	},

	'pane cannot be moved past screen edge'() {
		widget.setProperties({
			open: true
		});

		widget.setChildren([ GREEKING ]);

		widget.sendEvent('mousedown', {
			eventInit: <MouseEventInit> {
				pageX: 300
			},

			selector: ':last-child :first-child' /* this should be the content */
		});

		widget.sendEvent('mousemove', {
			eventInit: <MouseEventInit> {
				pageX: 400
			},

			selector: ':last-child :first-child' /* this should be the content */
		});

		assert(!((<HTMLElement> widget.getDom().lastChild).style.transform));

		widget.sendEvent('mouseup', {
			eventInit: <MouseEventInit> {
				pageX: 500
			},

			selector: ':last-child :first-child' /* this should be the content */
		});

		assert(!((<HTMLElement> widget.getDom().lastChild).style.transform));
	},

	'classes and transform removed after transition'() {
		widget.setProperties({
			open: true
		});

		const content = <HTMLElement> widget.getDom().lastChild;

		assert.isTrue(content.classList.contains(css.slideIn), 'should have css.slideIn');
		content.classList.add(css.slideOut);
		assert.isTrue(content.classList.contains(css.slideOut), 'should have css.slideOut');
		content.style.transform = 'translateX(1%)';

		widget.sendEvent('transitionend', {
			selector: ':last-child'
		});

		assert.isFalse(content.classList.contains(css.slideIn), 'should not have css.slideIn');
		assert.isFalse(content.classList.contains(css.slideOut), 'should not have css.slideOut');
		assert.strictEqual(content.style.transform, '', 'transform should be removed');
	},

	'last transform is applied on next render if being swiped closed'() {
		widget.setProperties({
			open: true
		});

		widget.setChildren([ GREEKING ]);

		const expected = v('div', {
			onmousedown: widget.listener,
			onmousemove: widget.listener,
			onmouseup: widget.listener,
			ontouchend: widget.listener,
			ontouchmove: widget.listener,
			ontouchstart: widget.listener,
			classes: widget.classes(css.root)
		}, [
			v('div', {
				afterCreate: widget.listener,
				afterUpdate: widget.listener,
				classes: widget.classes(css.underlay),
				enterAnimation: animations.fadeIn,
				exitAnimation: animations.fadeOut,
				key: 'underlay'
			}),
			v('div', {
				key: 'content',
				afterCreate: widget.listener,
				afterUpdate: widget.listener,
				classes: widget.classes(css.content, css.left, css.open, css.slideIn),
				styles: {
					width: '256px'
				}
			}, [ GREEKING ])
		]);

		widget.expectRender(expected);

		widget.setProperties({
			open: false
		});

		widget.sendEvent('mousedown', {
			eventInit: <MouseEventInit> {
				pageX: 300
			},
			selector: ':last-child'
		});

		widget.sendEvent('mousemove', {
			eventInit: <MouseEventInit> {
				pageX: 150
			},
			selector: ':last-child'
		});

		widget.sendEvent('mouseup', {
			eventInit: <MouseEventInit> {
				pageX: 50
			},
			selector: ':last-child'
		});

		replaceChild(expected, 0, null);
		assignChildProperties(expected, 1, {
			classes: widget.classes(css.content, css.left, css.slideOut),
			styles: {
				transform: 'translateX(-97.65625%)',
				width: '256px'
			}
		});
		assignProperties(expected, { classes: widget.classes(css.root) });
		widget.expectRender(expected);
	},

	'last transform is applied on next render if being swiped closed right'() {
		widget.setProperties({
			align: Align.right,
			open: true
		});

		widget.setChildren([ GREEKING ]);

		const expected = v('div', {
			onmousedown: widget.listener,
			onmousemove: widget.listener,
			onmouseup: widget.listener,
			ontouchend: widget.listener,
			ontouchmove: widget.listener,
			ontouchstart: widget.listener,
			classes: widget.classes(css.root)
		}, [
			v('div', {
				afterCreate: widget.listener,
				afterUpdate: widget.listener,
				classes: widget.classes(css.underlay),
				enterAnimation: animations.fadeIn,
				exitAnimation: animations.fadeOut,
				key: 'underlay'
			}),
			v('div', {
				key: 'content',
				afterCreate: widget.listener,
				afterUpdate: widget.listener,
				classes: widget.classes(css.content, css.right, css.open, css.slideIn),
				styles: {
					width: '256px'
				}
			}, [ GREEKING ])
		]);

		widget.expectRender(expected);

		widget.setProperties({
			align: Align.right,
			open: false
		});

		widget.sendEvent('mousedown', {
			eventInit: <MouseEventInit> {
				pageX: 300
			},
			selector: ':last-child'
		});

		widget.sendEvent('mousemove', {
			eventInit: <MouseEventInit> {
				pageX: 400
			},
			selector: ':last-child'
		});

		widget.sendEvent('mouseup', {
			eventInit: <MouseEventInit> {
				pageX: 500
			},
			selector: ':last-child'
		});

		replaceChild(expected, 0, null);
		assignChildProperties(expected, 1, {
			classes: widget.classes(css.content, css.right, css.slideOut),
			styles: {
				transform: 'translateX(78.125%)',
				width: '256px'
			}
		});
		assignProperties(expected, { classes: widget.classes(css.root) });
		widget.expectRender(expected);
	}
});
