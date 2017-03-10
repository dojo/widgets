import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import ResultItem from '../../ResultItem';
import * as css from '../../styles/comboBox.css';
import { assign } from '@dojo/core/lang';

function props(props = {}) {
	return assign({
		index: 0,
		label: 'foo',
		result: 'foo',
		selected: false,
		onMouseEnter: () => true,
		onMouseDown: () => true,
		onMouseUp: () => true,
		skipResult: () => true
	}, props);
}

registerSuite({
	name: 'ResultItem',

	'By default, no items should be disabled'() {
		const resultItem = new ResultItem();
		assert.isFalse(resultItem.isDisabled());
	},

	'Disabled items should be skipped'() {
		let called = false;
		const resultItem = new ResultItem();
		(<any> resultItem).onPropertiesChanged(<any> { changedPropertyKeys: {} });
		resultItem.isDisabled = () => true;
		resultItem.setProperties(props({
			skipResult: () => called = true,
			selected: true
		}));
		assert.isTrue(called);
	},

	'label should render properly'() {
		const resultItem = new ResultItem();
		resultItem.setProperties(props({ label: 'abc' }));
		const vnode = <VNode> resultItem.__render__();
		assert.strictEqual(vnode.children![0].text, 'abc');
	},

	'selected result should render properly'() {
		const resultItem = new ResultItem();
		resultItem.setProperties(props({ selected: true }));
		const vnode = <VNode> resultItem.__render__();
		assert.strictEqual(vnode.properties!['data-selected'], 'true');
	},

	'disabled result should render properly'() {
		const resultItem = new ResultItem();
		resultItem.setProperties(props());
		resultItem.isDisabled = () => true;
		const vnode = <VNode> resultItem.__render__();
		assert.isTrue(vnode.properties!.classes![css.disabledResult]);
	},

	'onMouseEnter should be called'() {
		let called = 0;
		const resultItem = new ResultItem();
		resultItem.setProperties(props({ onMouseEnter: () => called++ }));
		(<any> resultItem)._onMouseEnter();
		resultItem.isDisabled = () => true;
		(<any> resultItem)._onMouseEnter();
		assert.strictEqual(called, 1);
	},

	'onMouseDown should be called'() {
		let called = 0;
		const resultItem = new ResultItem();
		resultItem.setProperties(props({ onMouseDown: () => called++ }));
		(<any> resultItem)._onMouseDown(<any> {});
		resultItem.isDisabled = () => true;
		(<any> resultItem)._onMouseDown(<any> {});
		assert.strictEqual(called, 1);
	},

	'onMouseUp should be called'() {
		let called = 0;
		const resultItem = new ResultItem();
		resultItem.setProperties(props({ onMouseUp: () => called++ }));
		(<any> resultItem)._onMouseUp(<any> {});
		resultItem.isDisabled = () => true;
		(<any> resultItem)._onMouseUp(<any> {});
		assert.strictEqual(called, 1);
	}
});
