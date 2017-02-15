import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import Dialog from '../../dialog/Dialog';

export class App extends StatefulMixin(WidgetBase)<WidgetProperties> {
	openDialog() {
		this.setState({ open: true });
	}

	toggleModal(event: Event) {
		this.setState({ modal: (<HTMLInputElement> event.target).checked });
	}

	toggleUnderlay(event: Event) {
		this.setState({ underlay: (<HTMLInputElement> event.target).checked });
	}

	toggleCloseable(event: Event) {
		this.setState({ closeable: (<HTMLInputElement> event.target).checked });
	}

	toggleEnterAnimation(event: Event) {
		this.setState({ enterAnimation: (<HTMLInputElement> event.target).checked ? 'slideIn' : undefined });
	}

	toggleExitAnimation(event: Event) {
		this.setState({ exitAnimation: (<HTMLInputElement> event.target).checked ? 'slideOut' : undefined });
	}

	render() {
		return v('div', [
			w(Dialog, {
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
				onclick: this.openDialog
			}),
			v('div', { classes: { option: true }}, [
				v('input', {
					type: 'checkbox',
					id: 'modal',
					onchange: this.toggleModal
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
					onchange: this.toggleUnderlay
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
					onchange: this.toggleCloseable,
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
					onchange: this.toggleEnterAnimation
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
					onchange: this.toggleExitAnimation
				}),
				v('label', {
					for: 'exitAnimation',
					innerHTML: 'exitAnimation'
				})
			])
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector({});

projector.append();
