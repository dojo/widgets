const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import harness from '@dojo/framework/testing/harness';
import { v, w } from '@dojo/framework/core/vdom';

import Button from '../../index';
import * as css from '../../../theme/default/button.m.css';
import {
	isFocusedComparator,
	isNotFocusedComparator,
	noop,
	stubEvent
} from '../../../common/tests/support/test-helpers';

const compareFocusFalse = {
	selector: 'button',
	property: 'focus',
	comparator: isNotFocusedComparator
};

const compareFocusTrue = {
	selector: 'button',
	property: 'focus',
	comparator: isFocusedComparator
};

registerSuite('Button', {
	tests: {
		'no content'() {
			const h = harness(() => w(Button, {}), [compareFocusFalse]);
			h.expect(() =>
				v(
					'button',
					{
						'aria-pressed': null,
						classes: [css.root, null, null],
						disabled: undefined,
						id: undefined,
						name: undefined,
						focus: noop,
						onblur: noop,
						onclick: noop,
						onfocus: noop,
						type: 'button',
						value: undefined,
						onpointerenter: noop,
						onpointerleave: noop,
						onpointerdown: noop,
						onpointerup: noop
					},
					[null]
				)
			);
		},

		'call focus on button node'() {
			const h = harness(() => w(Button, { focus: () => true }), [compareFocusTrue]);
			h.expect(() =>
				v(
					'button',
					{
						'aria-pressed': null,
						classes: [css.root, null, null],
						disabled: undefined,
						id: undefined,
						name: undefined,
						focus: noop,
						onblur: noop,
						onclick: noop,
						onfocus: noop,
						type: 'button',
						value: undefined,
						onpointerenter: noop,
						onpointerleave: noop,
						onpointerdown: noop,
						onpointerup: noop
					},
					[null]
				)
			);
		},

		events() {
			let blurred = false;
			let clicked = false;
			let focused = false;

			const h = harness(() =>
				w(Button, {
					onBlur: () => {
						blurred = true;
					},
					onClick: () => {
						clicked = true;
					},
					onFocus: () => {
						focused = true;
					}
				})
			);

			h.trigger('button', 'onblur');
			h.trigger('button', 'onclick', stubEvent);
			h.trigger('button', 'onfocus');

			assert.isTrue(blurred);
			assert.isTrue(clicked);
			assert.isTrue(focused);
		}
	}
});
