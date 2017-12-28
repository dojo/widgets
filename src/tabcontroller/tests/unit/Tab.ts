const { registerSuite } = intern.getInterface('object');

import harness, { Harness } from '@dojo/test-extras/harness';
import { v } from '@dojo/widget-core/d';

import Tab from '../../Tab';
import * as css from '../../../theme/tabcontroller/tabController.m.css';

let widget: Harness<Tab>;

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
				classes: css.tab,
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
				aria: { describedBy: 'foo' },
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
				'aria-describedby': 'foo',
				classes: css.tab,
				id: 'foo',
				role: 'tabpanel'
			}, testChildren));
		}
	}
});
