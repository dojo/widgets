import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { w, v } from '@dojo/widget-core/d';
import Button from '../../button/Button';

export class App extends StatefulMixin(WidgetBase)<WidgetProperties> {
	toggleButton() {
		this.setState({ buttonPressed: !this.state['buttonPressed'] });
	}

	render() {
		return v('div', [
			v('h2', {
				innerHTML: 'Button Examples'
			}),
			v('p', {
				innerHTML: 'Basic example:'
			}),
			w(Button, {
				key: 'b1',
				content: 'Basic Button'
			}),
			v('p', {
				innerHTML: 'Disabled submit button:'
			}),
			w(Button, {
				key: 'b2',
				content: 'Submit',
				disabled: true,
				type: 'submit'
			}),
			v('p', {
				innerHTML: 'Icon Button'
			}),
			w(Button, {
				key: 'b3',
				content: 'Favorite',
				icon: ''
			}),
			v('p', {
				innerHTML: 'Toggle Button'
			}),
			w(Button, {
				key: 'b4',
				content: 'Button state',
				pressed: <boolean> this.state['buttonPressed'],
				onClick: this.toggleButton
			})
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector({});

projector.append();
