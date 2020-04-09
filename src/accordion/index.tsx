import * as css from '../theme/default/accordion.m.css';
import * as titlePaneCss from '../theme/default/title-pane.m.css';
import TitlePane, { TitlePaneProperties, TitlePaneChildren } from '../title-pane';
import theme from '../middleware/theme';
import { RenderResult } from '@dojo/framework/core/interfaces';
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
		open: (key: string) => TitlePaneProperties['open']
	): RenderResult;
}

interface AccordionPaneICache {
	openKeys: {
		[key: string]: boolean;
	};
}

const paneFactory = create({ theme })
	.properties<TitlePaneProperties>()
	.children<TitlePaneChildren>();

export const Pane = paneFactory(function Pane({ children, middleware: { theme }, properties }) {
	return (
		<TitlePane
			{...properties()}
			theme={theme.compose(
				titlePaneCss,
				css,
				'pane'
			)}
		>
			{children()[0]}
		</TitlePane>
	);
});

const icache = createICacheMiddleware<AccordionPaneICache>();

const factory = create({
	icache,
	theme
})
	.properties<AccordionPaneProperties>()
	.children<AccordionPaneChildren>();

export const Accordion = factory(function LoadingIndicator({
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

	const open = (key: string) => {
		const openKeys: AccordionPaneICache['openKeys'] = icache.get('openKeys') || {};
		return !!openKeys[key];
	};

	return <div classes={[theme.variant(), classes.root]}>{renderer(onOpen, onClose, open)}</div>;
});

export default Accordion;
