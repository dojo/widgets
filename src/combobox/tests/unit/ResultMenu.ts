import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import ResultMenu from '../../ResultMenu';
import { assign } from '@dojo/core/lang';

function props(props = {}) {
	return assign({
		results: ['a', 'b'],
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
		resultMenu.__setProperties__(props());
		const items: any[] = ['a', 'b'];
		assert.deepEqual(resultMenu.renderResults(items), items);
	},

	'renderResults should be called'() {
		let called = false;
		const resultMenu = new ResultMenu();
		resultMenu.__setProperties__(props());
		resultMenu.renderResults = results => {
			called = true;
			return results;
		};
		<VNode> resultMenu.__render__();
		assert.isTrue(called);
	}
});
