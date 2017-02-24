import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import TextInput from '../../textinput/TextInput';

export class App extends StatefulMixin(WidgetBase)<WidgetProperties> {
	onChange(event: Event) {
		const value = (<HTMLInputElement> event.target).value;
		this.setState({ inputValue: value });
		this.setState({ invalid: value.toLowerCase() !== 'foo' && value.toLowerCase() !== 'bar' });
	}

	render() {
		return v('div', [
			v('h1', {}, ['Text Input Examples']),
			v('h3', {}, ['String label']),
			w(TextInput, {
				key: 't1',
				type: 'text',
				placeholder: 'Hello, World',
				label: 'Name'
			}),
			v('h3', {}, ['Label before the input']),
			w(TextInput, {
				key: 't2',
				type: 'email',
				label: {
					position: 'before',
					content: 'Email (required)'
				},
				required: true
			}),
			v('h3', {}, ['Hidden accessible label']),
			w(TextInput, {
				key: 't3',
				type: 'text',
				placeholder: 'Type something...',
				label: {
					content: 'Try listening to me!',
					hidden: true
				}
			}),
			v('p', {}, ['(TODO: decide how to handle generic styles like .visually-hidden)']),
			v('h3', {}, ['Disabled text input']),
			w(TextInput, {
				key: 't4',
				type: 'text',
				label: 'Can\'t type here',
				value: 'Initial value',
				disabled: true
			}),
			v('h3', {}, ['Validated Input']),
			w(TextInput, {
				key: 't5',
				type: 'text',
				label: 'Type "foo" or "bar"',
				value: <string> this.state.inputValue,
				invalid: <boolean | undefined> this.state.invalid,
				onChange: this.onChange
			})
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector({});

projector.append();
