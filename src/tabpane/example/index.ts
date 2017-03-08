import { DNode } from '@dojo/widget-core/interfaces';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import TabPane, { TabConfig } from '../../tabpane/TabPane';

export class App extends StatefulMixin(WidgetBase)<WidgetProperties> {
	render(): DNode {
		return v('div', [
			w(TabPane, {
				activeIndex: <number> this.state.activeIndex,
				onRequestTabClose: (newTabs: TabConfig[]) => this.setState({ tabs: newTabs }),
				onRequestTabChange: (index: number) => this.setState({ activeIndex: index }),
				tabs: <TabConfig[]> this.state.tabs || [{
					label: 'foo',
					content: v('div', [ 'foobar' ])
				}, {
					label: 'baz',
					content: v('div', [ 'abc def ghi jkl' ]),
					closeable: true
				}, {
					label: 'bar',
					content: v('div', [ 'barfoo' ]),
					disabled: true
				}]
			})
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
