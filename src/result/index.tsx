import { RenderResult } from '@dojo/framework/core/interfaces';
import { create, tsx } from '@dojo/framework/core/vdom';

import theme from '../middleware/theme';
import * as css from '../theme/default/result.m.css';

type ResultStatus = 'success' | 'error' | 'warning' | 404 | 500; // TODO: Additional status

export interface ResultProperties {
	/* Title for the result */
	title?: string;
	/* A subtitle for the result */
	subTitle?: string;
	/* The result status. Applies appropriate icon and color. */
	status?: ResultStatus;
}

export interface ResultChildren {
	icon?: () => RenderResult;
	content?: () => RenderResult;
	actionButtons?: () => RenderResult;
}

const factory = create({ theme })
	.properties<ResultProperties>()
	.children<ResultChildren | undefined>();

export const Result = factory(function Result({ children, properties, middleware: { theme } }) {
	const themeCss = theme.classes(css);
	const { title, subTitle, status } = properties();
	const { actionButtons, content, icon } = children()[0] || ({} as ResultChildren);

	// TODO: Handle status Icons

	return (
		<div key="root" classes={[theme.variant(), themeCss.root]}>
			{icon && (
				<div key="icon" classes={themeCss.statusIcon}>
					{icon()}
				</div>
			)}
			{title && (
				<div classes={themeCss.titleWrapper}>
					{<h2 classes={themeCss.title}>{title}</h2>}
					{subTitle && <h3 classes={themeCss.subTitle}>{subTitle}</h3>}
				</div>
			)}
			{content && <div classes={themeCss.contentWrapper}>{content()}</div>}
			{actionButtons && (
				<div key="actions" classes={themeCss.actions}>
					{actionButtons && <div classes={themeCss.actionButtons}>{actionButtons()}</div>}
				</div>
			)}
		</div>
	);
});

export default Result;
