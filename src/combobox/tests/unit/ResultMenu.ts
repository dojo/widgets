import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import harness, { Harness } from '@dojo/test-extras/harness';
import { v, w } from '@dojo/widget-core/d';
import { WNode } from '@dojo/widget-core/interfaces';
import { VNode } from '@dojo/interfaces/vdom';
import WidgetRegistry from '@dojo/widget-core/WidgetRegistry';
import ResultItem  from '../../ResultItem';
import ResultMenu, { ResultMenuProperties } from '../../ResultMenu';
import { assign } from '@dojo/core/lang';
import * as css from '../../styles/comboBox.m.css';
import * as sinon from 'sinon';

const registry = new WidgetRegistry();
registry.define('result-item', ResultItem);

let widget: Harness<ResultMenuProperties, typeof ResultMenu>;

function props(props = {}): ResultMenuProperties {
	const stub = sinon.stub();
	return assign({
		results: ['a', 'b'],
		registry: registry,
		selectedIndex: 0,
		getResultLabel: () => '',
		onResultMouseEnter: stub,
		onResultMouseDown: stub,
		onResultMouseUp: stub,
		skipResult: stub
	}, props);
}

function createResultItem(
	index: number,
	result: string,
	selected: boolean,
	properties: ResultMenuProperties,
	isDisabled: (result: any) => boolean = widget.listener,
	theme: any = {}): WNode {
	return w<ResultItem>('result-item', {
		index,
		key: String(index),
		result,
		selected,
		getResultLabel: properties.getResultLabel,
		isDisabled,
		onMouseDown: properties.onResultMouseDown,
		onMouseEnter: properties.onResultMouseEnter,
		onMouseUp: properties.onResultMouseUp,
		theme
	});
}

registerSuite({
	name: 'ResultMenu',

	beforeEach() {
		widget = harness(ResultMenu);
	},

	afterEach() {
		widget.destroy();
	},

	render() {
		const resultMenuProperties = props();
		const expected = v('div', {
			classes: widget.classes(css.dropdown),
			id: undefined,
			role: 'listbox'
		}, [
			createResultItem(0, 'a', true, resultMenuProperties),
			createResultItem(1, 'b', false, resultMenuProperties)
		]);

		widget.setProperties(resultMenuProperties);
		widget.expectRender(expected);
	},

	'renderResults should be called'() {
		// this test can't be converted using `test-extras` because `renderResults` is not defined in the harnessed widget
		const resultMenu = new ResultMenu();
		const spy = sinon.spy(resultMenu, 'renderResults');
		resultMenu.__setProperties__(props());
		<VNode> resultMenu.__render__();
		assert.isTrue(spy.calledOnce);
	},

	'properties and attributes'() {
		const resultMenuProperties = props({
			id: 'foo',
			theme: 'bar',
			isResultDisabled: () => true
		});
		const expected = v('div', {
			classes: widget.classes(css.dropdown),
			id: resultMenuProperties.id,
			role: 'listbox'
		}, [
			createResultItem(0, 'a', true, resultMenuProperties, resultMenuProperties.isResultDisabled, resultMenuProperties.theme),
			createResultItem(1, 'b', false, resultMenuProperties, resultMenuProperties.isResultDisabled, resultMenuProperties.theme)
		]);
		widget.setProperties(resultMenuProperties);
		widget.expectRender(expected);
	}
});
