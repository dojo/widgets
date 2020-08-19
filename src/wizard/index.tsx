import { create, tsx } from '@dojo/framework/core/vdom';
import { RenderResult, WNode } from '@dojo/framework/core/interfaces';
import theme from '../middleware/theme';
import Icon from '../icon';
import * as css from '../theme/default/wizard.m.css';
import * as avatarCss from '../theme/default/avatar.m.css';
import Avatar from '../avatar';

export interface WizardProperties {
	/** A callback that will be notified when a step is clicked if this is clickable */
	onStep?(step: number): void;
	/** Direction for steps. Defaults to horizontal */
	direction?: 'horizontal' | 'vertical';
	/** Indicates whether steps should respond to clicks. Defaults to false */
	clickable?: boolean;
	/** The active step can be controlled to automatically set step status. Will be overridden by statuses provided to each step. If this property is not used, individual statuses should be passed to steps */
	activeStep?: number;
}

export type StepStatus = 'pending' | 'inProgress' | 'complete' | 'error';

export interface StepProperties {
	status?: StepStatus;
}
export interface StepChildren {
	title?: RenderResult;
	subTitle?: RenderResult;
	description?: RenderResult;
}

const stepFactory = create({ theme })
	.properties<StepProperties>()
	.children<StepChildren | undefined>();

export const Step = stepFactory(({ children, middleware: { theme } }) => {
	const [
		{ title, subTitle, description } = {
			description: undefined,
			title: undefined,
			subTitle: undefined
		}
	] = children();
	const themedCss = theme.classes(css);

	return (
		<div classes={[theme.variant(), themedCss.stepContent]}>
			<div
				classes={[
					themedCss.stepTitle,
					!title && themedCss.noTitle,
					!description && themedCss.noDescription
				]}
			>
				{title}
				<div classes={themedCss.stepSubTitle}>{subTitle}</div>
			</div>
			<div classes={themedCss.stepDescription}>{description}</div>
		</div>
	);
});

const factory = create({ theme })
	.children<WNode[]>()
	.properties<WizardProperties>();

export default factory(function Wizard({ properties, children, middleware: { theme } }) {
	const classes = theme.classes(css);
	const { activeStep, direction = 'horizontal', onStep, clickable = false } = properties();

	const stepNodes = children();

	const stepWrappers = stepNodes.map((step, index) => {
		let content;
		let defaultStatus: StepStatus | undefined;

		if (activeStep === undefined) {
			defaultStatus = undefined;
		} else if (activeStep > index) {
			defaultStatus = 'complete';
		} else if (activeStep < index) {
			defaultStatus = 'pending';
		} else {
			defaultStatus = 'inProgress';
		}

		const { status = defaultStatus } = step.properties;
		switch (status) {
			case 'complete':
				content = <Icon type="checkIcon" />;
				break;
			case 'error':
				content = <Icon type="closeIcon" />;
				break;
			default:
				content = String(index + 1);
		}
		return {
			content: [
				<div classes={classes.stepIcon}>
					<Avatar
						theme={theme.compose(
							avatarCss,
							css,
							'avatar'
						)}
						outline={Boolean(status !== 'inProgress')}
					>
						{content}
					</Avatar>
				</div>,
				step
			],
			status
		};
	});

	return (
		<div
			key="root"
			classes={[
				theme.variant(),
				classes.root,
				direction === 'horizontal' ? classes.horizontal : classes.vertical,
				clickable && classes.clickable
			]}
		>
			{stepWrappers.map(({ content, status }, index) => (
				<div
					key={`step${index + 1}`}
					classes={[
						classes.step,
						status === 'complete' && classes.complete,
						status === 'pending' && classes.pending,
						status === 'error' && classes.error
					]}
					onclick={() => {
						if (clickable && onStep) {
							onStep(index);
						}
					}}
				>
					<div classes={classes.tail} />
					{content}
				</div>
			))}
		</div>
	);
});
