import { tsx, create } from '@dojo/framework/core/vdom';
import { RenderResult } from '@dojo/framework/core/interfaces';
import * as css from '../theme/default/card.m.css';
import theme from '../middleware/theme';

export interface CardProperties {
	onAction?: () => void;
	mediaSrc?: string;
	mediaTitle?: string;
	square?: boolean;
	title?: string;
	subtitle?: string;
}

export interface CardChildren {
	header?: RenderResult;
	content?: RenderResult;
	actionButtons?: RenderResult;
	actionIcons?: RenderResult;
}

const factory = create({ theme })
	.properties<CardProperties>()
	.children<CardChildren | undefined>();

export const Card = factory(function Card({ children, properties, middleware: { theme } }) {
	const themeCss = theme.classes(css);
	const { onAction, mediaSrc, mediaTitle, square, title, subtitle } = properties();
	const { header, content, actionButtons, actionIcons } = children()[0] || ({} as CardChildren);

	return (
		<div key="root" classes={[theme.variant(), themeCss.root]}>
			{header && (
				<div key="header" classes={themeCss.header}>
					{header}
				</div>
			)}
			<div
				key="content"
				classes={[themeCss.content, onAction ? themeCss.primary : null]}
				onClick={() => onAction && onAction()}
			>
				{mediaSrc && (
					<div
						title={mediaTitle}
						classes={[
							themeCss.media,
							square ? themeCss.mediaSquare : themeCss.media16by9
						]}
						styles={{
							backgroundImage: `url("${mediaSrc}")`
						}}
					/>
				)}
				{title && (
					<div classes={themeCss.titleWrapper}>
						{<h2 classes={themeCss.title}>{title}</h2>}
						{subtitle && <h3 classes={themeCss.subtitle}>{subtitle}</h3>}
					</div>
				)}
				{content && <div classes={themeCss.contentWrapper}>{content}</div>}
			</div>
			{(actionButtons || actionIcons) && (
				<div key="actions" classes={themeCss.actions}>
					{actionButtons && <div classes={themeCss.actionButtons}>{actionButtons}</div>}
					{actionIcons && <div classes={themeCss.actionIcons}>{actionIcons}</div>}
				</div>
			)}
		</div>
	);
});

export default Card;
