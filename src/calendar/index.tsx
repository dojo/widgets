import { tsx, create } from '@dojo/framework/core/vdom';
import { DNode } from '@dojo/framework/core/interfaces';
import { uuid } from '@dojo/framework/core/util';
import commonBundle from '../common/nls/common';
import { formatAriaProperties, Keys } from '../common/util';
import { monthInMin, monthInMax, isOutOfDateRange } from './date-utils';
import CalendarCell from './CalendarCell';
import DatePicker, { Paging } from './DatePicker';
import Icon from '../icon/index';
import calendarBundle from './nls/Calendar';
import * as css from '../theme/default/calendar.m.css';
import * as baseCss from '../common/styles/base.m.css';

import theme from '../middleware/theme';
import icache from '@dojo/framework/core/middleware/icache';
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
	/** Set the currently displayed month, 0-based */
	month?: number;
	/** Customize or internationalize full month names and abbreviations */
	monthNames?: { short: string; long: string }[];
	/** Function called when the user selects a date */
	onDateSelect?(date: Date): void;
	/** Function called when the month changes */
	onMonthChange?(month: number): void;
	/** Function called when the year changes */
	onYearChange?(year: number): void;
	/** Format the displayed current month and year */
	renderMonthLabel?(month: number, year: number): string;
	/** Format the weekday column headers */
	renderWeekdayCell?(day: { short: string; long: string }): DNode;
	/** The currently selected date */
	selectedDate?: Date;
	/** Customize or internationalize weekday names and abbreviations */
	weekdayNames?: { short: string; long: string }[];
	/** Set the currently displayed year */
	year?: number;
	/** Configure the first day of the calendar week, defaults to 0 (sunday) */
	firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
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

const factory = create({ icache, i18n, theme, focus }).properties<CalendarProperties>();

export const Calendar = factory(function Calendar({
	middleware: { icache, i18n, theme, focus },
	properties
}) {
	const themeCss = theme.classes(css);
	const { messages: commonMessages } = i18n.localize(commonBundle);
	const callDateFocus = icache.getOrSet('callDateFocus', false);
	const defaultDate = icache.getOrSet('defaultDate', new Date());
	const focusedDay = icache.getOrSet('focusedDay', 1);
	const monthLabelId = icache.getOrSet('monthLabelId', uuid());
	const popupOpen = icache.getOrSet('popupOpen', false);
	const shouldFocus = focus.shouldFocus();

	const {
		labels = i18n.localize(calendarBundle).messages,
		aria = {},
		selectedDate,
		minDate,
		maxDate,
		weekdayNames = getWeekdays(commonMessages),
		firstDayOfWeek = 0
	} = properties();
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
		const { month, selectedDate = defaultDate, year } = properties();

		return {
			month: typeof month === 'number' ? month : selectedDate.getMonth(),
			year: typeof year === 'number' ? year : selectedDate.getFullYear()
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
		const { onDateSelect } = properties();
		let { month, year } = getMonthYear();

		if (disabled) {
			({ month, year } = date < 15 ? onMonthIncrement() : onMonthDecrement());
			icache.set('callDateFocus', true);
		}
		icache.set('focusedDay', date);
		onDateSelect && onDateSelect(new Date(year, month, date));
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
				const { onDateSelect } = properties();
				onDateSelect && onDateSelect(new Date(year, month, focusedDay));
		}
	}

	function onMonthDecrement() {
		const { month, year } = getMonthYear();
		const { onMonthChange, onYearChange } = properties();

		if (month === 0) {
			onMonthChange && onMonthChange(11);
			onYearChange && onYearChange(year - 1);
			return { month: 11, year: year - 1 };
		}

		onMonthChange && onMonthChange(month - 1);
		return { month: month - 1, year: year };
	}

	function onMonthIncrement() {
		const { month, year } = getMonthYear();
		const { onMonthChange, onYearChange } = properties();

		if (month === 11) {
			onMonthChange && onMonthChange(0);
			onYearChange && onYearChange(year + 1);
			return { month: 0, year: year + 1 };
		}

		onMonthChange && onMonthChange(month + 1);
		return { month: month + 1, year: year };
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
			renderMonthLabel,
			theme,
			classes,
			onMonthChange,
			onYearChange,
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
				renderMonthLabel={renderMonthLabel}
				theme={theme}
				year={year}
				minDate={minDate}
				maxDate={maxDate}
				onPopupChange={(open: boolean) => {
					icache.set('popupOpen', open);
				}}
				onRequestMonthChange={(requestMonth: number) => {
					onMonthChange && onMonthChange(requestMonth);
				}}
				onRequestYearChange={(requestYear: number) => {
					onYearChange && onYearChange(requestYear);
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
		const { renderWeekdayCell } = properties();
		return renderWeekdayCell ? (
			renderWeekdayCell(day)
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
				<tbody>{renderDateGrid(selectedDate)}</tbody>
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
