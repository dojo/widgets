import { WNode } from '@dojo/framework/core/interfaces';

const { describe, it, beforeEach } = intern.getInterface('bdd');
import testHarness from '@dojo/framework/testing/harness/harness';
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import breakpointMiddleware from '@dojo/framework/core/middleware/breakpoint';
import { create, tsx } from '@dojo/framework/core/vdom';
import * as fixedCss from '../styles/three-column-layout.m.css';
import * as baseCss from '../../common/styles/base.m.css';
import * as css from '../../theme/default/three-column-layout.m.css';

import ThreeColumnLayout from '../index';

describe('ThreeColumnLayout', () => {
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

	beforeEach(() => {
		breakpoint = 'LARGE';
	});
	const leading = <div>Leading</div>;
	const center = <div>Center</div>;
	const trailing = <div>Trailing</div>;
	const baseAssertion = assertionTemplate(() => (
		<div key="root" classes={[undefined, fixedCss.root, css.root]}>
			<div key="leading" classes={[css.leading, false]}>
				{leading}
			</div>
			<div key="center" classes={[fixedCss.center, css.center]}>
				{center}
			</div>
			<div key="trailing" classes={[css.trailing, false]}>
				{trailing}
			</div>
		</div>
	));

	it('renders', () => {
		const h = harness(() => (
			<ThreeColumnLayout>
				{{
					leading,
					center,
					trailing
				}}
			</ThreeColumnLayout>
		));

		h.expect(baseAssertion);
	});

	it('renders at medium breakpoint', () => {
		breakpoint = 'MEDIUM';
		const h = harness(() => (
			<ThreeColumnLayout>
				{{
					leading,
					center,
					trailing
				}}
			</ThreeColumnLayout>
		));

		h.expect(
			baseAssertion.setProperty('@trailing', 'classes', [
				css.trailing,
				baseCss.visuallyHidden
			])
		);
	});

	it('renders at medium breakpoint with trailing bias', () => {
		breakpoint = 'MEDIUM';
		const h = harness(() => (
			<ThreeColumnLayout bias="trailing">
				{{
					leading,
					center,
					trailing
				}}
			</ThreeColumnLayout>
		));

		h.expect(
			baseAssertion.setProperty('@leading', 'classes', [css.leading, baseCss.visuallyHidden])
		);
	});

	it('renders at small breakpoint', () => {
		breakpoint = 'SMALL';
		const h = harness(() => (
			<ThreeColumnLayout>
				{{
					leading,
					center,
					trailing
				}}
			</ThreeColumnLayout>
		));

		h.expect(
			baseAssertion
				.setProperty('@leading', 'classes', [css.leading, baseCss.visuallyHidden])
				.setProperty('@trailing', 'classes', [css.trailing, baseCss.visuallyHidden])
		);
	});
});
