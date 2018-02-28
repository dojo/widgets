const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import { v, w } from '@dojo/widget-core/d';
import { Keys } from '../../../common/util';

import { DEFAULT_LABELS, DEFAULT_MONTHS, DEFAULT_WEEKDAYS } from '../support/defaults';
import Calendar from '../../index';
import CalendarCell from '../../CalendarCell';
import DatePicker from '../../DatePicker';
import Icon from '../../../icon/index';
import * as css from '../../../theme/calendar.m.css';
import * as baseCss from '../../../common/styles/base.m.css';
import {
	compareId,
	createHarness,
	compareAriaLabelledBy,
	compareLabelId,
	noop,
	stubEvent
} from '../../../common/tests/support/test-helpers';

const testDate = new Date('June 3 2017');
const harness = createHarness([ compareId, compareLabelId, compareAriaLabelledBy ]);

let dateIndex = -1;
const expectedDateCell = function(date: number, active: boolean, selectedIndex = 0) {
	dateIndex++;
	return w(CalendarCell, {
		key: `date-${dateIndex}`,
		callFocus: false,
		date,
		disabled: !active,
		focusable: date === 1 && active,
		selected: dateIndex === selectedIndex,
		theme: undefined,
		today: active && new Date().toDateString() === new Date(`June ${date} 2017`).toDateString(),
		onClick: noop,
		onFocusCalled: noop,
		onKeyDown: noop
	});
};

const expected = function(popupOpen = false, selectedIndex = -1, weekdayLabel = '', customMonthLabel = false, describedby = '') {
	const overrides = describedby ? { 'aria-describedby': describedby } : {};
	dateIndex = -1;
	return v('div', {
		classes: css.root,
		dir: '',
		lang: null,
		...overrides
	}, [
		w(DatePicker, {
			key: 'date-picker',
			labelId: '',
			labels: DEFAULT_LABELS,
			month: 5,
			monthNames: DEFAULT_MONTHS,
			renderMonthLabel: customMonthLabel ? noop : undefined,
			theme: undefined,
			year: 2017,
			onPopupChange: noop,
			onRequestMonthChange: noop,
			onRequestYearChange: noop
		}),
		v('table', {
			cellspacing: '0',
			cellpadding: '0',
			role: 'grid',
			'aria-labelledby': '', // this._monthLabelId,
			classes: [ css.dateGrid, popupOpen ? baseCss.visuallyHidden : null ]
		}, [
			v('thead', [
				v('tr', DEFAULT_WEEKDAYS.map((weekday: { short: string; long: string; }) => v('th', {
						role: 'columnheader',
						classes: css.weekday
					}, [
						weekdayLabel ? weekdayLabel : v('abbr', { title: weekday.long }, [ weekday.short ])
					])
				))
			]),
			v('tbody', [
				v('tr', [
					expectedDateCell(28, false, selectedIndex),
					expectedDateCell(29, false, selectedIndex),
					expectedDateCell(30, false, selectedIndex),
					expectedDateCell(31, false, selectedIndex),
					expectedDateCell(1, true, selectedIndex),
					expectedDateCell(2, true, selectedIndex),
					expectedDateCell(3, true, selectedIndex)
				]),
				v('tr', [
					expectedDateCell(4, true, selectedIndex),
					expectedDateCell(5, true, selectedIndex),
					expectedDateCell(6, true, selectedIndex),
					expectedDateCell(7, true, selectedIndex),
					expectedDateCell(8, true, selectedIndex),
					expectedDateCell(9, true, selectedIndex),
					expectedDateCell(10, true, selectedIndex)
				]),
				v('tr', [
					expectedDateCell(11, true, selectedIndex),
					expectedDateCell(12, true, selectedIndex),
					expectedDateCell(13, true, selectedIndex),
					expectedDateCell(14, true, selectedIndex),
					expectedDateCell(15, true, selectedIndex),
					expectedDateCell(16, true, selectedIndex),
					expectedDateCell(17, true, selectedIndex)
				]),
				v('tr', [
					expectedDateCell(18, true, selectedIndex),
					expectedDateCell(19, true, selectedIndex),
					expectedDateCell(20, true, selectedIndex),
					expectedDateCell(21, true, selectedIndex),
					expectedDateCell(22, true, selectedIndex),
					expectedDateCell(23, true, selectedIndex),
					expectedDateCell(24, true, selectedIndex)
				]),
				v('tr', [
					expectedDateCell(25, true, selectedIndex),
					expectedDateCell(26, true, selectedIndex),
					expectedDateCell(27, true, selectedIndex),
					expectedDateCell(28, true, selectedIndex),
					expectedDateCell(29, true, selectedIndex),
					expectedDateCell(30, true, selectedIndex),
					expectedDateCell(1, false, selectedIndex)
				]),
				v('tr', [
					expectedDateCell(2, false, selectedIndex),
					expectedDateCell(3, false, selectedIndex),
					expectedDateCell(4, false, selectedIndex),
					expectedDateCell(5, false, selectedIndex),
					expectedDateCell(6, false, selectedIndex),
					expectedDateCell(7, false, selectedIndex),
					expectedDateCell(8, false, selectedIndex)
				])
			])
		]),
		v('div', {
			classes: [ css.controls, popupOpen ? baseCss.visuallyHidden : null ]
		}, [
			v('button', {
				classes: css.previous,
				tabIndex: popupOpen ? -1 : 0,
				type: 'button',
				onclick: noop
			}, [
				w(Icon, { type: 'leftIcon' }),
				v('span', { classes: [ baseCss.visuallyHidden ] }, [ 'Previous Month' ])
			]),
			v('button', {
				classes: css.next,
				tabIndex: popupOpen ? -1 : 0,
				type: 'button',
				onclick: noop
			}, [
				w(Icon, { type: 'rightIcon' }),
				v('span', { classes: [ baseCss.visuallyHidden ] }, [ 'Next Month' ])
			])
		])
	]);
};

registerSuite('Calendar', {
	tests: {
		'Render specific month with default props'() {
			const h = harness(() => w(Calendar, {
				month: testDate.getMonth(),
				year: testDate.getFullYear()
			}));
			h.expect(expected);
		},

		'Render specific month and year with selectedDate'() {
			const h = harness(() => w(Calendar, {
				selectedDate: testDate
			}));

			h.expect(() => expected(false, 6));
		},

		'Renders with custom properties'() {
			let properties: any = {
				aria: { describedBy: 'foo' },
				labels: DEFAULT_LABELS,
				month: testDate.getMonth(),
				monthNames: DEFAULT_MONTHS,
				selectedDate: new Date('June 1 2017'),
				weekdayNames: DEFAULT_WEEKDAYS,
				year: testDate.getFullYear(),
				renderMonthLabel: (month: number, year: number) => 'Foo',
				renderWeekdayCell: (day: { short: string; long: string; }) => 'Bar'
			};
			const h = harness(() => w(Calendar, properties));

			h.expect(() => expected(false, 4, 'Bar', true, 'foo'));
			properties = {
				month: testDate.getMonth(),
				year: testDate.getFullYear()
			};
			h.expect(expected);
		},

		'Click to select date'() {
			let selectedDate = testDate;
			const h = harness(() => w(Calendar, {
				month: testDate.getMonth(),
				year: testDate.getFullYear(),
				onDateSelect: (date: Date) => {
					selectedDate = date;
				}
			}));
			h.trigger('@date-4', 'onClick', 1, false);

			assert.strictEqual(selectedDate.getDate(), 1, 'Clicking cell selects correct date');
			assert.strictEqual(selectedDate.getMonth(), 5, 'Clicking active date has correct month');
			assert.strictEqual(selectedDate.getFullYear(), 2017, 'Clicking date keeps current year');
		},

		'Clicking on disabled dates changes month'() {
			let currentMonth = testDate.getMonth();
			let selectedDate = testDate;
			let properties = {
				month: currentMonth,
				year: testDate.getFullYear(),
				onMonthChange: (month: number) => {
					currentMonth = month;
				},
				onDateSelect: (date: Date) => {
					selectedDate = date;
				}
			};
			const h = harness(() => w(Calendar, properties));

			h.trigger('@date-34', 'onClick', 1, true);
			assert.strictEqual(currentMonth, 6, 'Month changes to July');
			assert.strictEqual(selectedDate.getMonth(), 6, 'selected date in July');
			assert.strictEqual(selectedDate.getDate(), 1, 'selected correct date in July');

			h.trigger('@date-2', 'onClick', 30, true);
			assert.strictEqual(currentMonth, 4, 'Month changes to May');
			assert.strictEqual(selectedDate.getMonth(), 4, 'selected date in May');
			assert.strictEqual(selectedDate.getDate(), 30, 'selected correct date in May');
		},

		'Keyboard date select'() {
			let selectedDate = testDate;
			const h = harness(() => w(Calendar, {
				month: testDate.getMonth(),
				year: testDate.getFullYear(),
				onDateSelect: (date: Date) => {
					selectedDate = date;
				}
			}));

			// right arrow, then select
			h.trigger('@date-4', 'onKeyDown', Keys.Right, () => {});
			h.trigger('@date-4', 'onFocusCalled');
			h.trigger('@date-5', 'onKeyDown', Keys.Enter, () => {});
			assert.strictEqual(selectedDate.getDate(), 2, 'Right arrow + enter selects second day');
			assert.strictEqual(selectedDate.getMonth(), 5, 'Selected date is same month');

			h.trigger('@date-5', 'onKeyDown', Keys.Down, () => {});
			h.trigger('@date-12', 'onKeyDown', Keys.Enter, () => {});
			assert.strictEqual(selectedDate.getDate(), 9, 'Down arrow + enter selects one week down');
			assert.strictEqual(selectedDate.getMonth(), 5, 'Selected date is same month');

			h.trigger('@date-12', 'onKeyDown', Keys.Left, () => {});
			h.trigger('@date-11', 'onKeyDown', Keys.Space, () => {});

			assert.strictEqual(selectedDate.getDate(), 8, 'Left arrow + space selects previous day');
			assert.strictEqual(selectedDate.getMonth(), 5, 'Selected date is same month');

			h.trigger('@date-11', 'onKeyDown', Keys.Up, () => {});
			h.trigger('@date-4', 'onKeyDown', Keys.Space, () => {});

			assert.strictEqual(selectedDate.getDate(), 1, 'Left arrow + space selects previous day');
			assert.strictEqual(selectedDate.getMonth(), 5, 'Selected date is same month');

			h.trigger('@date-4', 'onKeyDown', Keys.PageDown, () => {});
			h.trigger('@date-33', 'onKeyDown', Keys.Space, () => {});

			assert.strictEqual(selectedDate.getDate(), 30, 'Page Down + space selects last day');
			assert.strictEqual(selectedDate.getMonth(), 5, 'Selected date is same month');

			h.trigger('@date-33', 'onKeyDown', Keys.PageUp, () => {});
			h.trigger('@date-4', 'onKeyDown', Keys.Space, () => {});

			assert.strictEqual(selectedDate.getDate(), 1, 'Page Up + space selects first day');
			assert.strictEqual(selectedDate.getMonth(), 5, 'Selected date is same month');
		},

		'Arrow keys can change month'() {
			let currentMonth = testDate.getMonth();
			const h = harness(() => w(Calendar, {
				month: currentMonth,
				year: testDate.getFullYear(),
				onMonthChange: (month: number) => {
					currentMonth = month;
				}
			}));

			h.trigger('@date-4', 'onKeyDown', Keys.Left, () => {});
			assert.strictEqual(currentMonth, testDate.getMonth() - 1, 'Going left from the first day goes to previous month');

			h.trigger('@date-4', 'onKeyDown', Keys.PageDown, () => {});
			h.trigger('@date-4', 'onKeyDown', Keys.Right, () => {});
			assert.strictEqual(currentMonth, testDate.getMonth(), 'Going right from the last day goes to next month');
		},

		'Month changes wrap and change year'() {
			let currentMonth = 0;
			let currentYear = 2017;
			let properties = {
				month: currentMonth,
				year: currentYear,
				onMonthChange: (month: number) => {
					currentMonth = month;
				},
				onYearChange: (year: number) => {
					currentYear = year;
				}
			};
			const h = harness(() => w(Calendar, properties));

			h.trigger('@date-0', 'onKeyDown', Keys.Up, () => {});

			assert.strictEqual(currentMonth, 11, 'Previous month wraps from January to December');
			assert.strictEqual(currentYear, 2016, 'Year decrements when month wraps');

			properties = {
				month: 11,
				year: 2017,
				onMonthChange: (month: number) => {
					currentMonth = month;
				},
				onYearChange: (year: number) => {
					currentYear = year;
				}
			};

			h.trigger('@date-35', 'onKeyDown', Keys.Down, () => {});

			assert.strictEqual(currentMonth, 0, 'Next month wraps from December to January');
			assert.strictEqual(currentYear, 2018, 'Year increments when month wraps');
		},

		'Month popup events change month and year'() {
			let currentMonth = testDate.getMonth();
			let currentYear = testDate.getFullYear();
			const h = harness(() => w(Calendar, {
				month: currentMonth,
				year: currentYear,
				onMonthChange: (month: number) => {
					currentMonth = month;
				},
				onYearChange: (year: number) => {
					currentYear = year;
				}
			}));

			h.trigger('@date-picker', 'onRequestMonthChange', 2);
			assert.strictEqual(currentMonth, 2, 'Popup month change event triggers calendar month change event');

			h.trigger('@date-picker', 'onRequestYearChange', 2018);
			assert.strictEqual(currentYear, 2018, 'Popup year change triggers calendar year change');
		},

		'Previous button should decrement month'() {
			let currentMonth = testDate.getMonth();
			const h = harness(() => w(Calendar, {
				month: currentMonth,
				onMonthChange: (month: number) => {
					currentMonth = month;
				}
			}));

			h.trigger(`.${css.previous}`, 'onclick', stubEvent);
			assert.strictEqual(currentMonth, testDate.getMonth() - 1, 'Previous button decrements month');
		},

		'Next button should increment month'() {
			let currentMonth = testDate.getMonth();
			const h = harness(() => w(Calendar, {
				month: currentMonth,
				onMonthChange: (month: number) => {
					currentMonth = month;
				}
			}));

			h.trigger(`.${css.next}`, 'onclick', stubEvent);
			assert.strictEqual(currentMonth, testDate.getMonth() + 1, 'Next button increments month');
		},

		'onPopupChange should control visibility'() {
			let properties: any = {};
			const h = harness(() => w(Calendar, properties));
			h.trigger('@date-picker', 'onPopupChange', true);
			properties = {
				month: testDate.getMonth(),
				year: testDate.getFullYear()
			};
			h.expect(() => expected(true));
		}
	}
});
