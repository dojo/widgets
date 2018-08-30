import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import renderer from '@dojo/framework/widget-core/vdom';
import { v, w } from '@dojo/framework/widget-core/d';
import Calendar from '../../calendar/index';

export default class App extends WidgetBase {
	private _month: number | undefined;
	private _year: number | undefined;
	private _selectedDate: Date | undefined;
	private _today = new Date();
	private _minDate = new Date(2017, 3, 16);
	private _maxDate = new Date(this._today.getFullYear(), this._today.getMonth() + 1, 15);

	render() {
		return v('div', {}, [
			v('p', [`You may select days between ${this._minDate.toDateString()} and ${this._maxDate.toDateString()}`]),
			w(Calendar, {
				key: 'calendar-start-sunday',
				month: this._month,
				minDate: this._minDate,
				maxDate: this._maxDate,
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
			this._selectedDate ? v('p', {key: 'sunday-selected'}, [ `Selected Date: ${this._selectedDate.toDateString()}` ]) : null
		]);
	}
}
