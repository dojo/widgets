import { v, w } from '@dojo/widget-core/d';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import TitlePane from '../../titlepane/TitlePane';

export class App extends StatefulMixin(WidgetBase)<WidgetProperties> {
	render() {
		return v('div', {
			classes: {
				'main-app': true
			}
		}, [
			w(TitlePane, {
				ariaHeadingLevel: 1,
				closeable: false,
				id: 'titlePanel1',
				key: 'titlePanel1',
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
			]),
			w(TitlePane, {
				ariaHeadingLevel: 2,
				id: 'titlePanel2',
				key: 'titlePanel2',
				open: <boolean> this.state['t2open'],
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
			]),
			w(TitlePane, {
				id: 'titlePanel3',
				key: 'titlePanel3',
				open: <boolean> (this.state['t3open'] === undefined ? false : this.state['t3open']),
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
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector({});

projector.append();
