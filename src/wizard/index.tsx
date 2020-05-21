import { create, tsx } from '@dojo/framework/core/vdom';
import { RenderResult } from '@dojo/framework/core/interfaces';
import theme from '../middleware/theme';
import Icon from '../icon';
import * as css from '../theme/default/wizard.m.css';
import * as avatarCss from '../theme/default/avatar.m.css';
import Avatar from '../avatar';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';

export interface WizardProperties {
	/** Set an initial active step and then let the component handle it internally */
	initialActiveStep?: number;
	/** Optional controlled active step index. Defaults to the first step. */
	activeStep?: number;
	/** A callback that will be notified when the step should change */
	onActiveStep?(step: number): void;
	/** Indicates that there is an error in the active step. */
	error?: boolean;
	/** Direction for steps. Defaults to horizontal */
	direction?: 'horizontal' | 'vertical';
	/** Indicates whether steps should respond to clicks. Defaults to true */
	clickable?: boolean;
}

export type StepStatus = 'pending' | 'inProgress' | 'complete';

export interface StepChildren {
	title?: RenderResult;
	subTitle?: RenderResult;
	description?: RenderResult;
}

const stepFactory = create({ theme }).children<StepChildren | undefined>();

export const Step = stepFactory(({ properties, children, middleware: { theme } }) => {
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
			<div classes={themedCss.stepTitle}>
				{title}
				<div classes={themedCss.stepSubTitle}>{subTitle}</div>
			</div>
			<div classes={themedCss.stepDescription}>{description}</div>
		</div>
	);
});

interface WizardIcache {
	initialActiveStep: number;
	activeStep: number;
	errorTooltip: boolean;
}
const icache = createICacheMiddleware<WizardIcache>();
const factory = create({ theme, icache }).properties<WizardProperties>();

export default factory(function Wizard({ properties, children, middleware: { theme, icache } }) {
	const classes = theme.classes(css);
	const {
		direction = 'horizontal',
		initialActiveStep,
		onActiveStep,
		error,
		clickable = true
	} = properties();
	let { activeStep } = properties();

	if (typeof activeStep === 'undefined') {
		if (
			typeof initialActiveStep === 'number' &&
			initialActiveStep !== icache.get('initialActiveStep')
		) {
			icache.set('initialActiveStep', initialActiveStep);
			icache.set('activeStep', initialActiveStep);
		}
		activeStep = icache.getOrSet('activeStep', 0);
	}

	const stepNodes = children();
	const statuses: StepStatus[] = stepNodes.map((_, index) => {
		if (index < (activeStep || 0)) {
			return 'complete';
		} else if (index === activeStep) {
			return 'inProgress';
		} else {
			return 'pending';
		}
	});

	const steps = stepNodes.map((step, index) => [
		<div classes={classes.stepIcon}>
			<Avatar
				theme={theme.compose(
					avatarCss,
					css,
					'stepAvatar'
				)}
				outline={Boolean(error || statuses[index] !== 'inProgress')}
			>
				{statuses[index] === 'complete' ? (
					<Icon type="checkIcon" />
				) : statuses[index] === 'inProgress' && error ? (
					<Icon type="closeIcon" />
				) : (
					String(index + 1)
				)}
			</Avatar>
		</div>,
		step
	]);

	return (
		<div
			classes={[
				theme.variant(),
				classes.root,
				direction === 'horizontal' ? classes.horizontal : classes.vertical,
				clickable && classes.clickable
			]}
		>
			{steps.map((step, index) => (
				<div
					key={`step${index + 1}`}
					classes={[
						classes.step,
						statuses[index] === 'complete' && classes.complete,
						statuses[index] === 'pending' && classes.pending,
						error && statuses[index] === 'inProgress' && classes.error
					]}
					onclick={() => {
						if (clickable && (!error || index < (activeStep || 0))) {
							icache.set('activeStep', index);
							onActiveStep && onActiveStep(index);
						}
					}}
				>
					<div classes={classes.tail} />
					{step}
				</div>
			))}
		</div>
	);
});
