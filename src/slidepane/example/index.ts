import { DNode } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import SlidePane, { Align } from '../SlidePane';
import Select from '../../select/Select';
import { OptionData } from '../../select/SelectOption';
import dojoTheme from '../../themes/dojo/theme';

const ALIGN_OPTIONS = [{
	value: Align.left,
	label: 'Left'
}, {
	value: Align.right,
	label: 'Right'
}, {
	value: Align.top,
	label: 'Top'
}, {
	value: Align.bottom,
	label: 'Bottom'
}];

export class App extends WidgetBase<WidgetProperties> {
	private _theme: {};
	private _open = false;
	private _underlay = false;
	private _align: Align = Align.left;
	private _alignValue = 'left';

	themeChange(event: Event) {
		const checked = (<HTMLInputElement> event.target).checked;
		this._theme = checked ? dojoTheme : {};
		this.invalidate();
	}

	openSlidePane() {
		this._open = true;
		this.invalidate();
	}

	toggleUnderlay(event: Event) {
		this._underlay = (<HTMLInputElement> event.target).checked;
		this.invalidate();
	}

	onAlignChange(option: OptionData) {
		this._alignValue = option.value;
		switch (option.value) {
			case 'left':
				this._align = Align.left;
				break;
			case 'right':
				this._align = Align.right;
				break;
			case 'top':
				this._align = Align.top;
				break;
			case 'bottom':
				this._align = Align.bottom;
				break;
		}
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
				},
				theme: this._theme
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
					id: 'underlay',
					onchange: this.toggleUnderlay
				}),
				v('label', {
					for: 'underlay',
					innerHTML: 'underlay'
				})
			]),
			v('div', { classes: { option: true }}, [
				w(Select, {
					label: 'Alignment',
					options: ALIGN_OPTIONS,
					value: this._alignValue,
					theme: this._theme,
					onChange: this.onAlignChange
				})
			])
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
