import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';

import TitlePane from '../TitlePane';

export class App extends WidgetBase<WidgetProperties> {
	private _t2Open = true;
	private _t3Open = false;

	render() {
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
				styles: { marginBottom: '15px' }
			}, [
				w(TitlePane, {
					headingLevel: 1,
					closeable: false,
					key: 'titlePane1',
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
				styles: { marginBottom: '15px' }
			}, [
				w(TitlePane, {
					headingLevel: 2,
					key: 'titlePane2',
					open: _t2Open,
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

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
