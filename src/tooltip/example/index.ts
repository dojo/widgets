import { Set } from '@dojo/shim/Set';
import { w, v } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemedProperties } from '@dojo/widget-core/mixins/Themed';

import Button from '../../button/Button';
import TextInput from '../../textinput/TextInput';
import Tooltip, { Orientation } from '../Tooltip';

export default class App extends WidgetBase<ThemedProperties> {
	private _open = new Set<string>();

	onShow(key: string) {
		this._open.add(key);
		this.invalidate();
	}

	onHide(key: string) {
		this._open.delete(key);
		this.invalidate();
	}

	render() {
		const { theme } = this.properties;

		return v('div', [
			v('h2', [ 'Tooltip Examples' ]),
			v('div', { id: 'example-1' }, [
				w(Tooltip, {
					key: 'foo',
					content: 'This is a right-oriented tooltip that opens and closes based on child click.',
					orientation: Orientation.right,
					open: this._open.has('foo'),
					theme
				}, [
					w(Button, {
						theme,
						onClick: () => {
							const exists = this._open.has('foo');
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
					open: this._open.has('bar'),
					theme
				}, [
					w(TextInput, {
						theme,
						placeholder: 'Focus me',
						onFocus: () => { this.onShow('bar'); },
						onBlur: () => { this.onHide('bar'); }
					})
				])
			])
		]);
	}
}
