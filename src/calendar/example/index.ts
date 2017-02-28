import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import Calendar from '../../calendar/Calendar';

export class App extends StatefulMixin(WidgetBase)<WidgetProperties> {
	render() {
		return v('div', {}, [
			w(Calendar, {
				selectedDate: new Date()
			})
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
