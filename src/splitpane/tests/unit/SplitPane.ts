const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import { v } from '@dojo/widget-core/d';
import harness, { Harness } from '@dojo/test-extras/harness';
import has from '@dojo/has/has';

import * as css from '../../styles/splitPane.m.css';
import SplitPane, { Direction } from '../../SplitPane';

let widget: Harness<SplitPane>;

registerSuite('SplitPane', {
	beforeEach() {
		widget = harness(SplitPane);
		window.getSelection =
			window.getSelection ||
			(() => ({
				removeAllRanges() {}
			}));
	},

	afterEach() {
		widget.destroy();
	},

	tests: {
		'Should construct SplitPane with passed properties'() {
			// prettier-ignore
			widget.expectRender(v('div', {
				classes: [ css.root, css.row, css.rootFixed, css.rowFixed ],
				key: 'root'
			}, [
				v('div', {
					classes: [ css.leading, css.leadingFixed ],
					key: 'leading',
					styles: { width: '100px' }
				}, [ null ]),
				v('div', {
					classes: [ css.divider, css.dividerFixed ],
					key: 'divider',
					onmousedown: widget.listener,
					ontouchend: widget.listener,
					ontouchstart: widget.listener
				}),
				v('div', {
					classes: [ css.trailing, css.trailingFixed ],
					key: 'trailing'
				}, [ null ])
			]));
		},

		'Should construct SplitPane with default properties'() {
			widget.setProperties({
				direction: Direction.column,
				leading: 'abc',
				onResize: widget.listener,
				size: 200,
				trailing: 'def'
			});

			// prettier-ignore
			widget.expectRender(v('div', {
				classes: [ css.root, css.column, css.rootFixed, css.columnFixed ],
				key: 'root'
			}, [
				v('div', {
					classes: [ css.leading, css.leadingFixed ],
					key: 'leading',
					styles: { height: '200px' }
				}, [ 'abc' ]),
				v('div', {
					classes: [ css.divider, css.dividerFixed ],
					key: 'divider',
					onmousedown: widget.listener,
					ontouchend: widget.listener,
					ontouchstart: widget.listener
				}),
				v('div', {
					classes: [ css.trailing, css.trailingFixed ],
					key: 'trailing'
				}, [ 'def' ])
			]));
		},

		'Pane should not be a negative size'() {
			let setSize;

			widget.setProperties({
				onResize: (size) => (setSize = size)
			});

			widget.sendEvent('mousemove', {
				eventInit: <MouseEventInit>{
					clientX: 0
				},
				selector: ':nth-child(2)' /* this should be the divider */
			});
			widget.sendEvent('mousedown', {
				eventInit: <MouseEventInit>{
					clientX: 500
				},
				selector: ':nth-child(2)' /* this should be the divider */
			});
			widget.sendEvent('mousemove', {
				eventInit: <MouseEventInit>{
					clientX: 0
				},
				selector: ':nth-child(2)' /* this should be the divider */
			});
			widget.sendEvent('mouseup', {
				selector: ':nth-child(2)' /* this should be the divider */
			});

			assert.strictEqual(setSize, 0);
		},

		'Pane should not be greater than root widget'() {
			let setSize;

			widget.setProperties({
				onResize: (size) => (setSize = size)
			});

			widget.sendEvent('mousedown', {
				eventInit: <MouseEventInit>{
					clientX: 0
				},
				selector: ':nth-child(2)' /* this should be the divider */
			});
			widget.sendEvent('mousemove', {
				eventInit: <MouseEventInit>{
					clientX: 500
				},
				selector: ':nth-child(2)' /* this should be the divider */
			});
			widget.sendEvent('mouseup', {
				selector: ':nth-child(2)' /* this should be the divider */
			});

			assert.strictEqual(setSize, 0);
		},

		'Mouse move should call onResize for row'() {
			let called = false;

			widget.setProperties({
				onResize: () => (called = true)
			});

			widget.sendEvent('mousedown', {
				eventInit: <MouseEventInit>{
					clientX: 110
				},
				selector: ':nth-child(2)' /* this should be the divider */
			});
			widget.sendEvent('mousemove', {
				eventInit: <MouseEventInit>{
					clientX: 150
				},
				selector: ':nth-child(2)' /* this should be the divider */
			});
			widget.sendEvent('mouseup', {
				selector: ':nth-child(2)' /* this should be the divider */
			});

			assert.isTrue(called);
		},

		'Mouse move should call onResize for column'() {
			let called = false;

			widget.setProperties({
				onResize: () => (called = true),
				direction: Direction.column
			});

			widget.sendEvent('mousedown', {
				eventInit: <MouseEventInit>{
					clientY: 110
				},
				selector: ':nth-child(2)' /* this should be the divider */
			});
			widget.sendEvent('mousemove', {
				eventInit: <MouseEventInit>{
					clientY: 150
				},
				selector: ':nth-child(2)' /* this should be the divider */
			});
			widget.sendEvent('mouseup', {
				selector: ':nth-child(2)' /* this should be the divider */
			});

			assert.isTrue(called);
		},

		'Touch move should call onResize for row'() {
			if (!has('touch')) {
				this.skip('Environment not support touch events');
			}

			let called = false;

			widget.setProperties({
				onResize: () => (called = true),
				direction: Direction.row,
				size: 100
			});

			widget.sendEvent('touchstart', {
				eventInit: <MouseEventInit>{
					changedTouches: [{ clientX: 110 }]
				},
				selector: ':nth-child(2)' /* this should be the divider */
			});
			widget.sendEvent('touchmove', {
				eventInit: <MouseEventInit>{
					changedTouches: [{ clientX: 150 }]
				},
				selector: ':nth-child(2)' /* this should be the divider */
			});
			widget.sendEvent('touchmove', {
				eventInit: <MouseEventInit>{
					changedTouches: [{ clientX: 150 }]
				},
				selector: ':nth-child(2)' /* this should be the divider */
			});
			widget.sendEvent('touchend', {
				selector: ':nth-child(2)' /* this should be the divider */
			});

			assert.isTrue(called);
		},

		'Touch move should call onResize for column'() {
			if (!has('touch')) {
				this.skip('Environment not support touch events');
			}

			let called = 0;

			widget.setProperties({
				onResize: () => called++,
				direction: Direction.column
			});

			widget.sendEvent('touchstart', {
				eventInit: <MouseEventInit>{
					changedTouches: [{ clientY: 110 }]
				},
				selector: ':nth-child(2)' /* this should be the divider */
			});
			widget.sendEvent('touchmove', {
				eventInit: <MouseEventInit>{
					changedTouches: [{ clientY: 150 }]
				},
				selector: ':nth-child(2)' /* this should be the divider */
			});
			widget.sendEvent('touchend', {
				selector: ':nth-child(2)' /* this should be the divider */
			});
			widget.sendEvent('touchstart', {
				eventInit: <MouseEventInit>{
					changedTouches: [{ clientY: 150 }]
				},
				selector: ':nth-child(2)' /* this should be the divider */
			});
			widget.sendEvent('touchmove', {
				eventInit: <MouseEventInit>{
					changedTouches: [{ clientY: 110 }]
				},
				selector: ':nth-child(2)' /* this should be the divider */
			});
			widget.sendEvent('touchend', {
				selector: ':nth-child(2)' /* this should be the divider */
			});

			assert.strictEqual(called, 2);
		}
	}
});
