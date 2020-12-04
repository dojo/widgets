import { RenderResult } from '@dojo/framework/core/interfaces';
import theme from '../middleware/theme';
import { create, tsx } from '@dojo/framework/core/vdom';

import * as css from '../theme/default/breadcrumb-group.m.css';
import * as fixedCss from './styles/breadcrumb-group.m.css';

export interface BreadcrumbItem {
	[key: string]: any;

	href?: string;
	label: string;
	title?: string;
}

export interface BreadcrumbProperties {
	current?: 'page' | 'step';
	href?: string;
	title?: string;
}

export interface BreadcrumbGroupProperties {
	items: BreadcrumbItem[];
	label: string;
}

export interface BreadcrumbGroupChildren {
	(items: BreadcrumbItem[]): RenderResult;
}

const separatorFactory = create({ theme });

export const Separator = separatorFactory(function Separator({ children, middleware: { theme } }) {
	const themeCss = theme.classes(css);

	return (
		<li aria-hidden="true" classes={themeCss.listItem}>
			<span classes={[fixedCss.separatorFixed, themeCss.separator]}>{children()}</span>
		</li>
	);
});

export { Separator as BreadcrumbSeparator };

const breadcrumbFactory = create({ theme }).properties<BreadcrumbProperties>();

export const Breadcrumb = breadcrumbFactory(function Breadcrumb({
	children,
	middleware: { theme },
	properties
}) {
	const { current, href, title } = properties();
	const themeCss = theme.classes(css);

	return (
		<li classes={[themeCss.listItem, current ? themeCss.current : undefined]}>
			{href ? (
				<a
					aria-current={current || undefined}
					classes={[fixedCss.breadcrumbFixed, themeCss.breadcrumb]}
					href={href}
					title={title}
				>
					{children()}
				</a>
			) : (
				<span
					aria-current={current || undefined}
					classes={[fixedCss.breadcrumbFixed, themeCss.breadcrumb]}
				>
					{children()}
				</span>
			)}
		</li>
	);
});

const factory = create({ theme })
	.properties<BreadcrumbGroupProperties>()
	.children<BreadcrumbGroupChildren | undefined>();

export const BreadcrumbGroup = factory(function BreadcrumbGroup({
	children,
	properties,
	middleware: { theme }
}) {
	const { items, label, classes, theme: themeProp, variant } = properties();
	const themeCss = theme.classes(css);

	const defaultRenderer: BreadcrumbGroupChildren = (items: BreadcrumbItem[]) => {
		const lastIndex = items.length - 1;

		return items.map((item, index) => (
			<virtual>
				{index !== 0 && <Separator key={`breadcrumb-${index}-separator`}>/</Separator>}
				<Breadcrumb
					key={`breadcrumb-${index}`}
					current={index === lastIndex ? 'page' : undefined}
					href={item.href}
					title={item.title}
					classes={classes}
					theme={themeProp}
					variant={variant}
				>
					{item.label}
				</Breadcrumb>
			</virtual>
		));
	};
	const [renderer = defaultRenderer] = children();

	return (
		<nav classes={[theme.variant(), themeCss.root]} aria-label={label}>
			<ol classes={[fixedCss.listFixed, themeCss.list]}>{renderer(items)}</ol>
		</nav>
	);
});

export default BreadcrumbGroup;
