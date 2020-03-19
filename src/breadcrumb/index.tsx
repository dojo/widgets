import { DNode } from '@dojo/framework/core/interfaces';
import theme from '@dojo/framework/core/middleware/theme';
import { create, tsx } from '@dojo/framework/core/vdom';

import * as css from '../theme/default/breadcrumb.m.css';
import * as fixedCss from './styles/breadcrumb.m.css';

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
			<ol classes={[fixedCss.listFixed, themeCss.list]}>
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
						<virtual>
							{index !== 0 && (
								<li
									key={`${key}-separator`}
									aria-hidden="true"
									classes={[
										fixedCss.listItemFixed,
										themeCss.listItem,
										themeCss.separator
									]}
								>
									{separator}
								</li>
							)}
							<li
								classes={[
									fixedCss.listItemFixed,
									themeCss.listItem,
									current === index ? themeCss.current : undefined
								]}
								key={key}
							>
								<Tag {...properties}>{label}</Tag>
							</li>
						</virtual>
					);
				})}
			</ol>
		</nav>
	);
});

export default Breadcrumb;
