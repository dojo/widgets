import theme from '@dojo/framework/core/middleware/theme';
import { create, tsx } from '@dojo/framework/core/vdom';

import * as css from '../theme/default/crumb.m.css';

export interface CrumbItem {
	[key: string]: any;

	href?: string;
	label: string;
	title?: string;
}

export interface CrumbProperties {
	current?: 'page' | 'step';
	item: CrumbItem;
}

const factory = create({ theme }).properties<CrumbProperties>();

export const Crumb = factory(function Crumb({ middleware: { theme }, properties }) {
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

export default Crumb;
