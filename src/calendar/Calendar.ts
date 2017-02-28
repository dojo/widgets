import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v } from '@dojo/widget-core/d';
import { DNode } from '@dojo/widget-core/interfaces';
import uuid from '@dojo/core/uuid';
import * as css from './styles/calendar.css';

/**
 * @type CalendarProperties
 *
 * Properties that can be set on a Calendar component
 *
 * @property selectedDate			The currently selected date
 * @property focusedDate			Date that can receive keyboard focus. Used for a11y and to open the calendar on a specific month without selecting a date.
 * @property renderDateCell		Custom date cell render function. Should return a DNode.
 * @property onMonthChange		Function called when the month changes
 * @property onYearChange			Function called when the year changes
 * @property onDateSelect			Function called when the user selects a date
 * @property onDateFocus			Function called when a new date receives focus
 */
export interface CalendarProperties extends ThemeableProperties {
	selectedDate?: Date;
	focusedDate?: Date;
	renderDateCell?(date: number): DNode;
	onMonthChange?(): void;
	onYearChange?(): void;
	onDateSelect?(): void;
	onDateFocus?(): void;
};

// TODO: this should probably be imported from somewhere else
const keyCodes = {
	enter: 13,
	esc: 27,
	space: 32,
	left: 37,
	up: 38,
	right: 39,
	down: 40,
	pageUp: 33,
	pageDown: 34
};

// TODO: will need locale-specific month names and weekdays
const monthNames = [
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

const weekdayNames = [
	{short: 'Sun', long: 'Sunday'},
	{short: 'Mon', long: 'Monday'},
	{short: 'Tue', long: 'Tuesday'},
	{short: 'Wed', long: 'Wednesday'},
	{short: 'Thu', long: 'Thursday'},
	{short: 'Fri', long: 'Friday'},
	{short: 'Sat', long: 'Saturday'}
];

// will need to localize messages
const messages = {
	chooseMonth: 'Choose Month',
	chooseYear: 'Choose Year',
	previousMonth: 'Previous Month',
	nextMonth: 'Next Month'
};

@theme(css)
export default class Calendar extends ThemeableMixin(WidgetBase)<CalendarProperties> {
	private _focusedDay: number;
	private _focusedMonth: number;
	private _focusedYear: number;
	private _monthPopupOpen = false;

	onMonthTriggerClick() {
		// TODO: focus stuff
		this._monthPopupOpen = !this._monthPopupOpen;
		this.invalidate();
	}

	_getMonthLength(month: number, year = this._focusedYear) {
		const d = new Date(year, month + 1, 0);
		return d.getDate();
	}

	_renderDateGrid(selectedDate: Date | undefined) {
		const currentMonthLength = this._getMonthLength(this._focusedMonth);
		const previousMonthLength = this._getMonthLength(this._focusedMonth - 1);
		const initialWeekday = new Date(this._focusedYear, this._focusedMonth, 1).getDay();

		let dayIndex = 0,
				date = initialWeekday > 0 ? previousMonthLength - initialWeekday : 0,
				isCurrentMonth = initialWeekday > 0 ? false : true,
				isSelectedDay = false,
				weeks: any[] = [],
				days: any[],
				dateCellClasses: (string | null)[],
				i: number;

		const { renderDateCell = this.renderDateCell } = this.properties;

		for (let w = 0; w < 6; w++) {
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

				if (isCurrentMonth && selectedDate && new Date(this._focusedYear, this._focusedMonth, date).toDateString() === selectedDate.toDateString()) {
					isSelectedDay = true;
				} else {
					isSelectedDay = false;
				}

				dateCellClasses = [
					css.date,
					isCurrentMonth ? null : css.inactiveDate,
					isSelectedDay ? css.selectedDate : null
				];

				days.push(v('td', {
					role: 'gridcell',
					'aria-selected': String(isSelectedDay),
					'tabindex': isCurrentMonth && date === this._focusedDay ? '0' : '-1',
					classes: this.classes(...dateCellClasses).get()
				}, [ renderDateCell(date) ]));
			}

			weeks.push(v('tr', {}, days));
		}

		return weeks;
	}

	renderDateCell(date: number) {
		return v('span', {}, [ String(date) ]);
	}

	render() {
		let {
			selectedDate,
			focusedDate
		} = this.properties;

		if (!focusedDate) {
			focusedDate = selectedDate || new Date();
		}

		this._focusedDay = focusedDate.getDate();
		this._focusedMonth = focusedDate.getMonth();
		this._focusedYear = focusedDate.getFullYear();

		const monthButtonId = uuid();
		const monthLabelId = uuid();
		const yearSpinnerId = uuid();

		// Month picker month array
		// TODO: use radio widget instead of v()
		const monthRadios = [];
		const monthRadiosName = uuid();
		for (const month in monthNames) {
			monthRadios.push(v('label', {
				classes: this.classes(css.monthRadio).get()
			}, [
				v('input', {
					type: 'radio',
					classes: this.classes(css.visuallyHidden).get(),
					name: monthRadiosName,
					value: month + ''
				}),
				v('span', {}, [ monthNames[month].short ])
			]));
		}

		// Calendar Weekday array
		const weekdays = [];
		for (const weekday in weekdayNames) {
			weekdays.push(v('th', {
				role: 'columnheader',
				classes: this.classes(css.weekday).get()
			}, [
				v('abbr', { title: weekdayNames[weekday].long }, [ weekdayNames[weekday].short ])
			]));
		}

		return v('div', { classes: this.classes(css.root).get() }, [
			// calendar header and month nav
			v('div', {
				classes: this.classes(css.header).get(),
				role: 'heading'
			}, [
				v('div', {
					classes: this.classes(css.monthPicker).get()
				}, [
					// Month popup trigger
					// TODO: use button widget
					v('button', {
						id: monthButtonId,
						classes: this.classes(css.monthTrigger).get(),
						'aria-describedby': monthLabelId,
						'aria-haspopup': true,
						onclick: this.onMonthTriggerClick,
						onkeydown: (event: KeyboardEvent) => {
							if (event.which === keyCodes.enter || event.which === keyCodes.space) {
								this.onMonthTriggerClick();
							}
						}
					}, [
						v('span', { classes: this.classes().fixed(css.visuallyHidden).get() }, [ messages.chooseMonth ])
					]),
					v('label', {
						id: monthLabelId,
						classes: this.classes(css.currentMonthLabel).get(),
						'aria-live': 'assertive',
						'aria-atomic': true,
						innerHTML: monthNames[this._focusedMonth].long + ' ' + this._focusedYear
					}),
					// month popup
					v('div', {
						classes: this.classes(css.monthPopup).fixed(this._monthPopupOpen ? null : css.monthPopupHidden).get(),
						role: 'dialog',
						'aria-labelledby': monthButtonId,
						'aria-hidden': this._monthPopupOpen ? null : 'true'
					}, [
						// year spinner
						v('div', {}, [
							v('label', {
								for: yearSpinnerId,
								classes: this.classes(css.visuallyHidden).get(),
								innerHTML: messages.chooseYear
							}),
							v('span', {
								role: 'button',
								classes: this.classes(css.spinnerPrevious).get(),
								innerHTML: String(this._focusedYear - 1)
							}),
							v('div', {
								id: yearSpinnerId,
								classes: this.classes(css.spinner).get(),
								role: 'spinbutton',
								'aria-valuemin': '1',
								'aria-valuenow': this._focusedYear,
								tabindex: '0',
								innerHTML: String(this._focusedYear)
							}),
							v('span', {
								role: 'button',
								classes: this.classes(css.spinnerNext).get(),
								innerHTML: String(this._focusedYear + 1)
							})
						]),
						// month picker
						v('fieldset', {
							classes: this.classes(css.monthControl).get()
						}, [
							v('legend', { classes: this.classes(css.visuallyHidden).get() }, [ messages.chooseMonth ]),
							...monthRadios
						])
					])
				]),
				// previous/next month buttons
				v('button', {
					classes: this.classes(css.previousMonth).get()
				}, [
					v('span', { classes: this.classes(css.visuallyHidden).get() }, [ messages.previousMonth ])
				]),
				v('button', {
					classes: this.classes(css.nextMonth).get()
				}, [
					v('span', { classes: this.classes(css.visuallyHidden).get() }, [ messages.nextMonth ])
				])
			]),
			// date table
			v('table', {
				cellspacing: '0',
				cellpadding: '0',
				role: 'grid',
				'aria-labelledby': monthLabelId
			}, [
				v('thead', {}, [
					v('tr', {}, weekdays)
				]),
				v('tbody', {}, this._renderDateGrid(selectedDate))
			])
		]);
	}
}
