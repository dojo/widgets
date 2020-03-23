import { RenderResult } from '@dojo/framework/core/interfaces';
import theme from '@dojo/framework/core/middleware/theme';
import { create, tsx } from '@dojo/framework/core/vdom';

import { Breadcrumb, BreadcrumbItem } from '../breadcrumb';
import * as css from '../theme/default/breadcrumb-group.m.css';
import * as fixedCss from './styles/breadcrumb-group.m.css';

export interface BreadcrumbGroupProperties {
	items: BreadcrumbItem[];
	label: string;
}

export interface BreadcrumbGroupChildren {
	(items: BreadcrumbItem[]): RenderResult;
}

const factory = create({ theme })
	.properties<BreadcrumbGroupProperties>()
	.children<BreadcrumbGroupChildren | undefined>();

export const BreadcrumbGroup = factory(function BreadcrumbGroup({
	children,
	properties,
	middleware: { theme }
}) {
	const { items, label } = properties();
	const themeCss = theme.classes(css);

	const defaultRenderer: BreadcrumbGroupChildren = (items: BreadcrumbItem[]) => {
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
						<Breadcrumb
							item={item}
							current={index === lastIndex ? 'page' : undefined}
						/>
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

export default BreadcrumbGroup;
