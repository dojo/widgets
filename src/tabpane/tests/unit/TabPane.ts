import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import TabPane, { Align, TabPaneProperties } from '../../TabPane';
import TabButton from '../../TabButton';
import harness, { Harness } from '@dojo/test-extras/harness';
import { compareProperty } from '@dojo/test-extras/support/d';
import { HNode } from '@dojo/widget-core/interfaces';
import * as css from '../../styles/tabPane.m.css';
import { assign } from '@dojo/core/lang';
import { v, w } from '@dojo/widget-core/d';
import Tab from '../../Tab';

function props(props = {}) {
	return assign({
		activeIndex: 0
	}, props);
}

let tabPane: Harness<TabPaneProperties, typeof TabPane>;

const idComparator = compareProperty((value) => {
	return typeof value === 'string';
});

registerSuite({
	name: 'TabPane unit tests',
	beforeEach() {
		tabPane = harness(TabPane);
	},
	afterEach() {
		tabPane.destroy();
	},

	'default render'() {
		tabPane.setChildren([
			w(Tab, { label: 'foo', key: 'foo' }),
			w(Tab, { key: 'bar' })
		]);
		tabPane.setProperties({
			activeIndex: 0
		});
		const expected = v('div', {
			'aria-orientation': 'horizontal',
			classes: tabPane.classes(css.root),
			role: 'tablist'
		}, [
			v('div', {
				key: 'buttons',
				classes: tabPane.classes(css.tabButtons),
				afterCreate: tabPane.listener,
				afterUpdate: tabPane.listener
			}, [
				w(TabButton, {
					active: true,
					closeable: undefined,
					controls: <any> idComparator,
					disabled: undefined,
					id: <any> idComparator,
					index: 0,
					key: 'foo',
					onClick: tabPane.listener,
					onCloseClick: tabPane.listener,
					onEndPress: tabPane.listener,
					onHomePress: tabPane.listener,
					onDownArrowPress: tabPane.listener,
					onLeftArrowPress: tabPane.listener,
					onRightArrowPress: tabPane.listener,
					onUpArrowPress: tabPane.listener,
					// afterCreate: tabPane.listener,
					// afterUpdate: tabPane.listener,
					theme: {}
				}, [
					'foo'
				]),
				w(TabButton, {
					active: false,
					closeable: undefined,
					controls: <any> idComparator,
					disabled: undefined,
					id: <any> idComparator,
					index: 1,
					key: 'bar',
					onClick: tabPane.listener,
					onCloseClick: tabPane.listener,
					onEndPress: tabPane.listener,
					onHomePress: tabPane.listener,
					onDownArrowPress: tabPane.listener,
					onLeftArrowPress: tabPane.listener,
					onRightArrowPress: tabPane.listener,
					onUpArrowPress: tabPane.listener,
					theme: {}
				}, [
					null
				])
			]),
			v('div', {
				key: 'tabs',
				classes: tabPane.classes(css.tabs),
				afterCreate: tabPane.listener,
				afterUpdate: tabPane.listener
			}, [
				w(Tab, {
					key: 'foo',
					label: 'foo',
					id: <any> idComparator,
					labelledBy: <any> idComparator
				})
			])
		]);
		tabPane.expectRender(expected);
	},
	'alignButtons should add correct classes'() {
		tabPane.setProperties(props({ alignButtons: Align.right }));
		let vnode = <HNode> tabPane.getRender();
		assert.property(vnode.properties!.classes!, css.alignRight);

		tabPane.setProperties(props({ alignButtons: Align.bottom }));
		vnode = <HNode> tabPane.getRender();
		assert.property(vnode.properties!.classes!, css.alignBottom);

		tabPane.setProperties(props({ alignButtons: Align.left }));
		vnode = <HNode> tabPane.getRender();
		assert.property(vnode.properties!.classes!, css.alignLeft);
	},
	'Clicking tab should change activeIndex'() {
		let called = 0;
		tabPane.setChildren([
			w(Tab, { label: 'foo', key: 'foo' }),
			w(Tab, { label: 'bar', key: 'bar' })
		]);
		tabPane.setProperties(props({
			onRequestTabChange: (index: number) => {
				called++;
				tabPane.setProperties(props({ activeIndex: index }));
			}
		}));
		tabPane.callListener('onClick', { index: '0,0', args: [0] });
		tabPane.callListener('onClick', { index: '0,1', args: [1] });
		assert.strictEqual(called, 1);
	},
	'Closing a tab should change tabs'() {
		let closedKey;
		tabPane.setChildren([
			w(Tab, { label: 'foo', key: 'foo', closeable: true })
		]);
		tabPane.setProperties(props({
			onRequestTabClose: (index: number, key: string) => closedKey = key
		}));
		tabPane.callListener('onCloseClick', { index: '0,0', args: [0] });
		assert.strictEqual(closedKey, 'foo');
	},
	'Should get first tab'() {
		let tab;
		tabPane.setChildren([
			w(Tab, { label: 'foo', key: 'foo' }),
			w(Tab, { label: 'bar', key: 'bar' })
		]);
		tabPane.setProperties(props({
			activeIndex: 1,
			onRequestTabChange: (index: number) => tab = index
		}));
		tabPane.callListener('onHomePress', { index: '0,0' });
		assert.strictEqual(tab, 0);
	},
	'Should get last tab'() {
		let tab;
		tabPane.setChildren([
			w(Tab, { label: 'foo', key: 'foo' }),
			w(Tab, { label: 'bar', key: 'bar' })
		]);
		tabPane.setProperties(props({
			onRequestTabChange: (index: number) => tab = index
		}));
		tabPane.callListener('onEndPress', { index: '0,0' });
		assert.strictEqual(tab, 1);
	},
	'Should get next tab'() {
		let currentIndex = 2;
		tabPane.setChildren([
			w(Tab, { label: 'foo', key: 'foo' }),
			w(Tab, { label: 'bar', key: 'bar', disabled: true }),
			w(Tab, { label: 'baz', key: 'baz' })
		]);
		function onRequestTabChange(index: number) {
			currentIndex = index;
			tabPane.setProperties({
				activeIndex: index,
				onRequestTabChange: onRequestTabChange
			});
		}
		tabPane.setProperties({
			onRequestTabChange: onRequestTabChange,
			activeIndex: currentIndex
		});
		tabPane.callListener('onRightArrowPress', { index: '0,0' });
		assert.strictEqual(currentIndex, 0);
		tabPane.callListener('onRightArrowPress', { index: '0,0' });
		assert.strictEqual(currentIndex, 2);
	},
	'Should get previous tab'() {
		let currentIndex = 2;
		tabPane.setChildren([
			w(Tab, { label: 'foo', key: 'foo' }),
			w(Tab, { label: 'bar', key: 'bar', disabled: true }),
			w(Tab, { label: 'baz', key: 'baz' })
		]);
		function onRequestTabChange(index: number) {
			currentIndex = index;
			tabPane.setProperties({
				activeIndex: index,
				onRequestTabChange: onRequestTabChange
			});
		}
		tabPane.setProperties({
			onRequestTabChange: onRequestTabChange,
			activeIndex: currentIndex
		});
		tabPane.callListener('onLeftArrowPress', { index: '0,0' });
		assert.strictEqual(currentIndex, 0);
		tabPane.callListener('onLeftArrowPress', { index: '0,0' });
		assert.strictEqual(currentIndex, 2);
	},
	'Up arrow should get previous tab'() {
		let currentIndex;
		tabPane.setChildren([
			w(Tab, { label: 'foo', key: 'foo' }),
			w(Tab, { label: 'bar', key: 'bar' })
		]);
		function onRequestTabChange(index: number) {
			currentIndex = index;
			tabPane.setProperties({
				activeIndex: index,
				onRequestTabChange: onRequestTabChange
			});
		}
		tabPane.setProperties({
			onRequestTabChange: onRequestTabChange,
			activeIndex: 0,
			alignButtons: Align.left
		});
		tabPane.callListener('onUpArrowPress', { index: '0,0' });
		assert.strictEqual(currentIndex, 1);
		tabPane.setProperties({
			onRequestTabChange: onRequestTabChange,
			activeIndex: 0,
			alignButtons: Align.right
		});
		tabPane.callListener('onUpArrowPress', { index: '1,0' });
		assert.strictEqual(currentIndex, 1);
	},
	'Down arrow should get next tab'() {
		let currentIndex;
		tabPane.setChildren([
			w(Tab, { label: 'foo', key: 'foo' }),
			w(Tab, { label: 'bar', key: 'bar' })
		]);
		function onRequestTabChange(index: number) {
			currentIndex = index;
			tabPane.setProperties({
				activeIndex: index,
				onRequestTabChange: onRequestTabChange
			});
		}
		tabPane.setProperties({
			onRequestTabChange: onRequestTabChange,
			activeIndex: 0,
			alignButtons: Align.left
		});
		tabPane.callListener('onDownArrowPress', { index: '0,0' });
		assert.strictEqual(currentIndex, 1);
		tabPane.setProperties({
			onRequestTabChange: onRequestTabChange,
			activeIndex: 0,
			alignButtons: Align.right
		});
		tabPane.callListener('onDownArrowPress', { index: '1,0' });
		assert.strictEqual(currentIndex, 1);
	},
	'Should default to last tab if invalid activeIndex passed'() {
		let currentIndex, invalidIndex = 5;
		tabPane.setChildren([
			w(Tab, { label: 'foo', key: 'foo' }),
			w(Tab, { label: 'bar', key: 'bar' })
		]);
		tabPane.setProperties({
			onRequestTabChange: index => currentIndex = index,
			activeIndex: invalidIndex
		});
		tabPane.getRender(); // just to trigger a `_invalidate()`
		assert.strictEqual(currentIndex, 1);
	},
	'Should skip tab if activeIndex is disabled'() {
		let currentIndex, disabledIndex = 0;
		tabPane.setChildren([
			w(Tab, { label: 'foo', key: 'foo', disabled: true }),
			w(Tab, { label: 'bar', key: 'bar' })
		]);
		tabPane.setProperties({
			onRequestTabChange: index => currentIndex = index,
			activeIndex: disabledIndex
		});
		tabPane.getRender(); // just to trigger a `_invalidate()`
		assert.strictEqual(currentIndex, 1);
	}
});
