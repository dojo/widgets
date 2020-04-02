import { create, tsx } from '@dojo/framework/core/vdom';
import theme from '../middleware/theme';
import Card, { CardProperties, CardChildren } from '../card';
import { RenderResult } from '@dojo/framework/core/interfaces';
import * as css from '../theme/default/header-card.m.css';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface HeaderCardProperties extends CardProperties {
	title: string;
}

export interface HeaderCardChildren extends Omit<CardChildren, 'header'> {
	avatar?: RenderResult;
}

const factory = create({ theme })
	.properties<HeaderCardProperties>()
	.children<HeaderCardChildren | undefined>();

export const HeaderCard = factory(function HeaderCard({
	middleware: { theme },
	properties,
	children
}) {
	const themeCss = theme.classes(css);
	const { title, subtitle, ...cardProps } = properties();
	const [{ avatar, ...cardChildren } = {} as HeaderCardChildren] = children();
	return (
		<Card key="root" {...cardProps}>
			{{
				header: (
					<div key="header" classes={themeCss.header}>
						{avatar && <div classes={themeCss.avatar}>{avatar}</div>}
						<div key="headerContent" classes={themeCss.headerContent}>
							{<h2 classes={themeCss.title}>{title}</h2>}
							{subtitle && <h3 classes={themeCss.subtitle}>{subtitle}</h3>}
						</div>
					</div>
				),
				...cardChildren
			}}
		</Card>
	);
});

export default HeaderCard;
