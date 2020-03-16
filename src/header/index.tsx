import * as css from '../theme/default/header.m.css';
import theme from '../middleware/theme';
import { RenderResult } from '@dojo/framework/core/interfaces';
import { ThemedProperties } from '@dojo/framework/core/mixins/Themed';
import { create, tsx } from '@dojo/framework/core/vdom';

export interface HeaderProperties extends ThemedProperties {
	/** Determines if this header is fixed */
	sticky?: boolean;
}

export type HeaderChildren =
	| {
			/** Renderer for leading elements like icons */
			leading?(): RenderResult;
			/** Renderer for the header title */
			title?(): RenderResult;
			/** Renderer for header actions like links */
			actions?(): RenderResult;
			/** Renderer for trailing elements like search inputs */
			trailing?(): RenderResult;
	  }
	| undefined;

const factory = create({ theme })
	.properties<HeaderProperties>()
	.children<HeaderChildren>();

export const Header = factory(function Header({ children, properties, middleware: { theme } }) {
	const classes = theme.classes(css);
	const { sticky } = properties();
	const { actions = undefined, leading = undefined, title = undefined, trailing = undefined } =
		children()[0] || {};

	const actionElements = actions && actions();

	return (
		<virtual key="virtual">
			<div classes={[classes.root, sticky && classes.sticky]} key="root">
				<div classes={classes.row}>
					<div classes={classes.primary} key="primary">
						{leading && <div classes={classes.leading}>{leading()}</div>}
						<div classes={classes.title} key="title">
							{title && title()}
						</div>
					</div>
					<div classes={classes.secondary} key="secondary">
						<div classes={classes.actions} key="actions">
							{actions &&
								(Array.isArray(actionElements)
									? actionElements
									: [actionElements]
								).map((action) => <div classes={classes.action}>{action}</div>)}
						</div>
						{trailing && <div classes={classes.trailing}>{trailing()}</div>}
					</div>
				</div>
			</div>
			{sticky && <div classes={classes.spacer} />}
		</virtual>
	);
});

export default Header;
