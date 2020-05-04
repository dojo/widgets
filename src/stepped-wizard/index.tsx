import { create, tsx } from '@dojo/framework/core/vdom';
import { RenderResult } from '@dojo/framework/core/interfaces';
import theme from '@dojo/widgets/middleware/theme';
import Icon from '../icon';
import * as css from '../theme/default/stepped-wizard.m.css';
import * as avatarCss from '../theme/default/avatar.m.css';
import Avatar from '../avatar';

export interface SteppedWizardProperties {
	/** Controlled active step index. Defaults to the first step. */
	activeStep?: number;
	/** The number of steps in the wizard */
	numberOfSteps: number;
	/** If there is an error in the active step it can be passed here. */
	error?: string;
	/** Direction for steps. Defaults to horizontal */
	direction?: 'horizontal' | 'vertical';
}

export interface SteppedWizardChildren {
	(statuses: StepStatus[], error?: string): RenderResult;
}

export type StepStatus = 'pending' | 'inProgress' | 'complete';

export interface StepProperties {
	/** Current step status Defaults to `'pending'` */
	status?: StepStatus;
	/** Index of the step */
	index: number;
	/** Optional callback indicating that the step should be clickable */
	onClick?(): void;
}

export interface StepChildren {
	title?: RenderResult;
	subTitle?: RenderResult;
	icon?(status: StepStatus): RenderResult;
	description?: RenderResult;
}

const stepFactory = create({ theme })
	.properties<StepProperties>()
	.children<StepChildren | undefined>();

export const Step = stepFactory(({ properties, children, middleware: { theme } }) => {
	const { status = 'pending', index, onClick } = properties();
	const [
		{ title, subTitle, icon, description } = {
			description: undefined,
			title: undefined,
			subTitle: undefined,
			icon: undefined
		}
	] = children();
	const themedCss = theme.classes(css);

	return (
		<div
			classes={[
				themedCss.step,
				onClick && themedCss.clickable,
				status === 'complete' && themedCss.complete,
				status === 'pending' && themedCss.pending
			]}
			onclick={() => {
				onClick && onClick();
			}}
		>
			<div classes={themedCss.tail} />
			{icon ? (
				icon(status)
			) : (
				<div classes={themedCss.stepIcon}>
					<Avatar
						theme={theme.compose(
							avatarCss,
							css,
							'stepAvatar'
						)}
						outline={status !== 'inProgress'}
					>
						{status === 'complete' ? <Icon type="checkIcon" /> : String(index)}
					</Avatar>
				</div>
			)}
			<div classes={themedCss.stepContent}>
				<div classes={themedCss.stepTitle}>
					{title}
					<div classes={themedCss.stepSubTitle}>{subTitle}</div>
				</div>
				<div classes={themedCss.stepDescription}>{description}</div>
			</div>
		</div>
	);
});

const factory = create({ theme })
	.properties<SteppedWizardProperties>()
	.children<SteppedWizardChildren>();

export default factory(function SteppedWizard({ properties, children, middleware: { theme } }) {
	const classes = theme.classes(css);
	const { direction = 'horizontal', numberOfSteps, activeStep = 0, error } = properties();
	const [render] = children();
	const statuses: StepStatus[] = Array.from({ length: numberOfSteps }, (_, index) => {
		if (index < activeStep) {
			return 'complete';
		}

		if (index === activeStep) {
			return 'inProgress';
		}

		if (index > activeStep) {
			return 'pending';
		}
	});
	return (
		<div
			classes={[
				classes.root,
				direction === 'horizontal' ? classes.horizontal : classes.vertical
			]}
		>
			{render(statuses, error)}
		</div>
	);
});
