import * as css from '../theme/default/accordion-pane.m.css';
import * as titlePaneCss from '../theme/default/title-pane.m.css';
import theme from '../middleware/theme';
import { RenderResult, Theme } from '@dojo/framework/core/interfaces';
import { TitlePaneProperties } from '../title-pane';
import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';

export interface AccordionPaneProperties {
	/* If true, only one TitlePane can be opened at a given time */
	exclusive?: boolean;
}

export interface AccordionPaneChildren {
	(
		onOpen: (key: string) => TitlePaneProperties['onOpen'],
		onClose: (key: string) => TitlePaneProperties['onClose'],
		initialOpen: (key: string) => TitlePaneProperties['initialOpen'],
		theme: Theme
	): RenderResult;
}

interface AccordionPaneICache {
	openKeys: {
		[key: string]: boolean;
	};
}

const icache = createICacheMiddleware<AccordionPaneICache>();

const factory = create({
	icache,
	theme
})
	.properties<AccordionPaneProperties>()
	.children<AccordionPaneChildren>();

export const AccordionPane = factory(function LoadingIndicator({
	middleware: { icache, theme },
	properties,
	children
}) {
	const classes = theme.classes(css);
	const [renderer] = children();
	const { exclusive } = properties();

	const onOpen = (key: string) => {
		return () => {
			icache.set('openKeys', {
				...(exclusive ? {} : icache.get('openKeys')),
				[key]: true
			});
		};
	};

	const onClose = (key: string) => {
		return () => {
			const openKeys = icache.get('openKeys') || {};
			icache.set('openKeys', {
				...openKeys,
				[key]: false
			});
		};
	};

	const initialOpen = (key: string) => {
		const openKeys: AccordionPaneICache['openKeys'] = icache.get('openKeys') || {};
		return openKeys[key];
	};

	return (
		<div classes={classes.root}>
			{renderer(
				onOpen,
				onClose,
				initialOpen,
				theme.compose(
					titlePaneCss,
					css,
					'pane'
				)
			)}
		</div>
	);
});

export default AccordionPane;
