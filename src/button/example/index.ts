import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { w, v } from '@dojo/widget-core/d';
import Button, { ButtonType } from '../../button/Button';

export const AppBase = StatefulMixin(WidgetBase);
export class App extends AppBase<WidgetProperties> {
	toggleButton() {
		this.setState({ buttonPressed: !this.state.buttonPressed });
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
				innerHTML: 'Disabled menu button:'
			}),
			w(Button, {
				key: 'b2',
				content: 'Open',
				disabled: true,
				hasPopup: true,
				type: <ButtonType> 'menu'
			}),
			v('p', {
				innerHTML: 'Toggle Button'
			}),
			w(Button, {
				key: 'b4',
				content: 'Button state',
				pressed: <boolean> this.state.buttonPressed,
				onClick: this.toggleButton
			})
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
