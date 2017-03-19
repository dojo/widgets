import { DNode } from '@dojo/widget-core/interfaces';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import TabPane, { TabConfig, Align } from '../../tabpane/TabPane';

let timeout: any;

export class App extends StatefulMixin(WidgetBase)<WidgetProperties> {
	onAlignChange(event: Event) {
		const value = (<HTMLInputElement> event!.target).value;
		let align = Align.top;

		switch (value) {
			case 'right':
				align = Align.right;
				break;
			case 'bottom':
				align = Align.bottom;
				break;
			case 'left':
				align = Align.left;
				break;
		}

		this.setState({ align: align });
	}
	render(): DNode {
		return v('div', {
			classes: { example: true }
		}, [
			v('select', {
				onchange: this.onAlignChange
			}, [
				v('option', { selected: true, value: 'top' }, [ 'Top' ]),
				v('option', { value: 'left' }, [ 'Left' ]),
				v('option', { value: 'right' }, [ 'Right' ]),
				v('option', { value: 'bottom' }, [ 'Bottom' ])
			]),
			w(TabPane, {
				activeIndex: <number> this.state.activeIndex,
				loadingIndex: <number> this.state.loadingIndex,
				onRequestTabClose: (newTabs: TabConfig[]) => this.setState({ tabs: newTabs }),
				alignButtons: <Align> this.state.align,
				onRequestTabChange: (index: number) => {
					clearTimeout(timeout);
					if (index === 2) {
						this.setState({ loadingIndex: 2 });
						timeout = setTimeout(() => this.setState({
							activeIndex: index,
							loadingIndex: null
						}), 3000);
					}
					else {
						this.setState({
							activeIndex: index,
							loadingIndex: null
						});
					}
				},
				tabs: <TabConfig[]> this.state.tabs || [{
					label: 'Default',
					content: v('div', [
						'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer in ex pharetra, iaculis turpis eget, tincidunt lorem. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.'
					])
				}, {
					label: 'Disabled',
					content: v('div', [
						'Sed nibh est, sollicitudin consectetur porta finibus, condimentum gravida purus. Phasellus varius fringilla erat, a dignissim nunc iaculis et. Curabitur eu neque erat. Integer id lacus nulla. Phasellus ut sem eget enim interdum interdum ac ac orci.'
					]),
					disabled: true
				}, {
					label: 'Async',
					content: v('div', [
						'Curabitur id elit a tellus consequat maximus in non lorem. Donec sagittis porta aliquam. Nulla facilisi. Quisque sed mauris justo. Donec eu fringilla urna. Aenean vulputate ipsum imperdiet orci ornare tempor.'
					])
				}, {
					label: 'Closeable',
					content: v('div', [
						'Nullam congue, massa in egestas sagittis, diam neque rutrum tellus, nec egestas metus tellus vel odio. Vivamus tincidunt quam nisl, sit amet venenatis purus bibendum eget. Phasellus fringilla ex vitae odio hendrerit, non volutpat orci rhoncus.'
					]),
					closeable: true
				}, {
					label: 'Default',
					content: v('div', [
						'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer in ex pharetra, iaculis turpis eget, tincidunt lorem. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.'
					])
				}]
			})
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
