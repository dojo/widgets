import { deepAssign } from '@dojo/core/lang';
import { DNode } from '@dojo/widget-core/interfaces';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import { Dimensions } from '@dojo/widget-core/meta/Dimensions';
import SplitPane, { Direction } from '../../split-pane/index';
import GlobalEvent from '../../global-event/index';

export class App extends WidgetBase<WidgetProperties> {
	private state: any = {};

	public setState(state: any) {
		this.state = deepAssign(this.state, state);
		this.invalidate();
	}

	private _direction = Direction.column;

	private _collapseWidth = 600;

	private _changeToRow() {
		this._direction = this._direction === Direction.row ? Direction.column : Direction.row;
		this.invalidate();
	}

	private _changeCollapseWidth() {
		this._collapseWidth = this._collapseWidth === 600 ? 350 : 600;
		this.invalidate();
	}

	private _onResize = () => {
		this.invalidate();
	}

	render(): DNode {
		const containerStyles = {
			width: '100%',
			height: '500px',
			maxWidth: '1000px',
			border: '1px solid rgba(170, 170, 170, 0.5)'
		};

		const { width } = this.meta(Dimensions).get('example-column').size;

		return v('div', {
			styles: {
				padding: '50px'
			}
		}, [
			w(GlobalEvent, { key: 'global', window: { resize: this._onResize } }),
			v('h1', ['SplitPane Examples']),
			v('h3', ['Column']),
			v('div', { styles: { marginBottom: '10px' } }, [
				v('div', { styles: { marginBottom: '5px' } }, [ `Current Collapse Width: ${this._collapseWidth}` ]),
				v('div', { styles: { marginBottom: '5px' } }, [ `Current Size: ${width}` ]),
				v('button', { onclick: this._changeToRow }, [ 'Change to row' ]),
				v('button', { onclick: this._changeCollapseWidth }, [ `Change collapse width to ${this._collapseWidth === 600 ? '350' : '600' }` ])
			]),
			v('div', {
				key: 'example-column',
				id: 'example-column',
				styles: containerStyles
			}, [
					w(SplitPane, {
						key: 'column',
						collapseWidth: this._collapseWidth,
						direction: this._direction,
						onResize: (size: number) => {
							this.setState({ columnSize: size });
						},
						size: this.state.columnSize
					}, [ v('div', [ 'left' ]), v('div', [ 'right' ])])
			]),
			v('h3', ['Row']),
			v('div', {
				id: 'example-row',
				styles: containerStyles
			}, [
				w(SplitPane, {
					key: 'row',
					direction: Direction.row,
					onResize: (size: number) => {
						this.setState({ rowSize: size });
					},
					size: this.state.rowSize
				})
			]),
			v('h3', ['Nested']),
			v('div', {
				id: 'example-nested',
				styles: containerStyles
			}, [
				w(SplitPane, {
					key: 'nested',
					direction: Direction.column,
					onResize: (size: number) => {
						this.setState({ nestedSizeA: size });
					},
					size: this.state.nestedSizeA
				}, [
					v('div'),
					w(SplitPane, {
						direction: Direction.row,
						onResize: (size: number) => {
							this.setState({ nestedSizeB: size });
						},
						size: this.state.nestedSizeB
					})
				])
			]),
			v('h3', ['Multiple vertical nested']),
			v('div', {
				id: 'example-vertical-nested',
				styles: containerStyles
			}, [
				w(SplitPane, {
					key: 'verticalNested',
					direction: Direction.column,
					onResize: (size: number) => {
						this.setState({ nestedSizeC: size });
					},
					size: this.state.nestedSizeC
				}, [
					v('div'),
					w(SplitPane, {
						direction: Direction.column,
						onResize: (size: number) => {
							this.setState({ nestedSizeD: size });
						},
						size: this.state.nestedSizeD
					})
				])
			]),
			v('h3', ['Multiple horizontal nested']),
			v('div', {
				id: 'example-horizontal-nested',
				styles: containerStyles
			}, [
				w(SplitPane, {
					key: 'horizontalNested',
					direction: Direction.row,
					onResize: (size: number) => {
						this.setState({ nestedSizeE: size });
					},
					size: this.state.nestedSizeE
				}, [
					v('div'),
					w(SplitPane, {
						direction: Direction.row,
						onResize: (size: number) => {
							this.setState({ nestedSizeF: size });
						},
						size: this.state.nestedSizeF
					})
				])
			]),
			v('h3', ['Maximum size']),
			v('div', {
				id: 'example-max',
				styles: containerStyles
			}, [
				w(SplitPane, {
					key: 'maxSize',
					direction: Direction.column,
					onResize: (size: number) => {
						size = size > 300 ? 300 : size;
						this.setState({ maxSize: size });
					},
					size: this.state.maxSize
				})
			]),
			v('h3', ['Minimum size']),
			v('div', {
				id: 'example-min',
				styles: containerStyles
			}, [
				w(SplitPane, {
					key: 'minSize',
					direction: Direction.column,
					onResize: (size: number) => {
						size = size < 100 ? 100 : size;
						this.setState({ minSize: size });
					},
					size: this.state.minSize
				})
			])
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
