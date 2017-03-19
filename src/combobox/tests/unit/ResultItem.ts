import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import ResultItem from '../../ResultItem';
import * as css from '../../styles/comboBox.css';
import { assign } from '@dojo/core/lang';

function props(props = {}) {
	return assign({
		index: 0,
		result: 'foo',
		selected: false,
		onMouseEnter: () => true,
		onMouseDown: () => true,
		onMouseUp: () => true,
		isDisabled: () => true,
		getResultLabel: (result: any) => result
	}, props);
}

registerSuite({
	name: 'ResultItem',

	'label should render properly'() {
		const resultItem = new ResultItem();
		resultItem.setProperties(props({ result: 'abc' }));
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
		resultItem.setProperties(props({
			isDisabled: () => true
		}));
		const vnode = <VNode> resultItem.__render__();
		assert.isTrue(vnode.properties!.classes![css.disabledResult]);
	},

	'onMouseEnter should be called'() {
		let called = 0;
		const resultItem = new ResultItem();
		resultItem.setProperties(props({ onMouseEnter: () => called++ }));
		(<any> resultItem)._onMouseEnter();
		assert.strictEqual(called, 1);
	},

	'onMouseDown should be called'() {
		let called = 0;
		const resultItem = new ResultItem();
		resultItem.setProperties(props({ onMouseDown: () => called++ }));
		(<any> resultItem)._onMouseDown(<any> {});
		assert.strictEqual(called, 1);
	},

	'onMouseUp should be called'() {
		let called = 0;
		const resultItem = new ResultItem();
		resultItem.setProperties(props({ onMouseUp: () => called++ }));
		(<any> resultItem)._onMouseUp(<any> {});
		assert.strictEqual(called, 1);
	}
});
