const { it, describe } = intern.getInterface('bdd');

import { tsx } from '@dojo/framework/core/vdom';
import { renderer, assertion } from '@dojo/framework/testing/renderer';
import HStack from '../HStack';
import * as fixedCss from '../styles/hstack.m.css';

const baseAssertion = assertion(() => (
	<div classes={[null, fixedCss.root, fixedCss.middle, false]}>
		<div key={0} classes={[undefined, fixedCss.child]}>
			HStack Child
		</div>
	</div>
));

describe('Stacks - HStack', () => {
	it('Default Render', () => {
		const r = renderer(() => <HStack>HStack Child</HStack>);
		r.expect(baseAssertion);
	});
});
