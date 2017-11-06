import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { Set } from '@dojo/shim/Set';
import { w, v } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties, TypedTargetEvent } from '@dojo/widget-core/interfaces';

import Button from '../../button/Button';
import TextInput from '../../textinput/TextInput';
import Tooltip, { Orientation } from '../Tooltip';

import dojoTheme from '../../themes/dojo/theme';

export class App extends WidgetBase<WidgetProperties> {
	private _showing = new Set<string>();
	private _theme: {};

	themeChange(event: TypedTargetEvent<HTMLInputElement>) {
		this._theme = event.target.checked ? dojoTheme : {};
		this.invalidate();
	}

	onShow(key: string) {
		this._showing.add(key);
		this.invalidate();
	}

	onHide(key: string) {
		this._showing.delete(key);
		this.invalidate();
	}

	render() {
		return v('div', [
			v('h2', [ 'Tooltip Examples' ]),
			v('label', [
				'Use Dojo Theme ',
				v('input', {
					type: 'checkbox',
					onchange: this.themeChange
				})
			]),
			v('div', { id: 'example-1' }, [
				w(Tooltip, {
					key: 'foo',
					content: 'This is a right-oriented tooltip that opens and closes based on child click.',
					orientation: Orientation.right,
					showing: this._showing.has('foo'),
					theme: this._theme
				}, [
					w(Button, {
						theme: this._theme,
						onClick: () => {
							const exists = this._showing.has('foo');
							exists ? this.onHide('foo') : this.onShow('foo');
						}
					}, [ 'Click me' ])
				])
			]),
			v('div', { id: 'example-2' }, [
				w(Tooltip, {
					key: 'bar',
					content: 'This is a right-oriented tooltip that opens and closes based on child focus.',
					orientation: Orientation.right,
					showing: this._showing.has('bar'),
					theme: this._theme
				}, [
					w(TextInput, {
						theme: this._theme,
						placeholder: 'Focus me',
						onFocus: () => { this.onShow('bar'); },
						onBlur: () => { this.onHide('bar'); }
					})
				])
			])
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
