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
			/** Renderer for header actions like links */
			actionsRenderer?(): RenderResult;
			/** Renderer for leading elements like icons */
			leadingRenderer?(): RenderResult;
			/** Renderer for the header title */
			titleRenderer?(): RenderResult;
			/** Renderer for trailing elements like search inputs */
			trailingRenderer?(): RenderResult;
	  }
	| undefined;

const factory = create({ theme })
	.properties<HeaderProperties>()
	.children<HeaderChildren>();

export const Header = factory(function Header({ children, properties, middleware: { theme } }) {
	const classes = theme.classes(css);
	const { sticky } = properties();
	const {
		actionsRenderer = undefined,
		leadingRenderer = undefined,
		titleRenderer = undefined,
		trailingRenderer = undefined
	} = children()[0] || {};

	const actions = actionsRenderer && actionsRenderer();

	return (
		<div classes={[classes.root, sticky && classes.sticky]}>
			<div classes={classes.row}>
				<div classes={classes.primary} key="primary">
					{leadingRenderer && <div classes={classes.leading}>{leadingRenderer()}</div>}
					<div classes={classes.title} key="title">
						{titleRenderer && titleRenderer()}
					</div>
				</div>
				<div classes={classes.secondary} key="secondary">
					<div classes={classes.actions} key="actions">
						{actions &&
							(Array.isArray(actions) ? actions : [actions]).map((action) => (
								<div classes={classes.action}>{action}</div>
							))}
					</div>
					{trailingRenderer && <div classes={classes.trailing}>{trailingRenderer()}</div>}
				</div>
			</div>
		</div>
	);
});

export default Header;
