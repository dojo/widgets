import { RenderResult } from '@dojo/framework/core/interfaces';
import { create, tsx } from '@dojo/framework/core/vdom';

import theme from '../middleware/theme';
import * as css from '../theme/default/progress.m.css';

export interface ProgressProperties {
	/** Value used to calculate percent width */
	max?: number;
	/** Value used to calculate percent width */
	min?: number;
	/** Toggles visibility of progress bar output */
	showOutput?: boolean;
	/** The current value */
	value: number;
	/** Value used to supply a dom id to the element with role="progressbar" */
	widgetId?: string;
}

export interface ProgressChildren {
	output?(value: number, percent: number): RenderResult;
}

const factory = create({ theme })
	.properties<ProgressProperties>()
	.children<ProgressChildren | undefined>();

export const Progress = factory(function Progress({
	children,
	id,
	properties,
	middleware: { theme }
}) {
	const themeCss = theme.classes(css);
	const {
		value,
		showOutput = true,
		max = 100,
		min = 0,
		widgetId = `progress-${id}`
	} = properties();

	const _output = (value: number, percent: number) => {
		const { output } = children()[0] || ({} as ProgressChildren);
		return output ? output(value, percent) : `${percent}%`;
	};

	const renderProgress = (percent: number) => {
		return <div classes={themeCss.progress} styles={{ width: `${percent}%` }} />;
	};

	const percent = Math.round(((value - min) / (max - min)) * 100);
	const output = _output(value, percent);

	return (
		<div key="root" classes={themeCss.root}>
			<div
				classes={themeCss.bar}
				role="progressbar"
				aria-valuemin={`${min}`}
				aria-valuemax={`${max}`}
				aria-valuenow={`${value}`}
				aria-valuetext={output}
				id={widgetId}
			>
				{renderProgress(percent)}
			</div>
			{showOutput ? <span classes={themeCss.output}>{output}</span> : null}
		</div>
	);
});

export default Progress;
