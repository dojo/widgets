const { describe, it } = intern.getInterface('bdd');

import harness from '@dojo/framework/testing/harness';
import { v, w } from '@dojo/framework/core/vdom';

import * as css from '../../../theme/default/grid-footer.m.css';
import defaultBundle from '../../nls/Grid';
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

	it('should render with a custom message bundle', () => {
		const bundle = {
			messages: {
				...defaultBundle.messages,
				pageOfTotal: '{page} of {totalPages}. Row count: {totalRows}',
				pageOfUnknownTotal: 'Page {page} of Unknown'
			}
		};
		let h = harness(() =>
			w(Footer, {
				bundle,
				page: 1,
				pageSize: 100
			})
		);
		h.expect(() => v('div', { classes: css.root }, ['Page 1 of Unknown']));

		h = harness(() =>
			w(Footer, {
				bundle,
				total: 9998,
				page: 1,
				pageSize: 100
			})
		);
		h.expect(() => v('div', { classes: css.root }, ['1 of 100. Row count: 9998']));
	});
});
