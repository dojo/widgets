import { tsx, create } from '@dojo/framework/core/vdom';
import { RenderResult } from '@dojo/framework/core/interfaces';
import * as css from '../theme/default/card.m.css';
import theme, { ThemeProperties } from '../middleware/theme';

export interface CardProperties extends ThemeProperties {
	square?: boolean;
	mediaSrc?: string;
	title?: string;
}

export interface CardChildren {
	header?: () => RenderResult;
	content?: () => RenderResult;
	actionButtons?: () => RenderResult;
	actionIcons?: () => RenderResult;
}

const factory = create({ theme })
	.properties<CardProperties>()
	.children<CardChildren>();

export const Card = factory(function Card({ children, properties, middleware: { theme } }) {
	const themeCss = theme.classes(css);
	const { square, mediaSrc, title } = properties();
	const { header, content, actionButtons, actionIcons } = children()[0];

	return (
		<div key="root" classes={[themeCss.root]}>
			{header && <div classes={themeCss.header}>{header()}</div>}
			<div classes={[themeCss.primary]}>
				{mediaSrc && (
					<div
						title={title}
						classes={[
							themeCss.media,
							square ? themeCss.mediaSquare : themeCss.media16by9
						]}
						styles={{
							backgroundImage: `url("${mediaSrc}")`
						}}
					/>
				)}
				{content && <div classes={themeCss.content}>{content()}</div>}
			</div>
			{(actionButtons || actionIcons) && (
				<div classes={themeCss.actions}>
					{actionButtons && <div classes={themeCss.actionButtons}>{actionButtons()}</div>}
					{actionIcons && <div classes={themeCss.actionIcons}>{actionIcons()}</div>}
				</div>
			)}
		</div>
	);
});

export default Card;
