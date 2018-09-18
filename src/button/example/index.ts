import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/framework/widget-core/interfaces';
import renderer from '@dojo/framework/widget-core/vdom';
import { w, v } from '@dojo/framework/widget-core/d';
import Button from '../../button/index';

export class App extends WidgetBase<WidgetProperties> {
	private _buttonPressed: boolean | undefined;

	toggleButton() {
		this._buttonPressed = !this._buttonPressed;
		this.invalidate();
	}

	render() {
		return v('div', [
			v('h2', [ 'Button Examples' ]),
			v('div', { id: 'example-1' }, [
				v('p', [ 'Basic example:' ]),
				w(Button, {
					key: 'b1'
				}, [ 'Basic Button' ])
			]),
			v('div', { id: 'example-2' }, [
				v('p', [ 'Disabled submit button:' ]),
				w(Button, {
					key: 'b2',
					disabled: true,
					type: 'submit'
				}, [ 'Submit' ])
			]),
			v('div', { id: 'example-3' }, [
				v('p', [ 'Popup button:' ]),
				w(Button, {
					key: 'b3',
					popup: { expanded: false, id: 'fakeId' }
				}, [ 'Open' ]),
				v('div', { id: 'fakeId' })
			]),
			v('div', { id: 'example-4' }, [
				v('p', [ 'Toggle Button' ]),
				w(Button, {
					key: 'b4',
					pressed: this._buttonPressed,
					onClick: this.toggleButton
				}, [ 'Button state' ])
			])
		]);
	}
}

const r = renderer(() => w(App, {}));
r.mount();
