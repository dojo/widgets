import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { w, v } from '@dojo/widget-core/d';
import Button, { ButtonType } from '../../button/Button';
import dojo from '../../themes/dojo/theme';

export const AppBase = StatefulMixin(WidgetBase);
export class App extends AppBase<WidgetProperties> {
	private _theme: {};

	themeChange(event: Event) {
		const checked = (<HTMLInputElement> event.target).checked;
		this._theme = checked ? dojo : {};
		this.invalidate();
	}

	toggleButton() {
		this.setState({ buttonPressed: !this.state.buttonPressed });
	}

	render() {
		return v('div', [
			v('h2', {
				innerHTML: 'Button Examples'
			}),
			v('label', [
				'Use Dojo Theme ',
				v('input', {
					type: 'checkbox',
					onchange: this.themeChange
				})
			]),
			v('p', {
				innerHTML: 'Basic example:'
			}),
			w(Button, {
				key: 'b1',
				theme: this._theme,
				content: 'Basic Button'
			}),
			v('p', {
				innerHTML: 'Disabled menu button:'
			}),
			w(Button, {
				key: 'b2',
				theme: this._theme,
				content: 'Open',
				disabled: true,
				popup: { expanded: false, id: 'fakeId' },
				type: <ButtonType> 'menu'
			}),
			v('p', {
				innerHTML: 'Toggle Button'
			}),
			w(Button, {
				key: 'b4',
				theme: this._theme,
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
