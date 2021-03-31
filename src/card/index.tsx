import { RenderResult } from '@dojo/framework/core/interfaces';
import { create, tsx } from '@dojo/framework/core/vdom';
import ActionButton, { ActionButtonProperties } from '../action-button/index';
import Icon, { IconProperties } from '../icon/index';
import theme from '../middleware/theme';
import * as css from '../theme/default/card.m.css';

export interface ActionProperties extends ActionButtonProperties {}

const actionFactory = create().properties<ActionProperties>();

export const Action = actionFactory(({ properties, children }) => {
	const action = <ActionButton {...properties()}>{children()}</ActionButton>;

	return action;
});

export interface ActionIconProperties extends IconProperties {}

const actionIconFactory = create().properties<ActionIconProperties>();

export const ActionIcon = actionIconFactory(({ properties, children }) => {
	const action = <Icon {...properties()}>{children()}</Icon>;

	return action;
});

export interface CardProperties {
	onAction?: () => void;
	mediaSrc?: string;
	mediaTitle?: string;
	square?: boolean;
	title?: string;
	subtitle?: string;
	outlined?: boolean;
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
	const {
		onAction,
		mediaSrc,
		mediaTitle,
		square,
		title,
		subtitle,
		outlined = false
	} = properties();
	const { header, content, actionButtons, actionIcons } = children()[0] || ({} as CardChildren);

	return (
		<div key="root" classes={[theme.variant(), themeCss.root, outlined && themeCss.outlined]}>
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
