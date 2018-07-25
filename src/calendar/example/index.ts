import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/framework/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/framework/widget-core/mixins/Projector';
import { v, w } from '@dojo/framework/widget-core/d';
import Calendar from '../../calendar/index';

export class App extends WidgetBase<WidgetProperties> {
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

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
