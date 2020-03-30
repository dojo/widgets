import { tsx, create } from '@dojo/framework/core/vdom';
import { DNode, RenderResult } from '@dojo/framework/core/interfaces';
import { uuid } from '@dojo/framework/core/util';
import commonBundle from '../common/nls/common';
import { formatAriaProperties, Keys } from '../common/util';
import { monthInMin, monthInMax, isOutOfDateRange, toDate } from './date-utils';
import CalendarCell from './CalendarCell';
import DatePicker, { Paging } from './DatePicker';
import Icon from '../icon/index';
import calendarBundle from './nls/Calendar';
import * as css from '../theme/default/calendar.m.css';
import * as baseCss from '../common/styles/base.m.css';

import theme from '../middleware/theme';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import focus from '@dojo/framework/core/middleware/focus';
import i18n from '@dojo/framework/core/middleware/i18n';

export type CalendarMessages = typeof calendarBundle.messages;

export enum FirstDayOfWeek {
	sunday = 0,
	monday = 1,
	tuesday = 2,
	wednesday = 3,
	thursday = 4,
	friday = 5,
	saturday = 6
}

export interface CalendarProperties {
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
	/** Customize or internationalize accessible text for the Calendar widget */
	labels?: CalendarMessages;
	/** Set the latest date the calendar will display (it will show the whole month but not allow later selections) */
	maxDate?: Date;
	/** Set the earliest date the calendar will display (it will show the whole month but not allow previous selections) */
	minDate?: Date;
	/** Customize or internationalize full month names and abbreviations */
	monthNames?: { short: string; long: string }[];
	/** Customize or internationalize weekday names and abbreviations */
	weekdayNames?: { short: string; long: string }[];
	/** Configure the first day of the calendar week, defaults to 0 (sunday) */
	firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
	/** The initial value */
	initialValue?: Date;
	/** Function called when the user selects a date */
	onValue?: (value: Date) => void;
}

export interface CalendarIcache {
	value?: Date;
	initialValue?: Date;
	callDateFocus?: boolean;
	focusedDay: number;
	monthLabelId: string;
	popupOpen?: boolean;
	selectedDate: Date;
}

export interface CalendarChildren {
	/** Format the displayed current month and year */
	monthLabel?: (month: number, year: number) => RenderResult;
	/** Format the weekday column headers */
	weekdayCell?: (day: { short: string; long: string }) => RenderResult;
}

interface ShortLong<T> {
	short: keyof T;
	long: keyof T;
}

const DEFAULT_MONTHS: ShortLong<typeof commonBundle.messages>[] = [
	{ short: 'janShort', long: 'january' },
	{ short: 'febShort', long: 'february' },
	{ short: 'marShort', long: 'march' },
	{ short: 'aprShort', long: 'april' },
	{ short: 'mayShort', long: 'may' },
	{ short: 'junShort', long: 'june' },
	{ short: 'julShort', long: 'july' },
	{ short: 'augShort', long: 'august' },
	{ short: 'sepShort', long: 'september' },
	{ short: 'octShort', long: 'october' },
	{ short: 'novShort', long: 'november' },
	{ short: 'decShort', long: 'december' }
];

const DEFAULT_WEEKDAYS: ShortLong<typeof commonBundle.messages>[] = [
	{ short: 'sunShort', long: 'sunday' },
	{ short: 'monShort', long: 'monday' },
	{ short: 'tueShort', long: 'tuesday' },
	{ short: 'wedShort', long: 'wednesday' },
	{ short: 'thuShort', long: 'thursday' },
	{ short: 'friShort', long: 'friday' },
	{ short: 'satShort', long: 'saturday' }
];

const factory = create({
	icache: createICacheMiddleware<CalendarIcache>(),
	i18n,
	theme,
	focus
})
	.properties<CalendarProperties>()
	.children<CalendarChildren | undefined>();

export const Calendar = factory(function Calendar({
	middleware: { icache, i18n, theme, focus },
	properties,
	id,
	children
}) {
	const themeCss = theme.classes(css);
	const { messages: commonMessages } = i18n.localize(commonBundle);

	const {
		labels = i18n.localize(calendarBundle).messages,
		aria = {},
		minDate,
		maxDate,
		initialValue,
		weekdayNames = getWeekdays(commonMessages),
		firstDayOfWeek = 0
	} = properties();

	const { monthLabel, weekdayCell } = children()[0] || ({} as CalendarChildren);

	const existingInitialValue = icache.getOrSet('initialValue', new Date());
	const callDateFocus = icache.getOrSet('callDateFocus', false);
	const focusedDay = icache.getOrSet('focusedDay', 1);
	const monthLabelId = icache.getOrSet('monthLabelId', id);
	const popupOpen = icache.getOrSet('popupOpen', false);
	const shouldFocus = focus.shouldFocus();
	let value = icache.get('value') || new Date();
	let selectedDate = icache.getOrSet('selectedDate', value);
	console.log('focusedDay', focusedDay);

	if (initialValue !== existingInitialValue) {
		value = toDate(initialValue);
		selectedDate = toDate(value.getTime());
		if (isOutOfDateRange(value, minDate, maxDate)) {
			value = toDate(maxDate);
		}
		icache.set('initialValue', toDate(initialValue));
		onValueChange(value);
	}

	const { year, month } = getMonthYear();

	let weekdayOrder: number[] = [];
	for (let i = firstDayOfWeek; i < firstDayOfWeek + 7; i++) {
		weekdayOrder.push(i > 6 ? i - 7 : i);
	}

	const weekdays = weekdayOrder.map((order) => (
		<th role="columnheader" classes={themeCss.weekday}>
			{renderWeekdayCell(weekdayNames[order])}
		</th>
	));

	function onValueChange(newValue: Date) {
		const { onValue } = properties();
		icache.set('value', newValue);
		icache.set('selectedDate', toDate(newValue.getTime()));
		onValue && onValue(newValue);
	}

	function getMonthLength(month: number, year: number) {
		const lastDate = new Date(year, month + 1, 0);
		return lastDate.getDate();
	}

	function getMonths(commonMessages: typeof commonBundle.messages) {
		return DEFAULT_MONTHS.map((month) => ({
			short: commonMessages[month.short],
			long: commonMessages[month.long]
		}));
	}

	function getMonthYear() {
		const value = icache.get('selectedDate') || new Date();
		return {
			month: value.getMonth(),
			year: value.getFullYear()
		};
	}

	function getWeekdays(commonMessages: typeof commonBundle.messages) {
		return DEFAULT_WEEKDAYS.map((weekday) => ({
			short: commonMessages[weekday.short],
			long: commonMessages[weekday.long]
		}));
	}

	function goToDate(day: number) {
		const { month, year } = getMonthYear();
		const currentMonthLength = getMonthLength(month, year);
		const previousMonthLength = getMonthLength(month - 1, year);

		ensureDayIsInMinMax(new Date(year, month, day), (updatedDay) => (day = updatedDay));

		if (day < 1) {
			onMonthDecrement();
			day += previousMonthLength;
		} else if (day > currentMonthLength) {
			onMonthIncrement();
			day -= currentMonthLength;
		}

		icache.set('focusedDay', day);
		icache.set('callDateFocus', true);
	}

	function onDateClick(date: number, disabled: boolean) {
		let { month, year } = getMonthYear();

		if (disabled) {
			({ month, year } = date < 15 ? onMonthIncrement() : onMonthDecrement());
			icache.set('callDateFocus', true);
		}
		icache.set('focusedDay', date);
		const dateValue = new Date(year, month, date);
		onValueChange(dateValue);
	}

	function onDateFocusCalled() {
		icache.set('callDateFocus', false);
	}

	function onDateKeyDown(key: number, preventDefault: () => void) {
		const { month, year } = getMonthYear();
		switch (key) {
			case Keys.Up:
				preventDefault();
				goToDate(focusedDay - 7);
				break;
			case Keys.Down:
				preventDefault();
				goToDate(focusedDay + 7);
				break;
			case Keys.Left:
				preventDefault();
				goToDate(focusedDay - 1);
				break;
			case Keys.Right:
				preventDefault();
				goToDate(focusedDay + 1);
				break;
			case Keys.PageUp:
				preventDefault();
				goToDate(1);
				break;
			case Keys.PageDown:
				preventDefault();
				const monthLengh = getMonthLength(month, year);
				goToDate(monthLengh);
				break;
			case Keys.Enter:
			case Keys.Space:
				onValueChange(new Date(year, month, focusedDay));
		}
	}

	function onMonthDecrement() {
		let { month, year } = getMonthYear();

		year = month === 0 ? year - 1 : year;
		month = month === 0 ? 11 : month - 1;
		selectedDate.setMonth(month);
		selectedDate.setFullYear(year);
		icache.set('selectedDate', selectedDate);
		return { month, year };
	}

	function onMonthIncrement() {
		let { month, year } = getMonthYear();

		year = month === 11 ? year + 1 : year;
		month = month === 11 ? 0 : month + 1;
		selectedDate.setMonth(month);
		selectedDate.setFullYear(year);
		icache.set('selectedDate', selectedDate);
		return { month, year };
	}

	function onMonthPageDown(event: MouseEvent) {
		event.stopPropagation();
		onMonthDecrement();
	}

	function onMonthPageUp(event: MouseEvent) {
		event.stopPropagation();
		onMonthIncrement();
	}

	function ensureDayIsInMinMax(newDate: Date, update: (day: number) => void) {
		const { minDate, maxDate } = properties();

		if (minDate && newDate < minDate) {
			update(minDate.getDate());
		} else if (maxDate && newDate > maxDate) {
			update(maxDate.getDate());
		}
	}

	function renderDateGrid(selectedDate?: Date) {
		const { month, year } = getMonthYear();
		const { firstDayOfWeek = 0 } = properties();

		ensureDayIsInMinMax(new Date(year, month, focusedDay), (newDay) =>
			icache.set('focusedDay', newDay)
		);
		const currentMonthLength = getMonthLength(month, year);
		const previousMonthLength = getMonthLength(month - 1, year);
		const currentMonthStartDay = new Date(year, month, 1).getDay();
		const initialWeekday =
			currentMonthStartDay - firstDayOfWeek < 0
				? currentMonthStartDay - firstDayOfWeek + 7
				: currentMonthStartDay - firstDayOfWeek;
		const todayString = new Date().toDateString();

		let dayIndex = 0;
		let isCurrentMonth = currentMonthStartDay === firstDayOfWeek;
		let cellMonth = isCurrentMonth ? month : month - 1;
		let date = isCurrentMonth ? 0 : previousMonthLength - initialWeekday;
		let isSelectedDay: boolean;
		let isToday: boolean;
		let weeks: DNode[] = [];
		let days: DNode[];
		let dateObj: Date;
		let dateString: string;
		let weekday: number;

		for (let week = 0; week < 6; week++) {
			days = [];

			for (weekday = 0; weekday < 7; weekday++) {
				// find the next date
				// if we've reached the end of the previous month, reset to 1
				if (date > dayIndex && date >= previousMonthLength) {
					date = 1;
					cellMonth++;
				}
				// if we've reached the end of the current month, reset to 1
				else if (date <= dayIndex && date >= currentMonthLength) {
					date = 1;
					cellMonth++;
				} else {
					date++;
				}

				// set isSelectedDay if the dates match
				dateObj = new Date(year, cellMonth, date);
				dateString = dateObj.toDateString();
				isSelectedDay = Boolean(selectedDate && dateString === selectedDate.toDateString());
				isCurrentMonth = month === cellMonth;
				isToday = dateString === todayString;

				days.push(
					renderDateCell(dateObj, dayIndex++, isSelectedDay, isCurrentMonth, isToday)
				);
			}

			weeks.push(<tr>{days}</tr>);
		}

		return weeks;
	}

	function renderDateCell(
		dateObj: Date,
		index: number,
		selected: boolean,
		currentMonth: boolean,
		today: boolean
	) {
		const { minDate, maxDate, theme, classes } = properties();

		const date = dateObj.getDate();
		const outOfRange = isOutOfDateRange(dateObj, minDate, maxDate);
		const focusable = currentMonth && date === icache.get('focusedDay');

		return (
			<CalendarCell
				classes={classes}
				key={`date-${index}`}
				callFocus={(callDateFocus || shouldFocus) && focusable}
				date={date}
				outOfRange={outOfRange}
				focusable={focusable}
				disabled={!currentMonth}
				selected={selected}
				theme={theme}
				today={today}
				onClick={outOfRange ? undefined : onDateClick}
				onFocusCalled={onDateFocusCalled}
				onKeyDown={onDateKeyDown}
			/>
		);
	}

	function renderDatePicker(
		commonMessages: typeof commonBundle.messages,
		labels: CalendarMessages
	) {
		const {
			monthNames = getMonths(commonMessages),
			theme,
			classes,
			minDate,
			maxDate
		} = properties();
		const { month, year } = getMonthYear();

		return (
			<DatePicker
				key="date-picker"
				classes={classes}
				labelId={monthLabelId}
				labels={labels}
				month={month}
				monthNames={monthNames}
				renderMonthLabel={monthLabel}
				theme={theme}
				year={year}
				minDate={minDate}
				maxDate={maxDate}
				onPopupChange={(open: boolean) => {
					icache.set('popupOpen', open);
				}}
				onRequestMonthChange={(requestMonth: number) => {
					selectedDate.setMonth(requestMonth);
					icache.set('selectedDate', selectedDate);
				}}
				onRequestYearChange={(requestYear: number) => {
					selectedDate.setFullYear(requestYear);
					icache.set('selectedDate', selectedDate);
				}}
			/>
		);
	}

	function renderPagingButtonContent(type: Paging, labels: CalendarMessages) {
		const { theme, classes } = properties();
		const iconType = type === Paging.next ? 'rightIcon' : 'leftIcon';
		const labelText = type === Paging.next ? labels.nextMonth : labels.previousMonth;

		return [
			<Icon
				type={iconType}
				theme={theme}
				classes={{ ...classes, '@dojo/widgets/icon': { icon: [themeCss.icon] } }}
			/>,
			<span classes={[baseCss.visuallyHidden]}>{labelText}</span>
		];
	}

	function renderWeekdayCell(day: { short: string; long: string }) {
		return weekdayCell ? (
			weekdayCell(day)
		) : (
			<abbr classes={themeCss.abbr} title={day.long}>
				{day.short}
			</abbr>
		);
	}

	return (
		<div classes={[theme.variant(), themeCss.root]} {...formatAriaProperties(aria)}>
			{renderDatePicker(commonMessages, labels)}
			<table
				cellspacing="0"
				cellpadding="0"
				role="grid"
				aria-labelledby={monthLabelId}
				classes={[themeCss.dateGrid, popupOpen ? baseCss.visuallyHidden : null]}
			>
				<thead>
					<tr>{weekdays}</tr>
				</thead>
				<tbody>{renderDateGrid(value)}</tbody>
			</table>
			<div classes={[themeCss.controls, popupOpen ? baseCss.visuallyHidden : null]}>
				<button
					classes={themeCss.previous}
					tabIndex={popupOpen ? -1 : 0}
					type="button"
					disabled={!monthInMin(year, month - 1, minDate)}
					onclick={onMonthPageDown}
				>
					{renderPagingButtonContent(Paging.previous, labels)}
				</button>
				<button
					classes={themeCss.next}
					tabIndex={popupOpen ? -1 : 0}
					type="button"
					disabled={!monthInMax(year, month + 1, maxDate)}
					onclick={onMonthPageUp}
				>
					{renderPagingButtonContent(Paging.next, labels)}
				</button>
			</div>
		</div>
	);
});

export default Calendar;
