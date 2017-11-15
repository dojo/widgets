import { DNode } from '@dojo/widget-core/interfaces';
import { v, w } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemedProperties } from '@dojo/widget-core/mixins/Themed';
import SlidePane, { Align } from '../../slidepane/SlidePane';

export default class App extends WidgetBase<ThemedProperties> {
	private _open = false;
	private _underlay = false;
	private _align: Align = Align.left;

	openSlidePane() {
		this._open = true;
		this.invalidate();
	}

	toggleUnderlay(event: Event) {
		this._underlay = (<HTMLInputElement> event.target).checked;
		this.invalidate();
	}

	toggleAlign(event: Event) {
		this._align = (<HTMLInputElement> event.target).checked ? Align.right : Align.left;
		this.invalidate();
	}

	render(): DNode {
		const { theme } = this.properties;

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
				},
				theme
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
