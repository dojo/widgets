import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import TabController, { Align } from '../../TabController';
import * as css from '../../styles/tabController.m.css';
import { assign } from '@dojo/core/lang';
import { w } from '@dojo/widget-core/d';
import Tab from '../../Tab';

function props(props = {}) {
	return assign({
		activeIndex: 0
	}, props);
}

registerSuite({
	name: 'TabController',

	'Active tab button should render'() {
		const tabController = new TabController();

		tabController.__setChildren__([
			w(Tab, { label: 'foo', key: 'foo' }),
			w(Tab, { key: 'bar' })
		]);
		tabController.__setProperties__({
			activeIndex: 0
		});

		const vnode = <VNode> tabController.__render__();
		assert.strictEqual(vnode.children![0].children![0].text, 'foo');
		assert.property(vnode.children![0].children![0].properties!.classes!, css.activeTabButton);
	},

	'alignButtons should add correct classes'() {
		const tabController = new TabController();

		tabController.__setProperties__(props({ alignButtons: Align.right }));
		let vnode = <VNode> tabController.__render__();
		assert.property(vnode.properties!.classes!, css.alignRight);

		tabController.__setProperties__(props({ alignButtons: Align.bottom }));
		vnode = <VNode> tabController.__render__();
		assert.property(vnode.properties!.classes!, css.alignBottom);

		tabController.__setProperties__(props({ alignButtons: Align.left }));
		vnode = <VNode> tabController.__render__();
		assert.property(vnode.properties!.classes!, css.alignLeft);
	},

	'Clicking tab should change activeIndex'() {
		const tabController = new TabController();
		let called = 0;
		tabController.__setChildren__([
			w(Tab, { label: 'foo', key: 'foo' }),
			w(Tab, { label: 'bar', key: 'bar' })
		]);
		tabController.__setProperties__(props({
			onRequestTabChange: (index: number) => {
				called++;
				tabController.__setProperties__(props({ activeIndex: index }));
			}
		}));
		(<any> tabController).selectIndex(0);
		(<any> tabController).selectIndex(1);
		assert.strictEqual(called, 1);
	},

	'Closing a tab should change tabs'() {
		const tabController = new TabController();
		let closedKey;
		tabController.__setChildren__([
			w(Tab, { label: 'foo', key: 'foo', closeable: true })
		]);
		tabController.__setProperties__(props({
			onRequestTabClose: (index: number, key: string) => closedKey = key
		}));
		(<any> tabController).closeIndex(0);
		assert.strictEqual(closedKey, 'foo');
	},

	'Should get first tab'() {
		const tabController = new TabController();
		let tab;
		tabController.__setChildren__([
			w(Tab, { label: 'foo', key: 'foo' }),
			w(Tab, { label: 'bar', key: 'bar' })
		]);
		tabController.__setProperties__(props({
			activeIndex: 1,
			onRequestTabChange: (index: number) => tab = index
		}));
		(<any> tabController).selectFirstIndex();
		assert.strictEqual(tab, 0);
	},

	'Should get last tab'() {
		const tabController = new TabController();
		let tab;
		tabController.__setChildren__([
			w(Tab, { label: 'foo', key: 'foo' }),
			w(Tab, { label: 'bar', key: 'bar' })
		]);
		tabController.__setProperties__(props({
			onRequestTabChange: (index: number) => tab = index
		}));
		(<any> tabController).selectLastIndex();
		assert.strictEqual(tab, 1);
	},

	'Should get next tab'() {
		const tabController = new TabController();
		tabController.__setChildren__([
			w(Tab, { label: 'foo', key: 'foo' }),
			w(Tab, { label: 'bar', key: 'bar', disabled: true }),
			w(Tab, { label: 'baz', key: 'baz' })
		]);
		function onRequestTabChange(index: number) {
			tabController.__setProperties__({
				activeIndex: index,
				onRequestTabChange: onRequestTabChange
			});
		}
		tabController.__setProperties__({
			onRequestTabChange: onRequestTabChange,
			activeIndex: 2
		});
		(<any> tabController)._onRightArrowPress();
		assert.strictEqual(tabController.properties.activeIndex, 0);
		(<any> tabController)._onRightArrowPress();
		assert.strictEqual(tabController.properties.activeIndex, 2);
	},

	'Should get previous tab'() {
		const tabController = new TabController();
		tabController.__setChildren__([
			w(Tab, { label: 'foo', key: 'foo' }),
			w(Tab, { label: 'bar', key: 'bar', disabled: true }),
			w(Tab, { label: 'baz', key: 'baz' })
		]);
		function onRequestTabChange(index: number) {
			tabController.__setProperties__({
				activeIndex: index,
				onRequestTabChange: onRequestTabChange
			});
		}
		tabController.__setProperties__({
			onRequestTabChange: onRequestTabChange,
			activeIndex: 2
		});
		(<any> tabController)._onLeftArrowPress();
		assert.strictEqual(tabController.properties.activeIndex, 0);
		(<any> tabController)._onLeftArrowPress();
		assert.strictEqual(tabController.properties.activeIndex, 2);
	},

	'Up arrow should get previous tab'() {
		const tabController = new TabController();
		tabController.__setChildren__([
			w(Tab, { label: 'foo', key: 'foo' }),
			w(Tab, { label: 'bar', key: 'bar' })
		]);
		function onRequestTabChange(index: number) {
			tabController.__setProperties__({
				activeIndex: index,
				onRequestTabChange: onRequestTabChange
			});
		}
		(<any> tabController)._onUpArrowPress();
		tabController.__setProperties__({
			onRequestTabChange: onRequestTabChange,
			activeIndex: 0,
			alignButtons: Align.left
		});
		(<any> tabController)._onUpArrowPress();
		assert.strictEqual(tabController.properties.activeIndex, 1);
		tabController.__setProperties__({
			onRequestTabChange: onRequestTabChange,
			activeIndex: 0,
			alignButtons: Align.right
		});
		(<any> tabController)._onUpArrowPress();
		assert.strictEqual(tabController.properties.activeIndex, 1);
	},

	'Down arrow should get next tab'() {
		const tabController = new TabController();
		tabController.__setChildren__([
			w(Tab, { label: 'foo', key: 'foo' }),
			w(Tab, { label: 'bar', key: 'bar' })
		]);
		function onRequestTabChange(index: number) {
			tabController.__setProperties__({
				activeIndex: index,
				onRequestTabChange: onRequestTabChange
			});
		}
		(<any> tabController)._onDownArrowPress();
		tabController.__setProperties__({
			onRequestTabChange: onRequestTabChange,
			activeIndex: 0,
			alignButtons: Align.left
		});
		(<any> tabController)._onDownArrowPress();
		assert.strictEqual(tabController.properties.activeIndex, 1);
		tabController.__setProperties__({
			onRequestTabChange: onRequestTabChange,
			activeIndex: 0,
			alignButtons: Align.right
		});
		(<any> tabController)._onDownArrowPress();
		assert.strictEqual(tabController.properties.activeIndex, 1);
	},

	'Should default to last tab if invalid activeIndex passed'() {
		const tabController = new TabController();
		let tab;
		tabController.__setChildren__([
			w(Tab, { label: 'foo', key: 'foo' }),
			w(Tab, { label: 'bar', key: 'bar' })
		]);
		tabController.__setProperties__({
			onRequestTabChange: index => tab = index,
			activeIndex: 5
		});
		<VNode> tabController.__render__();
		assert.strictEqual(tab, 1);
	},

	'Should skip tab if activeIndex is disabled'() {
		const tabController = new TabController();
		let tab;
		tabController.__setChildren__([
			w(Tab, { label: 'foo', key: 'foo', disabled: true }),
			w(Tab, { label: 'bar', key: 'bar' })
		]);
		tabController.__setProperties__({
			onRequestTabChange: index => tab = index,
			activeIndex: 0
		});
		<VNode> tabController.__render__();
		assert.strictEqual(tab, 1);
	}
});
