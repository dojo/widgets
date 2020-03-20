import { RenderResult } from '@dojo/framework/core/interfaces';
import theme from '@dojo/framework/core/middleware/theme';
import { create, tsx } from '@dojo/framework/core/vdom';

import * as css from '../theme/default/breadcrumb.m.css';
import { Crumb, CrumbItem } from './Crumb';
import * as fixedCss from './styles/breadcrumb.m.css';

export interface BreadcrumbProperties {
	items: CrumbItem[];
	label: string;
}

export interface BreadcrumbChildren {
	(items: CrumbItem[]): RenderResult;
}

const factory = create({ theme })
	.properties<BreadcrumbProperties>()
	.children<BreadcrumbChildren | undefined>();

export const Breadcrumb = factory(function Breadcrumb({
	children,
	properties,
	middleware: { theme }
}) {
	const { items, label } = properties();
	const themeCss = theme.classes(css);

	const defaultRenderer: BreadcrumbChildren = (items: CrumbItem[]) => {
		const lastIndex = items.length - 1;

		return (
			<ol classes={[fixedCss.listFixed, themeCss.list]}>
				{items.map((item, index) => (
					<li
						classes={[
							fixedCss.listItemFixed,
							themeCss.listItem,
							index === lastIndex ? themeCss.current : undefined
						]}
						key={`breadcrumb-${index}`}
					>
						<Crumb item={item} current={index === lastIndex ? 'page' : undefined} />
					</li>
				))}
			</ol>
		);
	};
	const [renderer = defaultRenderer] = children();

	return (
		<nav classes={themeCss.root} aria-label={label}>
			{renderer(items)}
		</nav>
	);
});

export default Breadcrumb;
