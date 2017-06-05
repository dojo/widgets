import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import Calendar from '../../calendar/Calendar';
import Checkbox from '../../checkbox/Checkbox';
import dojoTheme from '../../themes/dojo/theme';

const AppBase = StatefulMixin(WidgetBase);
export class App extends AppBase<WidgetProperties> {
	private _theme: {};

	themeChange(event: Event) {
		const checked = (<HTMLInputElement> event.target).checked;
		this._theme = checked ? dojoTheme : {};
		this.invalidate();
	}

	render() {
		return v('div', {}, [
			w(Checkbox, {
				label: {
					content: 'Use Dojo Theme',
					before: false
				},
				onChange: this.themeChange
			}),
			w(Calendar, {
				key: 'calendar',
				month: this.state.month,
				selectedDate: this.state.selectedDate,
				theme: this._theme,
				year: this.state.year,
				onMonthChange: (month: number) => { this.setState({ 'month': month }); },
				onYearChange: (year: number) => { this.setState({ 'year': year }); },
				onDateSelect: (date: Date) => {
					this.setState({ 'selectedDate': date });
				}
			}),
			this.state.selectedDate ? v('p', [ `Selected Date: ${this.state.selectedDate.toDateString()}` ]) : null
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
