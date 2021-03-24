const { it, describe } = intern.getInterface('bdd');

import { tsx } from '@dojo/framework/core/vdom';
import { renderer, assertion } from '@dojo/framework/testing/renderer';
import VStack from '../VStack';
import * as fixedCss from '../styles/vstack.m.css';
import * as css from '../../theme/default/vstack.m.css';

describe('Stacks - VStack Rendering', () => {
	it('As Default', () => {
		const r = renderer(() => <VStack>VStack Child</VStack>);
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, false]}>
				<div key={0} classes={[undefined, fixedCss.child]}>
					VStack Child
				</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Extra Small Spacing', () => {
		const r = renderer(() => <VStack spacing="extra-small">VStack Child</VStack>);
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, false]}>
				<div key={0} classes={[css.extraSmall, fixedCss.child]}>
					VStack Child
				</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Small Spacing', () => {
		const r = renderer(() => <VStack spacing="small">VStack Child</VStack>);
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, false]}>
				<div key={0} classes={[css.small, fixedCss.child]}>
					VStack Child
				</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Medium Spacing', () => {
		const r = renderer(() => <VStack spacing="medium">VStack Child</VStack>);
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, false]}>
				<div key={0} classes={[css.medium, fixedCss.child]}>
					VStack Child
				</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Large Spacing', () => {
		const r = renderer(() => <VStack spacing="large">VStack Child</VStack>);
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, false]}>
				<div key={0} classes={[css.large, fixedCss.child]}>
					VStack Child
				</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Extra Large Spacing', () => {
		const r = renderer(() => <VStack spacing="extra-large">VStack Child</VStack>);
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, false]}>
				<div key={0} classes={[css.extraLarge, fixedCss.child]}>
					VStack Child
				</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Padding', () => {
		const r = renderer(() => <VStack padding>VStack Child</VStack>);
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, css.padding]}>
				<div key={0} classes={[undefined, fixedCss.child]}>
					VStack Child
				</div>
			</div>
		));
		r.expect(baseAssertion);
	});
});
