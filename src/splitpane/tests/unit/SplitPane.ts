import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';

import has from '@dojo/has/has';
import harness, { Harness } from '@dojo/test-extras/harness';
import { v } from '@dojo/widget-core/d';

import SplitPane, { Direction, SplitPaneProperties } from '../../SplitPane';
import * as css from '../../styles/splitPane.m.css';

const hasTouch = (function (): boolean {
	/* Since jsdom will fake it anyways, no problem pretending we can do touch in NodeJS */
	return Boolean('ontouchstart' in window || has('host-node'));
})();

let widget: Harness<SplitPaneProperties, typeof SplitPane>;

registerSuite({
	name: 'SplitPane',

	beforeEach() {
		widget = harness(SplitPane);
	},

	afterEach() {
		widget.destroy();
	},

	'Should construct SplitPane with passed properties'() {
		widget.expectRender(v('div', {
			afterCreate: widget.listener,
			afterUpdate: widget.listener,
			classes: widget.classes(css.root, css.row),
			key: 'root'
		}, [
			v('div', {
				afterCreate: widget.listener,
				afterUpdate: widget.listener,
				classes: widget.classes(css.leading),
				key: 'leading',
				styles: { width: '100px' }
			}, [ null ]),
			v('div', {
				afterCreate: widget.listener,
				afterUpdate: widget.listener,
				classes: widget.classes(css.divider),
				key: 'divider',
				onmousedown: widget.listener,
				ontouchend: widget.listener,
				ontouchstart: widget.listener
			}),
			v('div', {
				afterCreate: widget.listener,
				afterUpdate: widget.listener,
				classes: widget.classes(css.trailing),
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

		widget.expectRender(v('div', {
			afterCreate: widget.listener,
			afterUpdate: widget.listener,
			classes: widget.classes(css.root, css.column),
			key: 'root'
		}, [
			v('div', {
				afterCreate: widget.listener,
				afterUpdate: widget.listener,
				classes: widget.classes(css.leading),
				key: 'leading',
				styles: { height: '200px' }
			}, [ 'abc' ]),
			v('div', {
				afterCreate: widget.listener,
				afterUpdate: widget.listener,
				classes: widget.classes(css.divider),
				key: 'divider',
				onmousedown: widget.listener,
				ontouchend: widget.listener,
				ontouchstart: widget.listener
			}),
			v('div', {
				afterCreate: widget.listener,
				afterUpdate: widget.listener,
				classes: widget.classes(css.trailing),
				key: 'trailing'
			}, [ 'def' ])
		]));
	},

	'Pane should not be a negative size'() {
		let setSize;

		widget.setProperties({
			onResize: size => setSize = size
		});

		widget.sendEvent('mousedown', {
			eventInit: <MouseEventInit> {
				clientX: 500
			},
			selector: ':nth-child(2)' /* this should be the divider */
		});
		widget.sendEvent('mousemove', {
			eventInit: <MouseEventInit> {
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
			onResize: size => setSize = size
		});

		widget.sendEvent('mousedown', {
			eventInit: <MouseEventInit> {
				clientX: 0
			},
			selector: ':nth-child(2)' /* this should be the divider */
		});
		widget.sendEvent('mousemove', {
			eventInit: <MouseEventInit> {
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
			onResize: () => called = true
		});

		widget.sendEvent('mousedown', {
			eventInit: <MouseEventInit> {
				clientX: 110
			},
			selector: ':nth-child(2)' /* this should be the divider */
		});
		widget.sendEvent('mousemove', {
			eventInit: <MouseEventInit> {
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
			onResize: () => called = true,
			direction: Direction.column
		});

		widget.sendEvent('mousedown', {
			eventInit: <MouseEventInit> {
				clientY: 110
			},
			selector: ':nth-child(2)' /* this should be the divider */
		});
		widget.sendEvent('mousemove', {
			eventInit: <MouseEventInit> {
				clientY: 150
			},
			selector: ':nth-child(2)' /* this should be the divider */
		});
		widget.sendEvent('mouseup', {
			selector: ':nth-child(2)' /* this should be the divider */
		});

		assert.isTrue(called);
	},

	'Touch move should call onResize for row'(this: any) {
		if (!hasTouch) {
			this.skip('Environment not support touch events');
		}

		let called = false;

		widget.setProperties({
			onResize: () => called = true,
			direction: Direction.row,
			size: 100
		});

		widget.sendEvent('touchstart', {
			eventInit: <MouseEventInit> {
				changedTouches: [{ clientX: 110 }]
			},
			selector: ':nth-child(2)' /* this should be the divider */
		});
		widget.sendEvent('touchmove', {
			eventInit: <MouseEventInit> {
				changedTouches: [{ clientX: 150 }]
			},
			selector: ':nth-child(2)' /* this should be the divider */
		});
		widget.sendEvent('touchend', {
			selector: ':nth-child(2)' /* this should be the divider */
		});

		assert.isTrue(called);
	},

	'Touch move should call onResize for column'(this: any) {
		if (!hasTouch) {
			this.skip('Environment not support touch events');
		}

		let called = 0;

		widget.setProperties({
			onResize: () => called++,
			direction: Direction.column
		});

		widget.sendEvent('touchstart', {
			eventInit: <MouseEventInit> {
				changedTouches: [{ clientY: 110 }]
			},
			selector: ':nth-child(2)' /* this should be the divider */
		});
		widget.sendEvent('touchmove', {
			eventInit: <MouseEventInit> {
				changedTouches: [{ clientY: 150 }]
			},
			selector: ':nth-child(2)' /* this should be the divider */
		});
		widget.sendEvent('touchend', {
			selector: ':nth-child(2)' /* this should be the divider */
		});
		widget.sendEvent('touchstart', {
			eventInit: <MouseEventInit> {
				changedTouches: [{ clientY: 150 }]
			},
			selector: ':nth-child(2)' /* this should be the divider */
		});
		widget.sendEvent('touchmove', {
			eventInit: <MouseEventInit> {
				changedTouches: [{ clientY: 110 }]
			},
			selector: ':nth-child(2)' /* this should be the divider */
		});
		widget.sendEvent('touchend', {
			selector: ':nth-child(2)' /* this should be the divider */
		});

		assert.strictEqual(called, 2);
	},

	'onResieze should be called'() {
		let called = 0;
		const splitPane = new SplitPane();

		splitPane.setProperties({ onResize: () => called++ });

		(<any> splitPane)._root = { offsetWidth: 50, offsetHeight: 50 };
		(<any> splitPane)._onResize();

		splitPane.setProperties({
			direction: Direction.column,
			size: 25
		});

		(<any> splitPane)._onResize();

		assert.strictEqual(called, 1);
	}
});
