import { create, tsx } from '@dojo/framework/core/vdom';
const { it, describe } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import testHarness from '@dojo/framework/testing/harness/harness';
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';

import Wizard, { Step } from '../../index';
import * as css from '../../../theme/default/wizard.m.css';
import Avatar from '../../../avatar';
import { compareTheme, noop } from '../../../common/tests/support/test-helpers';
import Icon from '../../../icon';
import { WNode } from '@dojo/framework/core/interfaces';
import dimensions from '@dojo/framework/core/middleware/dimensions';

describe('Wizard', () => {
	const factory = create();
	let width = 10000;
	const mockDimensions = factory(() => {
		return {
			get() {
				return { size: { width } };
			}
		};
	});
	const harness = (renderFunc: () => WNode) =>
		testHarness(renderFunc, {
			customComparator: [compareTheme],
			middleware: [[dimensions, () => mockDimensions()]] as any
		});
	const baseAssertion = assertionTemplate(() => (
		<div key="root" classes={[undefined, css.root, css.horizontal, css.clickable]}>
			<div key="step1" classes={[css.step, css.complete, false, false]} onclick={noop}>
				<div classes={css.tail} />
				<div classes={css.stepIcon}>
					<Avatar assertion-key="avatar1" theme={{}} outline={true}>
						<Icon type="checkIcon" />
					</Avatar>
				</div>
				<div>Step 1</div>
			</div>
			<div key="step2" classes={[css.step, false, false, false]} onclick={noop}>
				<div classes={css.tail} />
				<div classes={css.stepIcon}>
					<Avatar assertion-key="avatar2" theme={{}} outline={false}>
						2
					</Avatar>
				</div>
				<div>Step 2</div>
			</div>
			<div key="step3" classes={[css.step, false, css.pending, false]} onclick={noop}>
				<div classes={css.tail} />
				<div classes={css.stepIcon}>
					<Avatar assertion-key="avatar3" theme={{}} outline={true}>
						3
					</Avatar>
				</div>
				<div>Step 3</div>
			</div>
		</div>
	));
	const baseStepAssertion = assertionTemplate(() => (
		<div classes={[undefined, css.stepContent]}>
			<div classes={[css.stepTitle, css.noTitle, css.noDescription]}>
				<div classes={css.stepSubTitle} />
			</div>
			<div classes={css.stepDescription} />
		</div>
	));

	it('renders', () => {
		const h = harness(() => (
			<Wizard
				steps={[{ status: 'complete' }, { status: 'inProgress' }, { status: 'pending' }]}
			>
				<div>Step 1</div>
				<div>Step 2</div>
				<div>Step 3</div>
			</Wizard>
		));

		h.expect(baseAssertion);
	});

	it('renders vertically', () => {
		const h = harness(() => (
			<Wizard
				direction="vertical"
				steps={[{ status: 'complete' }, { status: 'inProgress' }, { status: 'pending' }]}
			>
				<div>Step 1</div>
				<div>Step 2</div>
				<div>Step 3</div>
			</Wizard>
		));

		h.expect(
			baseAssertion.setProperty(':root', 'classes', [
				undefined,
				css.root,
				css.vertical,
				css.clickable
			])
		);
	});

	it('forces rendering vertically at smaller widths', () => {
		width = 400;
		const h = harness(() => (
			<Wizard
				steps={[{ status: 'complete' }, { status: 'inProgress' }, { status: 'pending' }]}
			>
				<div>Step 1</div>
				<div>Step 2</div>
				<div>Step 3</div>
			</Wizard>
		));

		h.expect(
			baseAssertion.setProperty(':root', 'classes', [
				undefined,
				css.root,
				css.vertical,
				css.clickable
			])
		);
		width = 10000;
	});

	it('renders with "clickable" set to false', () => {
		const h = harness(() => (
			<Wizard
				clickable={false}
				steps={[{ status: 'complete' }, { status: 'inProgress' }, { status: 'pending' }]}
			>
				<div>Step 1</div>
				<div>Step 2</div>
				<div>Step 3</div>
			</Wizard>
		));

		h.expect(
			baseAssertion.setProperty(':root', 'classes', [
				undefined,
				css.root,
				css.horizontal,
				false
			])
		);
	});

	it('renders with an error', () => {
		const h = harness(() => (
			<Wizard steps={[{ status: 'complete' }, { status: 'error' }, { status: 'pending' }]}>
				<div>Step 1</div>
				<div>Step 2</div>
				<div>Step 3</div>
			</Wizard>
		));

		h.expect(
			baseAssertion
				.setProperty('@step1', 'classes', [css.step, css.complete, false, false])
				.setProperty('@step2', 'classes', [css.step, false, false, css.error])
				.setProperty('@avatar2', 'outline', true)
				.setChildren('@avatar2', () => [<Icon type="closeIcon" />])
				.setProperty('@step3', 'classes', [css.step, false, css.pending, false])
		);
	});

	it('renders with a custom value', () => {
		const h = harness(() => (
			<Wizard
				steps={[
					{ status: 'complete' },
					{ value: 'A', status: 'inProgress' },
					{ status: 'pending' }
				]}
			>
				<div>Step 1</div>
				<div>Step 2</div>
				<div>Step 3</div>
			</Wizard>
		));

		h.expect(baseAssertion.setChildren('@avatar2', () => ['A']));
	});

	it('triggers the callback clicked', () => {
		let requestIndex;
		const h = harness(() => (
			<Wizard
				onStep={(step) => {
					requestIndex = step;
				}}
				steps={[{ status: 'complete' }, { status: 'inProgress' }, { status: 'pending' }]}
			>
				<div>Step 1</div>
				<div>Step 2</div>
				<div>Step 3</div>
			</Wizard>
		));

		h.expect(baseAssertion);

		h.trigger('@step3', 'onclick');

		assert.equal(requestIndex, 2);
	});

	describe('step', () => {
		it('renders step by default', () => {
			const h = harness(() => <Step />);
			h.expect(baseStepAssertion);
		});

		it('renders with title, subtitle, and description', () => {
			const h = harness(() => (
				<Step>
					{{
						title: 'title',
						subTitle: 'subTitle',
						description: 'description'
					}}
				</Step>
			));
			h.expect(
				baseStepAssertion.replaceChildren(':root', () => [
					<div classes={[css.stepTitle, false, false]}>
						title
						<div classes={css.stepSubTitle}>subTitle</div>
					</div>,
					<div classes={css.stepDescription}>description</div>
				])
			);
		});
	});
});
