import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as sinon from 'sinon';
import { VNode } from '@dojo/interfaces/vdom';
import ResultItem from '../../ResultItem';
import * as css from '../../styles/comboBox.m.css';
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
		resultItem.__setProperties__(props({ result: 'abc' }));
		const vnode = <VNode> resultItem.__render__();
		assert.strictEqual(vnode.children![0].text, 'abc');
	},

	'selected result should render properly'() {
		const resultItem = new ResultItem();
		resultItem.__setProperties__(props({ selected: true }));
		const vnode = <VNode> resultItem.__render__();
		assert.strictEqual(vnode.properties!['data-selected'], 'true');
	},

	'disabled result should render properly'() {
		const resultItem = new ResultItem();
		resultItem.__setProperties__(props({
			isDisabled: () => true
		}));
		const vnode = <VNode> resultItem.__render__();
		assert.isTrue(vnode.properties!.classes![css.disabledOption]);
	},

	'onMouseEnter should be called'() {
		const onMouseEnter = sinon.spy();
		const resultItem = new ResultItem();
		resultItem.__setProperties__(props({ onMouseEnter }));
		(<any> resultItem)._onMouseEnter();
		assert.isTrue(onMouseEnter.called);
	},

	'onMouseDown should be called'() {
		const onMouseDown = sinon.spy();
		const resultItem = new ResultItem();
		resultItem.__setProperties__(props({ onMouseDown }));
		(<any> resultItem)._onMouseDown(<any> {});
		assert.isTrue(onMouseDown.called);
	},

	'onMouseUp should be called'() {
		const onMouseUp = sinon.spy();
		const resultItem = new ResultItem();
		resultItem.__setProperties__(props({ onMouseUp }));
		(<any> resultItem)._onMouseUp(<any> {});
		assert.isTrue(onMouseUp.called);
	}
});
