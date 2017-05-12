import { WidgetBase, onPropertiesChanged } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import WidgetRegistry from '@dojo/widget-core/WidgetRegistry';
import { v, w } from '@dojo/widget-core/d';
import { DNode, PropertiesChangeEvent } from '@dojo/widget-core/interfaces';
import uuid from '@dojo/core/uuid';
import { includes } from '@dojo/shim/array';
import { Keys } from '../common/util';
import MonthPicker, { CalendarMessages } from './MonthPicker';
import CalendarCell, { CalendarCellProperties } from './CalendarCell';
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
	customDateCell?: any;
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

const DEFAULT_MONTHS = [
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

@theme(css)
export default class Calendar extends ThemeableMixin(WidgetBase)<CalendarProperties> {
	private _callDateFocus = false;
	private _defaultDate = new Date();
	private _focusedDay = 1;
	private _monthLabelId = uuid();
	private _monthPopupOpen = false;
	private _registry: WidgetRegistry;

	protected onElementUpdated(element: HTMLElement, key: string) {
		if (this._callDateFocus) {
			const { month } = this._getMonthYear();
			// focus date with correct key
			if (key === (this._focusedDay + '-' + month)) {
				element.focus();
				this._callDateFocus = false;
			}
		}
	}

	@onPropertiesChanged()
	protected onPropertiesChanged(evt: PropertiesChangeEvent<this, CalendarProperties>) {
		const { customDateCell = CalendarCell } = this.properties;
		console.log('properties changed event, changed props are', evt.changedPropertyKeys);

		// update custom option registry
		if ( !this._registry || includes(evt.changedPropertyKeys, 'customDateCell')) {
			const registry = this._createRegistry(customDateCell);

			if (this._registry) {
				this.registries.replace(this._registry, registry);
			}
			else {
				this.registries.add(registry);
			}
			this._registry = registry;
		}
	}

	private _createRegistry(customDateCell: any) {
		const registry = new WidgetRegistry();
		registry.define('date-cell', customDateCell);

		return registry;
	}

	private _getMonthLength(month: number, year: number) {
		const d = new Date(year, month + 1, 0);
		return d.getDate();
	}

	private _getMonthYear() {
		const {
			month,
			selectedDate = this._defaultDate,
			year
		} = this.properties;
		return { month: typeof month === 'number' ? month : selectedDate.getMonth(), year: year ? year : selectedDate.getFullYear() };
	}

	private _goToDate(day: number) {
		const {
			month,
			year
		} = this._getMonthYear();
		const currentMonthLength = this._getMonthLength(month, year);
		const previousMonthLength = this._getMonthLength(month - 1, year);

		if (day < 1) {
			this._onMonthIncrement('down');
			day += previousMonthLength;
		}
		else if (day > currentMonthLength) {
			this._onMonthIncrement('up');
			day -= currentMonthLength;
		}

		this._focusedDay = day;
		this._callDateFocus = true;
		this.invalidate();
	}

	private _onDateClick(date: number, disabled: boolean) {
		const { onDateSelect } = this.properties;
		let {
			month,
			year
		} = this._getMonthYear();

		if (disabled && date < 15) {
			({ month, year } = this._onMonthIncrement('up'));
			this._callDateFocus = true;
		}
		else if (disabled && date >= 15) {
			({ month, year } = this._onMonthIncrement('down'));
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

	private _onMonthIncrement(direction: 'up' | 'down') {
		const {
			month,
			year
		} = this._getMonthYear();
		const {
			onMonthChange,
			onYearChange
		} = this.properties;

		if (month === 11 && direction === 'up') {
			onMonthChange && onMonthChange(0);
			onYearChange && onYearChange(year + 1);
			return { month: 0, year: year + 1 };
		}
		else if (month === 0 && direction === 'down') {
			onMonthChange && onMonthChange(11);
			onYearChange && onYearChange(year - 1);
			return { month: 11, year: year - 1 };
		}
		else {
			const nextMonth = direction === 'up' ? month + 1 : month - 1;
			onMonthChange && onMonthChange(nextMonth);
			return { month: nextMonth, year: year };
		}
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

		let dayIndex = 0,
				date = initialWeekday > 0 ? previousMonthLength - initialWeekday : 0,
				isCurrentMonth = initialWeekday > 0 ? false : true,
				isSelectedDay: boolean,
				weeks: DNode[] = [],
				days: DNode[],
				i: number;

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
				if (isCurrentMonth && selectedDate && new Date(year, month, date).toDateString() === selectedDate.toDateString()) {
					isSelectedDay = true;
				} else {
					isSelectedDay = false;
				}

				days.push(w('date-cell', <CalendarCellProperties> {
					key: date + '-' + (isCurrentMonth ? month : 'inactive'),
					callFocus: this._callDateFocus && isCurrentMonth && date === this._focusedDay,
					date,
					disabled: !isCurrentMonth,
					focusable: isCurrentMonth && date === this._focusedDay,
					selected: isSelectedDay,
					theme,
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

	render() {
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
