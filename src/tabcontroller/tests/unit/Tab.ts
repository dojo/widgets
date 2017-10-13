const { registerSuite } = intern.getInterface('object');

import harness, { Harness } from '@dojo/test-extras/harness';
import { v } from '@dojo/widget-core/d';

import Tab, { TabProperties } from '../../Tab';
import * as css from '../../styles/tabController.m.css';

let widget: Harness<TabProperties, typeof Tab>;

registerSuite('Tab', {

	beforeEach() {
		widget = harness(Tab);
	},

	afterEach() {
		widget.destroy();
	},

	tests: {
		'default properties'() {
			widget.setProperties({ key: 'foo' });
			widget.expectRender(v('div', {
				'aria-labelledby': undefined,
				classes: widget.classes(css.tab),
				id: undefined,
				role: 'tabpanel'
			}, []));
		},

		'custom properties and children'() {
			const testChildren = [
				v('p', ['lorem ipsum']),
				v('a', { href: '#foo'}, [ 'foo' ])
			];
			widget.setProperties({
				closeable: true,
				disabled: true,
				id: 'foo',
				key: 'bar',
				label: 'baz',
				labelledBy: 'id'
			});
			widget.setChildren(testChildren);

			widget.expectRender(v('div', {
				'aria-labelledby': 'id',
				classes: widget.classes(css.tab),
				id: 'foo',
				role: 'tabpanel'
			}, testChildren));
		}
	}
});
