const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import { compareProperty } from '@dojo/test-extras/support/d';
import { v } from '@dojo/widget-core/d';
import harness, { Harness } from '@dojo/test-extras/harness';
import has from '@dojo/has/has';

import SlidePane, { Align, SlidePaneProperties } from '../../SlidePane';
import * as css from '../../styles/slidePane.m.css';
import * as animations from '../../../common/styles/animations.m.css';

const compareId = compareProperty((value: any) => {
	return typeof value === 'string';
});

let widget: Harness<SlidePaneProperties, typeof SlidePane>;

const GREEKING = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
	Quisque id purus ipsum. Aenean ac purus purus.
	Nam sollicitudin varius augue, sed lacinia felis tempor in.`;

registerSuite('SlidePane', {

	beforeEach() {
		widget = harness(SlidePane);
	},

	afterEach() {
		widget.destroy();
	},

	tests: {
		'Should construct SlidePane with passed properties'() {
			widget.setProperties({
				key: 'foo',
				align: Align.left,
				open: true,
				underlay: true
			});

			widget.setChildren([ GREEKING ]);

			widget.expectRender(v('div', {
				'aria-labelledby': compareId,
				classes: widget.classes(css.root),
				onmousedown: widget.listener,
				onmousemove: widget.listener,
				onmouseup: widget.listener,
				ontouchend: widget.listener,
				ontouchmove: widget.listener,
				ontouchstart: widget.listener
			}, [
				v('div', {
					classes: widget.classes(css.underlay, css.underlayVisible),
					enterAnimation: animations.fadeIn,
					exitAnimation: animations.fadeOut,
					key: 'underlay'
				}),
				v('div', {
					key: 'content',
					classes: widget.classes(
						css.pane,
						css.paneFixed,
						css.left,
						css.leftFixed,
						css.open,
						css.openFixed,
						css.slideIn,
						css.slideInFixed
					),
					styles: {
						transform: '',
						width: '320px',
						height: null
					}
				}, [
					null,
					v('div', {
						classes: widget.classes(css.content)
					}, [ GREEKING ])
				])
			]));
		},

		'Render correct children'() {
			widget.setProperties({
				key: 'foo',
				underlay: false
			});

			widget.expectRender(v('div', {
				'aria-labelledby': compareId,
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
					classes: widget.classes(
						css.pane,
						css.paneFixed,
						css.left,
						css.leftFixed
					),
					styles: {
						transform: '',
						width: '320px',
						height: null
					}
				}, [
					null,
					v('div', {
						classes: widget.classes(css.content)
					}, [])
				])
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
				'aria-labelledby': compareId,
				onmousedown: widget.listener,
				onmousemove: widget.listener,
				onmouseup: widget.listener,
				ontouchend: widget.listener,
				ontouchmove: widget.listener,
				ontouchstart: widget.listener,
				classes: widget.classes(css.root)
			}, [
				v('div', {
					classes: widget.classes(css.underlay),
					enterAnimation: animations.fadeIn,
					exitAnimation: animations.fadeOut,
					key: 'underlay'
				}),
				v('div', {
					key: 'content',
					classes: widget.classes(
						css.pane,
						css.paneFixed,
						css.left,
						css.leftFixed,
						css.open,
						css.openFixed,
						css.slideIn,
						css.slideInFixed
					),
					styles: {
						transform: '',
						width: '320px',
						height: null
					}
				}, [
					null,
					v('div', {
						classes: widget.classes(css.content)
					}, [])
				])
			]));

			widget.setProperties({
				open: false
			});

			widget.expectRender(v('div', {
				'aria-labelledby': compareId,
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
					classes: widget.classes(
						css.pane,
						css.paneFixed,
						css.left,
						css.leftFixed,
						css.slideOut,
						css.slideOutFixed
					),
					styles: {
						transform: '',
						width: '320px',
						height: null
					}
				}, [
					null,
					v('div', {
						classes: widget.classes(css.content)
					}, [])
				])
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

		'click close button to close'() {
			let called = false;

			widget.setProperties({
				open: true,
				title: 'foo',
				closeText: 'close',
				onRequestClose() {
					called = true;
				}
			});

			widget.getRender();

			widget.sendEvent('click', {
				selector: `.${css.close}`
			});

			assert.isTrue(called, 'onRequestClose should have been called');
		},

		'tap underlay to close'() {
			if (!has('touch')) {
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

		'swipe to close'() {
			if (!has('touch')) {
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

		'swipe to close top'() {
			if (!has('touch')) {
				this.skip('Environment not support touch events');
			}

			let called = false;

			widget.setProperties({
				open: true,
				align: Align.top,
				onRequestClose() {
					called = true;
				}
			});

			widget.sendEvent('touchmove', {
				eventInit: <MouseEventInit> {
					changedTouches: [ { screenY: 150 } ]
				}
			});

			widget.sendEvent('touchstart', {
				eventInit: <MouseEventInit> {
					changedTouches: [ { screenY: 300 } ]
				}
			});

			widget.sendEvent('touchmove', {
				eventInit: <MouseEventInit> {
					changedTouches: [ { screenY: 150 } ]
				}
			});

			widget.sendEvent('touchend', {
				eventInit: <MouseEventInit> {
					changedTouches: [ { screenY: 50 } ]
				}
			});

			assert.isTrue(called, 'onRequestClose should be called if swiped far enough up');
		},

		'swipe to close right'() {
			if (!has('touch')) {
				this.skip('Environment not support touch events');
			}

			let called = false;

			widget.setProperties({
				align: Align.right,
				open: true,
				width: 320,

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

		'swipe to close bottom'() {
			if (!has('touch')) {
				this.skip('Environment not support touch events');
			}

			let called = false;

			widget.setProperties({
				align: Align.bottom,
				open: true,
				width: 320,

				onRequestClose() {
					called = true;
				}
			});

			widget.sendEvent('touchstart', {
				eventInit: <MouseEventInit> {
					changedTouches: [ { screenY: 300 } ]
				}
			});

			widget.sendEvent('touchmove', {
				eventInit: <MouseEventInit> {
					changedTouches: [ { screenY: 400 } ]
				}
			});

			widget.sendEvent('touchend', {
				eventInit: <MouseEventInit> {
					changedTouches: [ { screenY: 500 } ]
				}
			});

			assert.isTrue(called, 'onRequestClose should be called if swiped far enough to close bottom');
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

		'classes removed after transition'() {
			function expected(open: boolean, transitionDone?: boolean) {
				return v('div', {
					'aria-labelledby': compareId,
					onmousedown: widget.listener,
					onmousemove: widget.listener,
					onmouseup: widget.listener,
					ontouchend: widget.listener,
					ontouchmove: widget.listener,
					ontouchstart: widget.listener,
					classes: widget.classes(css.root)
				}, [
					open ? v('div', {
						classes: widget.classes(css.underlay),
						enterAnimation: animations.fadeIn,
						exitAnimation: animations.fadeOut,
						key: 'underlay'
					}) : null,
					v('div', {
						key: 'content',
						classes: widget.classes(
							css.pane,
							css.paneFixed,
							css.left,
							css.leftFixed,
							open ? css.open : null,
							open ? css.openFixed : null,
							transitionDone ? null : (open ? css.slideIn : css.slideOut),
							transitionDone ? null : (open ? css.slideInFixed : css.slideOutFixed)
						),
						styles: {
							transform: '',
							width: '320px',
							height: null
						}
					}, [
						null,
						v('div', {
							classes: widget.classes(css.content)
						}, [ GREEKING ])
					])
				]);
			}

			widget.setProperties({ open: true });
			widget.setChildren([ GREEKING ]);
			widget.expectRender(expected(true, false));
			widget.sendEvent('transitionend', { selector: ':last-child' });
			widget.expectRender(expected(true, true), '`css.slideIn` should be removed when the animation ends.');
			widget.setProperties({ open: false });
			widget.expectRender(expected(false, false));

			widget.sendEvent('transitionend', {
				selector: ':last-child'
			});

			widget.expectRender(expected(false, true), '`css.slideOut` should be removed when the animation ends.');
		},

		'last transform is applied on next render if being swiped closed'() {
			widget.setProperties({
				open: true
			});

			widget.setChildren([ GREEKING ]);

			function expected(closed: boolean, swipeState: any = {}) {
				return v('div', {
					'aria-labelledby': compareId,
					onmousedown: widget.listener,
					onmousemove: widget.listener,
					onmouseup: widget.listener,
					ontouchend: widget.listener,
					ontouchmove: widget.listener,
					ontouchstart: widget.listener,
					classes: widget.classes(css.root)
				}, [
					closed ? null : v('div', {
						classes: widget.classes(css.underlay),
						enterAnimation: animations.fadeIn,
						exitAnimation: animations.fadeOut,
						key: 'underlay'
					}),
					v('div', {
						key: 'content',
						classes: swipeState.classes || widget.classes(
							css.pane,
							css.paneFixed,
							css.left,
							css.leftFixed,
							css.open,
							css.openFixed,
							css.slideIn,
							css.slideInFixed
						),
						styles: swipeState.styles || {
							transform: '',
							width: '320px',
							height: null
						}
					}, [
						null,
						v('div', {
							classes: widget.classes(css.content)
						}, [ GREEKING ])
					])
				]);
			}

			widget.expectRender(expected(false));

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

			widget.expectRender(expected(true, {
				classes: widget.classes(
					css.pane,
					css.paneFixed,
					css.left,
					css.leftFixed,
					css.slideOut,
					css.slideOutFixed
				),
				styles: {
					transform: 'translateX(-78.125%)',
					width: '320px',
					height: null
				}
			}));
		},

		'last transform is applied on next render if being swiped closed right'() {
			widget.setProperties({
				align: Align.right,
				open: true
			});

			widget.setChildren([ GREEKING ]);

			function expected(closed: boolean, swipeState: any = {}) {
				return v('div', {
					'aria-labelledby': compareId,
					onmousedown: widget.listener,
					onmousemove: widget.listener,
					onmouseup: widget.listener,
					ontouchend: widget.listener,
					ontouchmove: widget.listener,
					ontouchstart: widget.listener,
					classes: widget.classes(css.root)
				}, [
					closed ? null : v('div', {
						classes: widget.classes(css.underlay),
						enterAnimation: animations.fadeIn,
						exitAnimation: animations.fadeOut,
						key: 'underlay'
					}),
					v('div', {
						key: 'content',
						classes: swipeState.classes || widget.classes(
							css.pane,
							css.paneFixed,
							css.right,
							css.rightFixed,
							css.open,
							css.openFixed,
							css.slideIn,
							css.slideInFixed
						),
						styles: swipeState.styles || {
							transform: '',
							width: '320px',
							height: null
						}
					}, [
						null,
						v('div', {
							classes: widget.classes(css.content)
						}, [ GREEKING ])
					])
				]);
			}

			widget.expectRender(expected(false));

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

			widget.expectRender(expected(true, {
				classes: widget.classes(
					css.pane,
					css.paneFixed,
					css.right,
					css.rightFixed,
					css.slideOut,
					css.slideOutFixed
				),
				styles: {
					transform: 'translateX(62.5%)',
					width: '320px',
					height: null
				}
			}));
		}
	}
});
