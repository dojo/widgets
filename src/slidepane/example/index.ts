import { DNode } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { v, w } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import SlidePane, { Align } from '../../slidepane/SlidePane';

export class App extends StatefulMixin(WidgetBase)<WidgetProperties> {
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
				open: <boolean> this.state['open'],
				underlay: <boolean> this.state['underlay'],
				align: <Align> this.state['align'],
				onClose: () => {
					this.setState({ open: false });
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
