import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import { w, v } from '@dojo/widget-core/d';
import { DNode, Widget, WidgetProperties } from '@dojo/widget-core/interfaces';
import createProjectorMixin from '@dojo/widget-core/mixins/createProjectorMixin';
import internalState, { InternalState } from '@dojo/widget-core/mixins/internalState';
import createTitlePanel from '../../components/titlePanel/createTitlePanel';

type Root = Widget<WidgetProperties> & InternalState;

const createApp = createWidgetBase
	.mixin(internalState)
	.mixin({
		mixin: {
			render(this: Root): DNode {
				return v('div', {
					classes: {
						'main-app': true
					}
				}, [
					w(createTitlePanel, {
						id: 'titlePanel1',
						title: 'TitlePanel Widget With closeable=false',
						closeable: false,
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
					w(createTitlePanel, {
						id: 'titlePanel2',
						title: 'TitlePanel Widget (closeable)',
						open: <boolean> this.state['t2open'],
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
								Nam sollicitudin varius augue, sed lacinia felis tempor in.`
						})
					]),
					w(createTitlePanel, {
						id: 'titlePanel3',
						title: 'TitlePanel Widget with open=false',
						open: <boolean> (this.state['t3open'] === undefined ? false : this.state['t3open']),
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
	});

createApp.mixin(createProjectorMixin)({
		cssTransitions: true
	}).append().then(() => {
		console.log('projector is attached');
	});
