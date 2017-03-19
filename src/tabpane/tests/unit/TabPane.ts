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
	}
});
