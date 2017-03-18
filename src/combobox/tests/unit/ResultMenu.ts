import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import ResultMenu from '../../ResultMenu';
import { assign } from '@dojo/core/lang';
import WidgetRegistry from '@dojo/widget-core/WidgetRegistry';
import ResultItem from '../../ResultItem';

const registry = new WidgetRegistry();
registry.define('result-item', ResultItem);

function props(props = {}) {
	return assign({
		results: ['a', 'b'],
		registry: registry,
		selectedIndex: 0,
		getResultLabel: () => '',
		onResultMouseEnter: () => true,
		onResultMouseDown: () => true,
		onResultMouseUp: () => true,
		skipResult: () => true
	}, props);
}

registerSuite({
	name: 'ResultMenu',

	'By default renderResults should return items'() {
		const resultMenu = new ResultMenu();
		resultMenu.setProperties(props());
		const items: any[] = ['a', 'b'];
		assert.deepEqual(resultMenu.renderResults(items), items);
	},

	'renderResults should be called'() {
		let called = false;
		const resultMenu = new ResultMenu();
		resultMenu.setProperties(props());
		resultMenu.renderResults = results => {
			called = true;
			return results;
		};
		<VNode> resultMenu.__render__();
		assert.isTrue(called);
	}
});
