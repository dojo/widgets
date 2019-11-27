const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import { v, w } from '@dojo/framework/core/vdom';
import { Keys } from '../../../common/util';

import { DEFAULT_LABELS, DEFAULT_MONTHS, DEFAULT_WEEKDAYS } from '../support/defaults';
import Calendar, { CalendarProperties } from '../../index';
import CalendarCell from '../../CalendarCell';
import DatePicker from '../../DatePicker';
import Icon from '../../../icon/index';
import * as css from '../../../theme/default/calendar.m.css';
import * as baseCss from '../../../common/styles/base.m.css';
import {
	compareId,
	createHarness,
	compareAriaLabelledBy,
	compareLabelId,
	noop,
	stubEvent
} from '../../../common/tests/support/test-helpers';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';

const testDate = new Date('June 5 2017');
const harness = createHarness([compareId, compareLabelId, compareAriaLabelledBy]);

/** Index of current expected date cell. Used by date cell factory function */
const expectedDateCell = function(
	dateIndex: number,
	date: number,
	currentMonth: boolean,
	outOfRange = false,
	selectedIndex = -1
) {
	return w(CalendarCell, {
		key: `date-${dateIndex}`,
		callFocus: false,
		date,
		outOfRange,
		disabled: !currentMonth,
		focusable: date === 1 && currentMonth,
		selected: dateIndex === selectedIndex,
		theme: undefined,
		classes: undefined,
		today: false,
		onClick: outOfRange ? undefined : noop,
		onFocusCalled: noop,
		onKeyDown: noop
	});
};

const expected = function(
	popupOpen = false,
	selectedIndex = -1,
	weekdayLabel = '',
	customMonthLabel = false,
	describedby = ''
) {
	const overrides = describedby ? { 'aria-describedby': describedby } : {};
	let dateIndex = 0;
	return v(
		'div',
		{
			classes: css.root,
			...overrides
		},
		[
			w(DatePicker, {
				key: 'date-picker',
				labelId: '',
				labels: DEFAULT_LABELS,
				month: 5,
				monthNames: DEFAULT_MONTHS,
				renderMonthLabel: customMonthLabel ? noop : undefined,
				theme: undefined,
				classes: undefined,
				year: 2017,
				minDate: undefined,
				maxDate: undefined,
				onPopupChange: noop,
				onRequestMonthChange: noop,
				onRequestYearChange: noop
			}),
			v(
				'table',
				{
					cellspacing: '0',
					cellpadding: '0',
					role: 'grid',
					'aria-labelledby': '', // this._monthLabelId,
					classes: [css.dateGrid, popupOpen ? baseCss.visuallyHidden : null]
				},
				[
					v('thead', [
						v(
							'tr',
							DEFAULT_WEEKDAYS.map((weekday: { short: string; long: string }) =>
								v(
									'th',
									{
										role: 'columnheader',
										classes: css.weekday
									},
									[
										weekdayLabel
											? weekdayLabel
											: v('abbr', { title: weekday.long }, [weekday.short])
									]
								)
							)
						)
					]),
					v('tbody', [
						v('tr', [
							expectedDateCell(dateIndex++, 28, false, false, selectedIndex),
							expectedDateCell(dateIndex++, 29, false, false, selectedIndex),
							expectedDateCell(dateIndex++, 30, false, false, selectedIndex),
							expectedDateCell(dateIndex++, 31, false, false, selectedIndex),
							expectedDateCell(dateIndex++, 1, true, false, selectedIndex),
							expectedDateCell(dateIndex++, 2, true, false, selectedIndex),
							expectedDateCell(dateIndex++, 3, true, false, selectedIndex)
						]),
						v('tr', [
							expectedDateCell(dateIndex++, 4, true, false, selectedIndex),
							expectedDateCell(dateIndex++, 5, true, false, selectedIndex),
							expectedDateCell(dateIndex++, 6, true, false, selectedIndex),
							expectedDateCell(dateIndex++, 7, true, false, selectedIndex),
							expectedDateCell(dateIndex++, 8, true, false, selectedIndex),
							expectedDateCell(dateIndex++, 9, true, false, selectedIndex),
							expectedDateCell(dateIndex++, 10, true, false, selectedIndex)
						]),
						v('tr', [
							expectedDateCell(dateIndex++, 11, true, false, selectedIndex),
							expectedDateCell(dateIndex++, 12, true, false, selectedIndex),
							expectedDateCell(dateIndex++, 13, true, false, selectedIndex),
							expectedDateCell(dateIndex++, 14, true, false, selectedIndex),
							expectedDateCell(dateIndex++, 15, true, false, selectedIndex),
							expectedDateCell(dateIndex++, 16, true, false, selectedIndex),
							expectedDateCell(dateIndex++, 17, true, false, selectedIndex)
						]),
						v('tr', [
							expectedDateCell(dateIndex++, 18, true, false, selectedIndex),
							expectedDateCell(dateIndex++, 19, true, false, selectedIndex),
							expectedDateCell(dateIndex++, 20, true, false, selectedIndex),
							expectedDateCell(dateIndex++, 21, true, false, selectedIndex),
							expectedDateCell(dateIndex++, 22, true, false, selectedIndex),
							expectedDateCell(dateIndex++, 23, true, false, selectedIndex),
							expectedDateCell(dateIndex++, 24, true, false, selectedIndex)
						]),
						v('tr', [
							expectedDateCell(dateIndex++, 25, true, false, selectedIndex),
							expectedDateCell(dateIndex++, 26, true, false, selectedIndex),
							expectedDateCell(dateIndex++, 27, true, false, selectedIndex),
							expectedDateCell(dateIndex++, 28, true, false, selectedIndex),
							expectedDateCell(dateIndex++, 29, true, false, selectedIndex),
							expectedDateCell(dateIndex++, 30, true, false, selectedIndex),
							expectedDateCell(dateIndex++, 1, false, false, selectedIndex)
						]),
						v('tr', [
							expectedDateCell(dateIndex++, 2, false, false, selectedIndex),
							expectedDateCell(dateIndex++, 3, false, false, selectedIndex),
							expectedDateCell(dateIndex++, 4, false, false, selectedIndex),
							expectedDateCell(dateIndex++, 5, false, false, selectedIndex),
							expectedDateCell(dateIndex++, 6, false, false, selectedIndex),
							expectedDateCell(dateIndex++, 7, false, false, selectedIndex),
							expectedDateCell(dateIndex++, 8, false, false, selectedIndex)
						])
					])
				]
			),
			v(
				'div',
				{
					classes: [css.controls, popupOpen ? baseCss.visuallyHidden : null]
				},
				[
					v(
						'button',
						{
							classes: css.previous,
							disabled: false,
							tabIndex: popupOpen ? -1 : 0,
							type: 'button',
							onclick: noop
						},
						[
							w(Icon, { type: 'leftIcon', theme: undefined, classes: undefined }),
							v('span', { classes: [baseCss.visuallyHidden] }, ['Previous Month'])
						]
					),
					v(
						'button',
						{
							classes: css.next,
							disabled: false,
							tabIndex: popupOpen ? -1 : 0,
							type: 'button',
							onclick: noop
						},
						[
							w(Icon, { type: 'rightIcon', theme: undefined, classes: undefined }),
							v('span', { classes: [baseCss.visuallyHidden] }, ['Next Month'])
						]
					)
				]
			)
		]
	);
};
const baseTemplate = assertionTemplate(() => {
	let dateIndex = 0;
	return v(
		'div',
		{
			classes: css.root
		},
		[
			w(DatePicker, {
				key: 'date-picker',
				labelId: '',
				labels: DEFAULT_LABELS,
				month: 5,
				monthNames: DEFAULT_MONTHS,
				renderMonthLabel: undefined,
				theme: undefined,
				classes: undefined,
				year: 2017,
				minDate: undefined,
				maxDate: undefined,
				onPopupChange: noop,
				onRequestMonthChange: noop,
				onRequestYearChange: noop
			}),
			v(
				'table',
				{
					cellspacing: '0',
					cellpadding: '0',
					role: 'grid',
					'aria-labelledby': '', // this._monthLabelId,
					classes: [css.dateGrid, null]
				},
				[
					v('thead', [
						v(
							'tr',
							DEFAULT_WEEKDAYS.map((weekday: { short: string; long: string }) =>
								v(
									'th',
									{
										role: 'columnheader',
										classes: css.weekday
									},
									[v('abbr', { title: weekday.long }, [weekday.short])]
								)
							)
						)
					]),
					v('tbody', [
						v('tr', [
							expectedDateCell(dateIndex++, 28, false),
							expectedDateCell(dateIndex++, 29, false),
							expectedDateCell(dateIndex++, 30, false),
							expectedDateCell(dateIndex++, 31, false),
							expectedDateCell(dateIndex++, 1, true),
							expectedDateCell(dateIndex++, 2, true),
							expectedDateCell(dateIndex++, 3, true)
						]),
						v('tr', [
							expectedDateCell(dateIndex++, 4, true),
							expectedDateCell(dateIndex++, 5, true),
							expectedDateCell(dateIndex++, 6, true),
							expectedDateCell(dateIndex++, 7, true),
							expectedDateCell(dateIndex++, 8, true),
							expectedDateCell(dateIndex++, 9, true),
							expectedDateCell(dateIndex++, 10, true)
						]),
						v('tr', [
							expectedDateCell(dateIndex++, 11, true),
							expectedDateCell(dateIndex++, 12, true),
							expectedDateCell(dateIndex++, 13, true),
							expectedDateCell(dateIndex++, 14, true),
							expectedDateCell(dateIndex++, 15, true),
							expectedDateCell(dateIndex++, 16, true),
							expectedDateCell(dateIndex++, 17, true)
						]),
						v('tr', [
							expectedDateCell(dateIndex++, 18, true),
							expectedDateCell(dateIndex++, 19, true),
							expectedDateCell(dateIndex++, 20, true),
							expectedDateCell(dateIndex++, 21, true),
							expectedDateCell(dateIndex++, 22, true),
							expectedDateCell(dateIndex++, 23, true),
							expectedDateCell(dateIndex++, 24, true)
						]),
						v('tr', [
							expectedDateCell(dateIndex++, 25, true),
							expectedDateCell(dateIndex++, 26, true),
							expectedDateCell(dateIndex++, 27, true),
							expectedDateCell(dateIndex++, 28, true),
							expectedDateCell(dateIndex++, 29, true),
							expectedDateCell(dateIndex++, 30, true),
							expectedDateCell(dateIndex++, 1, false)
						]),
						v('tr', [
							expectedDateCell(dateIndex++, 2, false),
							expectedDateCell(dateIndex++, 3, false),
							expectedDateCell(dateIndex++, 4, false),
							expectedDateCell(dateIndex++, 5, false),
							expectedDateCell(dateIndex++, 6, false),
							expectedDateCell(dateIndex++, 7, false),
							expectedDateCell(dateIndex++, 8, false)
						])
					])
				]
			),
			v(
				'div',
				{
					classes: [css.controls, null]
				},
				[
					v(
						'button',
						{
							'assertion-key': 'previousMonth',
							classes: css.previous,
							disabled: false,
							tabIndex: 0,
							type: 'button',
							onclick: noop
						},
						[
							w(Icon, { type: 'leftIcon', theme: undefined, classes: undefined }),
							v('span', { classes: [baseCss.visuallyHidden] }, ['Previous Month'])
						]
					),
					v(
						'button',
						{
							'assertion-key': 'nextMonth',
							classes: css.next,
							disabled: false,
							tabIndex: 0,
							type: 'button',
							onclick: noop
						},
						[
							w(Icon, { type: 'rightIcon', theme: undefined, classes: undefined }),
							v('span', { classes: [baseCss.visuallyHidden] }, ['Next Month'])
						]
					)
				]
			)
		]
	);
});

registerSuite('Calendar', {
	tests: {
		'Render specific month with default props'() {
			const h = harness(() =>
				w(Calendar, {
					month: testDate.getMonth(),
					year: testDate.getFullYear()
				})
			);
			h.expect(expected);
		},

		'Render specific month and year with selectedDate'() {
			const h = harness(() =>
				w(Calendar, {
					selectedDate: testDate
				})
			);

			h.expect(() => expected(false, 8));
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
				renderWeekdayCell: (day: { short: string; long: string }) => 'Bar'
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
			const h = harness(() =>
				w(Calendar, {
					month: testDate.getMonth(),
					year: testDate.getFullYear(),
					onDateSelect: (date: Date) => {
						selectedDate = date;
					}
				})
			);
			h.trigger('@date-4', 'onClick', 1, false);

			assert.strictEqual(selectedDate.getDate(), 1, 'Clicking cell selects correct date');
			assert.strictEqual(
				selectedDate.getMonth(),
				5,
				'Clicking active date maintains current month'
			);
			assert.strictEqual(
				selectedDate.getFullYear(),
				2017,
				'Clicking date keeps current year'
			);
		},

		'Clicking on dates outside the current month changes the month'() {
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
			const h = harness(() =>
				w(Calendar, {
					month: testDate.getMonth(),
					year: testDate.getFullYear(),
					onDateSelect: (date: Date) => {
						selectedDate = date;
					}
				})
			);

			// right arrow, then select
			h.trigger('@date-4', 'onKeyDown', Keys.Right, () => {});
			h.trigger('@date-4', 'onFocusCalled');
			h.trigger('@date-5', 'onKeyDown', Keys.Enter, () => {});
			assert.strictEqual(selectedDate.getDate(), 2, 'Right arrow + enter selects second day');
			assert.strictEqual(selectedDate.getMonth(), 5, 'Selected date is same month');

			h.trigger('@date-5', 'onKeyDown', Keys.Down, () => {});
			h.trigger('@date-12', 'onKeyDown', Keys.Enter, () => {});
			assert.strictEqual(
				selectedDate.getDate(),
				9,
				'Down arrow + enter selects one week down'
			);
			assert.strictEqual(selectedDate.getMonth(), 5, 'Selected date is same month');

			h.trigger('@date-12', 'onKeyDown', Keys.Left, () => {});
			h.trigger('@date-11', 'onKeyDown', Keys.Space, () => {});

			assert.strictEqual(
				selectedDate.getDate(),
				8,
				'Left arrow + space selects previous day'
			);
			assert.strictEqual(selectedDate.getMonth(), 5, 'Selected date is same month');

			h.trigger('@date-11', 'onKeyDown', Keys.Up, () => {});
			h.trigger('@date-4', 'onKeyDown', Keys.Space, () => {});

			assert.strictEqual(
				selectedDate.getDate(),
				1,
				'Left arrow + space selects previous day'
			);
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
			const h = harness(() =>
				w(Calendar, {
					month: currentMonth,
					year: testDate.getFullYear(),
					onMonthChange: (month: number) => {
						currentMonth = month;
					}
				})
			);

			h.trigger('@date-4', 'onKeyDown', Keys.Left, () => {});
			assert.strictEqual(
				currentMonth,
				testDate.getMonth() - 1,
				'Going left from the first day goes to previous month'
			);

			h.trigger('@date-4', 'onKeyDown', Keys.PageDown, () => {});
			h.trigger('@date-4', 'onKeyDown', Keys.Right, () => {});
			assert.strictEqual(
				currentMonth,
				testDate.getMonth(),
				'Going right from the last day goes to next month'
			);
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
			const h = harness(() =>
				w(Calendar, {
					month: currentMonth,
					year: currentYear,
					onMonthChange: (month: number) => {
						currentMonth = month;
					},
					onYearChange: (year: number) => {
						currentYear = year;
					}
				})
			);

			h.trigger('@date-picker', 'onRequestMonthChange', 2);
			assert.strictEqual(
				currentMonth,
				2,
				'Popup month change event triggers calendar month change event'
			);

			h.trigger('@date-picker', 'onRequestYearChange', 2018);
			assert.strictEqual(
				currentYear,
				2018,
				'Popup year change triggers calendar year change'
			);
		},

		'Previous button should decrement month'() {
			let currentMonth = testDate.getMonth();
			const h = harness(() =>
				w(Calendar, {
					month: currentMonth,
					onMonthChange: (month: number) => {
						currentMonth = month;
					}
				})
			);

			h.trigger(`.${css.previous}`, 'onclick', stubEvent);
			assert.strictEqual(
				currentMonth,
				testDate.getMonth() - 1,
				'Previous button decrements month'
			);
		},

		'Next button should increment month'() {
			let currentMonth = testDate.getMonth();
			const h = harness(() =>
				w(Calendar, {
					month: currentMonth,
					onMonthChange: (month: number) => {
						currentMonth = month;
					}
				})
			);

			h.trigger(`.${css.next}`, 'onclick', stubEvent);
			assert.strictEqual(
				currentMonth,
				testDate.getMonth() + 1,
				'Next button increments month'
			);
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

const minDateInMonth = new Date('June 3, 2017');
const maxDateInMonth = new Date('June 29, 2017');

const baseMinMaxTemplate = baseTemplate
	.setProperty('@date-picker', 'minDate', minDateInMonth)
	.setProperty('@date-picker', 'maxDate', maxDateInMonth)
	.replaceChildren('tbody tr:first-child', () => [
		expectedDateCell(0, 28, false, true),
		expectedDateCell(1, 29, false, true),
		expectedDateCell(2, 30, false, true),
		expectedDateCell(3, 31, false, true),
		expectedDateCell(4, 1, true, true),
		expectedDateCell(5, 2, true, true),
		expectedDateCell(6, 3, true, false)
	])
	.setProperty('@date-4', 'focusable', false)
	.setProperty('@date-6', 'focusable', true)
	.replaceChildren('tbody tr:nth-child(5)', () => {
		let dateIndex = 28;
		return [
			expectedDateCell(dateIndex++, 25, true, false),
			expectedDateCell(dateIndex++, 26, true, false),
			expectedDateCell(dateIndex++, 27, true, false),
			expectedDateCell(dateIndex++, 28, true, false),
			expectedDateCell(dateIndex++, 29, true, false),
			expectedDateCell(dateIndex++, 30, true, true),
			expectedDateCell(dateIndex++, 1, false, true)
		];
	})
	.replaceChildren('tbody tr:last-child', () => {
		let dateIndex = 35;
		return [
			expectedDateCell(dateIndex++, 2, false, true),
			expectedDateCell(dateIndex++, 3, false, true),
			expectedDateCell(dateIndex++, 4, false, true),
			expectedDateCell(dateIndex++, 5, false, true),
			expectedDateCell(dateIndex++, 6, false, true),
			expectedDateCell(dateIndex++, 7, false, true),
			expectedDateCell(dateIndex++, 8, false, true)
		];
	})
	.setProperty('~previousMonth', 'disabled', true)
	.setProperty('~nextMonth', 'disabled', true);

registerSuite('Custom first day of week', {
	tests: {
		'render the correct first day of week'() {
			const h = harness(() =>
				w(Calendar, {
					month: testDate.getMonth(),
					year: testDate.getFullYear(),
					firstDayOfWeek: 2
				})
			);
			const firstDayOfWeekTemplate = baseTemplate
				.replaceChildren('thead', () => {
					let dayOrder = [2, 3, 4, 5, 6, 0, 1];
					return [
						v(
							'tr',
							dayOrder.map((order) =>
								v(
									'th',
									{
										role: 'columnheader',
										classes: css.weekday
									},
									[
										v('abbr', { title: DEFAULT_WEEKDAYS[order].long }, [
											DEFAULT_WEEKDAYS[order].short
										])
									]
								)
							)
						)
					];
				})
				.replaceChildren('tbody', () => {
					let dateIndex = 0;
					return [
						v('tr', [
							expectedDateCell(dateIndex++, 30, false),
							expectedDateCell(dateIndex++, 31, false),
							expectedDateCell(dateIndex++, 1, true),
							expectedDateCell(dateIndex++, 2, true),
							expectedDateCell(dateIndex++, 3, true),
							expectedDateCell(dateIndex++, 4, true),
							expectedDateCell(dateIndex++, 5, true)
						]),
						v('tr', [
							expectedDateCell(dateIndex++, 6, true),
							expectedDateCell(dateIndex++, 7, true),
							expectedDateCell(dateIndex++, 8, true),
							expectedDateCell(dateIndex++, 9, true),
							expectedDateCell(dateIndex++, 10, true),
							expectedDateCell(dateIndex++, 11, true),
							expectedDateCell(dateIndex++, 12, true)
						]),
						v('tr', [
							expectedDateCell(dateIndex++, 13, true),
							expectedDateCell(dateIndex++, 14, true),
							expectedDateCell(dateIndex++, 15, true),
							expectedDateCell(dateIndex++, 16, true),
							expectedDateCell(dateIndex++, 17, true),
							expectedDateCell(dateIndex++, 18, true),
							expectedDateCell(dateIndex++, 19, true)
						]),
						v('tr', [
							expectedDateCell(dateIndex++, 20, true),
							expectedDateCell(dateIndex++, 21, true),
							expectedDateCell(dateIndex++, 22, true),
							expectedDateCell(dateIndex++, 23, true),
							expectedDateCell(dateIndex++, 24, true),
							expectedDateCell(dateIndex++, 25, true),
							expectedDateCell(dateIndex++, 26, true)
						]),
						v('tr', [
							expectedDateCell(dateIndex++, 27, true),
							expectedDateCell(dateIndex++, 28, true),
							expectedDateCell(dateIndex++, 29, true),
							expectedDateCell(dateIndex++, 30, true),
							expectedDateCell(dateIndex++, 1, false),
							expectedDateCell(dateIndex++, 2, false),
							expectedDateCell(dateIndex++, 3, false)
						]),
						v('tr', [
							expectedDateCell(dateIndex++, 4, false),
							expectedDateCell(dateIndex++, 5, false),
							expectedDateCell(dateIndex++, 6, false),
							expectedDateCell(dateIndex++, 7, false),
							expectedDateCell(dateIndex++, 8, false),
							expectedDateCell(dateIndex++, 9, false),
							expectedDateCell(dateIndex++, 10, false)
						])
					];
				});
			h.expect(firstDayOfWeekTemplate);
		}
	}
});

registerSuite('Calendar with min-max', {
	tests: {
		'Render specific month not limited by min/max'() {
			const minDate = new Date('May 15, 2017');
			const maxDate = new Date('July 15, 2017');

			const h = harness(() =>
				w(Calendar, {
					month: testDate.getMonth(),
					year: testDate.getFullYear(),
					minDate,
					maxDate
				})
			);
			h.expect(
				baseTemplate
					.setProperty('@date-picker', 'minDate', minDate)
					.setProperty('@date-picker', 'maxDate', maxDate)
			);
		},

		'Render the month and year with min and max date limitations'() {
			const h = harness(() =>
				w(Calendar, {
					selectedDate: testDate,
					minDate: minDateInMonth,
					maxDate: maxDateInMonth
				})
			);

			h.expect(baseMinMaxTemplate.setProperty('@date-8', 'selected', true));
		},

		'Set the focusable date when the month change makes it invalid'() {
			const maxDate = new Date('June 24, 2017');
			const calendarProperties: CalendarProperties = {
				month: testDate.getMonth() - 1,
				year: testDate.getFullYear(),
				maxDate
			};

			const h = harness(() => w(Calendar, calendarProperties));

			h.trigger('@date-1', 'onKeyDown', Keys.Down, () => {});
			h.trigger('@date-8', 'onKeyDown', Keys.Down, () => {});
			h.trigger('@date-15', 'onKeyDown', Keys.Down, () => {});
			h.trigger('@date-22', 'onKeyDown', Keys.Down, () => {});

			h.expectPartial('@date-29', () =>
				w(CalendarCell, {
					key: `date-29`,
					callFocus: true,
					date: 29,
					outOfRange: false,
					disabled: false,
					focusable: true, // 29nd is focused
					selected: false,
					theme: undefined,
					classes: undefined,
					today: false,
					onClick: noop,
					onFocusCalled: noop,
					onKeyDown: noop
				})
			);

			// Change to next month so 29th cell is invalid
			calendarProperties.month = testDate.getMonth();

			h.expect(
				baseTemplate
					.setProperty('@date-picker', 'maxDate', maxDate)
					.setProperty('@date-4', 'focusable', false)
					.replaceChildren('tbody tr:nth-child(5)', () => {
						let dateIndex = 28;
						return [
							expectedDateCell(dateIndex++, 25, true, true),
							expectedDateCell(dateIndex++, 26, true, true),
							expectedDateCell(dateIndex++, 27, true, true),
							expectedDateCell(dateIndex++, 28, true, true),
							expectedDateCell(dateIndex++, 29, true, true),
							expectedDateCell(dateIndex++, 30, true, true),
							expectedDateCell(dateIndex++, 1, false, true)
						];
					})
					.replaceChildren('tbody tr:last-child', () => {
						let dateIndex = 35;
						return [
							expectedDateCell(dateIndex++, 2, false, true),
							expectedDateCell(dateIndex++, 3, false, true),
							expectedDateCell(dateIndex++, 4, false, true),
							expectedDateCell(dateIndex++, 5, false, true),
							expectedDateCell(dateIndex++, 6, false, true),
							expectedDateCell(dateIndex++, 7, false, true),
							expectedDateCell(dateIndex++, 8, false, true)
						];
					})
					.setProperty('@date-27', 'focusable', true)
					.setProperty('@date-27', 'callFocus', true)
					.setProperty('~nextMonth', 'disabled', true)
			);
		},

		'Allows the selected date even if outside the min/max'() {
			const h = harness(() =>
				w(Calendar, {
					selectedDate: new Date('June 1, 2017'),
					minDate: minDateInMonth,
					maxDate: maxDateInMonth
				})
			);

			h.expect(baseMinMaxTemplate.setProperty('@date-4', 'selected', true));
		},

		'Click to select date does not click outOfRange dates'() {
			const defaultDate = testDate.toDateString();
			let selectedDate = testDate.toDateString();
			const h = harness(() =>
				w(Calendar, {
					month: testDate.getMonth(),
					year: testDate.getFullYear(),
					minDate: minDateInMonth,
					maxDate: maxDateInMonth,
					onDateSelect: (date: Date) => {
						selectedDate = date.toDateString();
					}
				})
			);

			h.trigger('@date-2', 'onClick', 30, true);
			assert.strictEqual(
				selectedDate,
				defaultDate,
				'Clicking outOfRange date from last month does not select'
			);

			h.trigger('@date-5', 'onClick', 2, false);
			assert.strictEqual(
				selectedDate,
				defaultDate,
				'Clicking outOfRange date at beginning of the month does not select'
			);

			h.trigger('@date-33', 'onClick', 30, false);
			assert.strictEqual(
				selectedDate,
				defaultDate,
				'Clicking outOfRange date at end of the month does not select'
			);

			h.trigger('@date-35', 'onClick', 2, true);
			assert.strictEqual(
				selectedDate,
				defaultDate,
				'Clicking outOfRange date in next month does not select'
			);

			h.trigger('@date-20', 'onClick', 17, false);
			assert.strictEqual(
				selectedDate,
				new Date('June 17, 2017').toDateString(),
				'Clicking in range date selects'
			);
		},

		'Arrow keys keep month in min/max'() {
			let originalMonth = testDate.getMonth();
			let currentMonth = originalMonth;
			const h = harness(() =>
				w(Calendar, {
					month: currentMonth,
					year: testDate.getFullYear(),
					minDate: minDateInMonth,
					maxDate: maxDateInMonth,
					onMonthChange: (month: number) => {
						currentMonth = month;
					}
				})
			);

			h.trigger('@date-4', 'onKeyDown', Keys.Left, () => {});
			assert.strictEqual(
				currentMonth,
				originalMonth,
				'Going left from the first day does not change the month'
			);

			h.trigger('@date-4', 'onKeyDown', Keys.PageDown, () => {});
			h.trigger('@date-4', 'onKeyDown', Keys.Right, () => {});
			assert.strictEqual(
				currentMonth,
				testDate.getMonth(),
				'Going right from the last day does not change the month'
			);
		}
	}
});
