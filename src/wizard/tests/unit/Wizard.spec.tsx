import { create, tsx } from '@dojo/framework/core/vdom';
const { it, describe } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import { renderer, assertion, wrap } from '@dojo/framework/testing/renderer';

import Wizard, { Step } from '../../index';
import * as css from '../../../theme/default/wizard.m.css';
import * as avatarCss from '../../../theme/default/avatar.m.css';
import Avatar from '../../../avatar';
import { noop } from '../../../common/tests/support/test-helpers';
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
	const mockedRenderer = (renderFunc: () => WNode) =>
		renderer(renderFunc, { middleware: [[dimensions, mockDimensions]] });
	const WrappedRoot = wrap('div');
	const WrappedStep1 = wrap('div');
	const WrappedStep2 = wrap('div');
	const WrappedStep3 = wrap('div');
	const WrappedAvatar = wrap(Avatar);
	const baseAssertion = assertion(() => (
		<WrappedRoot key="root" classes={[undefined, css.root, css.horizontal, false]}>
			<WrappedStep1
				key="step1"
				classes={[css.step, css.complete, false, false]}
				onclick={noop}
			>
				<div classes={css.tail} />
				<virtual>
					<div classes={css.stepIcon}>
						<Avatar
							theme={{
								'@dojo/widgets/avatar': {
									avatarColor: avatarCss.avatarColor,
									avatarColorSecondary: avatarCss.avatarColorSecondary,
									avatarOutline: avatarCss.avatarOutline,
									circle: avatarCss.circle,
									large: avatarCss.large,
									medium: avatarCss.medium,
									root: css.avatarRoot,
									rounded: avatarCss.rounded,
									small: avatarCss.small,
									square: avatarCss.square
								}
							}}
							outline={true}
							classes={undefined}
							variant={undefined}
						>
							<Icon
								type="checkIcon"
								classes={undefined}
								variant={undefined}
								theme={undefined}
							/>
						</Avatar>
					</div>
					<div>Step 1</div>
				</virtual>
			</WrappedStep1>
			<WrappedStep2 key="step2" classes={[css.step, false, false, false]} onclick={noop}>
				<div classes={css.tail} />
				<virtual>
					<div classes={css.stepIcon}>
						<WrappedAvatar
							theme={{
								'@dojo/widgets/avatar': {
									avatarColor: avatarCss.avatarColor,
									avatarColorSecondary: avatarCss.avatarColorSecondary,
									avatarOutline: avatarCss.avatarOutline,
									circle: avatarCss.circle,
									large: avatarCss.large,
									medium: avatarCss.medium,
									root: css.avatarRoot,
									rounded: avatarCss.rounded,
									small: avatarCss.small,
									square: avatarCss.square
								}
							}}
							classes={undefined}
							variant={undefined}
							outline={false}
						>
							2
						</WrappedAvatar>
					</div>
					<div>Step 2</div>
				</virtual>
			</WrappedStep2>
			<WrappedStep3
				key="step3"
				classes={[css.step, false, css.pending, false]}
				onclick={noop}
			>
				<div classes={css.tail} />
				<virtual>
					<div classes={css.stepIcon}>
						<Avatar
							theme={{
								'@dojo/widgets/avatar': {
									avatarColor: avatarCss.avatarColor,
									avatarColorSecondary: avatarCss.avatarColorSecondary,
									avatarOutline: avatarCss.avatarOutline,
									circle: avatarCss.circle,
									large: avatarCss.large,
									medium: avatarCss.medium,
									root: css.avatarRoot,
									rounded: avatarCss.rounded,
									small: avatarCss.small,
									square: avatarCss.square
								}
							}}
							outline={true}
							classes={undefined}
							variant={undefined}
						>
							3
						</Avatar>
					</div>
					<div>Step 3</div>
				</virtual>
			</WrappedStep3>
		</WrappedRoot>
	));
	const WrappedStepRoot = wrap('div');
	const baseStepAssertion = assertion(() => (
		<WrappedStepRoot classes={[undefined, css.stepContent]}>
			<div classes={[css.stepTitle, css.noTitle, css.noDescription]}>
				<div classes={css.stepSubTitle} />
			</div>
			<div classes={css.stepDescription} />
		</WrappedStepRoot>
	));

	it('renders', () => {
		const r = mockedRenderer(() => (
			<Wizard activeStep={1}>
				<div>Step 1</div>
				<div>Step 2</div>
				<div>Step 3</div>
			</Wizard>
		));

		r.expect(baseAssertion);
	});

	it('renders vertically', () => {
		const r = mockedRenderer(() => (
			<Wizard direction="vertical" activeStep={1}>
				<div>Step 1</div>
				<div>Step 2</div>
				<div>Step 3</div>
			</Wizard>
		));

		r.expect(
			baseAssertion.setProperty(WrappedRoot, 'classes', [
				undefined,
				css.root,
				css.vertical,
				false
			])
		);
	});

	it('renders with "clickable" set to true', () => {
		const r = mockedRenderer(() => (
			<Wizard clickable activeStep={1}>
				<div>Step 1</div>
				<div>Step 2</div>
				<div>Step 3</div>
			</Wizard>
		));

		r.expect(
			baseAssertion.setProperty(WrappedRoot, 'classes', [
				undefined,
				css.root,
				css.horizontal,
				css.clickable
			])
		);
	});

	it('renders with an error', () => {
		const r = mockedRenderer(() => (
			<Wizard activeStep={1}>
				<div>Step 1</div>
				<Step status="error" />
				<div>Step 3</div>
			</Wizard>
		));

		r.expect(
			baseAssertion
				.setProperty(WrappedStep1, 'classes', [css.step, css.complete, false, false])
				.setProperty(WrappedStep2, 'classes', [css.step, false, false, css.error])
				.setChildren(WrappedStep2, () => [
					<div classes={css.tail} />,
					<virtual>
						<div classes={css.stepIcon}>
							<WrappedAvatar
								theme={{
									'@dojo/widgets/avatar': {
										avatarColor: avatarCss.avatarColor,
										avatarColorSecondary: avatarCss.avatarColorSecondary,
										avatarOutline: avatarCss.avatarOutline,
										circle: avatarCss.circle,
										large: avatarCss.large,
										medium: avatarCss.medium,
										root: css.avatarRoot,
										rounded: avatarCss.rounded,
										small: avatarCss.small,
										square: avatarCss.square
									}
								}}
								outline={false}
								classes={undefined}
								variant={undefined}
							>
								2
							</WrappedAvatar>
						</div>
						<Step status="error" />
					</virtual>
				])
				.setProperty(WrappedAvatar, 'outline', true)
				.setChildren(WrappedAvatar, () => [
					<Icon
						type="closeIcon"
						classes={undefined}
						variant={undefined}
						theme={undefined}
					/>
				])
				.setProperty(WrappedStep3, 'classes', [css.step, false, css.pending, false])
		);
	});

	it('triggers the callback when clicked', () => {
		let requestIndex;
		const r = mockedRenderer(() => (
			<Wizard
				clickable
				onStep={(step) => {
					requestIndex = step;
				}}
				activeStep={1}
			>
				<div>Step 1</div>
				<div>Step 2</div>
				<div>Step 3</div>
			</Wizard>
		));

		r.expect(
			baseAssertion.setProperty(WrappedRoot, 'classes', [
				undefined,
				css.root,
				css.horizontal,
				css.clickable
			])
		);

		r.property(WrappedStep3, 'onclick');

		r.expect(
			baseAssertion.setProperty(WrappedRoot, 'classes', [
				undefined,
				css.root,
				css.horizontal,
				css.clickable
			])
		);

		assert.equal(requestIndex, 2);
	});

	describe('step', () => {
		it('renders step by default', () => {
			const r = mockedRenderer(() => <Step />);
			r.expect(baseStepAssertion);
		});

		it('renders with title, subtitle, and description', () => {
			const r = mockedRenderer(() => (
				<Step>
					{{
						title: 'title',
						subTitle: 'subTitle',
						description: 'description'
					}}
				</Step>
			));
			r.expect(
				baseStepAssertion.replaceChildren(WrappedStepRoot, () => [
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
