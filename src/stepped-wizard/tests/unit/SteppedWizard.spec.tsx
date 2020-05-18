import { tsx } from '@dojo/framework/core/vdom';
const { it, describe } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import harness from '@dojo/framework/testing/harness/harness';
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';

import SteppedWizard, { Step } from '../../index';
import * as css from '../../../theme/default/stepped-wizard.m.css';
import Avatar from '../../../avatar';
import { compareTheme, noop } from '../../../common/tests/support/test-helpers';
import Icon from '../../../icon';

describe('SteppedWizard', () => {
	const baseAssertion = assertionTemplate(() => (
		<div classes={[css.root, css.horizontal]}>
			<div>rendered child</div>
		</div>
	));
	const baseStepAssertion = assertionTemplate(() => (
		<div classes={[css.step, undefined, false, css.pending]} onclick={noop}>
			<div classes={css.tail} />
			<div assertion-key="stepIcon" classes={css.stepIcon}>
				<Avatar assertion-key="avatar" theme={{}} outline={true}>
					1
				</Avatar>
			</div>
			<div assertion-key="content" classes={css.stepContent}>
				<div classes={css.stepTitle}>
					<div classes={css.stepSubTitle} />
				</div>
				<div classes={css.stepDescription} />
			</div>
		</div>
	));

	it('renders', () => {
		let statuses;
		let errorArgument;
		const error = 'error';
		const h = harness(
			() => (
				<SteppedWizard error={error} numberOfSteps={3} activeStep={1}>
					{(renderStatuses, error) => {
						statuses = renderStatuses;
						errorArgument = error;
						return <div>rendered child</div>;
					}}
				</SteppedWizard>
			),
			[compareTheme]
		);

		h.expect(baseAssertion);
		assert.deepEqual(statuses, ['complete', 'inProgress', 'pending']);
		assert.equal(errorArgument, error);
	});

	it('renders vertically', () => {
		const error = 'error';
		const h = harness(
			() => (
				<SteppedWizard direction="vertical" error={error} numberOfSteps={3} activeStep={1}>
					{() => <div>rendered child</div>}
				</SteppedWizard>
			),
			[compareTheme]
		);

		h.expect(baseAssertion.setProperty(':root', 'classes', [css.root, css.vertical]));
	});

	it('renders a pending step by default', () => {
		const h = harness(() => <Step index={0} />, [compareTheme]);
		h.expect(baseStepAssertion);
	});

	it('renders a pending step explicitly', () => {
		const h = harness(() => <Step status="pending" index={0} />, [compareTheme]);
		h.expect(baseStepAssertion);
	});

	it('renders an in progress step', () => {
		const h = harness(() => <Step status="inProgress" index={0} />, [compareTheme]);
		h.expect(
			baseStepAssertion
				.setProperty('@avatar', 'outline', false)
				.setProperty(':root', 'classes', [css.step, undefined, false, false])
		);
	});

	it('renders a complete progress step', () => {
		const h = harness(() => <Step status="complete" index={0} />, [compareTheme]);

		h.expect(
			baseStepAssertion
				.setProperty(':root', 'classes', [css.step, undefined, css.complete, false])
				.setChildren('@avatar', () => [<Icon type="checkIcon" />])
		);
	});

	it('renders with icon, title, subtitle, and description', () => {
		let status;
		const h = harness(
			() => (
				<Step status="pending" index={0}>
					{{
						title: 'title',
						subTitle: 'subTitle',
						description: 'description',
						icon: (iconStatus) => {
							status = iconStatus;
							return 'icon';
						}
					}}
				</Step>
			),
			[compareTheme]
		);
		h.expect(
			baseStepAssertion.replace('@stepIcon', 'icon').replaceChildren('@content', () => [
				<div classes={css.stepTitle}>
					title
					<div classes={css.stepSubTitle}>subTitle</div>
				</div>,
				<div classes={css.stepDescription}>description</div>
			])
		);
		assert.strictEqual(status, 'pending');
	});
});
