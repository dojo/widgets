import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import Calendar from '../../calendar/Calendar';

const AppBase = StatefulMixin(WidgetBase);
export class App extends AppBase<WidgetProperties> {
	render() {
		return v('div', {}, [
			w(Calendar, {
				month: <number> this.state.month,
				selectedDate: <Date> this.state.selectedDate,
				year: <number> this.state.year,
				onMonthChange: (month: number) => { this.setState({ 'month': month }); },
				onYearChange: (year: number) => { this.setState({ 'year': year }); },
				onDateSelect: (date: Date) => {
					this.setState({ 'selectedDate': date });
				}
			})
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
