import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import TabPane, { Align } from '../../TabPane';
import * as css from '../../styles/tabPane.css';

registerSuite({
	name: 'TabPane',

	'Active tab button should render'() {
		const tabPane = new TabPane();
		<VNode> tabPane.__render__();
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

	'Loading tab button should render as active'() {
		const tabPane = new TabPane();
		<VNode> tabPane.__render__();
		tabPane.setProperties({
			loadingIndex: 0,
			tabs: [{
				content: ''
			}]
		});

		const vnode = <VNode> tabPane.__render__();
		assert.property(vnode.children![0].children![0].properties!.classes!, css.activeTabButton);
	},

	'alignButtons should add correct classes'() {
		const tabPane = new TabPane();

		tabPane.setProperties({ alignButtons: Align.right });
		let vnode = <VNode> tabPane.__render__();
		assert.property(vnode.properties!.classes!, css.alignRight);

		tabPane.setProperties({ alignButtons: Align.bottom });
		vnode = <VNode> tabPane.__render__();
		assert.property(vnode.properties!.classes!, css.alignBottom);

		tabPane.setProperties({ alignButtons: Align.left });
		vnode = <VNode> tabPane.__render__();
		assert.property(vnode.properties!.classes!, css.alignLeft);
	},

	'Clicking tab should change activeIndex'() {
		const tabPane = new TabPane();
		let activeIndex;
		tabPane.setProperties({
			onRequestTabChange: index => activeIndex = index
		});
		(<any> tabPane).onTabClick(3);
		assert.strictEqual(activeIndex, 3);
	},

	'Closing a tab should change tabs'() {
		const tabPane = new TabPane();
		let newTabs;
		(<any> tabPane).onCloseClick(0);
		tabPane.setProperties({
			onRequestTabClose: tabs => newTabs = tabs,
			tabs: [{
				closeable: true
			}]
		});
		(<any> tabPane).onCloseClick(0);
		assert.deepEqual(newTabs, []);
	},

	'Should get first tab'() {
		const tabPane = new TabPane();
		let tab;
		tabPane.setProperties({ tabs: [{}, {}] });
		tabPane.setProperties({
			onRequestTabChange: index => tab = index,
			activeIndex: 3
		});
		(<any> tabPane)._getFirstTab();
		assert.strictEqual(tab, 0);
	},

	'Should get last tab'() {
		const tabPane = new TabPane();
		let tab;
		(<any> tabPane)._getLastTab();
		tabPane.setProperties({
			onRequestTabChange: index => tab = index,
			tabs: ['a', 'b'],
			activeIndex: 0
		});
		(<any> tabPane)._getLastTab();
		assert.strictEqual(tab, 1);
	},

	'Should get next tab'() {
		const tabPane = new TabPane();
		let tab;
		(<any> tabPane)._getNextTab();
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
		let tab;
		tabPane.setProperties({
			tabs: [{ disabled: true }, {}],
			onRequestTabChange: index => tab = index,
			activeIndex: 0
		});
		assert.strictEqual(tab, 1);
	}
});
