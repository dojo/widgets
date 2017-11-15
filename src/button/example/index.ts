import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemedProperties } from '@dojo/widget-core/mixins/Themed';
import { w, v } from '@dojo/widget-core/d';
import Button from '../../button/Button';

export default class App extends WidgetBase<ThemedProperties> {
	private _buttonPressed: boolean;

	toggleButton() {
		this._buttonPressed = !this._buttonPressed;
		this.invalidate();
	}

	render() {
		const { theme } = this.properties;

		return v('div', [
			v('h2', [ 'Button Examples' ]),
			v('div', { id: 'example-1' }, [
				v('p', [ 'Basic example:' ]),
				w(Button, {
					key: 'b1',
					theme
				}, [ 'Basic Button' ])
			]),
			v('div', { id: 'example-2' }, [
				v('p', [ 'Disabled submit button:' ]),
				w(Button, {
					key: 'b2',
					theme,
					disabled: true,
					type: 'submit'
				}, [ 'Submit' ])
			]),
			v('div', { id: 'example-3' }, [
				v('p', [ 'Popup button:' ]),
				w(Button, {
					key: 'b3',
					theme,
					popup: { expanded: false, id: 'fakeId' }
				}, [ 'Open' ])
			]),
			v('div', { id: 'example-4' }, [
				v('p', [ 'Toggle Button' ]),
				w(Button, {
					key: 'b4',
					theme,
					pressed: this._buttonPressed,
					onClick: this.toggleButton
				}, [ 'Button state' ])
			])
		]);
	}
}
