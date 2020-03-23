import theme from '@dojo/framework/core/middleware/theme';
import { create, tsx } from '@dojo/framework/core/vdom';

import * as css from '../theme/default/breadcrumb.m.css';

export interface BreadcrumbItem {
	[key: string]: any;

	href?: string;
	label: string;
	title?: string;
}

export interface BreadcrumbProperties {
	current?: 'page' | 'step';
	item: BreadcrumbItem;
}

const factory = create({ theme }).properties<BreadcrumbProperties>();

export const Breadcrumb = factory(function Breadcrumb({ middleware: { theme }, properties }) {
	const { current, item } = properties();
	const themeCss = theme.classes(css);

	return item.href ? (
		<a
			aria-current={current || undefined}
			classes={themeCss.root}
			href={item.href}
			title={item.title}
		>
			{item.label}
		</a>
	) : (
		<span aria-current={current || undefined} classes={themeCss.root}>
			{item.label}
		</span>
	);
});

export default Breadcrumb;
