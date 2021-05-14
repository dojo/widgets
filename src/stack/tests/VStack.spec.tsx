const { it, describe } = intern.getInterface('bdd');

import { tsx } from '@dojo/framework/core/vdom';
import { renderer, assertion } from '@dojo/framework/testing/renderer';
import VStack from '../VStack';
import * as fixedCss from '../styles/vstack.m.css';
import * as css from '../../theme/default/vstack.m.css';
import Spacer from '../Spacer';

describe('Stacks - VStack Rendering', () => {
	it('As Default', () => {
		const r = renderer(() => <VStack>VStack Child</VStack>);
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, undefined, false]}>
				<div classes={[null, null, fixedCss.child]}>VStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Small Spacing', () => {
		const r = renderer(() => <VStack spacing="small">VStack Child</VStack>);
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, undefined, false]}>
				<div classes={[css.smallSpacing, null, fixedCss.child]}>VStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Medium Spacing', () => {
		const r = renderer(() => <VStack spacing="medium">VStack Child</VStack>);
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, undefined, false]}>
				<div classes={[css.mediumSpacing, null, fixedCss.child]}>VStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Large Spacing', () => {
		const r = renderer(() => <VStack spacing="large">VStack Child</VStack>);
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, undefined, false]}>
				<div classes={[css.largeSpacing, null, fixedCss.child]}>VStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Small Padding', () => {
		const r = renderer(() => <VStack padding="small">VStack Child</VStack>);
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, css.smallPadding, false]}>
				<div classes={[null, null, fixedCss.child]}>VStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Medium Padding', () => {
		const r = renderer(() => <VStack padding="medium">VStack Child</VStack>);
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, css.mediumPadding, false]}>
				<div classes={[null, null, fixedCss.child]}>VStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Large Padding', () => {
		const r = renderer(() => <VStack padding="large">VStack Child</VStack>);
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, css.largePadding, false]}>
				<div classes={[null, null, fixedCss.child]}>VStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Start Alignment', () => {
		const r = renderer(() => <VStack align="start">VStack Child</VStack>);
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, undefined, false]}>
				<div classes={[null, fixedCss.left, fixedCss.child]}>VStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Middle Alignment', () => {
		const r = renderer(() => <VStack align="middle">VStack Child</VStack>);
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, undefined, false]}>
				<div classes={[null, fixedCss.center, fixedCss.child]}>VStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With End Alignment', () => {
		const r = renderer(() => <VStack align="end">VStack Child</VStack>);
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, undefined, false]}>
				<div classes={[null, fixedCss.right, fixedCss.child]}>VStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Stretch', () => {
		const r = renderer(() => <VStack stretch>VStack Child</VStack>);
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, undefined, fixedCss.stretch]}>
				<div classes={[null, null, fixedCss.child]}>VStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With a Spacer', () => {
		const r = renderer(() => (
			<VStack padding="large">
				<Spacer />
				VStack Child
				<Spacer />
			</VStack>
		));
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, css.largePadding, false]}>
				<Spacer />
				<div classes={[null, null, fixedCss.child]}>VStack Child</div>
				<Spacer />
			</div>
		));
		r.expect(baseAssertion);
	});
});
