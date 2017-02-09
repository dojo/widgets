import { DNode, Widget, WidgetProperties } from '@dojo/widget-core/interfaces';
import { w, v } from '@dojo/widget-core/d';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import createProjectorMixin from '@dojo/widget-core/mixins/createProjectorMixin';
import createButton from '../../button/createButton';

type Root = Widget<WidgetProperties>;

const createApp = createWidgetBase.mixin({
	mixin: {
		getChildrenNodes: function(this: Root): DNode[] {
			return [
				v('h2', {
					innerHTML: 'Button Examples'
				}),
				v('p', {
					innerHTML: 'Basic example:'
				}),
				w(createButton, {
					content: 'Basic Button'
				}),
				v('p', {
					innerHTML: 'Disabled submit button:'
				}),
				w(createButton, {
					content: 'Submit',
					disabled: true,
					type: 'submit'
				}),
				v('p', {
					innerHTML: 'Icon Button'
				}),
				w(createButton, {
					content: 'Favorite',
					icon: ''
				})
			];
		},
		classes: [ 'main-app' ],
		tagName: 'main'
	}
});

createApp.mixin(createProjectorMixin)().append().then(() => {
	console.log('projector is attached');
});
