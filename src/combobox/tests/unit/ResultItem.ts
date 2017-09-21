import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { assign } from '@dojo/core/lang';
import harness, { Harness } from '@dojo/test-extras/harness';
import { HNode } from '@dojo/widget-core/interfaces';
import { v } from '@dojo/widget-core/d';
import ResultItem, { ResultItemProperties } from '../../ResultItem';
import * as css from '../../styles/comboBox.m.css';
import { findIndex } from '@dojo/test-extras/support/d';
import * as sinon from 'sinon';

let widget: Harness<ResultItemProperties, typeof ResultItem>;

type Classes = {
	[index: string]: boolean | null | undefined;
};

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

	beforeEach() {
		widget = harness(ResultItem);
	},

	afterEach() {
		widget.destroy();
	},

	render() {
		const stub = sinon.stub();
		const resultItemProperties: ResultItemProperties = {
			index: 10,
			result: 'bar',
			selected: false,
			getResultLabel() {
				return 'foo';
			},
			isDisabled() {
				return false;
			},
			onMouseDown: stub,
			onMouseEnter: stub,
			onMouseUp: stub
		};
		const expected = v('div', {
			'aria-disabled': 'false',
			'aria-selected': 'false',
			classes: widget.classes(css.option),
			'data-selected': 'false',
			role: 'option',
			onmousedown: widget.listener,
			onmouseenter: widget.listener,
			onmouseup: widget.listener
		}, [
			v('div', ['foo'])
		]);
		widget.setProperties(resultItemProperties);
		widget.expectRender(expected);
	},

	'label should render properly'() {
		widget.setProperties(props({ result: 'abc' }));
		const vnode = <HNode> widget.getRender();
		const actualText = findIndex(vnode, '0,0');
		assert.strictEqual(actualText, 'abc');
	},

	'selected result should render properly'() {
		widget.setProperties(props({ selected: true }));
		const vnode = <HNode> widget.getRender();
		assert.strictEqual(vnode.properties!['data-selected'], 'true');
	},

	'disabled result should render properly'() {
		widget.setProperties(props({
			isDisabled: () => true
		}));
		const vnode = <HNode> widget.getRender();
		const classes = <Classes> vnode.properties.classes;
		assert.isTrue(classes[css.disabledOption]);
	},

	'onMouseEnter should be called'() {
		const spy = sinon.spy();
		widget.setProperties(props({ onMouseEnter: spy }));
		widget.sendEvent('mouseenter');
		assert.isTrue(spy.calledOnce);
	},

	'onMouseDown should be called'() {
		const spy = sinon.spy();
		widget.setProperties(props({ onMouseDown: spy }));
		widget.sendEvent('mousedown');
		assert.isTrue(spy.calledOnce);
	},

	'onMouseUp should be called'() {
		const spy = sinon.spy();
		widget.setProperties(props({ onMouseUp: spy }));
		widget.sendEvent('mouseup');
		assert.isTrue(spy.calledOnce);
	}
});
