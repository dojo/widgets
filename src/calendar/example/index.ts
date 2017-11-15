import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemedProperties } from '@dojo/widget-core/mixins/Themed';
import { v, w } from '@dojo/widget-core/d';
import Calendar from '../../calendar/Calendar';

export default class App extends WidgetBase<ThemedProperties> {
	private _month: number;
	private _year: number;
	private _selectedDate: Date;

	render() {
		const { theme } = this.properties;

		return v('div', {}, [
			w(Calendar, {
				month: this._month,
				selectedDate: this._selectedDate,
				theme,
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
