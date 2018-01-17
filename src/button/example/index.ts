import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { w, v } from '@dojo/widget-core/d';
import Button from '../../button/Button';
import dojoTheme from '../../themes/dojo/theme';

export class App extends WidgetBase<WidgetProperties> {
	private _theme: {};
	private _buttonPressed: boolean;

	themeChange(event: Event) {
		const checked = (event.target as HTMLInputElement).checked;
		this._theme = checked ? dojoTheme : {};
		this.invalidate();
	}

	toggleButton() {
		this._buttonPressed = !this._buttonPressed;
		this.invalidate();
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
				v('p', [ 'Disabled submit button:' ]),
				w(Button, {
					key: 'b2',
					theme: this._theme,
					disabled: true,
					type: 'submit'
				}, [ 'Submit' ])
			]),
			v('div', { id: 'example-3' }, [
				v('p', [ 'Popup button:' ]),
				w(Button, {
					key: 'b3',
					theme: this._theme,
					popup: { expanded: false, id: 'fakeId' }
				}, [ 'Open' ]),
				v('div', { id: 'fakeId' })
			]),
			v('div', { id: 'example-4' }, [
				v('p', [ 'Toggle Button' ]),
				w(Button, {
					key: 'b4',
					theme: this._theme,
					pressed: this._buttonPressed,
					onClick: this.toggleButton
				}, [ 'Button state' ])
			])
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
