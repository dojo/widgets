const { describe, it } = intern.getInterface('bdd');

import harness from '@dojo/framework/testing/harness/harness';
import { v, w } from '@dojo/framework/core/vdom';

import * as css from '../../../theme/default/grid-footer.m.css';
import Footer from '../../Footer';

describe('Footer', () => {
	it('should render footer without total', () => {
		const h = harness(() =>
			w(Footer, {
				page: 1,
				pageSize: 100
			})
		);
		h.expect(() => v('div', { classes: css.root }, ['Page 1 of ?']));
	});

	it('should render footer with total', () => {
		const h = harness(() =>
			w(Footer, {
				total: 9998,
				page: 1,
				pageSize: 100
			})
		);
		h.expect(() => v('div', { classes: css.root }, ['Page 1 of 100. Total rows 9998']));
	});
});
