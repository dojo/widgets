import { create, tsx } from '@dojo/framework/core/vdom';
import { RenderResult } from '@dojo/framework/core/interfaces';
import theme from '@dojo/widgets/middleware/theme';
import * as css from '../theme/default/stepped-wizard.m.css';

export interface SteppedWizardProperties {
	/** Initial active step ID. Defaults to the first step's ID. */
	initialActiveStep?: string;
	/** Controlled active step ID */
	activeStep?: string;
	/** Callback fired when a step is changed it `activeStep` is passed */
	onActiveStep?(stepId: string): void;
}

export interface SteppedWizardChildren {
	steps(statuses: { [id: string]: StepStatus }, activeStep: string): RenderResult;
}

export type StepStatus = 'pending' | 'inProgress' | 'complete' | 'error';

export interface StepProperties {
	/** Current step status Defaults to `'pending'` */
	status?: StepStatus;
	/** Index of the step */
}

export interface StepChildren {
	title?: RenderResult;
	subTitle?: RenderResult;
	icon?(status: StepStatus): RenderResult;
}

const stepFactory = create({ theme }).properties<StepProperties>().children<StepChildren | undefined>();

export const Step = stepFactory(({ properties, children, middleware: { theme } }) => {
	const { status = 'pending' } = properties();
	const [{ title, subTitle, icon } = { title: undefined, subTitle: undefined, icon: undefined }] = children();
	const themedCss = theme.classes(css);

	return (
		<div classes={themedCss.step}>
			{icon ? icon(status) : <div classes={themedCss.stepIcon}>{
				status === 'complete' ?
			}</div>
			{(title || subTitle) && (
				<div>
					{title}
					{subTitle}
				</div>
			)}
		</div>
	);
});


export interface StepContentProperties {
	active?: boolean;
}

const factory = create().properties<SteppedWizardProperties>();

export default factory(function SteppedWizard({properties, children})
{
	const x = properties();
	return (
		<div/>
	);
}
)
;
