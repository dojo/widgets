const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import { stub } from 'sinon';

import { v, w, isWNode } from '@dojo/widget-core/d';
import harness from '@dojo/test-extras/harness';

import * as css from '../../../theme/split-pane.m.css';
import * as fixedCss from '../../styles/split-pane.m.css';
import SplitPane, { Direction } from '../../index';
import { GlobalEvent } from '../../../global-event/index';
import { Dimensions } from '@dojo/widget-core/meta/Dimensions';
import { noop, MockMetaMixin, stubEvent } from '../../../common/tests/support/test-helpers';

function createVNodeSelector(type: 'window' | 'document', name: string) {
	return (node: any) => {
		if (isWNode<GlobalEvent>(node) && node.properties[type] !== undefined) {
			const globalFuncs = node.properties[type];
			return globalFuncs ? globalFuncs[name] : undefined;
		}
	};
}

registerSuite('SplitPane', {

	tests: {
		'Should construct SplitPane with passed properties'() {
			const h = harness(() => w(SplitPane, {}));
			h.expect(() => v('div', {
				classes: [ css.root, css.row, fixedCss.rootFixed, fixedCss.rowFixed ],
				key: 'root'
			}, [
				w(GlobalEvent, {
					key: 'global',
					window: {
						mouseup: noop,
						mousemove: noop,
						touchmove: noop
					}
				}),
				v('div', {
					classes: [ css.leading, fixedCss.leadingFixed ],
					key: 'leading',
					styles: { width: '100px' }
				}, [ null ]),
				v('div', {
					classes: [ css.divider, fixedCss.dividerFixed ],
					key: 'divider',
					onmousedown: noop,
					ontouchend: noop,
					ontouchstart: noop
				}),
				v('div', {
					classes: [ css.trailing, fixedCss.trailingFixed ],
					key: 'trailing'
				}, [ null ])
			]));
		},

		'Should construct SplitPane with default properties'() {
			const h = harness(() => w(SplitPane, {
				direction: Direction.column,
				leading: 'abc',
				onResize: noop,
				size: 200,
				trailing: 'def'
			}));

			h.expect(() => v('div', {
				classes: [ css.root, css.column, fixedCss.rootFixed, fixedCss.columnFixed ],
				key: 'root'
			}, [
				w(GlobalEvent, {
					key: 'global',
					window: {
						mouseup: noop,
						mousemove: noop,
						touchmove: noop
					}
				}),
				v('div', {
					classes: [ css.leading, fixedCss.leadingFixed ],
					key: 'leading',
					styles: { height: '200px' }
				}, [ 'abc' ]),
				v('div', {
					classes: [ css.divider, fixedCss.dividerFixed ],
					key: 'divider',
					onmousedown: noop,
					ontouchend: noop,
					ontouchstart: noop
				}),
				v('div', {
					classes: [ css.trailing, fixedCss.trailingFixed ],
					key: 'trailing'
				}, [ 'def' ])
			]));
		},

		'Pane should not be a negative size'() {
			let setSize;
			const mockMeta = stub();
			const mockDimensionsGet = stub();
			mockDimensionsGet.withArgs('root').returns({
				offset: {
					width: 200
				}
			});
			mockDimensionsGet.withArgs('divider').returns({
				offset: {
					width: 100
				}
			});
			mockMeta.withArgs(Dimensions).returns({
				get: mockDimensionsGet
			});

			const h = harness(() => w(MockMetaMixin(SplitPane, mockMeta), {
				onResize: (size: number) => setSize = size
			}));

			h.trigger('@global', createVNodeSelector('window', 'mousemove'), { clientX: 0, ...stubEvent });
			h.trigger('@divider', 'onmousedown', { clientX: 500, ...stubEvent });
			h.trigger('@global', createVNodeSelector('window', 'mousemove'), { clientX: 0, ...stubEvent });
			h.trigger('@global', createVNodeSelector('window', 'mouseup'), stubEvent);
			assert.strictEqual(setSize, 0);
		},

		'Pane should not be greater than root widget'() {
			let setSize;
			const h = harness(() => w(SplitPane, {
				onResize: (size: number) => setSize = size
			}));

			h.trigger('@divider', 'onmousedown', { clientX: 0, ...stubEvent });
			h.trigger('@global', createVNodeSelector('window', 'mousemove'), { clientX: 500, ...stubEvent });
			h.trigger('@global', createVNodeSelector('window', 'mouseup'), { clientX: 0, ...stubEvent });
			assert.strictEqual(setSize, 0);
		},

		'Mouse move should call onResize for row'() {
			let called = false;

			const h = harness(() => w(SplitPane, {
				onResize: () => called = true
			}));

			h.trigger('@divider', 'onmousedown', { clientX: 110, ...stubEvent });
			h.trigger('@global', createVNodeSelector('window', 'mousemove'), { clientX: 150, ...stubEvent });
			h.trigger('@global', createVNodeSelector('window', 'mouseup'), stubEvent);
			assert.isTrue(called);
		},

		'Mouse move should call onResize for column'() {
			let called = false;

			const h = harness(() => w(SplitPane, {
				onResize: () => called = true,
				direction: Direction.column
			}));

			h.trigger('@divider', 'onmousedown', { clientX: 110, ...stubEvent });
			h.trigger('@global', createVNodeSelector('window', 'mousemove'), { clientX: 150, ...stubEvent });
			h.trigger('@global', createVNodeSelector('window', 'mouseup'), stubEvent);

			assert.isTrue(called);
		},

		'Touch move should call onResize for row'() {
			let called = false;

			const h = harness(() => w(SplitPane, {
				onResize: () => called = true,
				direction: Direction.row,
				size: 100
			}));

			h.trigger('@divider', 'ontouchstart', { clientX: 110, ...stubEvent });
			h.trigger('@global', createVNodeSelector('window', 'touchmove'), { clientX: 150, ...stubEvent });
			h.trigger('@global', createVNodeSelector('window', 'touchend'), stubEvent);

			assert.isTrue(called);
		},

		'Touch move should call onResize for column'() {
			let called = 0;

			const h = harness(() => w(SplitPane, {
				onResize: () => called++,
				direction: Direction.column
			}));

			h.trigger('@divider', 'ontouchstart', { clientX: 110, ...stubEvent });
			h.trigger('@global', createVNodeSelector('window', 'touchmove'), { clientX: 150, ...stubEvent });
			h.trigger('@global', createVNodeSelector('window', 'touchend'), stubEvent);
			h.trigger('@divider', 'ontouchstart', { clientX: 110, ...stubEvent });
			h.trigger('@global', createVNodeSelector('window', 'touchmove'), { clientX: 150, ...stubEvent });
			h.trigger('@global', createVNodeSelector('window', 'touchend'), stubEvent);

			assert.strictEqual(called, 2);
		}
	}
});
