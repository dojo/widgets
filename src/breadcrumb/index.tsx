import { DNode, RenderResult } from '@dojo/framework/core/interfaces';
import theme from '@dojo/framework/core/middleware/theme';
import { create, tsx } from '@dojo/framework/core/vdom';

import * as css from '../theme/default/breadcrumb.m.css';
import * as fixedCss from './styles/breadcrumb.m.css';

export interface BreadcrumbItem {
	[key: string]: any;

	label: DNode;
}

export interface BreadcrumbProperties {
	current?: number;
	itemLevel?: 'page' | 'step';
	items: BreadcrumbItem[];
	label: string;
	separator?: DNode;
}

export interface BreadcrumbChildren {
	(item: BreadcrumbItem, current: boolean): RenderResult;
}

const factory = create({ theme })
	.properties<BreadcrumbProperties>()
	.children<BreadcrumbChildren | undefined>();

export const Breadcrumb = factory(function Breadcrumb({
	children,
	properties,
	middleware: { theme }
}) {
	const { current, itemLevel, items, label, separator = '/' } = properties();
	const themeCss = theme.classes(css);

	const defaultRenderer: BreadcrumbChildren = (item, isCurrent) => {
		const itemProperties = isCurrent ? { 'aria-current': itemLevel || 'page' } : {};
		return (
			<span {...itemProperties} classes={[fixedCss.labelFixed, themeCss.label]}>
				{item.label}
			</span>
		);
	};
	const [itemRenderer = defaultRenderer] = children();

	return (
		<nav classes={themeCss.root} aria-label={label}>
			<ol classes={[fixedCss.listFixed, themeCss.list]}>
				{items.map((item, index) => {
					const isCurrent = current === index;
					return (
						<virtual>
							{index !== 0 && (
								<li
									key={`breadcrumb-${index}-separator`}
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
								key={`breadcrumb-${index}`}
							>
								{itemRenderer(item, isCurrent)}
							</li>
						</virtual>
					);
				})}
			</ol>
		</nav>
	);
});

export default Breadcrumb;
