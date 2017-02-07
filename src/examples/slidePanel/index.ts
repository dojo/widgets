import { DNode, Widget, WidgetProperties } from '@dojo/widget-core/interfaces';
import { w, v } from '@dojo/widget-core/d';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import createProjectorMixin from '@dojo/widget-core/mixins/createProjectorMixin';
import createSlidePanel from '../../components/slidePanel/createSlidePanel';
import internalState, { InternalState } from '@dojo/widget-core/mixins/internalState';

type Root = Widget<WidgetProperties> & InternalState;

function openSlidePanel(this: Root) {
	this.setState({ open: true });
}

function toggleUnderlay(this: Root, event: Event) {
	this.setState({ underlay: (<HTMLInputElement> event.target).checked });
}

function toggleAlign(this: Root, event: Event) {
	this.setState({ align: (<HTMLInputElement> event.target).checked ? 'right' : 'left' });
}

const createApp = createWidgetBase.mixin(internalState).mixin({
	mixin: {
		cssTransitions: true,
		getChildrenNodes: function(this: Root): DNode[] {
			return [
				w(createSlidePanel, {
					id: 'panel',
					open: <boolean> this.state['open'],
					underlay: <boolean> this.state['underlay'],
					align: <string> this.state['align'],
					onRequestClose: () => {
						this.setState({ open: false });
					}
				}, [
					`Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					Quisque id purus ipsum. Aenean ac purus purus.
					Nam sollicitudin varius augue, sed lacinia felis tempor in.`
				]),
				v('button', {
					id: 'button',
					innerHTML: 'open slidepanel',
					onclick: openSlidePanel
				}),
				v('div', { classes: { option: true }}, [
					v('input', {
						type: 'checkbox',
						id: 'underlay',
						onchange: toggleUnderlay
					}),
					v('label', {
						for: 'underlay',
						innerHTML: 'underlay'
					})
				]),
				v('div', { classes: { option: true }}, [
					v('input', {
						type: 'checkbox',
						id: 'alignRight',
						onchange: toggleAlign
					}),
					v('label', {
						for: 'alignRight',
						innerHTML: 'align right'
					})
				])
			];
		},
		classes: [ 'main-app' ],
		tagName: 'main'
	}
});

createApp.mixin(createProjectorMixin)({
	cssTransitions: true
}).append().then(() => {
	console.log('projector is attached');
});
