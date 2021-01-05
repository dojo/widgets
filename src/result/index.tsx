import { RenderResult } from '@dojo/framework/core/interfaces';
import { create, tsx } from '@dojo/framework/core/vdom';

import theme from '../middleware/theme';
import * as css from '../theme/default/result.m.css';
import * as iconCss from '../theme/default/icon.m.css';
import Icon from '../icon';

type ResultStatus = 'alert' | 'error' | 'info' | 'success';

export enum StatusIcon {
	alert = 'alertIcon',
	error = 'cancelIcon',
	info = 'infoIcon',
	success = 'checkedBoxIcon'
}

export interface ResultProperties {
	/* Title for the result */
	title?: string;
	/* A subtitle for the result */
	subtitle?: string;
	/* The result status. Applies appropriate icon and color. */
	status?: ResultStatus;
}

export interface ResultChildren {
	icon?: RenderResult;
	content?: RenderResult;
	actionButtons?: RenderResult;
}

const factory = create({ theme })
	.properties<ResultProperties>()
	.children<ResultChildren | undefined>();

export const Result = factory(function Result({ children, properties, middleware: { theme } }) {
	const themeCss = theme.classes(css);
	const { title, subtitle, status, classes, variant } = properties();
	const { actionButtons, content, icon } = children()[0] || ({} as ResultChildren);

	return (
		<div key="root" classes={[theme.variant(), themeCss.root]}>
			{(icon || status) && (
				<div
					key="iconWrapper"
					classes={[
						themeCss.iconWrapper,
						status ? themeCss[status] : null,
						status && !icon ? themeCss.statusIcon : null
					]}
				>
					{icon ? (
						icon
					) : (
						<Icon
							key="icon"
							type={StatusIcon[status as ResultStatus]}
							theme={theme.compose(
								iconCss,
								css,
								'icon'
							)}
							classes={classes}
							variant={variant}
						/>
					)}
				</div>
			)}
			{title && (
				<div classes={themeCss.titleWrapper}>
					{<h2 classes={themeCss.title}>{title}</h2>}
					{subtitle && <h3 classes={themeCss.subtitle}>{subtitle}</h3>}
				</div>
			)}
			{content && <div classes={themeCss.contentWrapper}>{content}</div>}
			{actionButtons && (
				<div key="actions" classes={themeCss.actions}>
					{actionButtons && <div classes={themeCss.actionButtons}>{actionButtons}</div>}
				</div>
			)}
		</div>
	);
});

export default Result;
