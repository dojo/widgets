import * as css from '../theme/default/accordion-pane.m.css';
import * as titlePaneCss from '../theme/default/title-pane.m.css';
import theme from '../middleware/theme';
import { RenderResult } from '@dojo/framework/core/interfaces';
import { TitlePane, TitlePaneProperties, TitlePaneChildren } from '../title-pane';
import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';

const paneFactory = create({ theme })
	.properties<TitlePaneProperties>()
	.children<TitlePaneChildren>();

export interface AccordionPaneProperties {
	/* If true, only one TitlePane can be opened at a given time */
	exclusive?: boolean;
}

export interface AccordionPaneChildren {
	(
		pane: typeof TitlePane,
		open: (key: string | number) => TitlePaneProperties['open'],
		onOpen: (key: string | number) => TitlePaneProperties['onOpen'],
		onClose: (key: string | number) => TitlePaneProperties['onClose']
	): RenderResult;
}

interface AccordionPaneICache {
	openKeys: {
		[key: string]: boolean;
	};
	Pane: typeof TitlePane;
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
	const { exclusive, theme: themeProp } = properties();

	const onOpen = (key: string | number) => {
		return () => {
			icache.set('openKeys', {
				...(exclusive ? {} : icache.get('openKeys')),
				[key]: true
			});
		};
	};

	const onClose = (key: string | number) => {
		return () => {
			const openKeys = icache.get('openKeys') || {};
			icache.set('openKeys', {
				...openKeys,
				[key]: false
			});
		};
	};

	const open = (key: string | number) => {
		const openKeys: AccordionPaneICache['openKeys'] = icache.get('openKeys') || {};
		return !!openKeys[key];
	};

	const Pane = icache.getOrSet('Pane', () =>
		paneFactory(function Pane({
			children: paneChildren,
			id,
			properties: paneProperties,
			middleware: { theme: paneTheme }
		}) {
			const { key = id } = paneProperties();

			const localTheme = paneTheme.compose(
				titlePaneCss,
				css,
				'pane'
			);

			console.log(localTheme);

			return (
				<div classes={paneTheme.variant()}>
					<TitlePane
						key={key}
						onClose={onClose(key)}
						onOpen={onOpen(key)}
						open={open(key)}
						theme={localTheme}
					>
						{paneChildren()[0]}
					</TitlePane>
				</div>
			);
		})
	);

	return (
		<div classes={[theme.variant(), classes.root]}>{renderer(Pane, open, onOpen, onClose)}</div>
	);
});

export default AccordionPane;
