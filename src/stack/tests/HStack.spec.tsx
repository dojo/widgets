const { it, describe } = intern.getInterface('bdd');

import { tsx } from '@dojo/framework/core/vdom';
import { renderer, assertion } from '@dojo/framework/testing/renderer';
import HStack from '../HStack';
import * as fixedCss from '../styles/hstack.m.css';
import * as css from '../../theme/default/hstack.m.css';
import Spacer from '../Spacer';

describe('Stacks - HStack Rendering', () => {
	it('As Default', () => {
		const r = renderer(() => <HStack>HStack Child</HStack>);
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, fixedCss.middle, undefined, false]}>
				<div classes={[undefined, fixedCss.child]}>HStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Small Spacing', () => {
		const r = renderer(() => <HStack spacing="small">HStack Child</HStack>);
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, fixedCss.middle, undefined, false]}>
				<div classes={[css.smallSpacing, fixedCss.child]}>HStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Medium Spacing', () => {
		const r = renderer(() => <HStack spacing="medium">HStack Child</HStack>);
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, fixedCss.middle, undefined, false]}>
				<div classes={[css.mediumSpacing, fixedCss.child]}>HStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Large Spacing', () => {
		const r = renderer(() => <HStack spacing="large">HStack Child</HStack>);
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, fixedCss.middle, undefined, false]}>
				<div classes={[css.largeSpacing, fixedCss.child]}>HStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Small Padding', () => {
		const r = renderer(() => <HStack padding="small">HStack Child</HStack>);
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, fixedCss.middle, css.smallPadding, false]}>
				<div classes={[null, fixedCss.child]}>HStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Medium Padding', () => {
		const r = renderer(() => <HStack padding="medium">HStack Child</HStack>);
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, fixedCss.middle, css.mediumPadding, false]}>
				<div classes={[null, fixedCss.child]}>HStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Large Padding', () => {
		const r = renderer(() => <HStack padding="large">HStack Child</HStack>);
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, fixedCss.middle, css.largePadding, false]}>
				<div classes={[null, fixedCss.child]}>HStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Start Alignment', () => {
		const r = renderer(() => <HStack align="start">HStack Child</HStack>);
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, fixedCss.top, undefined, false]}>
				<div classes={[null, fixedCss.child]}>HStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With End Alignment', () => {
		const r = renderer(() => <HStack align="end">HStack Child</HStack>);
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, fixedCss.bottom, undefined, false]}>
				<div classes={[null, fixedCss.child]}>HStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Stretch', () => {
		const r = renderer(() => <HStack stretch>HStack Child</HStack>);
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, fixedCss.middle, undefined, fixedCss.stretch]}>
				<div classes={[null, fixedCss.child]}>HStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With a Spacer', () => {
		const r = renderer(() => (
			<HStack padding="large">
				<Spacer />
				HStack Child
				<Spacer />
			</HStack>
		));
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, fixedCss.middle, css.largePadding, false]}>
				<Spacer />
				<div classes={[null, fixedCss.child]}>HStack Child</div>
				<Spacer />
			</div>
		));
		r.expect(baseAssertion);
	});
});
