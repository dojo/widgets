import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { I18nMixin, I18nProperties } from '@dojo/framework/core/mixins/I18n';
import { FocusMixin } from '@dojo/framework/core/mixins/Focus';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/core/mixins/Themed';
import { v, w } from '@dojo/framework/core/vdom';
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

export interface CalendarProperties extends ThemedProperties, I18nProperties {
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

@theme(css)
export class Calendar extends FocusMixin(I18nMixin(ThemedMixin(WidgetBase)))<CalendarProperties> {
	private _callDateFocus = false;
	private _defaultDate = new Date();
	private _focusedDay = 1;
	private _monthLabelId = uuid();
	private _popupOpen = false;
	private _shouldFocus = false;

	private _getMonthLength(month: number, year: number) {
		const lastDate = new Date(year, month + 1, 0);
		return lastDate.getDate();
	}

	private _getMonths(commonMessages: typeof commonBundle.messages) {
		return DEFAULT_MONTHS.map((month) => ({
			short: commonMessages[month.short],
			long: commonMessages[month.long]
		}));
	}

	private _getMonthYear() {
		const { month, selectedDate = this._defaultDate, year } = this.properties;

		return {
			month: typeof month === 'number' ? month : selectedDate.getMonth(),
			year: typeof year === 'number' ? year : selectedDate.getFullYear()
		};
	}

	private _getWeekdays(commonMessages: typeof commonBundle.messages) {
		return DEFAULT_WEEKDAYS.map((weekday) => ({
			short: commonMessages[weekday.short],
			long: commonMessages[weekday.long]
		}));
	}

	private _goToDate(day: number) {
		const { month, year } = this._getMonthYear();
		const currentMonthLength = this._getMonthLength(month, year);
		const previousMonthLength = this._getMonthLength(month - 1, year);

		this._ensureDayIsInMinMax(new Date(year, month, day), (updatedDay) => (day = updatedDay));

		if (day < 1) {
			this._onMonthDecrement();
			day += previousMonthLength;
		} else if (day > currentMonthLength) {
			this._onMonthIncrement();
			day -= currentMonthLength;
		}

		this._focusedDay = day;
		this._callDateFocus = true;
		this.invalidate();
	}

	private _onDateClick(date: number, disabled: boolean) {
		const { onDateSelect } = this.properties;
		let { month, year } = this._getMonthYear();

		if (disabled) {
			({ month, year } = date < 15 ? this._onMonthIncrement() : this._onMonthDecrement());
			this._callDateFocus = true;
		}
		this._focusedDay = date;
		onDateSelect && onDateSelect(new Date(year, month, date));
	}

	private _onDateFocusCalled() {
		this._callDateFocus = false;
	}

	private _onDateKeyDown(key: number, preventDefault: () => void) {
		const { month, year } = this._getMonthYear();
		switch (key) {
			case Keys.Up:
				preventDefault();
				this._goToDate(this._focusedDay - 7);
				break;
			case Keys.Down:
				preventDefault();
				this._goToDate(this._focusedDay + 7);
				break;
			case Keys.Left:
				preventDefault();
				this._goToDate(this._focusedDay - 1);
				break;
			case Keys.Right:
				preventDefault();
				this._goToDate(this._focusedDay + 1);
				break;
			case Keys.PageUp:
				preventDefault();
				this._goToDate(1);
				break;
			case Keys.PageDown:
				preventDefault();
				const monthLengh = this._getMonthLength(month, year);
				this._goToDate(monthLengh);
				break;
			case Keys.Enter:
			case Keys.Space:
				const { onDateSelect } = this.properties;
				onDateSelect && onDateSelect(new Date(year, month, this._focusedDay));
		}
	}

	private _onMonthDecrement() {
		const { month, year } = this._getMonthYear();
		const { onMonthChange, onYearChange } = this.properties;

		if (month === 0) {
			onMonthChange && onMonthChange(11);
			onYearChange && onYearChange(year - 1);
			return { month: 11, year: year - 1 };
		}

		onMonthChange && onMonthChange(month - 1);
		return { month: month - 1, year: year };
	}

	private _onMonthIncrement() {
		const { month, year } = this._getMonthYear();
		const { onMonthChange, onYearChange } = this.properties;

		if (month === 11) {
			onMonthChange && onMonthChange(0);
			onYearChange && onYearChange(year + 1);
			return { month: 0, year: year + 1 };
		}

		onMonthChange && onMonthChange(month + 1);
		return { month: month + 1, year: year };
	}

	private _onMonthPageDown(event: MouseEvent) {
		event.stopPropagation();
		this._onMonthDecrement();
	}

	private _onMonthPageUp(event: MouseEvent) {
		event.stopPropagation();
		this._onMonthIncrement();
	}

	private _ensureDayIsInMinMax(newDate: Date, update: (day: number) => void) {
		const { minDate, maxDate } = this.properties;

		if (minDate && newDate < minDate) {
			update(minDate.getDate());
		} else if (maxDate && newDate > maxDate) {
			update(maxDate.getDate());
		}
	}

	private _renderDateGrid(selectedDate?: Date) {
		const { month, year } = this._getMonthYear();
		const { firstDayOfWeek = 0 } = this.properties;

		this._ensureDayIsInMinMax(
			new Date(year, month, this._focusedDay),
			(newDay) => (this._focusedDay = newDay)
		);
		const currentMonthLength = this._getMonthLength(month, year);
		const previousMonthLength = this._getMonthLength(month - 1, year);
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
					this.renderDateCell(dateObj, dayIndex++, isSelectedDay, isCurrentMonth, isToday)
				);
			}

			weeks.push(v('tr', days));
		}

		return weeks;
	}

	protected renderDateCell(
		dateObj: Date,
		index: number,
		selected: boolean,
		currentMonth: boolean,
		today: boolean
	): DNode {
		const { minDate, maxDate } = this.properties;

		const date = dateObj.getDate();
		const { theme, classes } = this.properties;
		const outOfRange = isOutOfDateRange(dateObj, minDate, maxDate);
		const focusable = currentMonth && date === this._focusedDay;

		return w(CalendarCell, {
			classes,
			key: `date-${index}`,
			callFocus: (this._callDateFocus || this._shouldFocus) && focusable,
			date,
			outOfRange,
			focusable,
			disabled: !currentMonth,
			selected,
			theme,
			today,
			onClick: outOfRange ? undefined : this._onDateClick,
			onFocusCalled: this._onDateFocusCalled,
			onKeyDown: this._onDateKeyDown
		});
	}

	protected renderDatePicker(
		commonMessages: typeof commonBundle.messages,
		labels: CalendarMessages
	): DNode {
		const {
			monthNames = this._getMonths(commonMessages),
			renderMonthLabel,
			theme,
			classes,
			onMonthChange,
			onYearChange,
			minDate,
			maxDate
		} = this.properties;
		const { month, year } = this._getMonthYear();

		return w(DatePicker, {
			key: 'date-picker',
			classes,
			labelId: this._monthLabelId,
			labels,
			month,
			monthNames,
			renderMonthLabel,
			theme,
			year,
			minDate,
			maxDate,
			onPopupChange: (open: boolean) => {
				this._popupOpen = open;
				this.invalidate();
			},
			onRequestMonthChange: (requestMonth: number) => {
				onMonthChange && onMonthChange(requestMonth);
			},
			onRequestYearChange: (requestYear: number) => {
				onYearChange && onYearChange(requestYear);
			}
		});
	}

	protected renderPagingButtonContent(type: Paging, labels: CalendarMessages): DNode[] {
		const { theme, classes } = this.properties;
		const iconType = type === Paging.next ? 'rightIcon' : 'leftIcon';
		const labelText = type === Paging.next ? labels.nextMonth : labels.previousMonth;

		return [
			w(Icon, {
				type: iconType,
				theme,
				classes: {
					...classes,
					'@dojo/widgets/icon': { icon: [this.theme(css.icon)] }
				}
			}),
			v('span', { classes: [baseCss.visuallyHidden] }, [labelText])
		];
	}

	protected renderWeekdayCell(day: { short: string; long: string }): DNode {
		const { renderWeekdayCell } = this.properties;
		return renderWeekdayCell
			? renderWeekdayCell(day)
			: v('abbr', { classes: this.theme(css.abbr), title: day.long }, [day.short]);
	}

	protected render(): DNode {
		const { messages: commonMessages } = this.localizeBundle(commonBundle);
		const {
			labels = this.localizeBundle(calendarBundle).messages,
			aria = {},
			selectedDate,
			minDate,
			maxDate,
			weekdayNames = this._getWeekdays(commonMessages),
			firstDayOfWeek = 0
		} = this.properties;
		const { year, month } = this._getMonthYear();
		this._shouldFocus = this.shouldFocus();

		let weekdayOrder: number[] = [];
		for (let i = firstDayOfWeek; i < firstDayOfWeek + 7; i++) {
			weekdayOrder.push(i > 6 ? i - 7 : i);
		}

		// Calendar Weekday array
		const weekdays = weekdayOrder.map((order) =>
			v(
				'th',
				{
					role: 'columnheader',
					classes: this.theme(css.weekday)
				},
				[this.renderWeekdayCell(weekdayNames[order])]
			)
		);

		return v(
			'div',
			{
				classes: [this.variant(), this.theme(css.root)],
				...formatAriaProperties(aria)
			},
			[
				// header
				this.renderDatePicker(commonMessages, labels),
				// date table
				v(
					'table',
					{
						cellspacing: '0',
						cellpadding: '0',
						role: 'grid',
						'aria-labelledby': this._monthLabelId,
						classes: [
							this.theme(css.dateGrid),
							this._popupOpen ? baseCss.visuallyHidden : null
						]
					},
					[
						v('thead', [v('tr', weekdays)]),
						v('tbody', this._renderDateGrid(selectedDate))
					]
				),
				// controls
				v(
					'div',
					{
						classes: [
							this.theme(css.controls),
							this._popupOpen ? baseCss.visuallyHidden : null
						]
					},
					[
						v(
							'button',
							{
								classes: this.theme(css.previous),
								tabIndex: this._popupOpen ? -1 : 0,
								type: 'button',
								disabled: !monthInMin(year, month - 1, minDate),
								onclick: this._onMonthPageDown
							},
							this.renderPagingButtonContent(Paging.previous, labels)
						),
						v(
							'button',
							{
								classes: this.theme(css.next),
								tabIndex: this._popupOpen ? -1 : 0,
								type: 'button',
								disabled: !monthInMax(year, month + 1, maxDate),
								onclick: this._onMonthPageUp
							},
							this.renderPagingButtonContent(Paging.next, labels)
						)
					]
				)
			]
		);
	}
}

export default Calendar;
