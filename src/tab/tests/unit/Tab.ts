const { registerSuite } = intern.getInterface('object');

import harness from '@dojo/test-extras/harness';
import { v, w } from '@dojo/widget-core/d';

import Tab from '../../index';
import * as css from '../../../theme/tab-controller.m.css';

registerSuite('Tab', {

	tests: {
		'default properties'() {
			const h = harness(() => w(Tab, { key: 'foo' }));
			h.expect(() => v('div', {
				'aria-labelledby': undefined,
				classes: [ css.tab, css.hidden ],
				id: undefined,
				role: 'tabpanel'
			}, []));
		},

		'custom properties and children'() {
			const testChildren = [
				v('p', ['lorem ipsum']),
				v('a', { href: '#foo'}, [ 'foo' ])
			];
			const h = harness(() => w(Tab, {
				aria: { describedBy: 'foo' },
				closeable: true,
				disabled: true,
				show: true,
				rootId: 'foo',
				key: 'bar',
				label: 'baz',
				labelledBy: 'id'
			}, testChildren));

			h.expect(() => v('div', {
				'aria-labelledby': 'id',
				'aria-describedby': 'foo',
				classes: [ css.tab, null ],
				id: 'foo',
				role: 'tabpanel'
			}, testChildren));
		}
	}
});
