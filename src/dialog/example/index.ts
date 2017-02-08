import { DNode, Widget, WidgetProperties } from '@dojo/widget-core/interfaces';
import { w, v } from '@dojo/widget-core/d';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import createProjectorMixin from '@dojo/widget-core/mixins/createProjectorMixin';
import createDialog from '../../dialog/createDialog';
import internalState, { InternalState } from '@dojo/widget-core/mixins/internalState';

type Root = Widget<WidgetProperties> & InternalState;

function openDialog(this: Root) {
	this.setState({ open: true });
}

function toggleModal(this: Root, event: Event) {
	this.setState({ modal: (<HTMLInputElement> event.target).checked });
}

function toggleUnderlay(this: Root, event: Event) {
	this.setState({ underlay: (<HTMLInputElement> event.target).checked });
}

function toggleCloseable(this: Root, event: Event) {
	this.setState({ closeable: (<HTMLInputElement> event.target).checked });
}

function toggleEnterAnimation(this: Root, event: Event) {
	this.setState({ enterAnimation: (<HTMLInputElement> event.target).checked ? 'slideIn' : undefined });
}

function toggleExitAnimation(this: Root, event: Event) {
	this.setState({ exitAnimation: (<HTMLInputElement> event.target).checked ? 'slideOut' : undefined });
}

const createApp = createWidgetBase.mixin(internalState).mixin({
	mixin: {
		cssTransitions: true,
		getChildrenNodes: function(this: Root): DNode[] {
			return [
				w(createDialog, {
					id: 'dialog',
					title: 'Dialog',
					open: <boolean> this.state['open'],
					modal: <boolean> this.state['modal'],
					underlay: <boolean> this.state['underlay'],
					closeable: <boolean> this.state['closeable'],
					enterAnimation: <string> this.state['enterAnimation'],
					exitAnimation: <string> this.state['exitAnimation'],
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
					innerHTML: 'open dialog',
					onclick: openDialog
				}),
				v('div', { classes: { option: true }}, [
					v('input', {
						type: 'checkbox',
						id: 'modal',
						onchange: toggleModal
					}),
					v('label', {
						for: 'modal',
						innerHTML: 'modal'
					})
				]),
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
						id: 'closeable',
						onchange: toggleCloseable,
						checked: true
					}),
					v('label', {
						for: 'closeable',
						innerHTML: 'closeable'
					})
				]),
				v('div', { classes: { option: true }}, [
					v('input', {
						type: 'checkbox',
						id: 'enterAnimation',
						onchange: toggleEnterAnimation
					}),
					v('label', {
						for: 'enterAnimation',
						innerHTML: 'enterAnimation'
					})
				]),
				v('div', { classes: { option: true }}, [
					v('input', {
						type: 'checkbox',
						id: 'exitAnimation',
						onchange: toggleExitAnimation
					}),
					v('label', {
						for: 'exitAnimation',
						innerHTML: 'exitAnimation'
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
