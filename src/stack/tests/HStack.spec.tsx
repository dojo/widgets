const { it, describe } = intern.getInterface('bdd');

import { tsx } from '@dojo/framework/core/vdom';
import { renderer, assertion } from '@dojo/framework/testing/renderer';
import Stack from '../index';
import * as fixedCss from '../styles/stack.m.css';
import * as css from '../../theme/default/stack.m.css';
import Spacer from '../Spacer';

describe('Stacks - HStack Rendering', () => {
	it('As Default', () => {
		const r = renderer(() => <Stack direction="horizontal">HStack Child</Stack>);
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, undefined, undefined, false]}>
				<div classes={[undefined, fixedCss.child]}>HStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Small Spacing', () => {
		const r = renderer(() => (
			<Stack direction="horizontal" spacing="small">
				HStack Child
			</Stack>
		));
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, undefined, undefined, false]}>
				<div classes={[css.smallSpacing, fixedCss.child]}>HStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Medium Spacing', () => {
		const r = renderer(() => (
			<Stack direction="horizontal" spacing="medium">
				HStack Child
			</Stack>
		));
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, undefined, undefined, false]}>
				<div classes={[css.mediumSpacing, fixedCss.child]}>HStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Large Spacing', () => {
		const r = renderer(() => (
			<Stack direction="horizontal" spacing="large">
				HStack Child
			</Stack>
		));
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, undefined, undefined, false]}>
				<div classes={[css.largeSpacing, fixedCss.child]}>HStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Small Padding', () => {
		const r = renderer(() => (
			<Stack direction="horizontal" padding="small">
				HStack Child
			</Stack>
		));
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, undefined, css.smallPadding, false]}>
				<div classes={[null, fixedCss.child]}>HStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Medium Padding', () => {
		const r = renderer(() => (
			<Stack direction="horizontal" padding="medium">
				HStack Child
			</Stack>
		));
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, undefined, css.mediumPadding, false]}>
				<div classes={[null, fixedCss.child]}>HStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Large Padding', () => {
		const r = renderer(() => (
			<Stack direction="horizontal" padding="large">
				HStack Child
			</Stack>
		));
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, undefined, css.largePadding, false]}>
				<div classes={[null, fixedCss.child]}>HStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Start Alignment', () => {
		const r = renderer(() => (
			<Stack direction="horizontal" align="start">
				HStack Child
			</Stack>
		));
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, fixedCss.start, undefined, false]}>
				<div classes={[null, fixedCss.child]}>HStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Middle Alignment', () => {
		const r = renderer(() => (
			<Stack direction="horizontal" align="middle">
				HStack Child
			</Stack>
		));
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, fixedCss.middle, undefined, false]}>
				<div classes={[null, fixedCss.child]}>HStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With End Alignment', () => {
		const r = renderer(() => (
			<Stack direction="horizontal" align="end">
				HStack Child
			</Stack>
		));
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, fixedCss.end, undefined, false]}>
				<div classes={[null, fixedCss.child]}>HStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With Stretch', () => {
		const r = renderer(() => (
			<Stack direction="horizontal" stretch>
				HStack Child
			</Stack>
		));
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, undefined, undefined, fixedCss.stretch]}>
				<div classes={[null, fixedCss.child]}>HStack Child</div>
			</div>
		));
		r.expect(baseAssertion);
	});

	it('With a Spacer', () => {
		const r = renderer(() => (
			<Stack direction="horizontal" padding="large">
				<Spacer />
				HStack Child
				<Spacer />
			</Stack>
		));
		const baseAssertion = assertion(() => (
			<div classes={[null, fixedCss.root, undefined, css.largePadding, false]}>
				<Spacer />
				<div classes={[null, fixedCss.child]}>HStack Child</div>
				<Spacer />
			</div>
		));
		r.expect(baseAssertion);
	});
});
