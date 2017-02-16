import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import TextInput from '../../textinput/TextInput';

export class App extends WidgetBase<WidgetProperties> {
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
				key: 't1',
				type: 'email',
				label: {
					position: 'before',
					content: 'Email'
				}
			}),
			v('h3', {}, ['Hidden accessible label']),
			w(TextInput, {
				key: 't1',
				type: 'text',
				placeholder: 'Type something...',
				label: {
					content: 'Try listening to me!',
					hidden: true
				}
			}),
			v('p', {}, ['(TODO: decide how to handle generic styles like .visually-hidden)'])
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector({});

projector.append();
