import theme from '@dojo/framework/core/middleware/theme';
import { create, tsx } from '@dojo/framework/core/vdom';

import * as css from '../theme/default/breadcrumb.m.css';

export interface BreadcrumbProperties {
	current?: 'page' | 'step';
	href?: string;
	label: string;
	title?: string;
}

const factory = create({ theme }).properties<BreadcrumbProperties>();

export const Breadcrumb = factory(function Breadcrumb({ middleware: { theme }, properties }) {
	const { current, href, label, title } = properties();
	const themeCss = theme.classes(css);

	return href ? (
		<a aria-current={current || undefined} classes={themeCss.root} href={href} title={title}>
			{label}
		</a>
	) : (
		<span aria-current={current || undefined} classes={themeCss.root}>
			{label}
		</span>
	);
});

export default Breadcrumb;
