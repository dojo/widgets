import { DNode } from '@dojo/framework/core/interfaces';
import theme from '@dojo/framework/core/middleware/theme';
import { create, tsx } from '@dojo/framework/core/vdom';

import * as css from './Breadcrumb.m.css';

export interface BreadcrumbItem {
	href?: string;
	key: string;
	label: DNode;
	title?: string;
}

export interface BreadcrumbProperties {
	current?: number;
	itemLevel?: 'page' | 'step';
	items: BreadcrumbItem[];
	label: string;
	separator?: DNode;
}

const factory = create({ theme }).properties<BreadcrumbProperties>();

const empty = Object.create(null);

export const Breadcrumb = factory(function Breadcrumb({ middleware: { theme }, properties }) {
	const { current, itemLevel, items, label, separator = '/' } = properties();
	const themeCss = theme.classes(css);

	return (
		<nav classes={themeCss.root} aria-label={label}>
			<ol classes={[css.listFixed, themeCss.list]}>
				{items.map(({ href, key, label, title }, index) => {
					const Tag = href ? 'a' : 'span';
					const hrefProperties = href ? { href, title } : empty;
					const currentProperties =
						current === index ? { 'aria-current': itemLevel || 'page' } : empty;

					const properties = {
						...hrefProperties,
						...currentProperties
					};

					return (
						<li
							classes={[
								themeCss.listItem,
								typeof separator === 'string'
									? themeCss.withTextSeparator
									: undefined,
								current === index ? themeCss.current : undefined
							]}
							data-separator={typeof separator === 'string' ? separator : undefined}
							key={key}
						>
							{separator && typeof separator !== 'string' && index !== 0 && (
								<span aria-hidden="true">{separator}</span>
							)}
							<Tag {...properties}>{label}</Tag>
						</li>
					);
				})}
			</ol>
		</nav>
	);
});

export default Breadcrumb;
