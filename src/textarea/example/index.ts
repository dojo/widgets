import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { v, w } from '@dojo/widget-core/d';
import Textarea from '../../textarea/Textarea';

export const AppBase = StatefulMixin(WidgetBase);
export class App extends AppBase<WidgetProperties> {
	onChange(event: Event) {
		const value = (<HTMLInputElement> event.target).value;
		this.setState({ inputValue: value });
		this.setState({ invalid: value.trim().length === 0 });
	}

	render() {
		const {
			inputValue = '',
			invalid
		} = this.state;

		return v('div', [
			v('h1', {}, ['Textarea Example']),
			w(Textarea, {
				key: 't1',
				columns: 40,
				rows: 8,
				placeholder: 'Hello, World',
				label: 'Type Something'
			}),
			v('h3', {}, ['Disabled Textarea']),
			w(Textarea, {
				key: 't2',
				columns: 40,
				rows: 3,
				label: 'Can\'t type here',
				value: 'Initial value',
				disabled: true
			}),
			v('h3', {}, ['Validated, Required Textarea']),
			w(Textarea, {
				key: 't3',
				columns: 40,
				rows: 8,
				label: 'Required',
				required: true,
				value: <string> inputValue,
				invalid: <boolean | undefined> invalid,
				onChange: this.onChange
			})
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
