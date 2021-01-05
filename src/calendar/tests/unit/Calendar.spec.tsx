const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import { tsx } from '@dojo/framework/core/vdom';
import { Keys } from '../../../common/util';

import bundle from '../../nls/Calendar';
import { DEFAULT_MONTHS, DEFAULT_WEEKDAYS } from '../support/defaults';
import Calendar, { CalendarProperties, CalendarCell, DatePicker } from '../../index';
import Icon from '../../../icon/index';
import * as css from '../../../theme/default/calendar.m.css';
import * as baseCss from '../../../common/styles/base.m.css';
import { compareTheme } from '../../../common/tests/support/test-helpers';
import {
	compareId,
	createHarness,
	compareAriaLabelledBy,
	compareLabelId,
	noop,
	stubEvent
} from '../../../common/tests/support/test-helpers';
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';

const testDate = new Date('June 5 2017');
const harness = createHarness([compareId, compareLabelId, compareAriaLabelledBy, compareTheme]);

/** Index of current expected date cell. Used by date cell factory function */
const expectedDateCell = function(
	dateIndex: number,
	date: number,
	currentMonth: boolean,
	outOfRange = false,
	selectedIndex = -1,
	focusIndex = -1
) {
	return (
		<CalendarCell
			key={`date-${dateIndex}`}
			callFocus={dateIndex === focusIndex}
			date={date}
			outOfRange={outOfRange}
			disabled={!currentMonth}
			focusable={
				date === 1 && currentMonth && (focusIndex === -1 || focusIndex === dateIndex)
			}
			selected={dateIndex === selectedIndex}
			theme={undefined}
			classes={undefined}
			variant={undefined}
			today={false}
			onClick={outOfRange ? undefined : noop}
			onFocusCalled={noop}
			onKeyDown={noop}
		/>
	);
};

const mayDates = (selectedIndex = -1, focusIndex = -1) => {
	let dateIndex = 0;
	return [
		<tr>
			{expectedDateCell(dateIndex++, 30, false, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 1, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 2, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 3, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 4, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 5, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 6, true, false, selectedIndex, focusIndex)}
		</tr>,
		<tr>
			{expectedDateCell(dateIndex++, 7, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 8, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 9, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 10, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 11, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 12, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 13, true, false, selectedIndex, focusIndex)}
		</tr>,
		<tr>
			{expectedDateCell(dateIndex++, 14, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 15, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 16, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 17, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 18, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 19, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 20, true, false, selectedIndex, focusIndex)}
		</tr>,
		<tr>
			{expectedDateCell(dateIndex++, 21, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 22, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 23, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 24, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 25, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 26, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 27, true, false, selectedIndex, focusIndex)}
		</tr>,
		<tr>
			{expectedDateCell(dateIndex++, 28, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 29, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 30, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 31, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 1, false, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 2, false, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 3, false, false, selectedIndex, focusIndex)}
		</tr>,
		<tr>
			{expectedDateCell(dateIndex++, 4, false, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 5, false, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 6, false, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 7, false, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 8, false, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 9, false, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 10, false, false, selectedIndex, focusIndex)}
		</tr>
	];
};

const julyDates = (selectedIndex = -1, focusIndex = -1) => {
	let dateIndex = 0;
	return [
		<tr>
			{expectedDateCell(dateIndex++, 25, false, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 26, false, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 27, false, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 28, false, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 29, false, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 30, false, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 1, true, false, selectedIndex, focusIndex)}
		</tr>,
		<tr>
			{expectedDateCell(dateIndex++, 2, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 3, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 4, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 5, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 6, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 7, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 8, true, false, selectedIndex, focusIndex)}
		</tr>,
		<tr>
			{expectedDateCell(dateIndex++, 9, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 10, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 11, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 12, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 13, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 14, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 15, true, false, selectedIndex, focusIndex)}
		</tr>,
		<tr>
			{expectedDateCell(dateIndex++, 16, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 17, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 18, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 19, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 20, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 21, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 22, true, false, selectedIndex, focusIndex)}
		</tr>,
		<tr>
			{expectedDateCell(dateIndex++, 23, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 24, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 25, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 26, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 27, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 28, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 29, true, false, selectedIndex, focusIndex)}
		</tr>,
		<tr>
			{expectedDateCell(dateIndex++, 30, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 31, true, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 1, false, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 2, false, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 3, false, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 4, false, false, selectedIndex, focusIndex)}
			{expectedDateCell(dateIndex++, 5, false, false, selectedIndex, focusIndex)}
		</tr>
	];
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
	return (
		<div classes={[undefined, css.root]} {...overrides}>
			<DatePicker
				key="date-picker"
				labelId=""
				labels={bundle.messages}
				month={5}
				monthNames={DEFAULT_MONTHS}
				renderMonthLabel={customMonthLabel ? noop : undefined}
				theme={undefined}
				classes={undefined}
				variant={undefined}
				year={2017}
				minDate={undefined}
				maxDate={undefined}
				onPopupChange={noop}
				onRequestMonthChange={noop}
				onRequestYearChange={noop}
			/>
			<table
				cellspacing="0"
				cellpadding="0"
				role="grid"
				aria-labelledby=""
				classes={[css.dateGrid, popupOpen ? baseCss.visuallyHidden : null]}
			>
				<thead>
					<tr>
						{DEFAULT_WEEKDAYS.map((weekday: { short: string; long: string }) => (
							<th role="columnheader" classes={css.weekday}>
								{weekdayLabel ? (
									weekdayLabel
								) : (
									<abbr title={weekday.long} classes={css.abbr}>
										{weekday.short}
									</abbr>
								)}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					<tr>
						{expectedDateCell(dateIndex++, 28, false, false, selectedIndex)}
						{expectedDateCell(dateIndex++, 29, false, false, selectedIndex)}
						{expectedDateCell(dateIndex++, 30, false, false, selectedIndex)}
						{expectedDateCell(dateIndex++, 31, false, false, selectedIndex)}
						{expectedDateCell(dateIndex++, 1, true, false, selectedIndex)}
						{expectedDateCell(dateIndex++, 2, true, false, selectedIndex)}
						{expectedDateCell(dateIndex++, 3, true, false, selectedIndex)}
					</tr>
					<tr>
						{expectedDateCell(dateIndex++, 4, true, false, selectedIndex)}
						{expectedDateCell(dateIndex++, 5, true, false, selectedIndex)}
						{expectedDateCell(dateIndex++, 6, true, false, selectedIndex)}
						{expectedDateCell(dateIndex++, 7, true, false, selectedIndex)}
						{expectedDateCell(dateIndex++, 8, true, false, selectedIndex)}
						{expectedDateCell(dateIndex++, 9, true, false, selectedIndex)}
						{expectedDateCell(dateIndex++, 10, true, false, selectedIndex)}
					</tr>
					<tr>
						{expectedDateCell(dateIndex++, 11, true, false, selectedIndex)}
						{expectedDateCell(dateIndex++, 12, true, false, selectedIndex)}
						{expectedDateCell(dateIndex++, 13, true, false, selectedIndex)}
						{expectedDateCell(dateIndex++, 14, true, false, selectedIndex)}
						{expectedDateCell(dateIndex++, 15, true, false, selectedIndex)}
						{expectedDateCell(dateIndex++, 16, true, false, selectedIndex)}
						{expectedDateCell(dateIndex++, 17, true, false, selectedIndex)}
					</tr>
					<tr>
						{expectedDateCell(dateIndex++, 18, true, false, selectedIndex)}
						{expectedDateCell(dateIndex++, 19, true, false, selectedIndex)}
						{expectedDateCell(dateIndex++, 20, true, false, selectedIndex)}
						{expectedDateCell(dateIndex++, 21, true, false, selectedIndex)}
						{expectedDateCell(dateIndex++, 22, true, false, selectedIndex)}
						{expectedDateCell(dateIndex++, 23, true, false, selectedIndex)}
						{expectedDateCell(dateIndex++, 24, true, false, selectedIndex)}
					</tr>
					<tr>
						{expectedDateCell(dateIndex++, 25, true, false, selectedIndex)}
						{expectedDateCell(dateIndex++, 26, true, false, selectedIndex)}
						{expectedDateCell(dateIndex++, 27, true, false, selectedIndex)}
						{expectedDateCell(dateIndex++, 28, true, false, selectedIndex)}
						{expectedDateCell(dateIndex++, 29, true, false, selectedIndex)}
						{expectedDateCell(dateIndex++, 30, true, false, selectedIndex)}
						{expectedDateCell(dateIndex++, 1, false, false, selectedIndex)}
					</tr>
					<tr>
						{expectedDateCell(dateIndex++, 2, false, false, selectedIndex)}
						{expectedDateCell(dateIndex++, 3, false, false, selectedIndex)}
						{expectedDateCell(dateIndex++, 4, false, false, selectedIndex)}
						{expectedDateCell(dateIndex++, 5, false, false, selectedIndex)}
						{expectedDateCell(dateIndex++, 6, false, false, selectedIndex)}
						{expectedDateCell(dateIndex++, 7, false, false, selectedIndex)}
						{expectedDateCell(dateIndex++, 8, false, false, selectedIndex)}
					</tr>
				</tbody>
			</table>
			<div classes={[css.controls, popupOpen ? baseCss.visuallyHidden : null]}>
				<button
					classes={css.previous}
					disabled={false}
					tabIndex={popupOpen ? -1 : 0}
					type="button"
					onclick={noop}
				>
					<Icon type="leftIcon" theme={{}} classes={undefined} variant={undefined} />
					<span classes={[baseCss.visuallyHidden]}>Previous Month</span>
				</button>
				<button
					classes={css.next}
					disabled={false}
					tabIndex={popupOpen ? -1 : 0}
					type="button"
					onclick={noop}
				>
					<Icon type="rightIcon" theme={{}} classes={undefined} variant={undefined} />
					<span classes={[baseCss.visuallyHidden]}>Next Month</span>
				</button>
			</div>
		</div>
	);
};
const baseTemplate = assertionTemplate(() => {
	let dateIndex = 0;
	return (
		<div classes={[undefined, css.root]}>
			<DatePicker
				key="date-picker"
				labelId=""
				labels={bundle.messages}
				month={5}
				monthNames={DEFAULT_MONTHS}
				renderMonthLabel={undefined}
				theme={undefined}
				classes={undefined}
				variant={undefined}
				year={2017}
				minDate={undefined}
				maxDate={undefined}
				onPopupChange={noop}
				onRequestMonthChange={noop}
				onRequestYearChange={noop}
			/>
			<table
				cellspacing="0"
				cellpadding="0"
				role="grid"
				aria-labelledby=""
				classes={[css.dateGrid, null]}
			>
				<thead>
					<tr>
						{DEFAULT_WEEKDAYS.map((weekday: { short: string; long: string }) => (
							<th role="columnheader" classes={css.weekday}>
								<abbr title={weekday.long} classes={css.abbr}>
									{weekday.short}
								</abbr>
							</th>
						))}
					</tr>
				</thead>
				<tbody assertion-key="dates">
					<tr>
						{expectedDateCell(dateIndex++, 28, false)}
						{expectedDateCell(dateIndex++, 29, false)}
						{expectedDateCell(dateIndex++, 30, false)}
						{expectedDateCell(dateIndex++, 31, false)}
						{expectedDateCell(dateIndex++, 1, true)}
						{expectedDateCell(dateIndex++, 2, true)}
						{expectedDateCell(dateIndex++, 3, true)}
					</tr>
					<tr>
						{expectedDateCell(dateIndex++, 4, true)}
						{expectedDateCell(dateIndex++, 5, true)}
						{expectedDateCell(dateIndex++, 6, true)}
						{expectedDateCell(dateIndex++, 7, true)}
						{expectedDateCell(dateIndex++, 8, true)}
						{expectedDateCell(dateIndex++, 9, true)}
						{expectedDateCell(dateIndex++, 10, true)}
					</tr>
					<tr>
						{expectedDateCell(dateIndex++, 11, true)}
						{expectedDateCell(dateIndex++, 12, true)}
						{expectedDateCell(dateIndex++, 13, true)}
						{expectedDateCell(dateIndex++, 14, true)}
						{expectedDateCell(dateIndex++, 15, true)}
						{expectedDateCell(dateIndex++, 16, true)}
						{expectedDateCell(dateIndex++, 17, true)}
					</tr>
					<tr>
						{expectedDateCell(dateIndex++, 18, true)}
						{expectedDateCell(dateIndex++, 19, true)}
						{expectedDateCell(dateIndex++, 20, true)}
						{expectedDateCell(dateIndex++, 21, true)}
						{expectedDateCell(dateIndex++, 22, true)}
						{expectedDateCell(dateIndex++, 23, true)}
						{expectedDateCell(dateIndex++, 24, true)}
					</tr>
					<tr>
						{expectedDateCell(dateIndex++, 25, true)}
						{expectedDateCell(dateIndex++, 26, true)}
						{expectedDateCell(dateIndex++, 27, true)}
						{expectedDateCell(dateIndex++, 28, true)}
						{expectedDateCell(dateIndex++, 29, true)}
						{expectedDateCell(dateIndex++, 30, true)}
						{expectedDateCell(dateIndex++, 1, false)}
					</tr>
					<tr>
						{expectedDateCell(dateIndex++, 2, false)}
						{expectedDateCell(dateIndex++, 3, false)}
						{expectedDateCell(dateIndex++, 4, false)}
						{expectedDateCell(dateIndex++, 5, false)}
						{expectedDateCell(dateIndex++, 6, false)}
						{expectedDateCell(dateIndex++, 7, false)}
						{expectedDateCell(dateIndex++, 8, false)}
					</tr>
				</tbody>
			</table>
			<div classes={[css.controls, null]}>
				<button
					assertion-key="previousMonth"
					classes={css.previous}
					disabled={false}
					tabIndex={0}
					type="button"
					onclick={noop}
				>
					<Icon type="leftIcon" theme={{}} classes={undefined} variant={undefined} />
					<span classes={[baseCss.visuallyHidden]}>Previous Month</span>
				</button>
				<button
					assertion-key="nextMonth"
					classes={css.next}
					disabled={false}
					tabIndex={0}
					type="button"
					onclick={noop}
				>
					<Icon type="rightIcon" theme={{}} classes={undefined} variant={undefined} />
					<span classes={[baseCss.visuallyHidden]}>Next Month</span>
				</button>
			</div>
		</div>
	);
});

registerSuite('Calendar', {
	tests: {
		'Render specific month with default props'() {
			const h = harness(() => <Calendar initialYear={2017} initialMonth={5} />);
			h.expect(expected);
		},

		'Controlled properties should always be rendered'() {
			const h = harness(() => (
				<Calendar
					initialMonth={6}
					initialYear={2018}
					initialValue={new Date(2018, 6)}
					value={testDate}
					month={5}
					year={2017}
				/>
			));

			h.expect(() => expected(false, 8));
			h.trigger('@date-picker', 'onRequestYearChange', 2018);
			h.trigger(`.${css.previous}`, 'onclick', stubEvent);
			h.expect(() => expected(false, 8));
		},

		'Render specific month and year with initialValue'() {
			const h = harness(() => <Calendar initialValue={testDate} />);

			h.expect(() => expected(false, 8));
		},

		'Renders with custom properties'() {
			let properties: any = {
				aria: { describedBy: 'foo' },
				labels: bundle.messages,
				monthNames: DEFAULT_MONTHS,
				initialValue: new Date('June 1 2017'),
				weekdayNames: DEFAULT_WEEKDAYS
			};
			let children: any = {
				monthLabel: () => 'Foo',
				weekdayCell: () => 'Bar'
			};
			const h = harness(() => <Calendar {...properties}>{children}</Calendar>);

			h.expect(() => expected(false, 4, 'Bar', true, 'foo'));
		},

		'Click to select date'() {
			let selectedDate = testDate;
			const h = harness(() => (
				<Calendar
					initialValue={testDate}
					onValue={(date: Date) => {
						selectedDate = date;
					}}
				/>
			));
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
			let selectedDate: Date = new Date();
			let properties = {
				initialValue: testDate,
				onValue(date: Date) {
					selectedDate = date;
				},
				onMonth(month: number) {
					currentMonth = month;
				}
			};
			const h = harness(() => <Calendar {...properties} />);

			h.trigger('@date-34', 'onClick', 1, true);
			h.expect(
				baseTemplate
					.setChildren('tbody', () => julyDates(6, 6))
					.setProperty('@date-picker', 'month', 6)
			);
			h.trigger('@date-6', 'onFocusCalled');
			h.expect(
				baseTemplate
					.setChildren('tbody', () => julyDates(6))
					.setProperty('@date-picker', 'month', 6)
			);
			assert.strictEqual(currentMonth, 6, 'Month changes to July');
			assert.strictEqual(selectedDate.getMonth(), 6, 'selected date in July');
			assert.strictEqual(selectedDate.getDate(), 1, 'selected correct date in July');
			h.trigger('@date-0', 'onClick', 30, true);
			h.trigger('@date-0', 'onClick', 30, true);
			h.trigger('@date-1', 'onClick', 1, false);

			h.expect(
				baseTemplate
					.setChildren('tbody', () => mayDates(1, 1))
					.setProperty('@date-picker', 'month', 4)
			);
			assert.strictEqual(currentMonth, 4, 'Month changes to May');
			assert.strictEqual(selectedDate.getMonth(), 4, 'selected date in May');
			assert.strictEqual(selectedDate.getDate(), 1, 'selected correct date in May');
		},

		'Keyboard date select'() {
			let selectedDate = testDate;
			const h = harness(() => (
				<Calendar
					initialValue={testDate}
					onValue={(date: Date) => {
						selectedDate = date;
					}}
				/>
			));

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
			const h = harness(() => (
				<Calendar
					initialYear={testDate.getFullYear()}
					initialMonth={currentMonth}
					onMonth={(month) => {
						currentMonth = month;
					}}
				/>
			));

			h.trigger('@date-4', 'onKeyDown', Keys.Left, () => {});
			h.expect(
				baseTemplate
					.setChildren('tbody', mayDates(-1, 31))
					.setProperty('@date-picker', 'month', 4)
					.setProperty('@date-31', 'focusable', true)
			);
			assert.strictEqual(currentMonth, 4);

			h.trigger('@date-4', 'onKeyDown', Keys.PageDown, () => {});
			h.trigger('@date-4', 'onKeyDown', Keys.Right, () => {});
			h.expect(baseTemplate.setProperty('@date-4', 'callFocus', true));
			assert.strictEqual(currentMonth, 5);
		},

		'Month change wraps to previous year'() {
			const initialValue = new Date('January 1, 2018');
			let currentMonth = initialValue.getMonth();
			let currentYear = initialValue.getFullYear();
			let properties = {
				initialMonth: currentMonth,
				initialYear: currentYear,
				onMonth(month: number) {
					currentMonth = month;
				},
				onYear(year: number) {
					currentYear = year;
				}
			};
			const h = harness(() => <Calendar {...properties} />);

			// Rollover year and continue to June
			h.trigger('@date-0', 'onKeyDown', Keys.Up, () => {});
			h.trigger('@date-0', 'onKeyDown', Keys.PageUp, () => {});
			h.trigger('@date-0', 'onKeyDown', Keys.Up, () => {});
			h.trigger('@date-0', 'onKeyDown', Keys.PageUp, () => {});
			h.trigger('@date-0', 'onKeyDown', Keys.Up, () => {});
			h.trigger('@date-0', 'onKeyDown', Keys.PageUp, () => {});
			h.trigger('@date-0', 'onKeyDown', Keys.Up, () => {});
			h.trigger('@date-0', 'onKeyDown', Keys.PageUp, () => {});
			h.trigger('@date-0', 'onKeyDown', Keys.Up, () => {});
			h.trigger('@date-0', 'onKeyDown', Keys.PageUp, () => {});
			h.trigger('@date-0', 'onKeyDown', Keys.Up, () => {});
			h.trigger('@date-0', 'onKeyDown', Keys.PageUp, () => {});
			h.trigger('@date-0', 'onKeyDown', Keys.Up, () => {});

			h.expect(
				baseTemplate
					// The 1st will not be focused because we've navigated to the 24th
					.setProperty('@date-4', 'focusable', false)
					.setProperty('@date-27', 'focusable', true)
					.setProperty('@date-27', 'callFocus', true)
			);
			assert.strictEqual(currentMonth, 5);
			assert.strictEqual(currentYear, 2017);
		},

		'Month change wraps to next year'() {
			const initialValue = new Date('December 1, 2016');
			let currentMonth = initialValue.getMonth();
			let currentYear = initialValue.getFullYear();
			let properties = {
				initialMonth: currentMonth,
				initialYear: currentYear,
				onMonth(month: number) {
					currentMonth = month;
				},
				onYear(year: number) {
					currentYear = year;
				}
			};
			const h = harness(() => <Calendar {...properties} />);

			// Rollover year and continue to June
			h.trigger('@date-0', 'onKeyDown', Keys.PageDown, () => {});
			h.trigger('@date-0', 'onKeyDown', Keys.Down, () => {});
			h.trigger('@date-0', 'onKeyDown', Keys.PageDown, () => {});
			h.trigger('@date-0', 'onKeyDown', Keys.Down, () => {});
			h.trigger('@date-0', 'onKeyDown', Keys.PageDown, () => {});
			h.trigger('@date-0', 'onKeyDown', Keys.Down, () => {});
			h.trigger('@date-0', 'onKeyDown', Keys.PageDown, () => {});
			h.trigger('@date-0', 'onKeyDown', Keys.Down, () => {});
			h.trigger('@date-0', 'onKeyDown', Keys.PageDown, () => {});
			h.trigger('@date-0', 'onKeyDown', Keys.Down, () => {});
			h.trigger('@date-0', 'onKeyDown', Keys.PageDown, () => {});
			h.trigger('@date-0', 'onKeyDown', Keys.Down, () => {});

			h.expect(
				baseTemplate
					// The 1st will not be focused because we've navigated to the 7th
					.setProperty('@date-4', 'focusable', false)
					.setProperty('@date-10', 'focusable', true)
					.setProperty('@date-10', 'callFocus', true)
			);
			assert.strictEqual(currentMonth, 5);
			assert.strictEqual(currentYear, 2017);
		},

		'Month popup events change month'() {
			let currentMonth = testDate.getMonth();
			const h = harness(() => (
				<Calendar
					initialYear={2017}
					initialMonth={currentMonth}
					onMonth={(month) => {
						currentMonth = month;
					}}
				/>
			));

			h.trigger('@date-picker', 'onRequestMonthChange', 4);
			h.expect(
				baseTemplate.setChildren('tbody', mayDates).setProperty('@date-picker', 'month', 4)
			);
			assert.strictEqual(currentMonth, 4);
		},

		'Year popup events change year'() {
			let currentYear = 2018;
			const h = harness(() => (
				<Calendar
					initialMonth={5}
					initialYear={currentYear}
					onYear={(year) => {
						currentYear = year;
					}}
				/>
			));

			h.trigger('@date-picker', 'onRequestYearChange', 2017);
			h.expect(baseTemplate);
			assert.strictEqual(currentYear, 2017);
		},

		'Previous button should decrement month'() {
			let currentMonth = testDate.getMonth();
			const h = harness(() => (
				<Calendar
					initialMonth={currentMonth}
					onMonth={(month: number) => {
						currentMonth = month;
					}}
				/>
			));

			h.trigger(`.${css.previous}`, 'onclick', stubEvent);
			assert.strictEqual(
				currentMonth,
				testDate.getMonth() - 1,
				'Previous button decrements month'
			);
		},

		'Next button should increment month'() {
			let currentMonth = testDate.getMonth();
			const h = harness(() => (
				<Calendar
					initialMonth={currentMonth}
					onMonth={(month: number) => {
						currentMonth = month;
					}}
				/>
			));

			h.trigger(`.${css.next}`, 'onclick', stubEvent);
			assert.strictEqual(
				currentMonth,
				testDate.getMonth() + 1,
				'Next button increments month'
			);
		},

		'onPopupChange should control visibility'() {
			let properties: any = {};
			const h = harness(() => <Calendar {...properties} />);
			h.trigger('@date-picker', 'onPopupChange', true);
			properties = {
				initialMonth: testDate.getMonth(),
				initialYear: testDate.getFullYear()
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
			const h = harness(() => (
				<Calendar
					initialMonth={testDate.getMonth()}
					initialYear={testDate.getFullYear()}
					firstDayOfWeek={2}
				/>
			));
			const firstDayOfWeekTemplate = baseTemplate
				.replaceChildren('thead', () => {
					let dayOrder = [2, 3, 4, 5, 6, 0, 1];
					return [
						<tr>
							{dayOrder.map((order) => (
								<th role="columnheader" classes={css.weekday}>
									<abbr title={DEFAULT_WEEKDAYS[order].long} classes={css.abbr}>
										{DEFAULT_WEEKDAYS[order].short}
									</abbr>
								</th>
							))}
						</tr>
					];
				})
				.replaceChildren('tbody', () => {
					let dateIndex = 0;
					return [
						<tr>
							{expectedDateCell(dateIndex++, 30, false)}
							{expectedDateCell(dateIndex++, 31, false)}
							{expectedDateCell(dateIndex++, 1, true)}
							{expectedDateCell(dateIndex++, 2, true)}
							{expectedDateCell(dateIndex++, 3, true)}
							{expectedDateCell(dateIndex++, 4, true)}
							{expectedDateCell(dateIndex++, 5, true)}
						</tr>,
						<tr>
							{expectedDateCell(dateIndex++, 6, true)}
							{expectedDateCell(dateIndex++, 7, true)}
							{expectedDateCell(dateIndex++, 8, true)}
							{expectedDateCell(dateIndex++, 9, true)}
							{expectedDateCell(dateIndex++, 10, true)}
							{expectedDateCell(dateIndex++, 11, true)}
							{expectedDateCell(dateIndex++, 12, true)}
						</tr>,
						<tr>
							{expectedDateCell(dateIndex++, 13, true)}
							{expectedDateCell(dateIndex++, 14, true)}
							{expectedDateCell(dateIndex++, 15, true)}
							{expectedDateCell(dateIndex++, 16, true)}
							{expectedDateCell(dateIndex++, 17, true)}
							{expectedDateCell(dateIndex++, 18, true)}
							{expectedDateCell(dateIndex++, 19, true)}
						</tr>,
						<tr>
							{expectedDateCell(dateIndex++, 20, true)}
							{expectedDateCell(dateIndex++, 21, true)}
							{expectedDateCell(dateIndex++, 22, true)}
							{expectedDateCell(dateIndex++, 23, true)}
							{expectedDateCell(dateIndex++, 24, true)}
							{expectedDateCell(dateIndex++, 25, true)}
							{expectedDateCell(dateIndex++, 26, true)}
						</tr>,
						<tr>
							{expectedDateCell(dateIndex++, 27, true)}
							{expectedDateCell(dateIndex++, 28, true)}
							{expectedDateCell(dateIndex++, 29, true)}
							{expectedDateCell(dateIndex++, 30, true)}
							{expectedDateCell(dateIndex++, 1, false)}
							{expectedDateCell(dateIndex++, 2, false)}
							{expectedDateCell(dateIndex++, 3, false)}
						</tr>,
						<tr>
							{expectedDateCell(dateIndex++, 4, false)}
							{expectedDateCell(dateIndex++, 5, false)}
							{expectedDateCell(dateIndex++, 6, false)}
							{expectedDateCell(dateIndex++, 7, false)}
							{expectedDateCell(dateIndex++, 8, false)}
							{expectedDateCell(dateIndex++, 9, false)}
							{expectedDateCell(dateIndex++, 10, false)}
						</tr>
					];
				});
			h.expect(firstDayOfWeekTemplate);
		}
	}
});

let environment: any;

registerSuite('Calendar with min-max', {
	beforeEach: () => {
		environment = { ...process.env };
	},
	afterEach: () => {
		process.env = environment;
	},
	tests: {
		'Render specific month not limited by min/max'() {
			const minDate = new Date('May 15, 2017');
			const maxDate = new Date('July 15, 2017');

			const h = harness(() => (
				<Calendar
					initialMonth={testDate.getMonth()}
					initialYear={testDate.getFullYear()}
					minDate={minDate}
					maxDate={maxDate}
				/>
			));
			h.expect(
				baseTemplate
					.setProperty('@date-picker', 'minDate', minDate)
					.setProperty('@date-picker', 'maxDate', maxDate)
			);
		},

		'Render the month and year with min and max date limitations'() {
			const h = harness(() => (
				<Calendar
					initialValue={testDate}
					minDate={minDateInMonth}
					maxDate={maxDateInMonth}
				/>
			));

			h.expect(baseMinMaxTemplate.setProperty('@date-8', 'selected', true));
		},

		'Time is ignored for minDate and maxDate'() {
			// Before/after must restore the `env` or this modification will leak
			process.env.TZ = 'Europe/London';
			const minDate = new Date('June 3, 2017 23:59:59.999');
			const maxDate = new Date('June 29, 2017 00:00:00.000');

			const h = harness(() => (
				<Calendar initialValue={testDate} minDate={minDate} maxDate={maxDate} />
			));
			h.expect(
				baseMinMaxTemplate
					.setProperty('@date-8', 'selected', true)
					.setProperty('@date-picker', 'minDate', minDate)
					.setProperty('@date-picker', 'maxDate', maxDate)
			);
		},

		'Set the focusable date when the month change makes it invalid'() {
			const maxDate = new Date('June 24, 2017');
			const calendarProperties: CalendarProperties = {
				initialMonth: testDate.getMonth() - 1,
				initialYear: testDate.getFullYear(),
				maxDate
			};

			const h = harness(() => <Calendar {...calendarProperties} />);

			h.trigger('@date-1', 'onKeyDown', Keys.Down, () => {});
			h.trigger('@date-8', 'onKeyDown', Keys.Down, () => {});
			h.trigger('@date-15', 'onKeyDown', Keys.Down, () => {});
			h.trigger('@date-22', 'onKeyDown', Keys.Down, () => {});

			h.expectPartial('@date-29', () => (
				<CalendarCell
					key="date-29"
					callFocus={true}
					date={29}
					outOfRange={false}
					disabled={false}
					focusable={true}
					selected={false}
					theme={undefined}
					classes={undefined}
					variant={undefined}
					today={false}
					onClick={noop}
					onFocusCalled={noop}
					onKeyDown={noop}
				/>
			));

			// Change to next month so 29th cell is invalid
			calendarProperties.initialMonth = testDate.getMonth();

			h.expect(
				baseTemplate
					.setProperty('@date-picker', 'maxDate', maxDate)
					// Defaults to selecting the max date if no initial date is provided and
					// today is not in range
					.setProperty('@date-27', 'selected', true)
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

		'Allows the initial value even if outside the min/max'() {
			const h = harness(() => (
				<Calendar
					initialValue={new Date('June 1, 2017')}
					minDate={minDateInMonth}
					maxDate={maxDateInMonth}
				/>
			));

			h.expect(baseMinMaxTemplate.setProperty('@date-4', 'selected', true));
		},

		'Click to select date does not click outOfRange dates'() {
			const defaultDate = testDate.toDateString();
			let selectedDate = testDate.toDateString();
			const h = harness(() => (
				<Calendar
					initialValue={testDate}
					minDate={minDateInMonth}
					maxDate={maxDateInMonth}
					onValue={(date: Date) => {
						selectedDate = date.toDateString();
					}}
				/>
			));

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
			const h = harness(() => (
				<Calendar
					initialMonth={currentMonth}
					initialYear={testDate.getFullYear()}
					minDate={minDateInMonth}
					maxDate={maxDateInMonth}
					onMonth={(month: number) => {
						currentMonth = month;
					}}
				/>
			));

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
