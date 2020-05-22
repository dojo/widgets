import { create, tsx } from '@dojo/framework/core/vdom';
import { RenderResult } from '@dojo/framework/core/interfaces';
import theme from '../middleware/theme';
import Icon from '../icon';
import * as css from '../theme/default/wizard.m.css';
import * as avatarCss from '../theme/default/avatar.m.css';
import Avatar from '../avatar';
import dimensions from '@dojo/framework/core/middleware/dimensions';
import resize from '@dojo/framework/core/middleware/resize';

export interface StepItem {
	value?: string;
	status?: StepStatus;
}
export interface WizardProperties {
	/** Specify step statuses and optional labels for step avatars */
	steps: StepItem[];
	/** A callback that will be notified when a step is clicked if this is clickable */
	onStep?(step: number): void;
	/** Direction for steps. Defaults to horizontal */
	direction?: 'horizontal' | 'vertical';
	/** Indicates whether steps should respond to clicks. Defaults to true */
	clickable?: boolean;
}

export type StepStatus = 'pending' | 'inProgress' | 'complete' | 'error';

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

const factory = create({ theme, dimensions, resize }).properties<WizardProperties>();

export default factory(function Wizard({
	properties,
	children,
	middleware: { theme, dimensions, resize }
}) {
	const classes = theme.classes(css);
	const { direction = 'horizontal', onStep, steps, clickable = true } = properties();
	resize.get('root');
	const width = dimensions.get('root').size.width;

	const stepNodes = children();
	const forceVertical = width < 200 * stepNodes.length;

	const stepWrappers = stepNodes.map((step, index) => [
		<div classes={classes.stepIcon}>
			<Avatar
				theme={theme.compose(
					avatarCss,
					css,
					'stepAvatar'
				)}
				outline={Boolean(steps[index].status !== 'inProgress')}
			>
				{steps[index].status === 'complete' ? (
					<Icon type="checkIcon" />
				) : steps[index].status === 'error' ? (
					<Icon type="closeIcon" />
				) : (
					steps[index].value || String(index + 1)
				)}
			</Avatar>
		</div>,
		step
	]);

	return (
		<div
			key="root"
			classes={[
				theme.variant(),
				classes.root,
				!forceVertical && direction === 'horizontal'
					? classes.horizontal
					: classes.vertical,
				clickable && classes.clickable
			]}
		>
			{stepWrappers.map((step, index) => (
				<div
					key={`step${index + 1}`}
					classes={[
						classes.step,
						steps[index].status === 'complete' && classes.complete,
						steps[index].status === 'pending' && classes.pending,
						steps[index].status === 'error' && classes.error
					]}
					onclick={() => {
						if (clickable && onStep) {
							onStep(index);
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
