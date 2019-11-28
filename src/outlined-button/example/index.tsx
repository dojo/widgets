import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { w, v } from '@dojo/framework/core/vdom';
import OutlinedButton from '../../outlined-button/index';

export default class App extends WidgetBase {
	private _buttonPressed: boolean | undefined;

	toggleButton() {
		this._buttonPressed = !this._buttonPressed;
		this.invalidate();
	}

	render() {
		return v('div', [
			v('h2', ['OutlinedButton Examples']),
			v('div', { id: 'example-1' }, [
				v('p', ['Basic example:']),
				w(
					OutlinedButton,
					{
						key: 'b1'
					},
					['Basic OutlinedButton']
				)
			]),
			v('div', { id: 'example-2' }, [
				v('p', ['Disabled submit button:']),
				w(
					OutlinedButton,
					{
						key: 'b2',
						disabled: true,
						type: 'submit'
					},
					['Submit']
				)
			]),
			v('div', { id: 'example-4' }, [
				v('p', ['Toggle OutlinedButton']),
				w(
					OutlinedButton,
					{
						key: 'b4',
						pressed: this._buttonPressed,
						onClick: this.toggleButton
					},
					['OutlinedButton state']
				)
			])
		]);
	}
}
