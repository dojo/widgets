import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v } from '@dojo/widget-core/d';
import uuid from '@dojo/core/uuid';
import * as css from './styles/calendar.css';

/**
 * @type CalendarProperties
 *
 * Properties that can be set on a Calendar component
 *
 * @property closeable			Determines whether the calendar can be closed
 * @property enterAnimation		CSS class to apply to the calendar when opened
 * @property exitAnimation		CSS class to apply to the calendar when closed
 * @property modal				Determines whether the calendar can be closed by clicking outside its content
 * @property open				Determines whether the calendar is open or closed
 * @property role				Role of this calendar for accessibility, either 'alert' or 'calendar'
 * @property title				Title to show in the calendar title bar
 * @property underlay			Determines whether a semi-transparent background shows behind the calendar
 * @property onOpen				Called when the calendar opens
 * @property onRequestClose		Called when the calendar is closed
 */
export interface CalendarProperties extends ThemeableProperties {
	selectedDate?: Date;
	focusedDate?: Date;
	onMonthChange?(): void;
	onYearChange?(): void;
	onDateSelect?(): void;
	onDateFocus?(): void;
};

// should this be used/stored here?
/* const keyCodes = {
	enter: 13,
	esc: 27,
	space: 32,
	left: 37,
	up: 38,
	right: 39,
	down: 40,
	pageUp: 33,
	pageDown: 34
}; */

// will need locale-specific month names
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
	private focusedDay: number;
	private focusedMonth: number;
	private focusedYear: number;
	private monthPopupOpen = false;

	_getMonthLength(month: number, year = this.focusedYear) {
		const d = new Date(year, month + 1, 0);
		return d.getDate();
	}

	_renderDateGrid(selectedDate: Date | undefined) {
		const currentMonthLength = this._getMonthLength(this.focusedMonth);
		const previousMonthLength = this._getMonthLength(this.focusedMonth - 1);
		const initialWeekday = new Date(this.focusedYear, this.focusedMonth, 1).getDay();

		let dayIndex = 0,
				date = initialWeekday > 0 ? previousMonthLength - initialWeekday : 0,
				isCurrentMonth = initialWeekday > 0 ? false : true,
				isSelectedDay = false,
				weeks: any[] = [],
				days: any[],
				dateCellClasses: (string | null)[],
				i: number;

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

				if (isCurrentMonth && selectedDate && new Date(this.focusedYear, this.focusedMonth, date).toDateString() === selectedDate.toDateString()) {
					isSelectedDay = true;
				}

				dateCellClasses = [
					css.date,
					isCurrentMonth ? null : css.inactiveDate,
					isSelectedDay ? css.selectedDate : null
				];

				days.push(v('td', {
					role: 'gridcell',
					'aria-selected': isSelectedDay,
					'tabindex': isCurrentMonth && date === this.focusedDay ? '0' : '-1',
					classes: this.classes(...dateCellClasses).get()
				}, [ v('span', {}, [ String(date) ]) ]));
			}

			weeks.push(v('tr', {}, days));
		}

		return weeks;
	}

	render() {
		let {
			selectedDate,
			focusedDate
		} = this.properties;

		if (!focusedDate) {
			focusedDate = selectedDate || new Date();
		}

		this.focusedDay = focusedDate.getDate();
		this.focusedMonth = focusedDate.getMonth();
		this.focusedYear = focusedDate.getFullYear();

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

		return v('div', {}, [
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
						'aria-haspopup': true
					}, [
						v('span', { classes: this.classes(css.visuallyHidden).get() }, [ messages.chooseMonth ])
					]),
					v('label', {
						id: monthLabelId,
						classes: this.classes(css.currentMonthLabel).get(),
						'aria-live': 'assertive',
						'aria-atomic': true,
						innerHTML: monthNames[this.focusedMonth].long + ' ' + this.focusedYear
					}),
					// month popup
					v('div', {
						classes: this.classes(css.monthPopup).fixed(this.monthPopupOpen ? null : css.monthPopupHidden).get(),
						role: 'dialog',
						'aria-labelledby': monthButtonId,
						'aria-hidden': this.monthPopupOpen ? null : 'true'
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
								innerHTML: String(this.focusedYear - 1)
							}),
							v('div', {
								id: yearSpinnerId,
								classes: this.classes(css.spinner).get(),
								role: 'spinbutton',
								'aria-valuemin': '1',
								'aria-valuenow': this.focusedYear,
								tabindex: '0',
								innerHTML: String(this.focusedYear)
							}),
							v('span', {
								role: 'button',
								classes: this.classes(css.spinnerNext).get(),
								innerHTML: String(this.focusedYear + 1)
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
