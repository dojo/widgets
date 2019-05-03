import { DNode } from '@dojo/framework/widget-core/interfaces';
import { v, w } from '@dojo/framework/widget-core/d';
import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import SlidePane, { Align } from '../../slide-pane/index';

export default class App extends WidgetBase {
	private _open = false;
	private _underlay = false;
	private _align: Align = Align.left;

	openSlidePane() {
		this._open = true;
		this.invalidate();
	}

	toggleUnderlay(event: Event) {
		this._underlay = (event.target as HTMLInputElement).checked;
		this.invalidate();
	}

	toggleAlign(event: Event) {
		this._align = (event.target as HTMLInputElement).checked ? Align.right : Align.left;
		this.invalidate();
	}

	render(): DNode {
		return v('div', [
			w(
				SlidePane,
				{
					title: 'SlidePane',
					key: 'pane',
					open: this._open,
					underlay: this._underlay,
					align: this._align,
					onRequestClose: () => {
						this._open = false;
						this.invalidate();
					}
				},
				[
					`Lorem ipsum dolor sit amet, consectetur adipiscing elit.
				Quisque id purus ipsum. Aenean ac purus purus.
				Nam sollicitudin varius augue, sed lacinia felis tempor in.
				Lorem ipsum dolor sit amet, consectetur adipiscing elit.
				Quisque id purus ipsum. Aenean ac purus purus.
				Nam sollicitudin varius augue, sed lacinia felis tempor in.
				Lorem ipsum dolor sit amet, consectetur adipiscing elit.
				Quisque id purus ipsum. Aenean ac purus purus.
				Nam sollicitudin varius augue, sed lacinia felis tempor in.
				Lorem ipsum dolor sit amet, consectetur adipiscing elit.
				Quisque id purus ipsum. Aenean ac purus purus.
				Nam sollicitudin varius augue, sed lacinia felis tempor in.
				Lorem ipsum dolor sit amet, consectetur adipiscing elit.
				Quisque id purus ipsum. Aenean ac purus purus.
				Nam sollicitudin varius augue, sed lacinia felis tempor in.
				Lorem ipsum dolor sit amet, consectetur adipiscing elit.
				Quisque id purus ipsum. Aenean ac purus purus.
				Nam sollicitudin varius augue, sed lacinia felis tempor in.
				Lorem ipsum dolor sit amet, consectetur adipiscing elit.
				Quisque id purus ipsum. Aenean ac purus purus.
				Nam sollicitudin varius augue, sed lacinia felis tempor in.
				Lorem ipsum dolor sit amet, consectetur adipiscing elit.
				Quisque id purus ipsum. Aenean ac purus purus.
				Nam sollicitudin varius augue, sed lacinia felis tempor in.`
				]
			),
			v('button', {
				id: 'button',
				innerHTML: 'open slidepane',
				onclick: this.openSlidePane
			}),
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
					id: 'alignRight',
					onchange: this.toggleAlign
				}),
				v('label', {
					for: 'alignRight',
					innerHTML: 'align right'
				})
			])
		]);
	}
}
