import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import TabPane, { Align } from '../../TabPane';
import * as css from '../../styles/tabPane.m.css';
import { assign } from '@dojo/core/lang';
import { w } from '@dojo/widget-core/d';
import Tab from '../../Tab';

function props(props = {}) {
	return assign({
		activeIndex: 0
	}, props);
}

registerSuite({
	name: 'TabPane',

	'Active tab button should render'() {
		const tabPane = new TabPane();

		tabPane.setChildren([
			w(Tab, { label: 'foo', key: 'foo' }),
			w(Tab, { key: 'bar' })
		]);
		tabPane.setProperties({
			activeIndex: 0
		});

		const vnode = <VNode> tabPane.__render__();
		assert.strictEqual(vnode.children![0].children![0].text, 'foo');
		assert.property(vnode.children![0].children![0].properties!.classes!, css.activeTabButton);
	},

	'alignButtons should add correct classes'() {
		const tabPane = new TabPane();

		tabPane.setProperties(props({ alignButtons: Align.right }));
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
		let called = 0;
		tabPane.setChildren([
			w(Tab, { label: 'foo', key: 'foo' }),
			w(Tab, { label: 'bar', key: 'bar' })
		]);
		tabPane.setProperties(props({
			onTabChange: (index: number) => {
				called++;
				tabPane.setProperties(props({ activeIndex: index }));
			}
		}));
		(<any> tabPane).selectIndex(0);
		(<any> tabPane).selectIndex(1);
		assert.strictEqual(called, 1);
	},

	'Closing a tab should change tabs'() {
		const tabPane = new TabPane();
		let closedKey;
		tabPane.setChildren([
			w(Tab, { label: 'foo', key: 'foo', closeable: true })
		]);
		tabPane.setProperties(props({
			onTabClose: (index: number, key: string) => closedKey = key
		}));
		(<any> tabPane).closeIndex(0);
		assert.strictEqual(closedKey, 'foo');
	},

	'Should get first tab'() {
		const tabPane = new TabPane();
		let tab;
		tabPane.setChildren([
			w(Tab, { label: 'foo', key: 'foo' }),
			w(Tab, { label: 'bar', key: 'bar' })
		]);
		tabPane.setProperties(props({
			activeIndex: 1,
			onTabChange: (index: number) => tab = index
		}));
		(<any> tabPane).selectFirstIndex();
		assert.strictEqual(tab, 0);
	},

	'Should get last tab'() {
		const tabPane = new TabPane();
		let tab;
		tabPane.setChildren([
			w(Tab, { label: 'foo', key: 'foo' }),
			w(Tab, { label: 'bar', key: 'bar' })
		]);
		tabPane.setProperties(props({
			onTabChange: (index: number) => tab = index
		}));
		(<any> tabPane).selectLastIndex();
		assert.strictEqual(tab, 1);
	},

	'Should get next tab'() {
		const tabPane = new TabPane();
		tabPane.setChildren([
			w(Tab, { label: 'foo', key: 'foo' }),
			w(Tab, { label: 'bar', key: 'bar', disabled: true }),
			w(Tab, { label: 'baz', key: 'baz' })
		]);
		function onTabChange(index: number) {
			tabPane.setProperties({
				activeIndex: index,
				onTabChange: onTabChange
			});
		}
		tabPane.setProperties({
			onTabChange: onTabChange,
			activeIndex: 2
		});
		(<any> tabPane)._onRightArrowPress();
		assert.strictEqual(tabPane.properties.activeIndex, 0);
		(<any> tabPane)._onRightArrowPress();
		assert.strictEqual(tabPane.properties.activeIndex, 2);
	},

	'Should get previous tab'() {
		const tabPane = new TabPane();
		tabPane.setChildren([
			w(Tab, { label: 'foo', key: 'foo' }),
			w(Tab, { label: 'bar', key: 'bar', disabled: true }),
			w(Tab, { label: 'baz', key: 'baz' })
		]);
		function onTabChange(index: number) {
			tabPane.setProperties({
				activeIndex: index,
				onTabChange: onTabChange
			});
		}
		tabPane.setProperties({
			onTabChange: onTabChange,
			activeIndex: 2
		});
		(<any> tabPane)._onLeftArrowPress();
		assert.strictEqual(tabPane.properties.activeIndex, 0);
		(<any> tabPane)._onLeftArrowPress();
		assert.strictEqual(tabPane.properties.activeIndex, 2);
	},

	'Up arrow should get previous tab'() {
		const tabPane = new TabPane();
		tabPane.setChildren([
			w(Tab, { label: 'foo', key: 'foo' }),
			w(Tab, { label: 'bar', key: 'bar' })
		]);
		function onTabChange(index: number) {
			tabPane.setProperties({
				activeIndex: index,
				onTabChange: onTabChange
			});
		}
		(<any> tabPane)._onUpArrowPress();
		tabPane.setProperties({
			onTabChange: onTabChange,
			activeIndex: 0,
			alignButtons: Align.left
		});
		(<any> tabPane)._onUpArrowPress();
		assert.strictEqual(tabPane.properties.activeIndex, 1);
		tabPane.setProperties({
			onTabChange: onTabChange,
			activeIndex: 0,
			alignButtons: Align.right
		});
		(<any> tabPane)._onUpArrowPress();
		assert.strictEqual(tabPane.properties.activeIndex, 1);
	},

	'Down arrow should get next tab'() {
		const tabPane = new TabPane();
		tabPane.setChildren([
			w(Tab, { label: 'foo', key: 'foo' }),
			w(Tab, { label: 'bar', key: 'bar' })
		]);
		function onTabChange(index: number) {
			tabPane.setProperties({
				activeIndex: index,
				onTabChange: onTabChange
			});
		}
		(<any> tabPane)._onDownArrowPress();
		tabPane.setProperties({
			onTabChange: onTabChange,
			activeIndex: 0,
			alignButtons: Align.left
		});
		(<any> tabPane)._onDownArrowPress();
		assert.strictEqual(tabPane.properties.activeIndex, 1);
		tabPane.setProperties({
			onTabChange: onTabChange,
			activeIndex: 0,
			alignButtons: Align.right
		});
		(<any> tabPane)._onDownArrowPress();
		assert.strictEqual(tabPane.properties.activeIndex, 1);
	},

	'Should default to last tab if invalid activeIndex passed'() {
		const tabPane = new TabPane();
		let tab;
		tabPane.setChildren([
			w(Tab, { label: 'foo', key: 'foo' }),
			w(Tab, { label: 'bar', key: 'bar' })
		]);
		tabPane.setProperties({
			onTabChange: index => tab = index,
			activeIndex: 5
		});
		<VNode> tabPane.__render__();
		assert.strictEqual(tab, 1);
	},

	'Should skip tab if activeIndex is disabled'() {
		const tabPane = new TabPane();
		let tab;
		tabPane.setChildren([
			w(Tab, { label: 'foo', key: 'foo', disabled: true }),
			w(Tab, { label: 'bar', key: 'bar' })
		]);
		tabPane.setProperties({
			onTabChange: index => tab = index,
			activeIndex: 0
		});
		<VNode> tabPane.__render__();
		assert.strictEqual(tab, 1);
	}
});
