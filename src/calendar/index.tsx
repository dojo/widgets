import { tsx, create } from '@dojo/framework/core/vdom';
import { DNode, RenderResult } from '@dojo/framework/core/interfaces';
import { formatAriaProperties, Keys } from '../common/util';
import { monthInMin, monthInMax, isOutOfDateRange, toDate } from './date-utils';
import Icon from '../icon/index';
import bundle from './nls/Calendar';
import * as css from '../theme/default/calendar.m.css';
import * as baseCss from '../common/styles/base.m.css';
import * as iconCss from '../theme/default/icon.m.css';

import theme from '../middleware/theme';
import icache, { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import focus from '@dojo/framework/core/middleware/focus';
import i18n from '@dojo/framework/core/middleware/i18n';

export type CalendarMessages = {
	chooseMonth: string;
	chooseYear: string;
	previousMonth: string;
	nextMonth: string;
	previousYears: string;
	nextYears: string;
};

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
	/** A controlled date value */
	value?: Date;
	/** Function called when the user selects a date */
	onValue?: (value: Date) => void;
	/** The initial month to display */
	initialMonth?: number;
	/** A controlled month value */
	month?: number;
	/** Function called when the month changes */
	onMonth?(month: number): void;
	/** The initial year to display */
	initialYear?: number;
	/** A controlled year value */
	year?: number;
	/** Function called when the year changes */
	onYear?(year: number): void;
}

export interface CalendarIcache {
	value: Date;
	initialValue: Date;
	initialMonth: number;
	month: number;
	initialYear: number;
	year: number;
	callDateFocus?: boolean;
	focusedDay: number;
	monthLabelId: string;
	popupOpen?: boolean;
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

const DEFAULT_MONTHS: ShortLong<typeof bundle.messages>[] = [
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

const DEFAULT_WEEKDAYS: ShortLong<typeof bundle.messages>[] = [
	{ short: 'sunShort', long: 'sunday' },
	{ short: 'monShort', long: 'monday' },
	{ short: 'tueShort', long: 'tuesday' },
	{ short: 'wedShort', long: 'wednesday' },
	{ short: 'thuShort', long: 'thursday' },
	{ short: 'friShort', long: 'friday' },
	{ short: 'satShort', long: 'saturday' }
];

interface CalendarCellProperties {
	/** Used to immediately call focus on the cell */
	callFocus?: boolean;
	/** The set date value */
	date: number;
	/** Whether the date is in the displayed month */
	disabled?: boolean;
	/** Whether the date can receive tab focus */
	focusable?: boolean;
	/** Handler for the click event */
	onClick?(date: number, disabled: boolean): void;
	/** Handler for when the cell receives focus */
	onFocusCalled?(): void;
	/** Handler for the key down event */
	onKeyDown?(key: number, preventDefault: () => void): void;
	/** if the date is outside the min/max */
	outOfRange?: boolean;
	/** if the date is currently selected */
	selected?: boolean;
	/** if the date the same as the current day */
	today?: boolean;
}

/**
 * Enum for next/previous buttons
 */
enum Paging {
	next = 'next',
	previous = 'previous'
}

/**
 * Enum for month or year controls
 */
enum Controls {
	month = 'month',
	year = 'year'
}

interface DatePickerProperties {
	/** Id to reference label containing current month and year */
	labelId?: string;
	/** Customize or internationalize accessible helper text */
	labels: CalendarMessages;
	/** Maximum date to be picked */
	maxDate?: Date;
	/** Minimum date to be picked */
	minDate?: Date;
	/** Currently displayed month (zero-based) */
	month: number;
	/** Array of full and abbreviated month names */
	monthNames: { short: string; long: string }[];
	/** Handles when a user action occurs that triggers a change in the month or year popup state */
	onPopupChange?(open: boolean): void;
	/** Handles when a month should change (month is zero-based) */
	onRequestMonthChange?(month: number): void;
	/** Handles when a year should change */
	onRequestYearChange?(year: number): void;
	/** Formats the displayed current month and year */
	renderMonthLabel?(month: number, year: number): RenderResult;
	/** Currently displayed year */
	year: number;
	/** Number of years to display in a single page of the year popup */
	yearRange?: number;
}

const BASE_YEAR = 2000;

export const CalendarCell = create({ theme }).properties<CalendarCellProperties>()(
	function CalendarCell({ middleware: { theme }, properties }) {
		const themeCss = theme.classes(css);
		const {
			callFocus,
			date,
			focusable = false,
			selected = false,
			onFocusCalled,
			disabled = false,
			outOfRange = false,
			today = false
		} = properties();

		function onClick(event: MouseEvent) {
			event.stopPropagation();
			const { date, disabled = false, onClick } = properties();
			onClick && onClick(date, disabled);
		}

		function onKeyDown(event: KeyboardEvent) {
			event.stopPropagation();
			const { onKeyDown } = properties();
			onKeyDown &&
				onKeyDown(event.which, () => {
					event.preventDefault();
				});
		}

		if (callFocus) {
			onFocusCalled && onFocusCalled();
		}

		return (
			<td
				key="root"
				focus={callFocus}
				role="gridcell"
				aria-selected={selected ? 'true' : 'false'}
				tabIndex={focusable ? 0 : -1}
				classes={[
					themeCss.date,
					disabled || outOfRange ? themeCss.inactiveDate : null,
					outOfRange ? themeCss.outOfRange : null,
					selected ? themeCss.selectedDate : null,
					today ? themeCss.todayDate : null
				]}
				onclick={onClick}
				onkeydown={onKeyDown}
			>
				<span>{`${date}`}</span>
			</td>
		);
	}
);

export const DatePicker = create({ theme, focus, icache }).properties<DatePickerProperties>()(
	function DatePicker({ middleware: { theme, focus, icache }, properties, id }) {
		const themeCss = theme.classes(css);
		const { labelId = `${id}_label`, labels, month, year } = properties();
		const keyWithFocus = icache.get<string>('keyWithFocus');
		const monthPopupOpen = icache.getOrSet('monthPopupOpen', false);
		const yearPopupOpen = icache.getOrSet('yearPopupOpen', false);
		const yearPage = icache.getOrSet('yearPage', 0);

		function closeMonthPopup(event?: MouseEvent) {
			if (event) {
				event.stopPropagation();
			}
			const { onPopupChange } = properties();
			icache.set('keyWithFocus', 'month-button');
			icache.set('monthPopupOpen', false);
			focus.focus();
			onPopupChange && onPopupChange(getPopupState());
		}

		function closeYearPopup(event?: MouseEvent) {
			if (event) {
				event.stopPropagation();
			}
			const { onPopupChange } = properties();
			icache.set('yearPopupOpen', false);
			icache.set('keyWithFocus', 'year-button');
			focus.focus();
			onPopupChange && onPopupChange(getPopupState());
		}

		function getMonthInputKey(month: number): string {
			return `${id}_month_input_${month}`;
		}

		function getPopupState() {
			const monthPopupOpen = icache.get('monthPopupOpen');
			const yearPopupOpen = icache.get('yearPopupOpen');
			return !!monthPopupOpen || !!yearPopupOpen;
		}

		function getYearInputKey(year: number): string {
			return `${id}_year_input_${year}`;
		}

		function getYearRange() {
			const { year, yearRange = 20 } = properties();
			const offset = ((year - BASE_YEAR) % yearRange) - yearRange * yearPage;

			if (year >= BASE_YEAR) {
				return { first: year - offset, last: year + yearRange - offset };
			} else {
				return { first: year - (yearRange + offset), last: year - offset };
			}
		}

		function onMonthButtonClick(event: MouseEvent) {
			event.stopPropagation();
			monthPopupOpen ? closeMonthPopup() : openMonthPopup();
		}

		function onMonthRadioChange(event: Event) {
			event.stopPropagation();
			const { onRequestMonthChange } = properties();
			onRequestMonthChange &&
				onRequestMonthChange(parseInt((event.target as HTMLInputElement).value, 10));
		}

		function onPopupKeyDown(event: KeyboardEvent) {
			event.stopPropagation();
			// close popup on escape, or if a value is selected with enter/space
			if (
				event.which === Keys.Escape ||
				event.which === Keys.Enter ||
				event.which === Keys.Space
			) {
				event.preventDefault();
				monthPopupOpen && closeMonthPopup();
				yearPopupOpen && closeYearPopup();
			}
		}

		function onYearButtonClick(event: MouseEvent) {
			event.stopPropagation();
			yearPopupOpen ? closeYearPopup() : openYearPopup();
		}

		function onYearPageDown(event: MouseEvent) {
			event.stopPropagation();
			icache.set('yearPage', yearPage - 1);
		}

		function onYearPageUp(event: MouseEvent) {
			event.stopPropagation();
			icache.set('yearPage', yearPage + 1);
		}

		function onYearRadioChange(event: Event) {
			event.stopPropagation();
			const {
				onRequestYearChange,
				month,
				minDate,
				maxDate,
				onRequestMonthChange
			} = properties();
			const newYear = parseInt((event.target as HTMLInputElement).value, 10);
			if (!monthInMinMax(newYear, month)) {
				// we know the year is valid but the month is out of range
				if (minDate && newYear === minDate.getFullYear()) {
					onRequestMonthChange && onRequestMonthChange(minDate.getMonth());
				} else if (maxDate && newYear === maxDate.getFullYear()) {
					onRequestMonthChange && onRequestMonthChange(maxDate.getMonth());
				}
			}
			icache.set('yearPage', 0);
			onRequestYearChange && onRequestYearChange(newYear);
		}

		function openMonthPopup() {
			const { month, onPopupChange } = properties();
			icache.set('monthPopupOpen', true);
			icache.set('yearPopupOpen', false);
			icache.set('keyWithFocus', getMonthInputKey(month));
			focus.focus();
			onPopupChange && onPopupChange(getPopupState());
		}

		function openYearPopup() {
			const { year, onPopupChange } = properties();
			icache.set('yearPopupOpen', true);
			icache.set('monthPopupOpen', false);
			icache.set('keyWithFocus', getYearInputKey(year));
			focus.focus();
			onPopupChange && onPopupChange(getPopupState());
		}

		function monthInMinMax(year: number, month: number) {
			let { minDate, maxDate } = properties();

			return monthInMin(year, month, minDate) && monthInMax(year, month, maxDate);
		}

		function yearInMinMax(year: number) {
			const { minDate, maxDate } = properties();
			const minYear = minDate ? minDate.getFullYear() : year;
			const maxYear = maxDate ? maxDate.getFullYear() : year;
			return year >= minYear && year <= maxYear;
		}

		function renderControlsTrigger(type: Controls) {
			const { month, monthNames, year } = properties();

			const content = type === Controls.month ? monthNames[month].long : `${year}`;
			const open = type === Controls.month ? monthPopupOpen : yearPopupOpen;
			const onclick = type === Controls.month ? onMonthButtonClick : onYearButtonClick;
			const key = `${type}-button`;

			return (
				<button
					key={key}
					aria-controls={`${id}_${type}_dialog`}
					aria-expanded={open ? 'true' : 'false'}
					aria-haspopup="true"
					id={`${id}_${type}_button`}
					classes={[
						(themeCss as any)[`${type}Trigger`],
						open ? (themeCss as any)[`${type}TriggerActive`] : null
					]}
					focus={keyWithFocus === key ? focus.shouldFocus : undefined}
					role="menuitem"
					type="button"
					onclick={onclick}
				>
					{content}
				</button>
			);
		}

		function renderMonthLabel(month: number, year: number) {
			const { monthNames, renderMonthLabel } = properties();
			return renderMonthLabel
				? renderMonthLabel(month, year)
				: `${monthNames[month].long} ${year}`;
		}

		function renderMonthRadios() {
			const { year, month, monthNames } = properties();
			return monthNames.map(({ short, long }, i) => {
				const key = getMonthInputKey(i);
				return (
					<label
						key={`${id}_month_radios_${i}`}
						classes={[
							themeCss.monthRadio,
							i === month ? themeCss.monthRadioChecked : null
						]}
						for={getMonthInputKey(i)}
						onmouseup={closeMonthPopup}
					>
						<input
							checked={i === month}
							classes={themeCss.monthRadioInput}
							id={key}
							key={key}
							name={`${id}_month_radios`}
							focus={keyWithFocus === key ? focus.shouldFocus : undefined}
							tabIndex={monthPopupOpen ? 0 : -1}
							type="radio"
							value={`${i}`}
							disabled={!monthInMinMax(year, i)}
							onchange={onMonthRadioChange}
						/>
						<abbr classes={themeCss.monthRadioLabel} title={long}>
							{short}
						</abbr>
					</label>
				);
			});
		}

		function renderPagingButtonContent(type: Paging) {
			const { labels, classes, variant } = properties();
			const iconType = type === Paging.next ? 'rightIcon' : 'leftIcon';
			const labelText = type === Paging.next ? labels.nextYears : labels.previousYears;

			return [
				<Icon
					type={iconType}
					theme={theme.compose(
						iconCss,
						css,
						'datePickerPaging'
					)}
					classes={classes}
					variant={variant}
				/>,
				<span classes={baseCss.visuallyHidden}>{labelText}</span>
			];
		}

		function renderYearRadios() {
			const { year } = properties();
			const radios = [];

			const yearLimits = getYearRange();
			for (let i = yearLimits.first; i < yearLimits.last; i++) {
				const key = getYearInputKey(i);
				radios.push(
					<label
						key={`${id}_year_radios_${i}`}
						classes={[
							themeCss.yearRadio,
							i === year ? themeCss.yearRadioChecked : null
						]}
						for={getYearInputKey(i)}
						onmouseup={closeYearPopup}
					>
						<input
							checked={i === year}
							classes={themeCss.yearRadioInput}
							id={key}
							key={key}
							name={`${id}_year_radios`}
							focus={keyWithFocus === key ? focus.shouldFocus : undefined}
							tabIndex={yearPopupOpen ? 0 : -1}
							type="radio"
							value={`${i}`}
							disabled={!yearInMinMax(i)}
							onchange={onYearRadioChange}
						/>
						<abbr classes={themeCss.yearRadioLabel}>{`${i}`}</abbr>
					</label>
				);
			}

			return radios;
		}

		return (
			<div classes={themeCss.datePicker}>
				<div classes={themeCss.topMatter} role="menubar">
					<label
						id={labelId}
						classes={[baseCss.visuallyHidden]}
						aria-live="polite"
						aria-atomic="false"
					>
						{renderMonthLabel(month, year)}
					</label>
					{renderControlsTrigger(Controls.month)}
					{renderControlsTrigger(Controls.year)}
				</div>

				<div
					key="month-grid"
					aria-hidden={monthPopupOpen ? 'false' : 'true'}
					aria-labelledby={`${id}_month_button`}
					classes={[themeCss.monthGrid, !monthPopupOpen ? baseCss.visuallyHidden : null]}
					id={`${id}_month_dialog`}
					role="dialog"
				>
					<fieldset classes={themeCss.monthFields} onkeydown={onPopupKeyDown}>
						<legend classes={baseCss.visuallyHidden}>{labels.chooseMonth}</legend>
						{renderMonthRadios()}
					</fieldset>
				</div>

				<div
					key="year-grid"
					aria-hidden={yearPopupOpen ? 'false' : 'true'}
					aria-labelledby={`${id}_year_button`}
					classes={[themeCss.yearGrid, !yearPopupOpen ? baseCss.visuallyHidden : null]}
					id={`${id}_year_dialog`}
					role="dialog"
				>
					<fieldset classes={themeCss.yearFields} onkeydown={onPopupKeyDown}>
						<legend classes={[baseCss.visuallyHidden]}>{labels.chooseYear}</legend>
						{...renderYearRadios()}
					</fieldset>
				</div>
				<div classes={themeCss.controls}>
					<button
						classes={themeCss.previous}
						tabindex={yearPopupOpen ? 0 : -1}
						type="button"
						onclick={onYearPageDown}
						disabled={!yearInMinMax(year - 1)}
					>
						{...renderPagingButtonContent(Paging.previous)}
					</button>
					<button
						classes={themeCss.next}
						tabindex={yearPopupOpen ? 0 : -1}
						type="button"
						onclick={onYearPageUp}
						disabled={!yearInMinMax(year + 1)}
					>
						{renderPagingButtonContent(Paging.next)}
					</button>
				</div>
			</div>
		);
	}
);

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
	const { messages: commonMessages } = i18n.localize(bundle);

	const {
		labels = i18n.localize(bundle).messages,
		aria = {},
		minDate,
		maxDate,
		initialValue,
		weekdayNames = getWeekdays(commonMessages),
		firstDayOfWeek = 0
	} = properties();

	let { value, month, year } = properties();
	const { monthLabel, weekdayCell } = children()[0] || ({} as CalendarChildren);
	const defaultDate = initialValue || new Date();
	const {
		initialYear = defaultDate.getFullYear(),
		initialMonth = defaultDate.getMonth()
	} = properties();

	const existingInitialValue = icache.get('initialValue');
	const existingInitialMonth = icache.get('initialMonth');
	const existingInitialYear = icache.get('initialYear');
	const callDateFocus = icache.getOrSet('callDateFocus', false);
	const focusedDay = icache.getOrSet('focusedDay', 1);
	const monthLabelId = icache.getOrSet('monthLabelId', id);
	const popupOpen = icache.getOrSet('popupOpen', false);
	const shouldFocus = focus.shouldFocus();
	if (!value) {
		value = icache.get('value') || new Date();

		if (!initialValue && !existingInitialValue) {
			value = toDate(defaultDate);

			if (isOutOfDateRange(value, minDate, maxDate)) {
				value = toDate(maxDate);
			}

			icache.set('initialValue', value);
			icache.set('value', value);
		}

		if (initialValue && initialValue !== existingInitialValue) {
			value = toDate(initialValue);

			icache.set('initialValue', toDate(initialValue));
			icache.set('value', value);
		}
	}

	if (typeof month === 'undefined') {
		if (initialMonth !== existingInitialMonth) {
			icache.set('initialMonth', initialMonth);
			icache.set('month', initialMonth);
		}
	}

	if (typeof year === 'undefined') {
		if (initialYear !== existingInitialYear) {
			icache.set('initialYear', initialYear);
			icache.set('year', initialYear);
		}
	}

	({ month, year } = getMonthYear());

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
		onValue && onValue(newValue);
	}

	function onMonthChange(newMonth: number) {
		const { onMonth } = properties();
		icache.set('month', newMonth);
		onMonth && onMonth(newMonth);
	}

	function onYearChange(newYear: number) {
		const { onYear } = properties();
		icache.set('year', newYear);
		onYear && onYear(newYear);
	}

	function getMonthLength(month: number, year: number) {
		const lastDate = new Date(year, month + 1, 0);
		return lastDate.getDate();
	}

	function getMonths(commonMessages: typeof bundle.messages) {
		return DEFAULT_MONTHS.map((month) => ({
			short: commonMessages[month.short],
			long: commonMessages[month.long]
		}));
	}

	function getMonthYear() {
		let { month, year, value } = properties();
		const selectedDate = value || icache.getOrSet('value', new Date());
		month = typeof month === 'number' ? month : icache.get('month');
		year = typeof year === 'number' ? year : icache.get('year');
		return {
			month: typeof month === 'number' ? month : selectedDate.getMonth(),
			year: typeof year === 'number' ? year : selectedDate.getFullYear()
		};
	}

	function getWeekdays(commonMessages: typeof bundle.messages) {
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
				const monthLength = getMonthLength(month, year);
				goToDate(monthLength);
				break;
			case Keys.Enter:
			case Keys.Space:
				onValueChange(new Date(year, month, focusedDay));
		}
	}

	function onMonthDecrement() {
		const { month, year } = getMonthYear();

		const newYear = month === 0 ? year - 1 : year;
		const newMonth = month === 0 ? 11 : month - 1;

		onMonthChange(newMonth);
		if (newYear !== year) {
			onYearChange(newYear);
		}

		return { month: newMonth, year: newYear };
	}

	function onMonthIncrement() {
		const { month, year } = getMonthYear();

		const newYear = month === 11 ? year + 1 : year;
		const newMonth = month === 11 ? 0 : month + 1;
		onMonthChange(newMonth);
		if (newYear !== year) {
			onYearChange(newYear);
		}
		return { month: newMonth, year: newYear };
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
		const { minDate, maxDate, theme, classes, variant } = properties();

		const date = dateObj.getDate();
		const outOfRange = isOutOfDateRange(dateObj, minDate, maxDate);
		const focusable = currentMonth && date === icache.get('focusedDay');

		return (
			<CalendarCell
				classes={classes}
				variant={variant}
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

	function renderDatePicker(commonMessages: typeof bundle.messages, labels: CalendarMessages) {
		const {
			monthNames = getMonths(commonMessages),
			theme,
			classes,
			variant,
			minDate,
			maxDate
		} = properties();
		const { month, year } = getMonthYear();

		return (
			<DatePicker
				key="date-picker"
				classes={classes}
				variant={variant}
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
					onMonthChange(requestMonth);
				}}
				onRequestYearChange={(requestYear: number) => {
					onYearChange(requestYear);
				}}
			/>
		);
	}

	function renderPagingButtonContent(type: Paging, labels: CalendarMessages) {
		const { classes, variant } = properties();
		const iconType = type === Paging.next ? 'rightIcon' : 'leftIcon';
		const labelText = type === Paging.next ? labels.nextMonth : labels.previousMonth;

		return [
			<Icon
				type={iconType}
				theme={theme.compose(
					iconCss,
					css,
					'calendarPaging'
				)}
				classes={classes}
				variant={variant}
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
