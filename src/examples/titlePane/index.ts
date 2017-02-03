import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import { w, v } from '@dojo/widget-core/d';
import { DNode, Widget, WidgetProperties } from '@dojo/widget-core/interfaces';
import createProjectorMixin from '@dojo/widget-core/mixins/createProjectorMixin';
import internalState, { InternalState } from '@dojo/widget-core/mixins/internalState';
import createTitlePane from '../../components/titlePane/createTitlePane';

type Root = Widget<WidgetProperties> & InternalState;

const createApp = createWidgetBase
.mixin(internalState)
.mixin({
	mixin: {
		getChildrenNodes: function(this: Root): DNode[] {
			return [
				w(createTitlePane, {
					id: 'titlePane',
					title: 'Title Pane Widget Title',
					collapsed: true,
					onCollapse() {
						console.log('collapsed');
					},
					onExpand() {
						console.log('expanded');
					}
				}, [ v('div', {
					innerHTML: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Quisque id purus ipsum. Aenean ac purus purus.
						Nam sollicitudin varius augue, sed lacinia felis tempor in.`
				}) ])
			];
		},
		classes: [ 'main-app' ],
		tagName: 'main'
	}
});

createApp.mixin(createProjectorMixin)().append().then(() => {
	console.log('projector is attached');
});
