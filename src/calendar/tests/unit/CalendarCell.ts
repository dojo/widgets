const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import harness from '@dojo/framework/testing/harness';
import { v, w } from '@dojo/framework/widget-core/d';

import CalendarCell from '../../CalendarCell';
import * as css from '../../../theme/calendar.m.css';
import { noop, stubEvent } from '../../../common/tests/support/test-helpers';

registerSuite('CalendarCell', {
	tests: {
		'Calendar cell with default properties'() {
			const h = harness(() =>
				w(CalendarCell, {
					date: 1
				})
			);

			h.expect(() =>
				v(
					'td',
					{
						key: 'root',
						role: 'gridcell',
						'aria-selected': 'false',
						tabIndex: -1,
						classes: [css.date, null, null, null, null],
						onclick: noop,
						onkeydown: noop
					},
					[v('span', {}, ['1'])]
				)
			);
		},

		'Calendar cell with custom properties'() {
			const h = harness(() =>
				w(CalendarCell, {
					date: 2,
					outOfRange: true,
					focusable: true,
					selected: true,
					today: true
				})
			);

			h.expect(() =>
				v(
					'td',
					{
						key: 'root',
						role: 'gridcell',
						'aria-selected': 'true',
						tabIndex: 0,
						classes: [
							css.date,
							css.inactiveDate,
							css.outOfRange,
							css.selectedDate,
							css.todayDate
						],
						onclick: noop,
						onkeydown: noop
					},
					[v('span', {}, ['2'])]
				)
			);
		},

		'Calendar cells for other months display as inactive'() {
			const h = harness(() =>
				w(CalendarCell, {
					date: 30,
					disabled: true
				})
			);

			h.expect(() =>
				v(
					'td',
					{
						key: 'root',
						role: 'gridcell',
						'aria-selected': 'false',
						tabIndex: -1,
						classes: [css.date, css.inactiveDate, null, null, null],
						onclick: noop,
						onkeydown: noop
					},
					[v('span', {}, ['30'])]
				)
			);
		},

		'Calendar cells for out of range dates display as inactive'() {
			const h = harness(() =>
				w(CalendarCell, {
					date: 30,
					outOfRange: true
				})
			);

			h.expect(() =>
				v(
					'td',
					{
						key: 'root',
						role: 'gridcell',
						'aria-selected': 'false',
						tabIndex: -1,
						classes: [css.date, css.inactiveDate, css.outOfRange, null, null],
						onclick: noop,
						onkeydown: noop
					},
					[v('span', {}, ['30'])]
				)
			);
		},

		'Click handler called with correct arguments'() {
			let clickedDate = 0;
			let clickedCurrentMonth = false;
			let date = 1;
			let disabled = true;
			const h = harness(() =>
				w(CalendarCell, {
					date,
					disabled,
					onClick: (callbackDate: number, callbackCurrentMonth: boolean) => {
						clickedDate = callbackDate;
						clickedCurrentMonth = callbackCurrentMonth;
					}
				})
			);

			h.trigger('td', 'onclick', stubEvent);
			assert.strictEqual(clickedDate, 1);
			assert.isTrue(clickedCurrentMonth);

			disabled = false;
			date = 2;
			h.trigger('td', 'onclick', stubEvent);
			assert.strictEqual(clickedDate, 2);
			assert.isFalse(clickedCurrentMonth);
		},

		'Keydown handler called'() {
			let called = false;
			const h = harness(() =>
				w(CalendarCell, {
					date: 1,
					onKeyDown: () => {
						called = true;
					}
				})
			);
			h.trigger('td', 'onkeydown', stubEvent);
			assert.isTrue(called);
		},

		'Focus is set with callback'() {
			let callFocus = true;
			let date = 1;
			const h = harness(() =>
				w(CalendarCell, {
					callFocus,
					date,
					onFocusCalled: () => {
						callFocus = false;
					}
				})
			);

			h.expect(() =>
				v(
					'td',
					{
						key: 'root',
						role: 'gridcell',
						'aria-selected': 'false',
						tabIndex: -1,
						classes: [css.date, null, null, null, null],
						onclick: noop,
						onkeydown: noop
					},
					[v('span', {}, ['1'])]
				)
			);

			assert.isFalse(callFocus, 'Focus callback should set callFocus to false');

			callFocus = true;
			date = 2;
			h.expect(() =>
				v(
					'td',
					{
						key: 'root',
						role: 'gridcell',
						'aria-selected': 'false',
						tabIndex: -1,
						classes: [css.date, null, null, null, null],
						onclick: noop,
						onkeydown: noop
					},
					[v('span', {}, ['2'])]
				)
			);

			assert.isFalse(callFocus, 'Focus callback should set callFocus to false');
		}
	}
});
