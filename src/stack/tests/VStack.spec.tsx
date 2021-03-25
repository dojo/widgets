const { it, describe } = intern.getInterface('bdd');

import { tsx } from '@dojo/framework/core/vdom';
import { renderer, assertion } from '@dojo/framework/testing/renderer';
import Stack from '../index';
import * as fixedCss from '../styles/stack.m.css';
import * as css from '../../theme/default/stack.m.css';
import Spacer from '../Spacer';

describe('Stacks - VStack Rendering', () => {
	it('As Default', () => {
		const r = renderer(() => <Stack direction="vertical">VStack Child</Stack>);
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, undefined, false]}>
				<div classes={[null, null, fixedCss.child]}>VStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Small Spacing', () => {
		const r = renderer(() => (
			<Stack direction="vertical" spacing="small">
				VStack Child
			</Stack>
		));
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, undefined, false]}>
				<div classes={[css.smallSpacing, null, fixedCss.child]}>VStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Medium Spacing', () => {
		const r = renderer(() => (
			<Stack direction="vertical" spacing="medium">
				VStack Child
			</Stack>
		));
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, undefined, false]}>
				<div classes={[css.mediumSpacing, null, fixedCss.child]}>VStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Large Spacing', () => {
		const r = renderer(() => (
			<Stack direction="vertical" spacing="large">
				VStack Child
			</Stack>
		));
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, undefined, false]}>
				<div classes={[css.largeSpacing, null, fixedCss.child]}>VStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Small Padding', () => {
		const r = renderer(() => (
			<Stack direction="vertical" padding="small">
				VStack Child
			</Stack>
		));
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, css.smallPadding, false]}>
				<div classes={[null, null, fixedCss.child]}>VStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Medium Padding', () => {
		const r = renderer(() => (
			<Stack direction="vertical" padding="medium">
				VStack Child
			</Stack>
		));
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, css.mediumPadding, false]}>
				<div classes={[null, null, fixedCss.child]}>VStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Large Padding', () => {
		const r = renderer(() => (
			<Stack direction="vertical" padding="large">
				VStack Child
			</Stack>
		));
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, css.largePadding, false]}>
				<div classes={[null, null, fixedCss.child]}>VStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Start Alignment', () => {
		const r = renderer(() => (
			<Stack direction="vertical" align="start">
				VStack Child
			</Stack>
		));
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, undefined, false]}>
				<div classes={[null, fixedCss.start, fixedCss.child]}>VStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Middle Alignment', () => {
		const r = renderer(() => (
			<Stack direction="vertical" align="middle">
				VStack Child
			</Stack>
		));
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, undefined, false]}>
				<div classes={[null, fixedCss.middle, fixedCss.child]}>VStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With End Alignment', () => {
		const r = renderer(() => (
			<Stack direction="vertical" align="end">
				VStack Child
			</Stack>
		));
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, undefined, false]}>
				<div classes={[null, fixedCss.end, fixedCss.child]}>VStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Stretch', () => {
		const r = renderer(() => (
			<Stack direction="vertical" stretch>
				VStack Child
			</Stack>
		));
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, undefined, fixedCss.stretch]}>
				<div classes={[null, null, fixedCss.child]}>VStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With a Spacer', () => {
		const r = renderer(() => (
			<Stack direction="vertical" padding="large">
				<Spacer />
				VStack Child
				<Spacer />
			</Stack>
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
