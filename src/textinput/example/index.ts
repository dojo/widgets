import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import TextInput, { TextInputType } from '../../textinput/TextInput';

export const AppBase = StatefulMixin(WidgetBase);
export class App extends AppBase<WidgetProperties> {
	render() {
		return v('div', [
			v('h1', {}, ['Text Input Examples']),
			v('h3', {}, ['String label']),
			w(TextInput, {
				key: 't1',
				label: 'Name',
				type: <TextInputType> 'text',
				placeholder: 'Hello, World',
				value: <string> this.state['value1'],
				onChange: (event: Event) => this.setState({ 'value1': (<HTMLInputElement> event.target).value })
			}),
			v('h3', {}, ['Label before the input']),
			w(TextInput, {
				key: 't2',
				type: <TextInputType> 'email',
				label: {
					before: true,
					content: 'Email (required)'
				},
				required: true,
				value: <string> this.state['value2'],
				onChange: (event: Event) => this.setState({ 'value2': (<HTMLInputElement> event.target).value })
			}),
			v('h3', {}, ['Hidden accessible label']),
			w(TextInput, {
				key: 't3',
				type: <TextInputType> 'text',
				placeholder: 'Type something...',
				label: {
					content: 'Try listening to me!',
					before: false,
					hidden: true
				},
				value: <string> this.state['value3'],
				onChange: (event: Event) => this.setState({ 'value3': (<HTMLInputElement> event.target).value })
			}),
			v('h3', {}, ['Disabled text input']),
			w(TextInput, {
				key: 't4',
				type: <TextInputType> 'text',
				label: 'Can\'t type here',
				value: 'Initial value',
				disabled: true,
				readOnly: true
			}),
			v('h3', {}, ['Validated Input']),
			w(TextInput, {
				key: 't5',
				type: <TextInputType> 'text',
				label: 'Type "foo" or "bar"',
				value: <string> this.state['value4'],
				invalid: <boolean | undefined> this.state.invalid,
				onChange: (event: Event) => {
					const value = (<HTMLInputElement> event.target).value;
					this.setState({ 'value4': value });
					this.setState({ invalid: value.toLowerCase() !== 'foo' && value.toLowerCase() !== 'bar' });
				}
			})
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
