import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import renderer from '@dojo/framework/widget-core/vdom';
import { v, w } from '@dojo/framework/widget-core/d';
import Calendar from '../../calendar/index';

export default class App extends WidgetBase {
	private _month: number | undefined;
	private _year: number | undefined;
	private _selectedDate: Date | undefined;

	private _month2: number | undefined;
	private _year2: number | undefined;
	private _selectedDate2: Date | undefined;

	render() {
		return v('div', {}, [
			w(Calendar, {
				key: 'calendar-start-sunday',
				month: this._month,
				// minDate: new Date(2014, 4, 9),
				// maxDate: new Date(2018, 9, 4),
				selectedDate: this._selectedDate,
				year: this._year,
				onMonthChange: (month: number) => {
					this._month = month;
					this.invalidate();
				},
				onYearChange: (year: number) => {
					this._year = year;
					this.invalidate();
				},
				onDateSelect: (date: Date) => {
					this._selectedDate = date;
					this.invalidate();
				}
			}),
			this._selectedDate ? v('p', [ `Selected Date: ${this._selectedDate.toDateString()}` ]) : null,
			v('hr'),
			v('p', {}, ['Calendar starts on Monday']),
			w(Calendar, {
				key: 'calendar-start-monday',
				month: this._month2,
				selectedDate: this._selectedDate2,
				firstDayOfTheWeek: 1,
				year: this._year2,
				onMonthChange: (month: number) => {
					this._month2 = month;
					this.invalidate();
				},
				onYearChange: (year: number) => {
					this._year2 = year;
					this.invalidate();
				},
				onDateSelect: (date: Date) => {
					this._selectedDate2 = date;
					this.invalidate();
				}
			}),
			this._selectedDate2 ? v('p', [ `Selected Date: ${this._selectedDate2.toDateString()}` ]) : null
		]);
	}
}
