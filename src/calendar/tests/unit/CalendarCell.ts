const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import harness from '@dojo/test-extras/harness';
import { v, w } from '@dojo/widget-core/d';

import CalendarCell from '../../CalendarCell';
import * as css from '../../../theme/calendar/calendar.m.css';

const noop = () => {};

registerSuite('CalendarCell', {
	tests: {
		'Calendar cell with default properties'() {
			const h = harness(() => w(CalendarCell, {
				date: 1
			}));

			h.expect(() => v('td', {
				key: 'root',
				role: 'gridcell',
				'aria-selected': 'false',
				tabIndex: -1,
				classes: [ css.date, null, null, null ],
				onclick: noop,
				onkeydown: noop
			}, [
				v('span', {}, [ '1' ])
			]));
		},

		'Calendar cell with custom properties'() {
			const h = harness(() => w(CalendarCell, {
				date: 2,
				disabled: true,
				focusable: true,
				selected: true,
				today: true
			}));

			h.expect(() => v('td', {
				key: 'root',
				role: 'gridcell',
				'aria-selected': 'true',
				tabIndex: 0,
				classes: [ css.date, css.inactiveDate, css.selectedDate, css.todayDate ],
				onclick: noop,
				onkeydown: noop
			}, [
				v('span', {}, [ '2' ])
			]));
		},

		'Click handler called with correct arguments'() {
			let clickedDate = 0;
			let clickedDisabled = false;
			let date = 1;
			let disabled = true;
			const h = harness(() => w(CalendarCell, {
				date,
				disabled,
				onClick: (date: number, disabled: boolean) => {
					clickedDate = date;
					clickedDisabled = disabled;
				}
			}));

			h.trigger('td', 'onclick');
			assert.strictEqual(clickedDate, 1);
			assert.isTrue(clickedDisabled);

			disabled = false;
			date = 2;
			h.trigger('td', 'onclick');
			assert.strictEqual(clickedDate, 2);
			assert.isFalse(clickedDisabled, 'disabled defaults to false');
		},

		'Keydown handler called'() {
			let called = false;
			const h = harness(() => w(CalendarCell, {
				date: 1,
				onKeyDown: () => {
					called = true;
				}
			}));
			h.trigger('td', 'onkeydown');
			assert.isTrue(called);
		},

		'Focus is set with callback'() {
			let callFocus = true;
			let date = 1;
			const h = harness(() => w(CalendarCell, {
				callFocus,
				date,
				onFocusCalled: () => {
					callFocus = false;
				}
			}));

			h.expect(() => v('td', {
				key: 'root',
				role: 'gridcell',
				'aria-selected': 'false',
				tabIndex: -1,
				classes: [ css.date, null, null, null ],
				onclick: noop,
				onkeydown: noop
			}, [
				v('span', {}, [ '1' ])
			]));

			assert.isFalse(callFocus, 'Focus callback should set callFocus to false');

			callFocus = true;
			date = 2;
			h.expect(() => v('td', {
				key: 'root',
				role: 'gridcell',
				'aria-selected': 'false',
				tabIndex: -1,
				classes: [ css.date, null, null, null ],
				onclick: noop,
				onkeydown: noop
			}, [
				v('span', {}, [ '2' ])
			]));

			assert.isFalse(callFocus, 'Focus callback should set callFocus to false');
		}
	}
});
