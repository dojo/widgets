const { describe, it, beforeEach } = intern.getInterface('bdd');
import testRenderer, { assertion, wrap } from '@dojo/framework/testing/renderer';
import { create, tsx } from '@dojo/framework/core/vdom';
import * as fixedCss from '../styles/two-column-layout.m.css';
import * as css from '../../theme/default/two-column-layout.m.css';
import * as baseCss from '../../common/styles/base.m.css';
import breakpointMiddleware from '@dojo/framework/core/middleware/breakpoint';
import drag from '@dojo/framework/core/middleware/drag';
import resize from '@dojo/framework/core/middleware/resize';

import TwoColumnLayout from '../index';
import { WNode } from '@dojo/framework/core/interfaces';

describe('TwoColumnLayout', () => {
	let breakpoint = 'LARGE';
	let isDragging = false;
	let xDelta = 0;
	// TODO - Fix test context so resize mock works and remove this
	const factory = create();
	const mockBreakpoint = factory(() => {
		return {
			get() {
				return { breakpoint, contentRect: {} };
			}
		};
	});

	const dragFactory = create();
	const mockDrag = dragFactory(() => {
		return {
			get() {
				return { isDragging, delta: { x: xDelta } };
			}
		};
	});

	const resizeFactory = create();
	const mockResize = resizeFactory(() => {
		return {
			get() {
				return { width: 0 };
			}
		};
	});
	const render = (renderFunc: () => WNode) =>
		testRenderer(renderFunc, {
			middleware: [
				[breakpointMiddleware, () => mockBreakpoint()],
				[drag, () => mockDrag()],
				[resize, () => mockResize()]
			] as any
		});
	const leading = <div>Leading</div>;
	const trailing = <div>Trailing</div>;

	const WrappedRoot = wrap('div');
	const WrappedLeading = wrap('div');
	const WrappedTrailing = wrap('div');
	const baseAssertion = assertion(() => (
		<WrappedRoot key="root" classes={[undefined, fixedCss.root, css.root, false]}>
			<WrappedLeading
				key="leading"
				classes={[false, fixedCss.even, false, false, css.column]}
				styles={{}}
			>
				{leading}
			</WrappedLeading>
			<WrappedTrailing
				key="trailing"
				classes={[false, fixedCss.even, false, false, css.column]}
			>
				{trailing}
			</WrappedTrailing>
		</WrappedRoot>
	));
	beforeEach(() => {
		isDragging = false;
		xDelta = 0;
		breakpoint = 'LARGE';
	});

	it('renders', () => {
		const r = render(() => (
			<TwoColumnLayout>
				{{
					leading,
					trailing
				}}
			</TwoColumnLayout>
		));

		r.expect(baseAssertion);
	});

	it('renders with leading bias', () => {
		const r = render(() => (
			<TwoColumnLayout bias="leading">
				{{
					leading,
					trailing
				}}
			</TwoColumnLayout>
		));

		r.expect(
			baseAssertion
				.setProperty(WrappedLeading, 'classes', [
					fixedCss.biased,
					false,
					false,
					false,
					css.column
				])
				.setProperty(WrappedTrailing, 'classes', [
					false,
					false,
					false,
					css.small,
					css.column
				])
		);
	});

	it('renders with trailing bias', () => {
		const r = render(() => (
			<TwoColumnLayout bias="trailing">
				{{
					leading,
					trailing
				}}
			</TwoColumnLayout>
		));

		r.expect(
			baseAssertion
				.setProperty(WrappedLeading, 'classes', [
					false,
					false,
					false,
					css.small,
					css.column
				])
				.setProperty(WrappedTrailing, 'classes', [
					fixedCss.biased,
					false,
					false,
					false,
					css.column
				])
		);
	});

	it('renders with a divider when resize is true', () => {
		const r = render(() => (
			<TwoColumnLayout resize>
				{{
					leading,
					trailing
				}}
			</TwoColumnLayout>
		));

		r.expect(
			baseAssertion.insertAfter(WrappedLeading, () => [
				<div classes={css.divider} key="divider" />
			])
		);
	});

	it('adds a resize class and fixed width styles when divider is dragged', () => {
		isDragging = true;
		xDelta = 100;
		const r = render(() => (
			<TwoColumnLayout resize>
				{{
					leading,
					trailing
				}}
			</TwoColumnLayout>
		));

		r.expect(
			baseAssertion
				.insertAfter(WrappedLeading, () => [<div classes={css.divider} key="divider" />])
				.setProperty(WrappedLeading, 'styles', { flexBasis: '100px' })
				.setProperty(WrappedRoot, 'classes', [
					undefined,
					fixedCss.root,
					css.root,
					fixedCss.resize
				])
		);

		isDragging = true;
		xDelta = 200;

		r.expect(
			baseAssertion
				.insertAfter(WrappedLeading, () => [<div classes={css.divider} key="divider" />])
				.setProperty(WrappedLeading, 'styles', { flexBasis: '300px' })
				.setProperty(WrappedRoot, 'classes', [
					undefined,
					fixedCss.root,
					css.root,
					fixedCss.resize
				])
		);

		isDragging = false;

		r.expect(
			baseAssertion
				.insertAfter(WrappedLeading, () => [<div classes={css.divider} key="divider" />])
				.setProperty(WrappedLeading, 'styles', { flexBasis: '0px' })
				.setProperty(WrappedRoot, 'classes', [
					undefined,
					fixedCss.root,
					css.root,
					fixedCss.resize
				])
		);
	});

	describe('collapsed', () => {
		beforeEach(() => {
			breakpoint = 'SMALL';
		});

		it('renders', () => {
			const r = render(() => (
				<TwoColumnLayout>
					{{
						leading,
						trailing
					}}
				</TwoColumnLayout>
			));

			r.expect(
				baseAssertion
					.setProperty(WrappedLeading, 'classes', [
						false,
						false,
						false,
						false,
						css.column
					])
					.setProperty(WrappedTrailing, 'classes', [
						false,
						false,
						baseCss.visuallyHidden,
						false,
						css.column
					])
			);
		});

		it('does not render a divider when collapsed', () => {
			const r = render(() => (
				<TwoColumnLayout resize>
					{{
						leading,
						trailing
					}}
				</TwoColumnLayout>
			));

			r.expect(
				baseAssertion
					.setProperty(WrappedLeading, 'classes', [
						false,
						false,
						false,
						false,
						css.column
					])
					.setProperty(WrappedTrailing, 'classes', [
						false,
						false,
						baseCss.visuallyHidden,
						false,
						css.column
					])
			);
		});

		it('renders with leading bias', () => {
			const r = render(() => (
				<TwoColumnLayout bias="leading">
					{{
						leading,
						trailing
					}}
				</TwoColumnLayout>
			));

			r.expect(
				baseAssertion
					.setProperty(WrappedLeading, 'classes', [
						fixedCss.biased,
						false,
						false,
						false,
						css.column
					])
					.setProperty(WrappedTrailing, 'classes', [
						false,
						false,
						baseCss.visuallyHidden,
						false,
						css.column
					])
			);
		});

		it('renders with trailing bias', () => {
			const r = render(() => (
				<TwoColumnLayout bias="trailing">
					{{
						leading,
						trailing
					}}
				</TwoColumnLayout>
			));

			r.expect(
				baseAssertion
					.setProperty(WrappedLeading, 'classes', [
						false,
						false,
						baseCss.visuallyHidden,
						false,
						css.column
					])
					.setProperty(WrappedTrailing, 'classes', [
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
