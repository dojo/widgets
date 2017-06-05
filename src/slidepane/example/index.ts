import { DNode } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { v, w } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import SlidePane, { Align } from '../../slidepane/SlidePane';
import dojoTheme from '../../themes/dojo/theme';

export class App extends StatefulMixin(WidgetBase)<WidgetProperties> {
	private _theme: {};

	themeChange(event: Event) {
		const checked = (<HTMLInputElement> event.target).checked;
		this._theme = checked ? dojoTheme : {};
		this.invalidate();
	}

	openSlidePane() {
		this.setState({ open: true });
	}

	toggleUnderlay(event: Event) {
		this.setState({ underlay: (<HTMLInputElement> event.target).checked });
	}

	toggleAlign(event: Event) {
		this.setState({ align: (<HTMLInputElement> event.target).checked ? Align.right : Align.left });
	}

	render(): DNode {
		return v('div', [
			w(SlidePane, {
				key: 'pane',
				open: this.state.open,
				underlay: this.state.underlay,
				align: this.state.align,
				onRequestClose: () => this.setState({ open: false }),
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
