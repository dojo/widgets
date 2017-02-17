import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import Radio from '../../radio/Radio';

export class App extends WidgetBase<WidgetProperties> {
	render() {
		return v('div', [
			v('fieldset', {}, [
				v('legend', {}, ['Set of radio buttons with first option selected']),
				w(Radio, {
					checked: true,
					label: 'First option',
					name: 'sample-radios'
				}),
				w(Radio, {
					label: 'Second option',
					name: 'sample-radios'
				}),
				w(Radio, {
					label: 'Third option',
					name: 'sample-radios'
				})
			])
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector({});

projector.append();
