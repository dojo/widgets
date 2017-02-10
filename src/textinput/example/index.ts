import { DNode, Widget, WidgetProperties } from '@dojo/widget-core/interfaces';
import { w, v } from '@dojo/widget-core/d';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import createProjectorMixin from '@dojo/widget-core/mixins/createProjectorMixin';
import createTextInput from '../../textinput/createTextInput';

type Root = Widget<WidgetProperties>;

const createApp = createWidgetBase.mixin({
	mixin: {
		getChildrenNodes: function(this: Root): DNode[] {
			return [
				v('h2', {}, ['Text Input']),
				w(createTextInput, {
					type: 'text',
					placeholder: 'Hello, World',
					label: 'Type something'
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
