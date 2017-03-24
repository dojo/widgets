import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import TabPane, { Align } from '../../TabPane';
import * as css from '../../styles/tabPane.m.css';
import { assign } from '@dojo/core/lang';

function props(props = {}) {
	return assign({
		activeIndex: 0,
		tabs: []
	}, props);
}

registerSuite({
	name: 'TabPane',

	'Active tab button should render'() {
		const tabPane = new TabPane();
		tabPane.setProperties({
			activeIndex: 0,
			tabs: [{
				label: 'foo'
			}]
		});

		const vnode = <VNode> tabPane.__render__();
		assert.strictEqual(vnode.children![0].children![0].text, 'foo');
		assert.property(vnode.children![0].children![0].properties!.classes!, css.activeTabButton);
	},

	'alignButtons should add correct classes'() {
		const tabPane = new TabPane();

		tabPane.setProperties(props({ alignButtons: Align.right, tabs: [{}] }));
		let vnode = <VNode> tabPane.__render__();
		assert.property(vnode.properties!.classes!, css.alignRight);

		tabPane.setProperties(props({ alignButtons: Align.bottom }));
		vnode = <VNode> tabPane.__render__();
		assert.property(vnode.properties!.classes!, css.alignBottom);

		tabPane.setProperties(props({ alignButtons: Align.left }));
		vnode = <VNode> tabPane.__render__();
		assert.property(vnode.properties!.classes!, css.alignLeft);
	},

	'Clicking tab should change activeIndex'() {
		const tabPane = new TabPane();
		let count = 0;
		tabPane.setProperties(props({
			onRequestTabChange: (index: number) => {
				count = count + index;
				tabPane.setProperties(props({ activeIndex: 3 }));
			}
		}));
		(<any> tabPane).onTabClick(3);
		(<any> tabPane).onTabClick(3);
		assert.strictEqual(count, 3);
	},

	'Closing a tab should change tabs'() {
		const tabPane = new TabPane();
		let newTabs;
		tabPane.setProperties(props({
			onRequestTabClose: (tabs: any[]) => newTabs = tabs,
			tabs: [{
				closeable: true
			}]
		}));
		(<any> tabPane).onCloseClick(0);
		assert.deepEqual(newTabs, []);
	},

	'Should get first tab'() {
		const tabPane = new TabPane();
		let tab;
		tabPane.setProperties(props({
			tabs: [{}, {}],
			onRequestTabChange: (index: number) => tab = index
		}));
		(<any> tabPane)._getFirstTab();
		assert.strictEqual(tab, 0);
	},

	'Should get last tab'() {
		const tabPane = new TabPane();
		let tab;
		tabPane.setProperties(props({
			onRequestTabChange: (index: number) => tab = index,
			tabs: ['a', 'b']
		}));
		(<any> tabPane)._getLastTab();
		assert.strictEqual(tab, 1);
	},

	'Should get next tab'() {
		const tabPane = new TabPane();
		let tab;
		tabPane.setProperties({
			onRequestTabChange: index => tab = index,
			tabs: [{ disabled: true }, { disabled: true }, {}],
			activeIndex: 2
		});
		(<any> tabPane)._getNextTab();
		assert.strictEqual(tab, 2);
	},

	'Should get previous tab'() {
		const tabPane = new TabPane();
		let tab;
		tabPane.setProperties({
			onRequestTabChange: index => tab = index,
			tabs: ['a', 'b'],
			activeIndex: 1
		});
		(<any> tabPane)._getPreviousTab();
		assert.strictEqual(tab, 0);
	},

	'Should default to first tab if invalid activeIndex passed'() {
		const tabPane = new TabPane();
		let tab;
		tabPane.setProperties({
			tabs: [{}, {}],
			onRequestTabChange: index => tab = index,
			activeIndex: 5
		});
		assert.strictEqual(tab, 0);
	},

	'Should skip tab if activeIndex is disabled'() {
		const tabPane = new TabPane();
		const tabs = [{ disabled: true }, {}];
		let tab;
		tabPane.setProperties(<any> {
			onRequestTabChange: () => {}
		});
		tabPane.setProperties({
			tabs: tabs,
			onRequestTabChange: index => tab = index,
			activeIndex: 0
		});
		tabPane.setProperties({
			activeIndex: 1,
			tabs: tabs
		});
		assert.strictEqual(tab, 1);
	}
});
