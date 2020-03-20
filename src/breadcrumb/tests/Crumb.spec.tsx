const { describe, it } = intern.getInterface('bdd');
import harness from '@dojo/framework/testing/harness';
import { tsx } from '@dojo/framework/core/vdom';

import * as css from '../../theme/default/crumb.m.css';
import Crumb from '../Crumb';

describe('Crumb', () => {
	it('renders a text label', () => {
		const h = harness(() => <Crumb item={{ label: 'Home' }} />);

		h.expect(() => (
			<span aria-current={undefined} classes={css.root}>
				Home
			</span>
		));
	});

	it('renders with a link', () => {
		const h = harness(() => (
			<Crumb
				item={{
					href: '/home',
					label: 'Home',
					title: 'Home page'
				}}
			/>
		));

		h.expect(() => (
			<a aria-current={undefined} classes={css.root} href="/home" title="Home page">
				Home
			</a>
		));
	});

	it('renders with an aria-current attributes', () => {
		const h = harness(() => <Crumb current="step" item={{ label: 'Home' }} />);

		h.expect(() => (
			<span aria-current="step" classes={css.root}>
				Home
			</span>
		));
	});
});
