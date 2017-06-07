import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { w, v } from '@dojo/widget-core/d';
import Button from '../../button/Button';
import dojoTheme from '../../themes/dojo/theme';

export const AppBase = StatefulMixin(WidgetBase);
export class App extends AppBase<WidgetProperties> {
	private _theme: {};

	themeChange(event: Event) {
		const checked = (<HTMLInputElement> event.target).checked;
		this._theme = checked ? dojoTheme : {};
		this.invalidate();
	}

	toggleButton() {
		this.setState({ buttonPressed: !this.state.buttonPressed });
	}

	render() {
		return v('div', [
			v('h2', [ 'Button Examples' ]),
			v('label', [
				'Use Dojo Theme ',
				v('input', {
					type: 'checkbox',
					onchange: this.themeChange
				})
			]),
			v('div', { id: 'example-1' }, [
				v('p', [ 'Basic example:' ]),
				w(Button, {
					key: 'b1',
					theme: this._theme
				}, [ 'Basic Button' ])
			]),
			v('div', { id: 'example-2' }, [
				v('p', [ 'Disabled menu button:' ]),
				w(Button, {
					key: 'b2',
					theme: this._theme,
					disabled: true,
					popup: { expanded: false, id: 'fakeId' },
					type: 'menu'
				}, [ 'Open' ])
			]),
			v('div', { id: 'example-3' }, [
				v('p', [ 'Toggle Button' ]),
				w(Button, {
					key: 'b3',
					theme: this._theme,
					pressed: this.state.buttonPressed,
					onClick: this.toggleButton
				}, [ 'Button state' ])
			])
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
