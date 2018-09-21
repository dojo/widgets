import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import renderer from '@dojo/framework/widget-core/vdom';
import { v, w } from '@dojo/framework/widget-core/d';
import Calendar from '../../calendar/index';

export default class App extends WidgetBase {
	private _month: number | undefined;
	private _year: number | undefined;
	private _selectedDate: Date | undefined;

	render() {
		return v('div', {}, [
			w(Calendar, {
				month: this._month,
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
			this._selectedDate ? v('p', [ `Selected Date: ${this._selectedDate.toDateString()}` ]) : null
		]);
	}
}
