import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { v, w } from '@dojo/widget-core/d';
import Checkbox, { Mode } from '../../checkbox/Checkbox';

export const AppBase = StatefulMixin(WidgetBase);
export class App extends AppBase<WidgetProperties> {
	onChange(event: Event) {
		const value = (<HTMLInputElement> event.target).value;
		const checked = (<HTMLInputElement> event.target).checked;
		this.setState({ [value]: checked });
	}

	render() {
		const {
			c1 = true,
			c2 = false,
			c3 = false,
			c4 = false,
			c5 = true
		} = this.state;

		return v('fieldset', [
			v('legend', {}, ['Checkbox Example']),
			w(Checkbox, {
				key: 'c1',
				checked: <boolean> c1,
				label: {
					content: 'Sample checkbox that starts checked',
					before: false
				},
				value: 'c1',
				onChange: this.onChange
			}),
			w(Checkbox, {
				key: 'c2',
				checked: <boolean> c2,
				label: {
					content: 'Sample disabled checkbox',
					before: false
				},
				disabled: true,
				value: 'c2',
				onChange: this.onChange
			}),
			w(Checkbox, {
				key: 'c3',
				checked: <boolean> c3,
				label: {
					content: 'Required checkbox',
					before: false
				},
				required: true,
				value: 'c3',
				onChange: this.onChange
			}),
			w(Checkbox, {
				key: 'c4',
				checked: <boolean> c4,
				label: 'Checkbox in "toggle" mode',
				mode: Mode.toggle,
				value: 'c4',
				onChange: this.onChange
			}),
			w(Checkbox, {
				key: 'c5',
				checked: <boolean> c5,
				label: 'Disabled toggle mode',
				onLabel: 'On',
				offLabel: 'Off',
				mode: Mode.toggle,
				disabled: true,
				value: 'c5',
				onChange: this.onChange
			})
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
