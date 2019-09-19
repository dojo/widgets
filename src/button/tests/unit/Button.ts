const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import harness from '@dojo/framework/testing/harness';
import { v, w } from '@dojo/framework/core/vdom';

import Button from '../../index';
import Icon from '../../../icon/index';
import * as css from '../../../theme/button.m.css';
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
						'aria-controls': null,
						'aria-expanded': null,
						'aria-haspopup': null,
						'aria-pressed': null,
						classes: [css.root, null, null, null],
						disabled: undefined,
						id: undefined,
						name: undefined,
						focus: noop,
						onblur: noop,
						onclick: noop,
						onfocus: noop,
						type: undefined,
						value: undefined
					},
					[null]
				)
			);
		},

		'properties and attributes'() {
			const h = harness(
				() =>
					w(
						Button,
						{
							type: 'submit',
							name: 'bar',
							id: 'qux',
							aria: {
								describedBy: 'baz'
							},
							disabled: true,
							popup: {
								expanded: true,
								id: 'popupId'
							},
							pressed: true,
							value: 'value'
						},
						['foo']
					),
				[compareFocusFalse]
			);

			h.expect(() =>
				v(
					'button',
					{
						'aria-controls': 'popupId',
						'aria-describedby': 'baz',
						'aria-expanded': 'true',
						'aria-haspopup': 'true',
						'aria-pressed': 'true',
						classes: [css.root, css.disabled, css.popup, css.pressed],
						disabled: true,
						name: 'bar',
						id: 'qux',
						focus: noop,
						onblur: noop,
						onclick: noop,
						onfocus: noop,
						type: 'submit',
						value: 'value'
					},
					[
						'foo',
						v('span', { classes: css.addon }, [
							w(Icon, { type: 'downIcon', theme: undefined, classes: undefined })
						])
					]
				)
			);
		},

		'popup = true'() {
			const h = harness(
				() =>
					w(Button, {
						popup: true
					}),
				[compareFocusFalse]
			);

			h.expect(() =>
				v(
					'button',
					{
						'aria-controls': '',
						'aria-expanded': 'false',
						'aria-haspopup': 'true',
						'aria-pressed': null,
						classes: [css.root, null, css.popup, null],
						disabled: undefined,
						name: undefined,
						id: undefined,
						focus: noop,
						onblur: noop,
						onclick: noop,
						onfocus: noop,
						type: undefined,
						value: undefined
					},
					[
						v('span', { classes: css.addon }, [
							w(Icon, { type: 'downIcon', theme: undefined, classes: undefined })
						])
					]
				)
			);
		},

		'call focus on button node'() {
			const h = harness(() => w(Button, { focus: () => true }), [compareFocusTrue]);
			h.expect(() =>
				v(
					'button',
					{
						'aria-controls': null,
						'aria-expanded': null,
						'aria-haspopup': null,
						'aria-pressed': null,
						classes: [css.root, null, null, null],
						disabled: undefined,
						id: undefined,
						name: undefined,
						focus: noop,
						onblur: noop,
						onclick: noop,
						onfocus: noop,
						type: undefined,
						value: undefined
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
