import { DNode } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import SlidePane, { Align } from '../../slide-pane/index';

export class App extends WidgetBase<WidgetProperties> {
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
			w(SlidePane, {
				title: 'SlidePane',
				key: 'pane',
				open: this._open,
				underlay: this._underlay,
				align: this._align,
				onRequestClose: () => {
					this._open = false;
					this.invalidate();
				}
			}, [
				`Lorem ipsum dolor sit amet, consectetur adipiscing elit.
				Quisque id purus ipsum. Aenean ac purus purus.
				Nam sollicitudin varius augue, sed lacinia felis tempor in.`
			]),
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

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
