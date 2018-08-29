import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { I18nMixin } from '@dojo/framework/widget-core/mixins/I18n';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/widget-core/mixins/Themed';
import { v, w } from '@dojo/framework/widget-core/d';
import { DNode } from '@dojo/framework/widget-core/interfaces';
import { uuid } from '@dojo/framework/core/util';
import commonBundle from '../common/nls/common';
import { CommonMessages } from '../common/interfaces';
import { CustomAriaProperties } from '../common/interfaces';
import { formatAriaProperties, Keys } from '../common/util';
import CalendarCell from './CalendarCell';
import DatePicker, { Paging } from './DatePicker';
import Icon from '../icon/index';
import calendarBundle from './nls/Calendar';
import * as css from '../theme/calendar.m.css';
import * as baseCss from '../common/styles/base.m.css';
import customElement from '@dojo/framework/widget-core/decorators/customElement';

export type CalendarMessages = typeof calendarBundle.messages;

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
 * @property minDate           Set the earliest date the calendar will display (it will show the whole month but not allow previous selections)
 * @property maxDate           Set the latest date the calendar will display (it will show the whole month but not allow later selections)
 * @property renderMonthLabel  Format the displayed current month and year
 * @property renderWeekdayCell Format the weekday column headers
 * @property onMonthChange     Function called when the month changes
 * @property onYearChange      Function called when the year changes
 * @property onDateSelect      Function called when the user selects a date
 */
export interface CalendarProperties extends ThemedProperties, CustomAriaProperties {
	labels?: CalendarMessages;
	month?: number;
	monthNames?: { short: string; long: string; }[];
	selectedDate?: Date;
	weekdayNames?: { short: string; long: string; }[];
	year?: number;
	minDate?: Date;
	maxDate?: Date;
	renderMonthLabel?(month: number, year: number): string;
	renderWeekdayCell?(day: { short: string; long: string; }): DNode;
	onMonthChange?(month: number): void;
	onYearChange?(year: number): void;
	onDateSelect?(date: Date): void;
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

export const ThemedBase = I18nMixin(ThemedMixin(WidgetBase));

@theme(css)
@customElement<CalendarProperties>({
	tag: 'dojo-calendar',
	properties: [
		'aria',
		'classes',
		'selectedDate',
		'month',
		'year',
		'renderMonthLabel',
		'renderWeekdayCell',
		'labels',
		'monthNames',
		'weekdayNames',
		'theme'
	],
	events: [ 'onDateSelect', 'onMonthChange', 'onYearChange' ]
})
export class CalendarBase<P extends CalendarProperties = CalendarProperties> extends ThemedBase<P, null> {
	private _callDateFocus = false;
	private _defaultDate = new Date();
	private _focusedDay = 1;
	private _monthLabelId = uuid();
	private _popupOpen = false;

	private _getMonthLength(month: number, year: number) {
		const lastDate = new Date(year, month + 1, 0);
		return lastDate.getDate();
	}

	private _getMonths(commonMessages: CommonMessages) {
		return DEFAULT_MONTHS.map((month) => ({
			short: commonMessages[month.short],
			long: commonMessages[month.long]
		}));
	}

	private _getMonthYear() {
		const {
			month,
			selectedDate = this._defaultDate,
			year,
			minDate = this._defaultDate,
			maxDate = this._defaultDate
		} = this.properties;

		let selected = selectedDate;
		if (selectedDate > maxDate) {
			selected = maxDate;
		}
		else if (selectedDate < minDate) {
			selected = minDate;
		}

		return {
			month: typeof month === 'number' ? month : selected.getMonth(),
			year: typeof year === 'number' ? year : selected.getFullYear()
		};
	}

	private _getWeekdays(commonMessages: CommonMessages) {
		return DEFAULT_WEEKDAYS.map((weekday) => ({
			short: commonMessages[weekday.short],
			long: commonMessages[weekday.long]
		}));
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

	private _monthInMin(year: number, month: number) {
		const {
			minDate
		} = this.properties;

		if (minDate) {
			return new Date(year, month, 1) >= new Date(minDate.getFullYear(), minDate.getMonth(), 1);
		}
		return true;
	}

	private _monthInMax(year: number, month: number) {
		const {
			maxDate
		} = this.properties;

		if (maxDate) {
			const thisMonth = new Date(year, month, 1);
			const max = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
			return thisMonth <= max;
		}
		return true;
	}

	private _lastMonthInMin() {
		let {
			year,
			month
		} = this._getMonthYear();

		year = month === 0 ? year - 1 : year;
		month = month === 0 ? 11 : month - 1;

		return this._monthInMin(year, month);
	}

	private _nextMonthInMax() {
		let {
			year,
			month
		} = this._getMonthYear();

		year = month === 11 ? year + 1 : year;
		month = month === 11 ? 0 : month + 1;

		return this._monthInMax(year, month);
	}

	private _dateInMinMax(date: Date): boolean {
		const {
			minDate = date,
			maxDate = date
		} = this.properties;

		const inRange = date >= minDate && date <= maxDate;
		console.log(inRange, minDate.toDateString(), '<=', date.toDateString(), '<=', maxDate.toDateString());
		return inRange;
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

		if (!this._monthInMin(month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1)) {
			return { month, year };
		}

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

		if (!this._monthInMax(month === 11 ? year + 1 : year, month === 11 ? 0 : month + 1)) {
			return { month, year };
		}

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
		let dateObj: Date;
		let dateString: string;
		let i: number;
		let realMonth = isCurrentMonth ? month : month === 0 ? 11 : month - 1;
		let realYear = isCurrentMonth ? year : month === 0 ? year - 1 : year;

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
				// FIXME `month` is wrong for last/next month!
				dateObj = new Date(realYear, realMonth, date);
				dateString = dateObj.toDateString();
				if (isCurrentMonth && selectedDate && dateString === selectedDate.toDateString()) {
					isSelectedDay = true;
				}
				else {
					isSelectedDay = false;
				}

				const isToday = isCurrentMonth && dateString === todayString;

				days.push(this.renderDateCell(date, week * 7 + i, isSelectedDay, isCurrentMonth, isToday, dateObj));
			}

			weeks.push(v('tr', days));
		}

		return weeks;
	}

	protected renderDateCell(date: number, index: number, selected: boolean, currentMonth: boolean, today: boolean, dateObj: Date): DNode {
		const { theme, classes } = this.properties;

		return w(CalendarCell, {
			classes,
			key: `date-${index}`,
			callFocus: this._callDateFocus && currentMonth && date === this._focusedDay,
			date,
			disabled: !currentMonth, // && !this._dateInMinMax(dateObj),
			focusable: currentMonth && date === this._focusedDay,
			selected,
			theme,
			today,
			onClick: this._onDateClick,
			onFocusCalled: this._onDateFocusCalled,
			onKeyDown: this._onDateKeyDown
		});
	}

	protected renderDatePicker(commonMessages: CommonMessages, labels: CalendarMessages): DNode {
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
		const {
			month,
			year
		} = this._getMonthYear();

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
			w(Icon, { type: iconType, theme, classes }),
			v('span', { classes: [ baseCss.visuallyHidden ] }, [ labelText ])
		];
	}

	protected renderWeekdayCell(day: { short: string; long: string; }): DNode {
		const { renderWeekdayCell } = this.properties;
		return renderWeekdayCell ? renderWeekdayCell(day) : v('abbr', { title: day.long }, [ day.short ]);
	}

	protected render(): DNode {
		const { messages: commonMessages } = this.localizeBundle(commonBundle);
		const {
			labels = this.localizeBundle(calendarBundle).messages,
			aria = {},
			selectedDate,
			weekdayNames = this._getWeekdays(commonMessages)
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

		return v('div', {
			classes: this.theme(css.root),
			...formatAriaProperties(aria)
		}, [
			// header
			this.renderDatePicker(commonMessages, labels),
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
					type: 'button',
					disabled: !this._lastMonthInMin(),
					onclick: this._onMonthPageDown
				}, this.renderPagingButtonContent(Paging.previous, labels)),
				v('button', {
					classes: this.theme(css.next),
					tabIndex: this._popupOpen ? -1 : 0,
					type: 'button',
					disabled: !this._nextMonthInMax(),
					onclick: this._onMonthPageUp
				}, this.renderPagingButtonContent(Paging.next, labels))
			])
		]);
	}
}

export default class Calendar extends CalendarBase<CalendarProperties> {}
