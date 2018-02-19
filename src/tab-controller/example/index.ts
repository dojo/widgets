import { DNode } from '@dojo/widget-core/interfaces';
import { includes } from '@dojo/shim/array';
import { deepAssign } from '@dojo/core/lang';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import Tab from '../Tab';
import TabController, { Align } from '../../tab-controller';
import Task from '@dojo/core/async/Task';

let refresh: Task<any>;

function refreshData() {
	return new Task((resolve, reject) => {
		setTimeout(resolve, 1500);
	});
}

interface State {
	align: Align;
	closedKeys: string[];
	loading: boolean;
	activeIndex: number;
}

export class App extends WidgetBase<WidgetProperties> {
	private _state: State = {
		align: Align.top,
		closedKeys: [],
		loading: false,
		activeIndex: 0
	};

	private setState(state: Partial<State>) {
		this._state = deepAssign(this._state, state);
		this.invalidate();
	}

	onAlignChange(event: Event) {
		const value = (event.target as HTMLInputElement).value;
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
		const {
			activeIndex = 0,
			align,
			closedKeys = [],
			loading
		} = this._state;

		return v('div', {
			classes: 'example'
		}, [
			v('select', {
				styles: { marginBottom: '20px' },
				onchange: this.onAlignChange
			}, [
				v('option', { selected: true, value: 'top' }, [ 'Top' ]),
				v('option', { value: 'left' }, [ 'Left' ]),
				v('option', { value: 'right' }, [ 'Right' ]),
				v('option', { value: 'bottom' }, [ 'Bottom' ])
			]),
			w(TabController, {
				activeIndex: activeIndex,
				alignButtons: align,
				onRequestTabClose: (index: number, key: string) => {
					this.setState({ closedKeys: [...closedKeys, key] });
				},
				onRequestTabChange: (index: number, key: string) => {
					refresh && refresh.cancel();
					if (key === 'async') {
						this.setState({
							activeIndex: 2,
							loading: true
						});
						refresh = refreshData().then(() => {
							this.setState({ loading: false });
						});
					}
					else {
						this.setState({ activeIndex: index });
					}
				}
			}, [
				w(Tab, {
					key: 'default',
					label: 'Default'
				}, [
					'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer in ex pharetra, iaculis turpis eget, tincidunt lorem. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.'
				]),
				w(Tab, {
					disabled: true,
					key: 'disabled',
					label: 'Disabled'
				}, [
					'Sed nibh est, sollicitudin consectetur porta finibus, condimentum gravida purus. Phasellus varius fringilla erat, a dignissim nunc iaculis et. Curabitur eu neque erat. Integer id lacus nulla. Phasellus ut sem eget enim interdum interdum ac ac orci.'
				]),
				w(Tab, {
					key: 'async',
					label: 'Async'
				}, [
					loading ? 'Loading...' : 'Curabitur id elit a tellus consequat maximus in non lorem. Donec sagittis porta aliquam. Nulla facilisi. Quisque sed mauris justo. Donec eu fringilla urna. Aenean vulputate ipsum imperdiet orci ornare tempor.'
				]),
				!includes(closedKeys, 'closeable') ? w(Tab, {
					closeable: true,
					key: 'closeable',
					label: 'Closeable'
				}, [
					'Nullam congue, massa in egestas sagittis, diam neque rutrum tellus, nec egestas metus tellus vel odio. Vivamus tincidunt quam nisl, sit amet venenatis purus bibendum eget. Phasellus fringilla ex vitae odio hendrerit, non volutpat orci rhoncus.'
				]) : null,
				w(Tab, {
					key: 'foo',
					label: 'Foobar'
				}, [
					'Sed nibh est, sollicitudin consectetur porta finibus, condimentum gravida purus. Phasellus varius fringilla erat, a dignissim nunc iaculis et. Curabitur eu neque erat. Integer id lacus nulla. Phasellus ut sem eget enim interdum interdum ac ac orci.'
				])
			])
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
