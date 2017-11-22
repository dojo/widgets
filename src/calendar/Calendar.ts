import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { I18nMixin } from '@dojo/widget-core/mixins/I18n'
import { ThemedMixin, ThemedProperties, theme } from '@dojo/widget-core/mixins/Themed';
import { v, w } from '@dojo/widget-core/d';
import { DNode } from '@dojo/widget-core/interfaces';
import uuid from '@dojo/core/uuid';
import commonBundle from '../common/nls/common';
import { Keys } from '../common/util';
import calendarBundle from './nls/Calendar';
import { CalendarMessages } from './DatePicker';
import DatePicker, { Paging } from './DatePicker';
import CalendarCell from './CalendarCell';
import * as css from './styles/calendar.m.css';
import * as baseCss from '../common/styles/base.m.css';
import * as iconCss from '../common/styles/icons.m.css';

/**
 * @type CalendarProperties
 *
 * Properties that can be set on a Calendar component
 *
 * @property labels            Customize or internationalize accessible text for the Calendar widget
 * @property month             Set the currently displayed month, 0-based
 * @property monthNames        Customize or internationalize full month names and abbreviations
 * @property selectedDate      The currently selected date
 * @property weekdayNames      Customize or internationalize weekday names and abbreviations
 * @property year              Set the currently displayed year
 * @property renderMonthLabel  Format the displayed current month and year
 * @property renderWeekdayCell Format the weekday column headers
 * @property onMonthChange     Function called when the month changes
 * @property onYearChange      Function called when the year changes
 * @property onDateSelect      Function called when the user selects a date
 */
export interface CalendarProperties extends ThemedProperties {
	labels?: CalendarMessages;
	month?: number;
	monthNames?: { short: string; long: string; }[];
	selectedDate?: Date;
	weekdayNames?: { short: string; long: string; }[];
	year?: number;
	renderMonthLabel?(month: number, year: number): string;
	renderWeekdayCell?(day: { short: string; long: string; }): DNode;
	onMonthChange?(month: number): void;
	onYearChange?(year: number): void;
	onDateSelect?(date: Date): void;
}

export const DEFAULT_MONTHS = [
	{short: 'Jan', long: 'January'},
	{short: 'Feb', long: 'February'},
	{short: 'Mar', long: 'March'},
	{short: 'Apr', long: 'April'},
	{short: 'May', long: 'May'},
	{short: 'Jun', long: 'June'},
	{short: 'Jul', long: 'July'},
	{short: 'Aug', long: 'August'},
	{short: 'Sep', long: 'September'},
	{short: 'Oct', long: 'October'},
	{short: 'Nov', long: 'November'},
	{short: 'Dec', long: 'December'}
];

export const DEFAULT_WEEKDAYS = [
	{short: 'sun', long: 'sunday'},
	{short: 'mon', long: 'monday'},
	{short: 'tue', long: 'tuesday'},
	{short: 'wed', long: 'wednesday'},
	{short: 'thu', long: 'thursday'},
	{short: 'fri', long: 'friday'},
	{short: 'sat', long: 'saturday'}
];

export const CalendarBase = I18nMixin(ThemedMixin(WidgetBase));

@theme(css)
@theme(iconCss)
export default class Calendar extends CalendarBase<CalendarProperties> {
	private _callDateFocus = false;
	private _defaultDate = new Date();
	private _focusedDay = 1;
	private _monthLabelId = uuid();
	private _popupOpen = false;

	private _getMonthLength(month: number, year: number) {
		const lastDate = new Date(year, month + 1, 0);
		return lastDate.getDate();
	}

	private _getMonthYear() {
		const {
			month,
			selectedDate = this._defaultDate,
			year
		} = this.properties;
		return {
			month: typeof month === 'number' ? month : selectedDate.getMonth(),
			year: typeof year === 'number' ? year : selectedDate.getFullYear()
		};
	}

	private _goToDate(day: number) {
		const {
			month,
			year
		} = this._getMonthYear();
		const currentMonthLength = this._getMonthLength(month, year);
		const previousMonthLength = this._getMonthLength(month - 1, year);

		if (day < 1) {
			this._onMonthDecrement();
			day += previousMonthLength;
		}
		else if (day > currentMonthLength) {
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

		if (disabled && date < 15) {
			({ month, year } = this._onMonthIncrement());
			this._callDateFocus = true;
		}
		else if (disabled && date >= 15) {
			({ month, year } = this._onMonthDecrement());
			this._callDateFocus = true;
		}
		this._focusedDay = date;
		onDateSelect && onDateSelect(new Date(year, month, date));
	}

	private _onDateFocusCalled() {
		this._callDateFocus = false;
	}

	private _onDateKeyDown(event: KeyboardEvent) {
		const { month, year } = this._getMonthYear();
		switch (event.which) {
			case Keys.Up:
				event.preventDefault();
				this._goToDate(this._focusedDay - 7);
				break;
			case Keys.Down:
				event.preventDefault();
				this._goToDate(this._focusedDay + 7);
				break;
			case Keys.Left:
				event.preventDefault();
				this._goToDate(this._focusedDay - 1);
				break;
			case Keys.Right:
				event.preventDefault();
				this._goToDate(this._focusedDay + 1);
				break;
			case Keys.PageUp:
				event.preventDefault();
				this._goToDate(1);
				break;
			case Keys.PageDown:
				event.preventDefault();
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
		const {
			month,
			year
		} = this._getMonthYear();
		const {
			onMonthChange,
			onYearChange
		} = this.properties;

		if (month === 0) {
			onMonthChange && onMonthChange(11);
			onYearChange && onYearChange(year - 1);
			return { month: 11, year: year - 1 };
		}

		onMonthChange && onMonthChange(month - 1);
		return { month: month - 1, year: year };
	}

	private _onMonthIncrement() {
		const {
			month,
			year
		} = this._getMonthYear();
		const {
			onMonthChange,
			onYearChange
		} = this.properties;

		if (month === 11) {
			onMonthChange && onMonthChange(0);
			onYearChange && onYearChange(year + 1);
			return { month: 0, year: year + 1 };
		}

		onMonthChange && onMonthChange(month + 1);
		return { month: month + 1, year: year };
	}

	private _onMonthPageDown() {
		this._onMonthDecrement();
	}

	private _onMonthPageUp() {
		this._onMonthIncrement();
	}

	private _renderDateGrid(selectedDate?: Date) {
		const {
			month,
			year
		} = this._getMonthYear();

		const currentMonthLength = this._getMonthLength(month, year);
		const previousMonthLength = this._getMonthLength(month - 1, year);
		const initialWeekday = new Date(year, month, 1).getDay();
		const todayString = new Date().toDateString();

		let dayIndex = 0;
		let date = initialWeekday > 0 ? previousMonthLength - initialWeekday : 0;
		let isCurrentMonth = initialWeekday > 0 ? false : true;
		let isSelectedDay: boolean;
		let weeks: DNode[] = [];
		let days: DNode[];
		let dateString: string;
		let i: number;

		for (let week = 0; week < 6; week++) {
			days = [];

			for (i = 0; i < 7; i++) {
				// find the next date
				// if we've reached the end of the previous month, reset to 1
				if (date > dayIndex && date >= previousMonthLength) {
					date = 1;
					isCurrentMonth = true;
				}
				// if we've reached the end of the current month, reset to 1
				else if (date <= dayIndex && date >= currentMonthLength) {
					date = 1;
					isCurrentMonth = false;
				}
				else {
					date++;
				}
				dayIndex++;

				// set isSelectedDay if the dates match
				dateString = new Date(year, month, date).toDateString();
				if (isCurrentMonth && selectedDate && dateString === selectedDate.toDateString()) {
					isSelectedDay = true;
				}
				else {
					isSelectedDay = false;
				}

				const isToday = isCurrentMonth && dateString === todayString;

				days.push(this.renderDateCell(date, week * 7 + i, isSelectedDay, isCurrentMonth, isToday));
			}

			weeks.push(v('tr', days));
		}

		return weeks;
	}

	protected renderDateCell(date: number, index: number, selected: boolean, currentMonth: boolean, today: boolean): DNode {
		const { theme = {} } = this.properties;

		return w(CalendarCell, {
			key: `date-${index}`,
			callFocus: this._callDateFocus && currentMonth && date === this._focusedDay,
			date,
			disabled: !currentMonth,
			focusable: currentMonth && date === this._focusedDay,
			selected,
			theme,
			today,
			onClick: this._onDateClick,
			onFocusCalled: this._onDateFocusCalled,
			onKeyDown: this._onDateKeyDown
		});
	}

	protected renderDatePicker(): DNode {
		const {
			labels = this.localizeBundle(calendarBundle),
			monthNames = DEFAULT_MONTHS,
			renderMonthLabel,
			theme = {},
			onMonthChange,
			onYearChange
		} = this.properties;
		const {
			month,
			year
		} = this._getMonthYear();

		return w(DatePicker, {
			key: 'date-picker',
			labelId: this._monthLabelId,
			labels,
			month,
			monthNames,
			renderMonthLabel,
			theme,
			year,
			onPopupChange: (open: boolean) => {
				this._popupOpen = open;
			},
			onRequestMonthChange: (requestMonth: number) => {
				onMonthChange && onMonthChange(requestMonth);
			},
			onRequestYearChange: (requestYear: number) => {
				onYearChange && onYearChange(requestYear);
			}
		});
	}

	protected renderPagingButtonContent(type: Paging): DNode[] {
		const { labels = this.localizeBundle(calendarBundle) } = this.properties;
		const iconClass = type === Paging.next ? iconCss.rightIcon : iconCss.leftIcon;
		const labelText = type === Paging.next ? labels.nextMonth : labels.previousMonth;

		return [
			v('i', { classes: this.theme([ iconCss.icon, iconClass ]),
				role: 'presentation', 'aria-hidden': 'true'
			}),
			v('span', { classes: [ baseCss.visuallyHidden ] }, [ labelText ])
		];
	}

	protected renderWeekdayCell(day: { short: string; long: string; }): DNode {
		const { renderWeekdayCell } = this.properties;
		return renderWeekdayCell ? renderWeekdayCell(day) : v('abbr', { title: day.long }, [ day.short ]);
	}

	protected render(): DNode {
		const messages = this.localizeBundle(commonBundle);
		const {
			selectedDate,
			weekdayNames = DEFAULT_WEEKDAYS.map((weekday) => ({ short: messages[weekday.short], long: messages[weekday.long] }))
		} = this.properties;

		// Calendar Weekday array
		const weekdays = [];
		for (const weekday in weekdayNames) {
			weekdays.push(v('th', {
				role: 'columnheader',
				classes: this.theme(css.weekday)
			}, [
				this.renderWeekdayCell(weekdayNames[weekday])
			]));
		}

		return v('div', { classes: this.theme(css.root) }, [
			// header
			this.renderDatePicker(),
			// date table
			v('table', {
				cellspacing: '0',
				cellpadding: '0',
				role: 'grid',
				'aria-labelledby': this._monthLabelId,
				classes: [ this.theme(css.dateGrid), this._popupOpen ? baseCss.visuallyHidden : null ]
			}, [
				v('thead', [
					v('tr', weekdays)
				]),
				v('tbody', this._renderDateGrid(selectedDate))
			]),
			// controls
			v('div', {
				classes: [ this.theme(css.controls), this._popupOpen ? baseCss.visuallyHidden : null ]
			}, [
				v('button', {
					classes: this.theme(css.previous),
					tabIndex: this._popupOpen ? -1 : 0,
					onclick: this._onMonthPageDown
				}, this.renderPagingButtonContent(Paging.previous)),
				v('button', {
					classes: this.theme(css.next),
					tabIndex: this._popupOpen ? -1 : 0,
					onclick: this._onMonthPageUp
				}, this.renderPagingButtonContent(Paging.next))
			])
		]);
	}
}
