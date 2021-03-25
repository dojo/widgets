const { it, describe } = intern.getInterface('bdd');

import { tsx } from '@dojo/framework/core/vdom';
import { renderer, assertion } from '@dojo/framework/testing/renderer';
import Spacer from '../Spacer';
import * as css from '../styles/spacer.m.css';

describe('Stacks - Spacer Rendering', () => {
	it('Default', () => {
		const r = renderer(() => <Spacer />);
		const expectedAssertion = assertion(() => (
			<div styles={{ flex: '1' }} classes={[css.root]} />
		));
		r.expect(expectedAssertion);
	});

	it('With Span', () => {
		const r = renderer(() => <Spacer span={2} />);
		const expectedAssertion = assertion(() => (
			<div styles={{ flex: '2' }} classes={[css.root]} />
		));
		r.expect(expectedAssertion);
	});
});
