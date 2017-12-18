import { DNode } from '@dojo/widget-core/interfaces';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import Dialog from '../../dialog/Dialog';
import dojoTheme from '../../themes/dojo/theme';

export class App extends WidgetBase<WidgetProperties> {
	private _theme: {};
	private _modal = false;
	private _underlay = false;
	private _closeable = true;
	private _open = false;

	themeChange(event: Event) {
		const checked = (event.target as HTMLInputElement).checked;
		this._theme = checked ? dojoTheme : {};
		this.invalidate();
	}

	openDialog() {
		this._open = true;
		this.invalidate();
	}

	toggleModal(event: any) {
		this._modal = event.target.checked;
		this.invalidate();
	}

	toggleUnderlay(event: any) {
		this._underlay = event.target.checked;
		this.invalidate();
	}

	toggleCloseable(event: any) {
		this._closeable = event.target.checked;
		this.invalidate();
	}

	render(): DNode {
		return v('div', [
			v('button', {
				id: 'button',
				innerHTML: 'open dialog',
				onclick: this.openDialog
			}),
			w(
				Dialog,
				{
					key: 'dialog',
					title: 'Dialog',
					open: this._open,
					modal: this._modal,
					underlay: this._underlay,
					closeable: this._closeable,
					onRequestClose: () => {
						this._open = false;
						this.invalidate();
					},
					theme: this._theme
				},
				[
					`Lorem ipsum dolor sit amet, consectetur adipiscing elit.
				Quisque id purus ipsum. Aenean ac purus purus.
				Nam sollicitudin varius augue, sed lacinia felis tempor in.`
				]
			),
			v('div', { classes: 'option' }, [
				v('label', [
					'Use Dojo Theme ',
					v('input', {
						type: 'checkbox',
						onchange: this.themeChange
					})
				])
			]),
			v('div', { classes: 'option' }, [
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
			v('div', { classes: 'option' }, [
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
			v('div', { classes: 'option' }, [
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
