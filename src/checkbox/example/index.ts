import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import Checkbox from '../../checkbox/Checkbox';

export class App extends WidgetBase<WidgetProperties> {
	render() {
		return v('div', [
			v('h1', {}, ['Checkbox Example']),
			w(Checkbox, {
				checked: true,
				label: 'Sample checked checkbox'
			})
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector({});

projector.append();
