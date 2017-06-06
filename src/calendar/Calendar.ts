import { WidgetBase, onPropertiesChanged, diffProperty, DiffType } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import WidgetRegistry from '@dojo/widget-core/WidgetRegistry';
import { v, w } from '@dojo/widget-core/d';
import { DNode, PropertiesChangeEvent, Constructor } from '@dojo/widget-core/interfaces';
import uuid from '@dojo/core/uuid';
import { includes } from '@dojo/shim/array';
import { Keys } from '../common/util';
import MonthPicker, { CalendarMessages } from './MonthPicker';
import CalendarCell from './CalendarCell';
import * as css from './styles/calendar.m.css';

/**
 * @type CalendarProperties
 *
 * Properties that can be set on a Calendar component
 *
 * @property customDateCell    Custom widget constructor for the date cell. Should use CalendarCell as a base.
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
export interface CalendarProperties extends ThemeableProperties {
	customDateCell?: Constructor<CalendarCell>;
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
};

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
	{short: 'Sun', long: 'Sunday'},
	{short: 'Mon', long: 'Monday'},
	{short: 'Tue', long: 'Tuesday'},
	{short: 'Wed', long: 'Wednesday'},
	{short: 'Thu', long: 'Thursday'},
	{short: 'Fri', long: 'Friday'},
	{short: 'Sat', long: 'Saturday'}
];

export const DEFAULT_LABELS: CalendarMessages = {
	chooseMonth: 'Choose Month',
	chooseYear: 'Choose Year',
	previousMonth: 'Previous Month',
	nextMonth: 'Next Month'
};

export const CalendarBase = ThemeableMixin(WidgetBase);

@theme(css)
@diffProperty('customDateCell', DiffType.REFERENCE)
export default class Calendar extends CalendarBase<CalendarProperties> {
	private _callDateFocus = false;
	private _defaultDate = new Date();
	private _focusedDay = 1;
	private _monthLabelId = uuid();
	private _monthPopupOpen = false;
	private _registry: WidgetRegistry;

	constructor() {
		/* istanbul ignore next: disregard transpiled `super`'s "else" block */
		super();

		this._registry = this._createRegistry(CalendarCell);
		this.registries.add(this._registry);
	}

	@onPropertiesChanged()
	protected onPropertiesChanged(evt: PropertiesChangeEvent<this, CalendarProperties>) {
		const { customDateCell = CalendarCell } = this.properties;

		// update custom option registry
		if ( includes(evt.changedPropertyKeys, 'customDateCell')) {
			const registry = this._createRegistry(customDateCell);

			this.registries.replace(this._registry, registry);
			this._registry = registry;
		}
	}

	private _createRegistry(customDateCell: any) {
		const registry = new WidgetRegistry();
		registry.define('date-cell', customDateCell);

		return registry;
	}

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
				this._goToDate(this._focusedDay - 7);
				break;
			case Keys.Down:
				this._goToDate(this._focusedDay + 7);
				break;
			case Keys.Left:
				this._goToDate(this._focusedDay - 1);
				break;
			case Keys.Right:
				this._goToDate(this._focusedDay + 1);
				break;
			case Keys.PageUp:
				this._goToDate(1);
				break;
			case Keys.PageDown:
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

	private _renderDateGrid(selectedDate?: Date) {
		const {
			month,
			year
		} = this._getMonthYear();
		const { theme = {} } = this.properties;

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

				days.push(w<CalendarCell>('date-cell', {
					key: `date-${week * 7 + i}`,
					callFocus: this._callDateFocus && isCurrentMonth && date === this._focusedDay,
					date,
					disabled: !isCurrentMonth,
					focusable: isCurrentMonth && date === this._focusedDay,
					selected: isSelectedDay,
					theme,
					today: isCurrentMonth && dateString === todayString,
					onClick: this._onDateClick,
					onFocusCalled: this._onDateFocusCalled,
					onKeyDown: this._onDateKeyDown
				}));
			}

			weeks.push(v('tr', days));
		}

		return weeks;
	}

	private _renderWeekdayCell(day: { short: string; long: string; }): DNode {
		const { renderWeekdayCell } = this.properties;
		return renderWeekdayCell ? renderWeekdayCell(day) : v('abbr', { title: day.long }, [ day.short ]);
	}

	protected render(): DNode {
		const {
			labels = DEFAULT_LABELS,
			monthNames = DEFAULT_MONTHS,
			renderMonthLabel,
			selectedDate,
			theme = {},
			weekdayNames = DEFAULT_WEEKDAYS,
			onMonthChange,
			onYearChange
		} = this.properties;
		const {
			month,
			year
		} = this._getMonthYear();

		// Calendar Weekday array
		const weekdays = [];
		for (const weekday in weekdayNames) {
			weekdays.push(v('th', {
				role: 'columnheader',
				classes: this.classes(css.weekday)
			}, [
				this._renderWeekdayCell(weekdayNames[weekday])
			]));
		}

		return v('div', { classes: this.classes(css.root) }, [
			// month popup
			w(MonthPicker, {
				labelId: this._monthLabelId,
				labels,
				month,
				monthNames,
				open: this._monthPopupOpen,
				renderMonthLabel,
				theme,
				year,
				onRequestClose: () => {
					this._monthPopupOpen = false;
					this.invalidate();
				},
				onRequestOpen: () => {
					this._monthPopupOpen = true;
					this.invalidate();
				},
				onRequestMonthChange: (requestMonth: number) => {
					onMonthChange && onMonthChange(requestMonth);
				},
				onRequestYearChange: (requestYear: number) => {
					onYearChange && onYearChange(requestYear);
				}
			}),
			// date table
			v('table', {
				cellspacing: '0',
				cellpadding: '0',
				role: 'grid',
				'aria-labelledby': this._monthLabelId
			}, [
				v('thead', [
					v('tr', weekdays)
				]),
				v('tbody', this._renderDateGrid(selectedDate))
			])
		]);
	}
}
