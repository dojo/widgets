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
						title: 'TitlePanel Widget With collapsible=false',
						collapsible: false,
						onRequestCollapse: () => {
							alert('onRequestCollapse should never get called');
						},
						onRequestExpand: () => {
							alert('onRequestExpand should never get called');
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
						title: 'TitlePanel Widget (collapsible)',
						collapsed: <boolean> this.state['t2collapsed'],
						onRequestCollapse: () => {
							this.setState({ t2collapsed: true });
						},
						onRequestExpand: () => {
							this.setState({ t2collapsed: false });
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
						title: 'TitlePanel Widget with collapsed=true',
						collapsed: <boolean> (this.state['t3collapsed'] === undefined ? true : this.state['t3collapsed']),
						onRequestCollapse: () => {
							this.setState({ t3collapsed: true });
						},
						onRequestExpand: () => {
							this.setState({ t3collapsed: false });
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
