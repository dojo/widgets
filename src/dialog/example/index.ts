import { DNode } from '@dojo/widget-core/interfaces';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import Dialog from '../../dialog/Dialog';
import dojoTheme from '../../themes/dojo/theme';

export class App extends StatefulMixin(WidgetBase)<WidgetProperties> {
	private _theme: {};

	themeChange(event: Event) {
		const checked = (<HTMLInputElement> event.target).checked;
		this._theme = checked ? dojoTheme : {};
		this.invalidate();
	}

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

	render(): DNode {
		return v('div', [
			w(Dialog, {
				key: 'dialog',
				title: 'Dialog',
				open: <boolean> this.state['open'],
				modal: <boolean> this.state['modal'],
				underlay: <boolean> this.state['underlay'],
				closeable: <boolean> this.state['closeable'],
				onRequestClose: () => {
					this.setState({ open: false });
				},
				theme: this._theme
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
				v('label', [
					'Use Dojo Theme ',
					v('input', {
						type: 'checkbox',
						onchange: this.themeChange
					})
				])
			]),
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
			])
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
