const { describe, it, beforeEach } = intern.getInterface('bdd');
import testHarness from '@dojo/framework/testing/harness';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import { create, tsx } from '@dojo/framework/core/vdom';
import * as fixedCss from '../styles/two-column-layout.m.css';
import * as css from '../../theme/default/two-column-layout.m.css';
import * as baseCss from '../../common/styles/base.m.css';
import breakpointMiddleware from '@dojo/framework/core/middleware/breakpoint';

import TwoColumnLayout from '../index';
import { WNode } from '@dojo/framework/core/interfaces';

describe('TwoColumnLayout', () => {
	let breakpoint = 'LARGE';
	// TODO - Fix test context so resize mock works and remove this
	const factory = create();
	const mockBreakpoint = factory(() => {
		return {
			get() {
				return { breakpoint, contentRect: {} };
			}
		};
	});
	const harness = (renderFunc: () => WNode) =>
		testHarness(renderFunc, {
			middleware: [[breakpointMiddleware, () => mockBreakpoint()]] as any
		});
	const leading = <div>Leading</div>;
	const trailing = <div>Trailing</div>;
	const baseAssertion = assertionTemplate(() => (
		<div key="root" classes={[undefined, fixedCss.root, css.root]}>
			<div key="leading" classes={[false, fixedCss.even, false, false, css.column]}>
				{leading}
			</div>
			<div key="trailing" classes={[false, fixedCss.even, false, false, css.column]}>
				{trailing}
			</div>
		</div>
	));
	beforeEach(() => {
		breakpoint = 'LARGE';
	});

	it('renders', () => {
		const h = harness(() => (
			<TwoColumnLayout>
				{{
					leading,
					trailing
				}}
			</TwoColumnLayout>
		));

		h.expect(baseAssertion);
	});

	it('renders with leading bias', () => {
		const h = harness(() => (
			<TwoColumnLayout bias="leading">
				{{
					leading,
					trailing
				}}
			</TwoColumnLayout>
		));

		h.expect(
			baseAssertion
				.setProperty('@leading', 'classes', [
					fixedCss.biased,
					false,
					false,
					false,
					css.column
				])
				.setProperty('@trailing', 'classes', [false, false, false, css.small, css.column])
		);
	});

	it('renders with trailing bias', () => {
		const h = harness(() => (
			<TwoColumnLayout bias="trailing">
				{{
					leading,
					trailing
				}}
			</TwoColumnLayout>
		));

		h.expect(
			baseAssertion
				.setProperty('@leading', 'classes', [false, false, false, css.small, css.column])
				.setProperty('@trailing', 'classes', [
					fixedCss.biased,
					false,
					false,
					false,
					css.column
				])
		);
	});

	describe('collapsed', () => {
		beforeEach(() => {
			breakpoint = 'SMALL';
		});

		it('renders', () => {
			const h = harness(() => (
				<TwoColumnLayout>
					{{
						leading,
						trailing
					}}
				</TwoColumnLayout>
			));

			h.expect(
				baseAssertion
					.setProperty('@leading', 'classes', [false, false, false, false, css.column])
					.setProperty('@trailing', 'classes', [
						false,
						false,
						baseCss.visuallyHidden,
						false,
						css.column
					])
			);
		});

		it('renders with leading bias', () => {
			const h = harness(() => (
				<TwoColumnLayout bias="leading">
					{{
						leading,
						trailing
					}}
				</TwoColumnLayout>
			));

			h.expect(
				baseAssertion
					.setProperty('@leading', 'classes', [
						fixedCss.biased,
						false,
						false,
						false,
						css.column
					])
					.setProperty('@trailing', 'classes', [
						false,
						false,
						baseCss.visuallyHidden,
						false,
						css.column
					])
			);
		});

		it('renders with trailing bias', () => {
			const h = harness(() => (
				<TwoColumnLayout bias="trailing">
					{{
						leading,
						trailing
					}}
				</TwoColumnLayout>
			));

			h.expect(
				baseAssertion
					.setProperty('@leading', 'classes', [
						false,
						false,
						baseCss.visuallyHidden,
						false,
						css.column
					])
					.setProperty('@trailing', 'classes', [
						fixedCss.biased,
						false,
						false,
						false,
						css.column
					])
			);
		});
	});
});
