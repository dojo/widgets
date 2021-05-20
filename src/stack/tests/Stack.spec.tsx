const { it, describe } = intern.getInterface('bdd');

import { tsx } from '@dojo/framework/core/vdom';
import { renderer, assertion, wrap } from '@dojo/framework/testing/renderer';
import Stack from '../index';
import * as fixedCss from '../styles/stack.m.css';
import * as css from '../../theme/default/stack.m.css';
import Spacer from '../Spacer';

describe('Stack', () => {
	describe('HStack Rendering', () => {
		it('As Default', () => {
			const r = renderer(() => <Stack direction="horizontal">HStack Child</Stack>);
			const baseAssertion = assertion(() => (
				<div
					classes={[
						null,
						css.horizontal,
						fixedCss.horizontal,
						fixedCss.root,
						undefined,
						undefined,
						false
					]}
				>
					<div classes={[undefined, false, fixedCss.child]}>HStack Child</div>
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
				<div
					classes={[
						null,
						css.horizontal,
						fixedCss.horizontal,
						fixedCss.root,
						undefined,
						undefined,
						false
					]}
				>
					<div classes={[css.smallSpacing, false, fixedCss.child]}>HStack Child</div>
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
				<div
					classes={[
						null,
						css.horizontal,
						fixedCss.horizontal,
						fixedCss.root,
						undefined,
						undefined,
						false
					]}
				>
					<div classes={[css.mediumSpacing, false, fixedCss.child]}>HStack Child</div>
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
				<div
					classes={[
						null,
						css.horizontal,
						fixedCss.horizontal,
						fixedCss.root,
						undefined,
						undefined,
						false
					]}
				>
					<div classes={[css.largeSpacing, false, fixedCss.child]}>HStack Child</div>
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
				<div
					classes={[
						null,
						css.horizontal,
						fixedCss.horizontal,
						fixedCss.root,
						undefined,
						css.smallPadding,
						false
					]}
				>
					<div classes={[null, false, fixedCss.child]}>HStack Child</div>
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
				<div
					classes={[
						null,
						css.horizontal,
						fixedCss.horizontal,
						fixedCss.root,
						undefined,
						css.mediumPadding,
						false
					]}
				>
					<div classes={[null, false, fixedCss.child]}>HStack Child</div>
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
				<div
					classes={[
						null,
						css.horizontal,
						fixedCss.horizontal,
						fixedCss.root,
						undefined,
						css.largePadding,
						false
					]}
				>
					<div classes={[null, false, fixedCss.child]}>HStack Child</div>
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
				<div
					classes={[
						null,
						css.horizontal,
						fixedCss.horizontal,
						fixedCss.root,
						fixedCss.start,
						undefined,
						false
					]}
				>
					<div classes={[null, false, fixedCss.child]}>HStack Child</div>
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
				<div
					classes={[
						null,
						css.horizontal,
						fixedCss.horizontal,
						fixedCss.root,
						fixedCss.middle,
						undefined,
						false
					]}
				>
					<div classes={[null, false, fixedCss.child]}>HStack Child</div>
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
				<div
					classes={[
						null,
						css.horizontal,
						fixedCss.horizontal,
						fixedCss.root,
						fixedCss.end,
						undefined,
						false
					]}
				>
					<div classes={[null, false, fixedCss.child]}>HStack Child</div>
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
				<div
					classes={[
						null,
						css.horizontal,
						fixedCss.horizontal,
						fixedCss.root,
						undefined,
						undefined,
						fixedCss.stretch
					]}
				>
					<div classes={[null, false, fixedCss.child]}>HStack Child</div>
				</div>
			));
			r.expect(baseAssertion);
		});

		it('With a Spacer', () => {
			const WrappedSpacerTop = wrap(Spacer);
			const WrappedSpacerBottom = wrap(Spacer);
			const WrappedSpacerTopDiv = wrap('div');
			const WrappedSpacerBottomDiv = wrap('div');

			const r = renderer(() => (
				<Stack direction="horizontal" padding="large">
					<Spacer />
					HStack Child
					<Spacer spanCallback={() => {}} />
				</Stack>
			));
			const baseAssertion = assertion(() => (
				<div
					classes={[
						null,
						css.horizontal,
						fixedCss.horizontal,
						fixedCss.root,
						undefined,
						css.largePadding,
						false
					]}
				>
					<WrappedSpacerTopDiv classes={[null, false, fixedCss.child]}>
						<WrappedSpacerTop spanCallback={() => {}} />
					</WrappedSpacerTopDiv>
					<div classes={[null, false, fixedCss.child]}>HStack Child</div>
					<WrappedSpacerBottomDiv classes={[null, false, fixedCss.child]}>
						<WrappedSpacerBottom spanCallback={() => {}} />
					</WrappedSpacerBottomDiv>
				</div>
			));
			r.expect(baseAssertion);
			r.property(WrappedSpacerTop, 'spanCallback', 1);
			r.property(WrappedSpacerBottom, 'spanCallback', 2);
			r.expect(
				baseAssertion
					.setProperties(WrappedSpacerTopDiv, {
						styles: { flex: '1' },
						classes: [fixedCss.spacer]
					})
					.setProperties(WrappedSpacerBottomDiv, {
						styles: { flex: '2' },
						classes: [fixedCss.spacer]
					})
			);
		});
	});

	describe('VStack Rendering', () => {
		it('As Default', () => {
			const r = renderer(() => <Stack direction="vertical">VStack Child</Stack>);
			const baseAssertion = assertion(() => (
				<div
					classes={[
						null,
						css.vertical,
						fixedCss.vertical,
						fixedCss.root,
						false,
						undefined,
						false
					]}
				>
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
				<div
					classes={[
						null,
						css.vertical,
						fixedCss.vertical,
						fixedCss.root,
						false,
						undefined,
						false
					]}
				>
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
				<div
					classes={[
						null,
						css.vertical,
						fixedCss.vertical,
						fixedCss.root,
						false,
						undefined,
						false
					]}
				>
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
				<div
					classes={[
						null,
						css.vertical,
						fixedCss.vertical,
						fixedCss.root,
						false,
						undefined,
						false
					]}
				>
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
				<div
					classes={[
						null,
						css.vertical,
						fixedCss.vertical,
						fixedCss.root,
						false,
						css.smallPadding,
						false
					]}
				>
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
				<div
					classes={[
						null,
						css.vertical,
						fixedCss.vertical,
						fixedCss.root,
						false,
						css.mediumPadding,
						false
					]}
				>
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
				<div
					classes={[
						null,
						css.vertical,
						fixedCss.vertical,
						fixedCss.root,
						false,
						css.largePadding,
						false
					]}
				>
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
				<div
					classes={[
						null,
						css.vertical,
						fixedCss.vertical,
						fixedCss.root,
						false,
						undefined,
						false
					]}
				>
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
				<div
					classes={[
						null,
						css.vertical,
						fixedCss.vertical,
						fixedCss.root,
						false,
						undefined,
						false
					]}
				>
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
				<div
					classes={[
						null,
						css.vertical,
						fixedCss.vertical,
						fixedCss.root,
						false,
						undefined,
						false
					]}
				>
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
				<div
					classes={[
						null,
						css.vertical,
						fixedCss.vertical,
						fixedCss.root,
						false,
						undefined,
						fixedCss.stretch
					]}
				>
					<div classes={[null, null, fixedCss.child]}>VStack Child</div>
				</div>
			));
			r.expect(baseAssertion);
		});

		it('With a Spacer', () => {
			const WrappedSpacerTop = wrap(Spacer);
			const WrappedSpacerBottom = wrap(Spacer);
			const WrappedSpacerTopDiv = wrap('div');
			const WrappedSpacerBottomDiv = wrap('div');

			const r = renderer(() => (
				<Stack direction="vertical" padding="large">
					<Spacer />
					VStack Child
					<Spacer spanCallback={() => {}} />
				</Stack>
			));
			const baseAssertion = assertion(() => (
				<div
					classes={[
						null,
						css.vertical,
						fixedCss.vertical,
						fixedCss.root,
						false,
						css.largePadding,
						false
					]}
				>
					<WrappedSpacerTopDiv classes={[null, null, fixedCss.child]}>
						<WrappedSpacerTop spanCallback={() => {}} />
					</WrappedSpacerTopDiv>
					<div classes={[null, null, fixedCss.child]}>VStack Child</div>
					<WrappedSpacerBottomDiv classes={[null, null, fixedCss.child]}>
						<WrappedSpacerBottom spanCallback={() => {}} />
					</WrappedSpacerBottomDiv>
				</div>
			));
			r.expect(baseAssertion);
			r.property(WrappedSpacerTop, 'spanCallback', 1);
			r.property(WrappedSpacerBottom, 'spanCallback', 2);
			r.expect(
				baseAssertion
					.setProperties(WrappedSpacerTopDiv, {
						styles: { flex: '1' },
						classes: [fixedCss.spacer]
					})
					.setProperties(WrappedSpacerBottomDiv, {
						styles: { flex: '2' },
						classes: [fixedCss.spacer]
					})
			);
		});
	});
});
