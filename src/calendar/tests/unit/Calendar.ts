import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import harness, { Harness } from '@dojo/test-extras/harness';
import { compareProperty, assignProperties, assignChildProperties, replaceChild, findKey } from '@dojo/test-extras/support/d';
import { v, w } from '@dojo/widget-core/d';
import { Keys } from '../../../common/util';

import CalendarCell from '../../CalendarCell';
import DatePicker from '../../DatePicker';
import Calendar, { CalendarProperties, DEFAULT_MONTHS, DEFAULT_LABELS, DEFAULT_WEEKDAYS } from '../../Calendar';
import * as css from '../../styles/calendar.m.css';
import * as baseCss from '../../../common/styles/base.m.css';
import * as iconCss from '../../../common/styles/icons.m.css';

let widget: Harness<CalendarProperties, typeof Calendar>;
const testDate = new Date('June 3 2017');

const compareId = compareProperty((value: any) => {
	return typeof value === 'string';
});

let dateIndex = -1;
const expectedDateCell = function(widget: any, date: number, active: boolean) {
	dateIndex++;
	return w<CalendarCell>('date-cell', {
		key: `date-${dateIndex}`,
		callFocus: false,
		date,
		disabled: !active,
		focusable: date === 1 && active,
		selected: false,
		today: active && new Date().toDateString() === new Date(`June ${date} 2017`).toDateString(),
		onClick: widget.listener,
		onFocusCalled: widget.listener,
		onKeyDown: widget.listener
	});
};

const expected = function(widget: any, popupOpen = false) {
	dateIndex = -1;
	return v('div', { classes: widget.classes(css.root) }, [
		w(DatePicker, {
			key: 'date-picker',
			labelId: <any> compareId,
			labels: DEFAULT_LABELS,
			month: 5,
			monthNames: DEFAULT_MONTHS,
			renderMonthLabel: undefined,
			year: 2017,
			onPopupChange: widget.listener,
			onRequestMonthChange: widget.listener,
			onRequestYearChange: widget.listener
		}),
		v('table', {
			cellspacing: '0',
			cellpadding: '0',
			role: 'grid',
			'aria-labelledby': compareId, // this._monthLabelId,
			classes: widget.classes(css.dateGrid, popupOpen ? baseCss.visuallyHidden : null)
		}, [
			v('thead', [
				v('tr', DEFAULT_WEEKDAYS.map((weekday: { short: string; long: string; }) => v('th', {
						role: 'columnheader',
						classes: widget.classes(css.weekday)
					}, [
						v('abbr', { title: weekday.long }, [ weekday.short ])
					])
				))
			]),
			v('tbody', [
				v('tr', [
					expectedDateCell(widget, 28, false),
					expectedDateCell(widget, 29, false),
					expectedDateCell(widget, 30, false),
					expectedDateCell(widget, 31, false),
					expectedDateCell(widget, 1, true),
					expectedDateCell(widget, 2, true),
					expectedDateCell(widget, 3, true)
				]),
				v('tr', [
					expectedDateCell(widget, 4, true),
					expectedDateCell(widget, 5, true),
					expectedDateCell(widget, 6, true),
					expectedDateCell(widget, 7, true),
					expectedDateCell(widget, 8, true),
					expectedDateCell(widget, 9, true),
					expectedDateCell(widget, 10, true)
				]),
				v('tr', [
					expectedDateCell(widget, 11, true),
					expectedDateCell(widget, 12, true),
					expectedDateCell(widget, 13, true),
					expectedDateCell(widget, 14, true),
					expectedDateCell(widget, 15, true),
					expectedDateCell(widget, 16, true),
					expectedDateCell(widget, 17, true)
				]),
				v('tr', [
					expectedDateCell(widget, 18, true),
					expectedDateCell(widget, 19, true),
					expectedDateCell(widget, 20, true),
					expectedDateCell(widget, 21, true),
					expectedDateCell(widget, 22, true),
					expectedDateCell(widget, 23, true),
					expectedDateCell(widget, 24, true)
				]),
				v('tr', [
					expectedDateCell(widget, 25, true),
					expectedDateCell(widget, 26, true),
					expectedDateCell(widget, 27, true),
					expectedDateCell(widget, 28, true),
					expectedDateCell(widget, 29, true),
					expectedDateCell(widget, 30, true),
					expectedDateCell(widget, 1, false)
				]),
				v('tr', [
					expectedDateCell(widget, 2, false),
					expectedDateCell(widget, 3, false),
					expectedDateCell(widget, 4, false),
					expectedDateCell(widget, 5, false),
					expectedDateCell(widget, 6, false),
					expectedDateCell(widget, 7, false),
					expectedDateCell(widget, 8, false)
				])
			])
		]),
		v('div', {
			classes: widget.classes(css.controls, popupOpen ? baseCss.visuallyHidden : null)
		}, [
			v('button', {
				classes: widget.classes(css.previous),
				tabIndex: popupOpen ? -1 : 0,
				onclick: widget.listener
			}, [
				v('i', { classes: widget.classes(iconCss.icon, iconCss.leftIcon),
					role: 'presentation', 'aria-hidden': 'true'
				}),
				v('span', { classes: widget.classes(baseCss.visuallyHidden) }, [ 'Previous Month' ])
			]),
			v('button', {
				classes: widget.classes(css.next),
				tabIndex: popupOpen ? -1 : 0,
				onclick: widget.listener
			}, [
				v('i', { classes: widget.classes(iconCss.icon, iconCss.rightIcon),
					role: 'presentation', 'aria-hidden': 'true'
				}),
				v('span', { classes: widget.classes(baseCss.visuallyHidden) }, [ 'Next Month' ])
			])
		])
	]);
};

registerSuite({
	name: 'Calendar',

	beforeEach() {
		widget = harness(Calendar);
	},

	afterEach() {
		widget.destroy();
	},

	'Render specific month with default props'() {
		widget.setProperties({
			theme: {},
			month: testDate.getMonth(),
			year: testDate.getFullYear()
		});
		widget.expectRender(expected(widget), 'Renders June 2017 by setting month and year props');
	},

	'Render specific month and year with selectedDate'() {
		widget.setProperties({
			selectedDate: testDate
		});

		const expectedVdom = expected(widget);
		assignProperties(findKey(expectedVdom, 'date-6')!, {
			selected: true
		});

		widget.expectRender(expectedVdom, 'Renders June 2017 with correct selected date');
	},

	'Renders with custom properties'() {
		widget.setProperties({
			customDateCell: CalendarCell,
			labels: DEFAULT_LABELS,
			month: testDate.getMonth(),
			monthNames: DEFAULT_MONTHS,
			selectedDate: new Date('June 1 2017'),
			weekdayNames: DEFAULT_WEEKDAYS,
			year: testDate.getFullYear(),
			renderMonthLabel: (month: number, year: number) => 'Foo',
			renderWeekdayCell: (day: { short: string; long: string; }) => 'Bar'
		});

		let expectedVdom = expected(widget);

		for (let i = 0; i < 7; i++) {
			replaceChild(expectedVdom, `1,0,0,${i},0`, 'Bar');
		}
		assignProperties(findKey(expectedVdom, 'date-4')!, {
			selected: true
		});
		assignChildProperties(expectedVdom, '0', {
			renderMonthLabel: widget.listener
		});

		widget.expectRender(expectedVdom);

		class CustomCalendarCell extends CalendarCell {}
		widget.setProperties({
			month: testDate.getMonth(),
			year: testDate.getFullYear()
		});
		expectedVdom = expected(widget);
		widget.expectRender(expectedVdom, 'renders with updated properties');
	},

	'Click to select date'() {
		let selectedDate = testDate;
		widget.setProperties({
			month: testDate.getMonth(),
			year: testDate.getFullYear(),
			onDateSelect: (date: Date) => {
				selectedDate = date;
			}
		});

		widget.callListener('onClick', {
			args: [1, false],
			key: 'date-4'
		});

		assert.strictEqual(selectedDate.getDate(), 1, 'Clicking cell selects correct date');
		assert.strictEqual(selectedDate.getMonth(), 5, 'Clicking active date has correct month');
		assert.strictEqual(selectedDate.getFullYear(), 2017, 'Clicking date keeps current year');
	},

	'Clicking on disabled dates changes month'() {
		let currentMonth = testDate.getMonth();
		let selectedDate = testDate;
		widget.setProperties({
			month: currentMonth,
			year: testDate.getFullYear(),
			onMonthChange: (month: number) => {
				currentMonth = month;
			},
			onDateSelect: (date: Date) => {
				selectedDate = date;
			}
		});

		widget.callListener('onClick', {
			args: [1, true],
			key: 'date-34'
		});
		assert.strictEqual(currentMonth, 6, 'Month changes to July');
		assert.strictEqual(selectedDate.getMonth(), 6, 'selected date in July');
		assert.strictEqual(selectedDate.getDate(), 1, 'selected correct date in July');

		widget.callListener('onClick', {
			args: [30, true],
			key: 'date-2'
		});
		assert.strictEqual(currentMonth, 4, 'Month changes to May');
		assert.strictEqual(selectedDate.getMonth(), 4, 'selected date in May');
		assert.strictEqual(selectedDate.getDate(), 30, 'selected correct date in May');
	},

	'Keyboard date select'() {
		let selectedDate = testDate;
		widget.setProperties({
			month: testDate.getMonth(),
			year: testDate.getFullYear(),
			onDateSelect: (date: Date) => {
				selectedDate = date;
			}
		});

		// right arrow, then select
		widget.callListener('onKeyDown', {
			args: [{
				which: Keys.Right,
				preventDefault: () => {}
			}],
			key: 'date-4'
		});
		// not a good way to test this, but this would be called with the arrow key
		widget.callListener('onFocusCalled', {
			key: 'date-4'
		});
		widget.callListener('onKeyDown', {
			args: [{
				which: Keys.Enter,
				preventDefault: () => {}
			}],
			key: 'date-5'
		});
		assert.strictEqual(selectedDate.getDate(), 2, 'Right arrow + enter selects second day');
		assert.strictEqual(selectedDate.getMonth(), 5, 'Selected date is same month');

		// down arrow
		widget.callListener('onKeyDown', {
			args: [{
				which: Keys.Down,
				preventDefault: () => {}
			}],
			key: 'date-5'
		});
		widget.callListener('onKeyDown', {
			args: [{
				which: Keys.Enter,
				preventDefault: () => {}
			}],
			key: 'date-12'
		});
		assert.strictEqual(selectedDate.getDate(), 9, 'Down arrow + enter selects one week down');
		assert.strictEqual(selectedDate.getMonth(), 5, 'Selected date is same month');

		// left arrow
		widget.callListener('onKeyDown', {
			args: [{
				which: Keys.Left,
				preventDefault: () => {}
			}],
			key: 'date-12'
		});
		widget.callListener('onKeyDown', {
			args: [{
				which: Keys.Space,
				preventDefault: () => {}
			}],
			key: 'date-11'
		});
		assert.strictEqual(selectedDate.getDate(), 8, 'Left arrow + space selects previous day');
		assert.strictEqual(selectedDate.getMonth(), 5, 'Selected date is same month');

		// up arrow
		widget.callListener('onKeyDown', {
			args: [{
				which: Keys.Up,
				preventDefault: () => {}
			}],
			key: 'date-11'
		});
		widget.callListener('onKeyDown', {
			args: [{
				which: Keys.Space,
				preventDefault: () => {}
			}],
			key: 'date-4'
		});
		assert.strictEqual(selectedDate.getDate(), 1, 'Left arrow + space selects previous day');
		assert.strictEqual(selectedDate.getMonth(), 5, 'Selected date is same month');

		// page down
		widget.callListener('onKeyDown', {
			args: [{
				which: Keys.PageDown,
				preventDefault: () => {}
			}],
			key: 'date-4'
		});
		widget.callListener('onKeyDown', {
			args: [{
				which: Keys.Space,
				preventDefault: () => {}
			}],
			key: 'date-33'
		});
		assert.strictEqual(selectedDate.getDate(), 30, 'Page Down + space selects last day');
		assert.strictEqual(selectedDate.getMonth(), 5, 'Selected date is same month');

		// page up
		widget.callListener('onKeyDown', {
			args: [{
				which: Keys.PageUp,
				preventDefault: () => {}
			}],
			key: 'date-33'
		});
		widget.callListener('onKeyDown', {
			args: [{
				which: Keys.Space,
				preventDefault: () => {}
			}],
			key: 'date-4'
		});
		assert.strictEqual(selectedDate.getDate(), 1, 'Page Up + space selects first day');
		assert.strictEqual(selectedDate.getMonth(), 5, 'Selected date is same month');
	},

	'Arrow keys can change month'() {
		let currentMonth = testDate.getMonth();
		widget.setProperties({
			month: currentMonth,
			year: testDate.getFullYear(),
			onMonthChange: (month: number) => {
				currentMonth = month;
			}
		});

		widget.callListener('onKeyDown', {
			args: [{
				which: Keys.Left,
				preventDefault: () => {}
			}],
			key: 'date-4'
		});
		assert.strictEqual(currentMonth, testDate.getMonth() - 1, 'Going left from the first day goes to previous month');

		widget.callListener('onKeyDown', {
			args: [{
				which: Keys.PageDown,
				preventDefault: () => {}
			}],
			key: 'date-4'
		});
		widget.callListener('onKeyDown', {
			args: [{
				which: Keys.Right,
				preventDefault: () => {}
			}],
			key: 'date-4'
		});
		assert.strictEqual(currentMonth, testDate.getMonth() + 1, 'Going right from the last day goes to next month');
	},

	'Month changes wrap and change year'() {
		let currentMonth = 0;
		let currentYear = 2017;
		widget.setProperties({
			month: currentMonth,
			year: currentYear,
			onMonthChange: (month: number) => {
				currentMonth = month;
			},
			onYearChange: (year: number) => {
				currentYear = year;
			}
		});

		widget.callListener('onKeyDown', {
			args: [{
				which: Keys.Up,
				preventDefault: () => {}
			}],
			key: 'date-0'
		});
		assert.strictEqual(currentMonth, 11, 'Previous month wraps from January to December');
		assert.strictEqual(currentYear, 2016, 'Year decrements when month wraps');

		widget.setProperties({
			month: 11,
			year: 2017,
			onMonthChange: (month: number) => {
				currentMonth = month;
			},
			onYearChange: (year: number) => {
				currentYear = year;
			}
		});

		widget.callListener('onKeyDown', {
			args: [{
				which: Keys.Down,
				preventDefault: () => {}
			}],
			key: 'date-35'
		});
		assert.strictEqual(currentMonth, 0, 'Next month wraps from December to January');
		assert.strictEqual(currentYear, 2018, 'Year increments when month wraps');
	},

	'Month popup events change month and year'() {
		let currentMonth = testDate.getMonth();
		let currentYear = testDate.getFullYear();
		widget.setProperties({
			month: currentMonth,
			year: currentYear,
			onMonthChange: (month: number) => {
				currentMonth = month;
			},
			onYearChange: (year: number) => {
				currentYear = year;
			}
		});

		widget.callListener('onRequestMonthChange', {
			args: [2],
			index: '0'
		});
		assert.strictEqual(currentMonth, 2, 'Popup month change event triggers calendar month change event');

		widget.callListener('onRequestYearChange', {
			args: [2018],
			index: '0'
		});
		assert.strictEqual(currentYear, 2018, 'Popup year change triggers calendar year change');
	},

	'Previous button should decrement month'() {
		let currentMonth = testDate.getMonth();
		widget.setProperties({
			month: currentMonth,
			onMonthChange: (month: number) => {
				currentMonth = month;
			}
		});

		widget.sendEvent('click', {
			selector: `.${css.previous}`
		});

		assert.strictEqual(currentMonth, testDate.getMonth() - 1, 'Previous button decrements month');
	},

	'Next button should increment month'() {
		let currentMonth = testDate.getMonth();
		widget.setProperties({
			month: currentMonth,
			onMonthChange: (month: number) => {
				currentMonth = month;
			}
		});

		widget.sendEvent('click', {
			selector: `.${css.next}`
		});

		assert.strictEqual(currentMonth, testDate.getMonth() + 1, 'Next button increments month');
	},

	'onPopupChange should control visibility'() {
		// Needed to get initial CSS classes on the component to then falsify
		expected(widget);
		widget.callListener('onPopupChange', {
			args: [true],
			key: 'date-picker'
		});
		widget.setProperties({
			month: testDate.getMonth(),
			year: testDate.getFullYear()
		});
		widget.expectRender(expected(widget, true), 'Date grid is hidden when onPopupOpen is called');
	}
});
