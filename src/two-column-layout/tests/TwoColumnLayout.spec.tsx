import createBreakpointMock from '@dojo/framework/testing/mocks/middleware/breakpoint';

const { describe, it, beforeEach } = intern.getInterface('bdd');
import testHarness from '@dojo/framework/testing/harness';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import { tsx } from '@dojo/framework/core/vdom';
import * as fixedCss from '../styles/two-column-layout.m.css';
import * as css from '../../theme/default/two-column-layout.m.css';
import * as baseCss from '../../common/styles/base.m.css';

import TwoColumnLayout from '../index';
import { WNode } from '@dojo/framework/core/interfaces';
import breakpoint from '@dojo/framework/core/middleware/breakpoint';

describe('TwoColumnLayout', () => {
	const mockBreakpoint = createBreakpointMock();
	const harness = (renderFunc: () => WNode) =>
		testHarness(renderFunc, {
			middleware: [[breakpoint, mockBreakpoint]]
		});
	const leading = <div>Leading</div>;
	const trailing = <div>Trailing</div>;
	const baseAssertion = assertionTemplate(() => (
		<div key="root" classes={[fixedCss.root, css.root]}>
			<div key="leading" classes={[undefined, fixedCss.even, undefined, css.column]}>
				{leading}
			</div>
			<div key="trailing" classes={[undefined, fixedCss.even, undefined, css.column]}>
				{trailing}
			</div>
		</div>
	));
	beforeEach(() => {
		mockBreakpoint('root', { breakpoint: 'LARGE', contentRect: {} });
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
				.setProperty('@leading', 'classes', [fixedCss.biased, undefined, undefined])
				.setProperty('@trailing', 'classes', [undefined, undefined, undefined])
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
				.setProperty('@leading', 'classes', [undefined, undefined, undefined])
				.setProperty('@trailing', 'classes', [fixedCss.biased, undefined, undefined])
		);
	});

	describe('collapsed', () => {
		beforeEach(() => {
			mockBreakpoint('root', { breakpoint: 'SMALL', contentRect: {} });
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
					.setProperty('@leading', 'classes', [fixedCss.biased, undefined, undefined])
					.setProperty('@trailing', 'classes', [undefined, undefined, undefined])
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
					.setProperty('@leading', 'classes', [undefined, undefined, undefined])
					.setProperty('@trailing', 'classes', [fixedCss.biased, undefined, undefined])
			);
		});
	});
});
