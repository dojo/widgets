import { tsx } from '@dojo/framework/core/vdom';
const { it, describe } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import harness from '@dojo/framework/testing/harness/harness';
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';

import Wizard, { Step } from '../../index';
import * as css from '../../../theme/default/wizard.m.css';
import Avatar from '../../../avatar';
import { compareTheme, noop } from '../../../common/tests/support/test-helpers';
import Icon from '../../../icon';

describe('Wizard', () => {
	const baseAssertion = assertionTemplate(() => (
		<div classes={[undefined, css.root, css.horizontal, css.clickable]}>
			<div key="step1" classes={[css.step, css.complete, false, undefined]} onclick={noop}>
				<div classes={css.tail} />
				<div classes={css.stepIcon}>
					<Avatar assertion-key="avatar1" theme={{}} outline={true}>
						<Icon type="checkIcon" />
					</Avatar>
				</div>
				<div>Step 1</div>
			</div>
			<div key="step2" classes={[css.step, false, false, undefined]} onclick={noop}>
				<div classes={css.tail} />
				<div classes={css.stepIcon}>
					<Avatar assertion-key="avatar2" theme={{}} outline={false}>
						2
					</Avatar>
				</div>
				<div>Step 2</div>
			</div>
			<div key="step3" classes={[css.step, false, css.pending, undefined]} onclick={noop}>
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
			<div classes={css.stepTitle}>
				<div classes={css.stepSubTitle} />
			</div>
			<div classes={css.stepDescription} />
		</div>
	));

	it('renders', () => {
		const h = harness(
			() => (
				<Wizard initialActiveStep={1}>
					<div>Step 1</div>
					<div>Step 2</div>
					<div>Step 3</div>
				</Wizard>
			),
			[compareTheme]
		);

		h.expect(baseAssertion);
	});

	it('renders vertically', () => {
		const h = harness(
			() => (
				<Wizard direction="vertical" initialActiveStep={1}>
					<div>Step 1</div>
					<div>Step 2</div>
					<div>Step 3</div>
				</Wizard>
			),
			[compareTheme]
		);

		h.expect(
			baseAssertion.setProperty(':root', 'classes', [
				undefined,
				css.root,
				css.vertical,
				css.clickable
			])
		);
	});

	it('renders wich "clickable" set to false', () => {
		const h = harness(
			() => (
				<Wizard clickable={false} initialActiveStep={1}>
					<div>Step 1</div>
					<div>Step 2</div>
					<div>Step 3</div>
				</Wizard>
			),
			[compareTheme]
		);

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
		const h = harness(
			() => (
				<Wizard error initialActiveStep={1}>
					<div>Step 1</div>
					<div>Step 2</div>
					<div>Step 3</div>
				</Wizard>
			),
			[compareTheme]
		);

		h.expect(
			baseAssertion
				.setProperty('@step1', 'classes', [css.step, css.complete, false, false])
				.setProperty('@step2', 'classes', [css.step, false, false, css.error])
				.setProperty('@avatar2', 'outline', true)
				.setChildren('@avatar2', () => [<Icon type="closeIcon" />])
				.setProperty('@step3', 'classes', [css.step, false, css.pending, false])
		);
	});

	it('changes the active step when clicked', () => {
		const h = harness(
			() => (
				<Wizard initialActiveStep={1}>
					<div>Step 1</div>
					<div>Step 2</div>
					<div>Step 3</div>
				</Wizard>
			),
			[compareTheme]
		);

		h.expect(baseAssertion);

		h.trigger('@step3', 'onclick');

		h.expect(
			baseAssertion
				.setProperty('@step3', 'classes', [css.step, false, false, undefined])
				.setProperty('@step2', 'classes', [css.step, css.complete, false, undefined])
				.setProperty('@avatar2', 'outline', true)
				.setProperty('@avatar3', 'outline', false)
				.setChildren('@avatar2', () => [<Icon type="checkIcon" />])
		);

		h.trigger('@step1', 'onclick');

		h.expect(
			baseAssertion
				.setProperty('@step3', 'classes', [css.step, false, css.pending, undefined])
				.setProperty('@step2', 'classes', [css.step, false, css.pending, undefined])
				.setProperty('@step1', 'classes', [css.step, false, false, undefined])
				.setProperty('@avatar2', 'outline', true)
				.setProperty('@avatar1', 'outline', false)
				.setChildren('@avatar2', () => ['2'])
				.setChildren('@avatar1', () => ['1'])
		);
	});

	it('only the previous nodes can be selected when there is an error', () => {
		let activeIndex = 1;
		const h = harness(
			() => (
				<Wizard
					error={activeIndex === 1}
					initialActiveStep={activeIndex}
					onActiveStep={(index) => {
						activeIndex = index;
					}}
				>
					<div>Step 1</div>
					<div>Step 2</div>
					<div>Step 3</div>
				</Wizard>
			),
			[compareTheme]
		);

		const errorAssertion = baseAssertion
			.setProperty('@step1', 'classes', [css.step, css.complete, false, false])
			.setProperty('@step2', 'classes', [css.step, false, false, css.error])
			.setProperty('@avatar2', 'outline', true)
			.setChildren('@avatar2', () => [<Icon type="closeIcon" />])
			.setProperty('@step3', 'classes', [css.step, false, css.pending, false]);
		h.expect(errorAssertion);
		h.trigger('@step3', 'onclick');
		h.expect(errorAssertion);

		h.trigger('@step1', 'onclick');

		h.expect(
			baseAssertion
				.setProperty('@step3', 'classes', [css.step, false, css.pending, false])
				.setProperty('@step2', 'classes', [css.step, false, css.pending, false])
				.setProperty('@step1', 'classes', [css.step, false, false, false])
				.setProperty('@avatar2', 'outline', true)
				.setProperty('@avatar1', 'outline', false)
				.setChildren('@avatar2', () => ['2'])
				.setChildren('@avatar1', () => ['1'])
		);
	});

	it('controlled property overrides internal step changes', () => {
		let activeIndex;
		const h = harness(
			() => (
				<Wizard
					activeStep={1}
					onActiveStep={(index) => {
						activeIndex = index;
					}}
				>
					<div>Step 1</div>
					<div>Step 2</div>
					<div>Step 3</div>
				</Wizard>
			),
			[compareTheme]
		);

		h.expect(baseAssertion);
		h.trigger('@step3', 'onclick');
		assert.strictEqual(activeIndex, 2);
		h.expect(baseAssertion);

		h.trigger('@step1', 'onclick');
		assert.strictEqual(activeIndex, 0);
		h.expect(baseAssertion);
	});

	describe('step', () => {
		it('renders step by default', () => {
			const h = harness(() => <Step />, [compareTheme]);
			h.expect(baseStepAssertion);
		});

		it('renders with title, subtitle, and description', () => {
			const h = harness(
				() => (
					<Step>
						{{
							title: 'title',
							subTitle: 'subTitle',
							description: 'description'
						}}
					</Step>
				),
				[compareTheme]
			);
			h.expect(
				baseStepAssertion.replaceChildren(':root', () => [
					<div classes={css.stepTitle}>
						title
						<div classes={css.stepSubTitle}>subTitle</div>
					</div>,
					<div classes={css.stepDescription}>description</div>
				])
			);
		});
	});
});
