import { deepAssign } from '@dojo/core/lang';
import { DNode } from '@dojo/widget-core/interfaces';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemedProperties } from '@dojo/widget-core/mixins/Themed';
import { v, w } from '@dojo/widget-core/d';
import SplitPane, { Direction } from '../../splitpane/SplitPane';

export default class App extends WidgetBase<ThemedProperties> {
	private state: any = {};

	public setState(state: any) {
		this.state = deepAssign(this.state, state);
		this.invalidate();
	}

	render(): DNode {
		const { theme } = this.properties;

		const containerStyles = {
			width: '100%',
			height: '500px',
			maxWidth: '1000px',
			border: '1px solid rgba(170, 170, 170, 0.5)'
		};

		return v('div', {
			styles: {
				padding: '50px'
			}
		}, [
			v('h1', ['SplitPane Examples']),
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
					size: this.state.rowSize,
					theme
				})
			]),
			v('h3', ['Column']),
			v('div', {
				id: 'example-column',
				styles: containerStyles
			}, [
				w(SplitPane, {
					key: 'column',
					direction: Direction.column,
					onResize: (size: number) => {
						this.setState({ columnSize: size });
					},
					size: this.state.columnSize,
					theme
				})
			]),
			v('h3', ['Nested']),
			v('div', {
				id: 'example-nested',
				styles: containerStyles
			}, [
				w(SplitPane, {
					key: 'nested',
					direction: Direction.row,
					onResize: (size: number) => {
						this.setState({ nestedSizeA: size });
					},
					size: this.state.nestedSizeA,
					theme,
					trailing: w(SplitPane, {
						direction: Direction.column,
						onResize: (size: number) => {
							this.setState({ nestedSizeB: size });
						},
						size: this.state.nestedSizeB,
						theme
					})
				})
			]),
			v('h3', ['Multiple vertical nested']),
			v('div', {
				id: 'example-vertical-nested',
				styles: containerStyles
			}, [
				w(SplitPane, {
					key: 'verticalNested',
					direction: Direction.row,
					onResize: (size: number) => {
						this.setState({ nestedSizeC: size });
					},
					size: this.state.nestedSizeC,
					theme,
					trailing: w(SplitPane, {
						direction: Direction.row,
						onResize: (size: number) => {
							this.setState({ nestedSizeD: size });
						},
						size: this.state.nestedSizeD,
						theme
					})
				})
			]),
			v('h3', ['Multiple horizontal nested']),
			v('div', {
				id: 'example-horizontal-nested',
				styles: containerStyles
			}, [
				w(SplitPane, {
					key: 'horizontalNested',
					direction: Direction.column,
					onResize: (size: number) => {
						this.setState({ nestedSizeE: size });
					},
					size: this.state.nestedSizeE,
					theme,
					trailing: w(SplitPane, {
						direction: Direction.column,
						onResize: (size: number) => {
							this.setState({ nestedSizeF: size });
						},
						size: this.state.nestedSizeF,
						theme
					})
				})
			]),
			v('h3', ['Maximum size']),
			v('div', {
				id: 'example-max',
				styles: containerStyles
			}, [
				w(SplitPane, {
					key: 'maxSize',
					direction: Direction.row,
					onResize: (size: number) => {
						size = size > 300 ? 300 : size;
						this.setState({ maxSize: size });
					},
					size: this.state.maxSize,
					theme
				})
			]),
			v('h3', ['Minimum size']),
			v('div', {
				id: 'example-min',
				styles: containerStyles
			}, [
				w(SplitPane, {
					key: 'minSize',
					direction: Direction.row,
					onResize: (size: number) => {
						size = size < 100 ? 100 : size;
						this.setState({ minSize: size });
					},
					size: this.state.minSize,
					theme
				})
			])
		]);
	}
}
