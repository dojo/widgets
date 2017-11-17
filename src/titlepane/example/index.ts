import { v, w } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemedProperties } from '@dojo/widget-core/mixins/Themed';

import TitlePane from '../TitlePane';

export default class App extends WidgetBase<ThemedProperties> {
	private _t2Open = true;
	private _t3Open = false;

	render() {
		const { theme } = this.properties;
		const {
			_t2Open,
			_t3Open
		} = this;

		return v('div', {
			styles: {
				margin: '20px',
				maxWidth: '350px'
			}
		}, [
			v('div', {
				id: 'titlePane1',
				styles: { 'margin-bottom': '15px' }
			}, [
				w(TitlePane, {
					headingLevel: 1,
					closeable: false,
					key: 'titlePane1',
					theme,
					title: 'TitlePanel Widget With closeable=false'
				}, [
					v('div', {
						innerHTML: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
							Quisque id purus ipsum. Aenean ac purus purus.
							Nam sollicitudin varius augue, sed lacinia felis tempor in.`
					})
				])
			]),

			v('div', {
				id: 'titlePane2',
				styles: { 'margin-bottom': '15px' }
			}, [
				w(TitlePane, {
					headingLevel: 2,
					key: 'titlePane2',
					open: _t2Open,
					theme,
					title: 'TitlePanel Widget (closeable)',
					onRequestClose: () => {
						this._t2Open = false;
						this.invalidate();
					},
					onRequestOpen: () => {
						this._t2Open = true;
						this.invalidate();
					}
				}, [
					v('div', {
						innerHTML: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
							Quisque id purus ipsum. Aenean ac purus purus.
							Nam sollicitudin varius augue, sed lacinia felis tempor in.
							<br>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit.
							Quisque id purus ipsum. Aenean ac purus purus.
							Nam sollicitudin varius augue, sed lacinia felis tempor in.
							<br>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit.
							Quisque id purus ipsum. Aenean ac purus purus.
							Nam sollicitudin varius augue, sed lacinia felis tempor in.`
					})
				])
			]),

			v('div', { id: 'titlePane3' }, [
				w(TitlePane, {
					key: 'titlePane3',
					open: _t3Open,
					theme,
					title: 'TitlePanel Widget with open=false',
					onRequestClose: () => {
						this._t3Open = false;
						this.invalidate();
					},
					onRequestOpen: () => {
						this._t3Open = true;
						this.invalidate();
					}
				}, [
					v('div', {
						innerHTML: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
							Quisque id purus ipsum. Aenean ac purus purus.
							Nam sollicitudin varius augue, sed lacinia felis tempor in.`
					})
				])
			])
		]);
	}
}
