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

		tabPane.__setChildren__([
			w(Tab, { label: 'foo', key: 'foo' }),
			w(Tab, { key: 'bar' })
		]);
		tabPane.__setProperties__({
			activeIndex: 0
		});

		const vnode = <VNode> tabPane.__render__();
		assert.strictEqual(vnode.children![0].children![0].text, 'foo');
		assert.property(vnode.children![0].children![0].properties!.classes!, css.activeTabButton);
	},

	'alignButtons should add correct classes'() {
		const tabPane = new TabPane();

		tabPane.__setProperties__(props({ alignButtons: Align.right }));
		let vnode = <VNode> tabPane.__render__();
		assert.property(vnode.properties!.classes!, css.alignRight);

		tabPane.__setProperties__(props({ alignButtons: Align.bottom }));
		vnode = <VNode> tabPane.__render__();
		assert.property(vnode.properties!.classes!, css.alignBottom);

		tabPane.__setProperties__(props({ alignButtons: Align.left }));
		vnode = <VNode> tabPane.__render__();
		assert.property(vnode.properties!.classes!, css.alignLeft);
	},

	'Clicking tab should change activeIndex'() {
		const tabPane = new TabPane();
		let called = 0;
		tabPane.__setChildren__([
			w(Tab, { label: 'foo', key: 'foo' }),
			w(Tab, { label: 'bar', key: 'bar' })
		]);
		tabPane.__setProperties__(props({
			onRequestTabChange: (index: number) => {
				called++;
				tabPane.__setProperties__(props({ activeIndex: index }));
			}
		}));
		(<any> tabPane).selectIndex(0);
		(<any> tabPane).selectIndex(1);
		assert.strictEqual(called, 1);
	},

	'Closing a tab should change tabs'() {
		const tabPane = new TabPane();
		let closedKey;
		tabPane.__setChildren__([
			w(Tab, { label: 'foo', key: 'foo', closeable: true })
		]);
		tabPane.__setProperties__(props({
			onRequestTabClose: (index: number, key: string) => closedKey = key
		}));
		(<any> tabPane).closeIndex(0);
		assert.strictEqual(closedKey, 'foo');
	},

	'Should get first tab'() {
		const tabPane = new TabPane();
		let tab;
		tabPane.__setChildren__([
			w(Tab, { label: 'foo', key: 'foo' }),
			w(Tab, { label: 'bar', key: 'bar' })
		]);
		tabPane.__setProperties__(props({
			activeIndex: 1,
			onRequestTabChange: (index: number) => tab = index
		}));
		(<any> tabPane).selectFirstIndex();
		assert.strictEqual(tab, 0);
	},

	'Should get last tab'() {
		const tabPane = new TabPane();
		let tab;
		tabPane.__setChildren__([
			w(Tab, { label: 'foo', key: 'foo' }),
			w(Tab, { label: 'bar', key: 'bar' })
		]);
		tabPane.__setProperties__(props({
			onRequestTabChange: (index: number) => tab = index
		}));
		(<any> tabPane).selectLastIndex();
		assert.strictEqual(tab, 1);
	},

	'Should get next tab'() {
		const tabPane = new TabPane();
		tabPane.__setChildren__([
			w(Tab, { label: 'foo', key: 'foo' }),
			w(Tab, { label: 'bar', key: 'bar', disabled: true }),
			w(Tab, { label: 'baz', key: 'baz' })
		]);
		function onRequestTabChange(index: number) {
			tabPane.__setProperties__({
				activeIndex: index,
				onRequestTabChange: onRequestTabChange
			});
		}
		tabPane.__setProperties__({
			onRequestTabChange: onRequestTabChange,
			activeIndex: 2
		});
		(<any> tabPane)._onRightArrowPress();
		assert.strictEqual(tabPane.properties.activeIndex, 0);
		(<any> tabPane)._onRightArrowPress();
		assert.strictEqual(tabPane.properties.activeIndex, 2);
	},

	'Should get previous tab'() {
		const tabPane = new TabPane();
		tabPane.__setChildren__([
			w(Tab, { label: 'foo', key: 'foo' }),
			w(Tab, { label: 'bar', key: 'bar', disabled: true }),
			w(Tab, { label: 'baz', key: 'baz' })
		]);
		function onRequestTabChange(index: number) {
			tabPane.__setProperties__({
				activeIndex: index,
				onRequestTabChange: onRequestTabChange
			});
		}
		tabPane.__setProperties__({
			onRequestTabChange: onRequestTabChange,
			activeIndex: 2
		});
		(<any> tabPane)._onLeftArrowPress();
		assert.strictEqual(tabPane.properties.activeIndex, 0);
		(<any> tabPane)._onLeftArrowPress();
		assert.strictEqual(tabPane.properties.activeIndex, 2);
	},

	'Up arrow should get previous tab'() {
		const tabPane = new TabPane();
		tabPane.__setChildren__([
			w(Tab, { label: 'foo', key: 'foo' }),
			w(Tab, { label: 'bar', key: 'bar' })
		]);
		function onRequestTabChange(index: number) {
			tabPane.__setProperties__({
				activeIndex: index,
				onRequestTabChange: onRequestTabChange
			});
		}
		(<any> tabPane)._onUpArrowPress();
		tabPane.__setProperties__({
			onRequestTabChange: onRequestTabChange,
			activeIndex: 0,
			alignButtons: Align.left
		});
		(<any> tabPane)._onUpArrowPress();
		assert.strictEqual(tabPane.properties.activeIndex, 1);
		tabPane.__setProperties__({
			onRequestTabChange: onRequestTabChange,
			activeIndex: 0,
			alignButtons: Align.right
		});
		(<any> tabPane)._onUpArrowPress();
		assert.strictEqual(tabPane.properties.activeIndex, 1);
	},

	'Down arrow should get next tab'() {
		const tabPane = new TabPane();
		tabPane.__setChildren__([
			w(Tab, { label: 'foo', key: 'foo' }),
			w(Tab, { label: 'bar', key: 'bar' })
		]);
		function onRequestTabChange(index: number) {
			tabPane.__setProperties__({
				activeIndex: index,
				onRequestTabChange: onRequestTabChange
			});
		}
		(<any> tabPane)._onDownArrowPress();
		tabPane.__setProperties__({
			onRequestTabChange: onRequestTabChange,
			activeIndex: 0,
			alignButtons: Align.left
		});
		(<any> tabPane)._onDownArrowPress();
		assert.strictEqual(tabPane.properties.activeIndex, 1);
		tabPane.__setProperties__({
			onRequestTabChange: onRequestTabChange,
			activeIndex: 0,
			alignButtons: Align.right
		});
		(<any> tabPane)._onDownArrowPress();
		assert.strictEqual(tabPane.properties.activeIndex, 1);
	},

	'Should default to last tab if invalid activeIndex passed'() {
		const tabPane = new TabPane();
		let tab;
		tabPane.__setChildren__([
			w(Tab, { label: 'foo', key: 'foo' }),
			w(Tab, { label: 'bar', key: 'bar' })
		]);
		tabPane.__setProperties__({
			onRequestTabChange: index => tab = index,
			activeIndex: 5
		});
		<VNode> tabPane.__render__();
		assert.strictEqual(tab, 1);
	},

	'Should skip tab if activeIndex is disabled'() {
		const tabPane = new TabPane();
		let tab;
		tabPane.__setChildren__([
			w(Tab, { label: 'foo', key: 'foo', disabled: true }),
			w(Tab, { label: 'bar', key: 'bar' })
		]);
		tabPane.__setProperties__({
			onRequestTabChange: index => tab = index,
			activeIndex: 0
		});
		<VNode> tabPane.__render__();
		assert.strictEqual(tab, 1);
	}
});
