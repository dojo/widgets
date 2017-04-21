import { DNode } from '@dojo/widget-core/interfaces';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import SplitPane, { Direction } from '../../splitpane/SplitPane';

export class App extends StatefulMixin(WidgetBase)<WidgetProperties> {
	render(): DNode {
		const containerStyles = {
			width: '100vw',
			height: '100vh',
			maxWidth: '1000px',
			maxHeight: '600px',
			border: '1px solid rgba(170, 170, 170, 0.5)'
		};

		return v('div', [
			v('h1', ['SplitPane Examples']),
			v('h3', ['Nested']),
			v('div', {
				styles: containerStyles
			}, [
				w(SplitPane, {
					direction: Direction.row,
					onResize: (size: number) => this.setState({ nestedSizeA: size }),
					size: <number> this.state.nestedSizeA,
					trailing: w(SplitPane, {
						direction: Direction.column,
						onResize: (size: number) => this.setState({ nestedSizeB: size }),
						size: <number> this.state.nestedSizeB
					})
				})
			])
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
