const { registerSuite } = intern.getInterface('object');

import harness from '@dojo/framework/testing/harness';
import { v, w } from '@dojo/framework/widget-core/d';

import Tab from '../../index';
import * as css from '../../../theme/tab-controller.m.css';

registerSuite('Tab', {

	tests: {
		'default properties'() {
			const h = harness(() => w(Tab, { key: 'foo' }));
			h.expect(() => v('div', {
					'aria-labelledby': undefined,
					classes: [ css.tab ],
					id: undefined,
					role: 'tabpanel'
			}, [
				v('div', { classes: [ css.hidden ] }, [])
			]));
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
				widgetId: 'foo',
				key: 'bar',
				label: 'baz',
				labelledBy: 'id'
			}, testChildren));

			h.expect(() => v('div', {
				'aria-labelledby': 'id',
				'aria-describedby': 'foo',
				classes: [ css.tab ],
				id: 'foo',
				role: 'tabpanel'
			}, [
				v('div', { classes: [ null ] }, testChildren)
			]));
		}
	}
});
