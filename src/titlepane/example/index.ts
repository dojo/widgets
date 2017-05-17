import { v, w } from '@dojo/widget-core/d';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import TitlePane from '../TitlePane';
import dojoTheme from '../../themes/dojo/theme';

export class App extends StatefulMixin(WidgetBase)<WidgetProperties> {
	private _theme: {};

	themeChange(event: Event) {
		const checked = (<HTMLInputElement> event.target).checked;
		this._theme = checked ? dojoTheme : {};
		this.invalidate();
	}

	render() {
		const { t2open = true, t3open = false } = this.state;

		return v('div', {
			styles: {
				margin: '20px',
				width: '450px'
			}
		}, [
			v('div', { classes: { option: true }, style: 'margin-bottom: 20px;' }, [
				v('label', [
					'Use Dojo Theme ',
					v('input', {
						type: 'checkbox',
						onchange: this.themeChange
					})
				])
			]),

			v('div', {
				id: 'titlePane1',
				styles: { 'margin-bottom': '15px' }
			}, [
				w(TitlePane, {
					headingLevel: 1,
					closeable: false,
					key: 'titlePane1',
					theme: this._theme,
					title: 'TitlePanel Widget With closeable=false',
					onRequestClose: () => {
						alert('onRequestClose should never get called');
					},
					onRequestOpen: () => {
						alert('onRequestOpen should never get called');
					}
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
					open: t2open,
					theme: this._theme,
					title: 'TitlePanel Widget (closeable)',
					onRequestClose: () => {
						this.setState({ t2open: false });
					},
					onRequestOpen: () => {
						this.setState({ t2open: true });
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
					open: t3open,
					theme: this._theme,
					title: 'TitlePanel Widget with open=false',
					onRequestClose: () => {
						this.setState({ t3open: false });
					},
					onRequestOpen: () => {
						this.setState({ t3open: true });
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
