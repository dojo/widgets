import { create, tsx } from '@dojo/framework/core/vdom';
import { DNode, RenderResult } from '@dojo/framework/core/interfaces';
import theme from '../middleware/theme';
import Icon from '../icon';
import * as css from '../theme/default/wizard.m.css';
import * as avatarCss from '../theme/default/avatar.m.css';
import Avatar from '../avatar';
import { isRenderResult } from '../common/util';

export interface Step {
	title?: RenderResult;
	subTitle?: RenderResult;
	description?: RenderResult;
	status?: StepStatus;
}
export interface WizardProperties {
	/** A callback that will be notified when a step is clicked if this is clickable */
	onStep?(step: number): void;
	/** Direction for steps. Defaults to horizontal */
	direction?: 'horizontal' | 'vertical';
	/** Indicates whether steps should respond to clicks. Defaults to false */
	clickable?: boolean;
	/** The active step can be controlled to automatically set step status. Will be overridden by statuses provided to each step. If this property is not used, individual statuses should be passed to steps */
	activeStep?: number;
	/** The steps available to the wizard */
	steps: Step[];
}

export type StepRenderer = (
	status: StepStatus | undefined,
	index: number,
	step: Step
) => RenderResult;

export interface WizardChildren {
	/** Custom renderer for the wizardSteps, receives the checkbox group middleware and options */
	step?: StepRenderer;
}

export type StepStatus = 'pending' | 'inProgress' | 'complete' | 'error';

const factory = create({ theme })
	.properties<WizardProperties>()
	.children<WizardChildren | RenderResult | undefined>();

export default factory(function Wizard({ properties, children, middleware: { theme } }) {
	const themedCss = theme.classes(css);
	const {
		activeStep,
		direction = 'horizontal',
		onStep,
		clickable = false,
		classes,
		variant,
		steps,
		theme: themeProp
	} = properties();

	let stepRenderer: StepRenderer | undefined;
	let stepContent: DNode[] | undefined;
	const body = children();

	if (body && body[0] && !isRenderResult(body[0])) {
		stepRenderer = body[0].step;
	} else if (isRenderResult(body)) {
		stepContent = body;
	}

	const stepWrappers = steps.map((step, index) => {
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

		const { title, description, subTitle, status = defaultStatus } = step;

		if (stepRenderer) {
			return {
				content: stepRenderer(defaultStatus, index, step),
				status
			};
		}

		switch (status) {
			case 'complete':
				content = (
					<Icon type="checkIcon" theme={themeProp} classes={classes} variant={variant} />
				);
				break;
			case 'error':
				content = (
					<Icon type="closeIcon" theme={themeProp} classes={classes} variant={variant} />
				);
				break;
			default:
				content = String(index + 1);
		}

		return {
			content: (
				<virtual>
					<div classes={themedCss.stepIcon}>
						<Avatar
							theme={theme.compose(
								avatarCss,
								css,
								'avatar'
							)}
							classes={classes}
							variant={variant}
							outline={Boolean(status !== 'inProgress')}
						>
							{content}
						</Avatar>
					</div>
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
						{stepContent && stepContent[index]}
					</div>
				</virtual>
			),
			status
		};
	});

	return (
		<div
			key="root"
			classes={[
				theme.variant(),
				themedCss.root,
				direction === 'horizontal' ? themedCss.horizontal : themedCss.vertical,
				clickable && themedCss.clickable
			]}
		>
			{stepWrappers.map(({ content, status }, index) => (
				<div
					key={`step${index + 1}`}
					classes={[
						themedCss.step,
						status === 'complete' && themedCss.complete,
						status === 'pending' && themedCss.pending,
						status === 'error' && themedCss.error
					]}
					onclick={() => {
						if (clickable && onStep) {
							onStep(index);
						}
					}}
				>
					<div classes={themedCss.tail} />
					{content}
				</div>
			))}
		</div>
	);
});
