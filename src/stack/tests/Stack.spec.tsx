const { it, describe } = intern.getInterface('bdd');

import { tsx } from '@dojo/framework/core/vdom';
import { renderer, assertion } from '@dojo/framework/testing/renderer';
import Spacer from '../Spacer';
import Stack from '../Stack';
import VStack from '../VStack';
import HStack from '../HStack';

describe('Stacks - Stack Rendering', () => {
	describe('Vertical', () => {
		it('As Default', () => {
			const r = renderer(() => <Stack direction="vertical">VStack Child</Stack>);
			const baseAssertion = assertion(() => <VStack>VStack Child</VStack>);
			r.expect(baseAssertion);
		});

		it('With Small Spacing', () => {
			const r = renderer(() => (
				<Stack direction="vertical" spacing="small">
					VStack Child
				</Stack>
			));
			const baseAssertion = assertion(() => <VStack spacing="small">VStack Child</VStack>);
			r.expect(baseAssertion);
		});

		it('With Medium Spacing', () => {
			const r = renderer(() => (
				<Stack direction="vertical" spacing="medium">
					VStack Child
				</Stack>
			));
			const baseAssertion = assertion(() => <VStack spacing="medium">VStack Child</VStack>);
			r.expect(baseAssertion);
		});

		it('With Large Spacing', () => {
			const r = renderer(() => (
				<Stack direction="vertical" spacing="large">
					VStack Child
				</Stack>
			));
			const baseAssertion = assertion(() => <VStack spacing="large">VStack Child</VStack>);
			r.expect(baseAssertion);
		});

		it('With Small Padding', () => {
			const r = renderer(() => (
				<Stack direction="vertical" padding="small">
					VStack Child
				</Stack>
			));
			const baseAssertion = assertion(() => <VStack padding="small">VStack Child</VStack>);
			r.expect(baseAssertion);
		});

		it('With Medium Padding', () => {
			const r = renderer(() => (
				<Stack direction="vertical" padding="medium">
					VStack Child
				</Stack>
			));
			const baseAssertion = assertion(() => <VStack padding="medium">VStack Child</VStack>);
			r.expect(baseAssertion);
		});

		it('With Large Padding', () => {
			const r = renderer(() => (
				<Stack direction="vertical" padding="large">
					VStack Child
				</Stack>
			));
			const baseAssertion = assertion(() => <VStack padding="large">VStack Child</VStack>);
			r.expect(baseAssertion);
		});

		it('With Start Alignment', () => {
			const r = renderer(() => (
				<Stack direction="vertical" align="start">
					VStack Child
				</Stack>
			));
			const baseAssertion = assertion(() => <VStack align="start">VStack Child</VStack>);
			r.expect(baseAssertion);
		});

		it('With End Alignment', () => {
			const r = renderer(() => (
				<Stack direction="vertical" align="end">
					VStack Child
				</Stack>
			));
			const baseAssertion = assertion(() => <VStack align="end">VStack Child</VStack>);
			r.expect(baseAssertion);
		});

		it('With Stretch', () => {
			const r = renderer(() => (
				<Stack direction="vertical" stretch>
					VStack Child
				</Stack>
			));
			const baseAssertion = assertion(() => <VStack stretch>VStack Child</VStack>);
			r.expect(baseAssertion);
		});

		it('With a Spacer', () => {
			const r = renderer(() => (
				<Stack direction="vertical">
					<Spacer />
					VStack Child
					<Spacer />
				</Stack>
			));
			const baseAssertion = assertion(() => (
				<VStack>
					<Spacer />
					VStack Child
					<Spacer />
				</VStack>
			));
			r.expect(baseAssertion);
		});
	});

	describe('Horizontal', () => {
		it('As Default', () => {
			const r = renderer(() => <Stack direction="horizontal">HStack Child</Stack>);
			const baseAssertion = assertion(() => <HStack>HStack Child</HStack>);
			r.expect(baseAssertion);
		});

		it('With Small Spacing', () => {
			const r = renderer(() => (
				<Stack direction="horizontal" spacing="small">
					HStack Child
				</Stack>
			));
			const baseAssertion = assertion(() => <HStack spacing="small">HStack Child</HStack>);
			r.expect(baseAssertion);
		});

		it('With Medium Spacing', () => {
			const r = renderer(() => (
				<Stack direction="horizontal" spacing="medium">
					HStack Child
				</Stack>
			));
			const baseAssertion = assertion(() => <HStack spacing="medium">HStack Child</HStack>);
			r.expect(baseAssertion);
		});

		it('With Large Spacing', () => {
			const r = renderer(() => (
				<Stack direction="horizontal" spacing="large">
					HStack Child
				</Stack>
			));
			const baseAssertion = assertion(() => <HStack spacing="large">HStack Child</HStack>);
			r.expect(baseAssertion);
		});

		it('With Small Padding', () => {
			const r = renderer(() => (
				<Stack direction="horizontal" padding="small">
					HStack Child
				</Stack>
			));
			const baseAssertion = assertion(() => <HStack padding="small">HStack Child</HStack>);
			r.expect(baseAssertion);
		});

		it('With Medium Padding', () => {
			const r = renderer(() => (
				<Stack direction="horizontal" padding="medium">
					HStack Child
				</Stack>
			));
			const baseAssertion = assertion(() => <HStack padding="medium">HStack Child</HStack>);
			r.expect(baseAssertion);
		});

		it('With Large Padding', () => {
			const r = renderer(() => (
				<Stack direction="horizontal" padding="large">
					HStack Child
				</Stack>
			));
			const baseAssertion = assertion(() => <HStack padding="large">HStack Child</HStack>);
			r.expect(baseAssertion);
		});

		it('With Start Alignment', () => {
			const r = renderer(() => (
				<Stack direction="horizontal" align="start">
					HStack Child
				</Stack>
			));
			const baseAssertion = assertion(() => <HStack align="start">HStack Child</HStack>);
			r.expect(baseAssertion);
		});

		it('With End Alignment', () => {
			const r = renderer(() => (
				<Stack direction="horizontal" align="end">
					HStack Child
				</Stack>
			));
			const baseAssertion = assertion(() => <HStack align="end">HStack Child</HStack>);
			r.expect(baseAssertion);
		});

		it('With Stretch', () => {
			const r = renderer(() => (
				<Stack direction="horizontal" stretch>
					HStack Child
				</Stack>
			));
			const baseAssertion = assertion(() => <HStack stretch>HStack Child</HStack>);
			r.expect(baseAssertion);
		});

		it('With a Spacer', () => {
			const r = renderer(() => (
				<Stack direction="horizontal">
					<Spacer />
					HStack Child
					<Spacer />
				</Stack>
			));
			const baseAssertion = assertion(() => (
				<HStack>
					<Spacer />
					HStack Child
					<Spacer />
				</HStack>
			));
			r.expect(baseAssertion);
		});
	});
});
