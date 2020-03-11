import { tsx, create } from '@dojo/framework/core/vdom';
import { RenderResult } from '@dojo/framework/core/interfaces';
import * as css from '../theme/default/card.m.css';
import theme, { ThemeProperties } from '../middleware/theme';

export interface CardProperties extends ThemeProperties {
	/** Renderer for action available from the card */
	actionsRenderer?(): RenderResult;
}

const factory = create({ theme }).properties<CardProperties>();

export const Card = factory(function Card({ children, properties, middleware: { theme } }) {
	const { actionsRenderer } = properties();
	const classes = theme.classes(css);

	return (
		<div key="root" classes={[theme.variant(), classes.root]}>
			{children()}
			{actionsRenderer && <div classes={[classes.actions]}>{actionsRenderer()}</div>}
		</div>
	);
});

export default Card;
