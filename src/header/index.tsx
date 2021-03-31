import { RenderResult } from '@dojo/framework/core/interfaces';
import { create, tsx } from '@dojo/framework/core/vdom';
import { LinkProperties } from '@dojo/framework/routing/interfaces';
import Link from '@dojo/framework/routing/Link';
import ActionButton, { ActionButtonProperties } from '../action-button';
import theme from '../middleware/theme';
import * as css from '../theme/default/header.m.css';

export type ActionProperties = LinkProperties | ActionButtonProperties;

const actionFactory = create({ theme }).properties<ActionProperties>();

function IsLink(properties: ActionProperties): properties is LinkProperties {
	return Boolean(properties && properties.hasOwnProperty('to'));
}

export const Action = actionFactory(({ properties, children, middleware: { theme } }) => {
	const themedCss = theme.classes(css);
	const props = properties();

	if (IsLink(props)) {
		return (
			<Link {...props} classes={[theme.variant(), themedCss.action]}>
				{children()}
			</Link>
		);
	} else {
		return <ActionButton {...props}>{children()}</ActionButton>;
	}
});

export interface HeaderProperties {
	/** Determines if this header is fixed */
	sticky?: boolean;
}

export type HeaderChildren = {
	/** Renderer for leading elements like icons */
	leading?: RenderResult;
	/** Renderer for the header title */
	title: RenderResult;
	/** Renderer for header actions like links */
	actions?: RenderResult;
	/** Renderer for trailing elements like search inputs */
	trailing?: RenderResult;
};

const factory = create({ theme })
	.properties<HeaderProperties>()
	.children<HeaderChildren>();

export const Header = factory(function Header({ children, properties, middleware: { theme } }) {
	const classes = theme.classes(css);
	const { sticky } = properties();
	const { actions, leading, title, trailing } = children()[0];

	return (
		<header key="header" classes={[theme.variant(), sticky ? classes.spacer : undefined]}>
			<div classes={[classes.root, sticky && classes.sticky]} key="root">
				<div classes={classes.row}>
					<div classes={classes.primary} key="primary">
						{leading && <div classes={classes.leading}>{leading}</div>}
						<div classes={classes.title} key="title">
							{title && title}
						</div>
					</div>
					<div classes={classes.secondary} key="secondary">
						<nav classes={classes.actions} key="actions">
							{actions}
						</nav>
						{trailing && <div classes={classes.trailing}>{trailing}</div>}
					</div>
				</div>
			</div>
		</header>
	);
});

export default Header;
