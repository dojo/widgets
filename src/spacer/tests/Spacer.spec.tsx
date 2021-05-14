const { it, describe } = intern.getInterface('bdd');

import { tsx } from '@dojo/framework/core/vdom';
import { renderer, assertion } from '@dojo/framework/testing/renderer';
import Spacer from '../Spacer';
import * as css from '../styles/spacer.m.css';

describe('Stacks - Spacer', () => {
	it('Default Render', () => {
		const r = renderer(() => <Spacer />);
		const expectedAssertion = assertion(() => <div classes={[css.root, css.normal]} />);
		r.expect(expectedAssertion);
	});

	it('Double size', () => {
		const r = renderer(() => <Spacer size="double" />);
		const expectedAssertion = assertion(() => <div classes={[css.root, css.double]} />);
		r.expect(expectedAssertion);
	});
});
