import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { v, w } from '@dojo/widget-core/d';
import Checkbox from '../../checkbox/Checkbox';

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
			c3 = false
		} = this.state;

		return v('fieldset', [
			v('legend', {}, ['Checkbox Example']),
			w(Checkbox, {
				key: 'c1',
				checked: <boolean> c1,
				label: 'Sample checkbox that starts checked',
				value: 'c1',
				onChange: this.onChange
			}),
			w(Checkbox, {
				key: 'c2',
				checked: <boolean> c2,
				label: 'Sample disabled checkbox',
				disabled: true,
				value: 'c2',
				onChange: this.onChange
			}),
			w(Checkbox, {
				key: 'c3',
				checked: <boolean> c3,
				label: 'Required checkbox',
				required: true,
				value: 'c3',
				onChange: this.onChange
			})
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
