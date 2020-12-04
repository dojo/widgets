import * as css from '../theme/default/accordion.m.css';
import * as titlePaneCss from '../theme/default/title-pane.m.css';
import TitlePane from '../title-pane';
import theme from '../middleware/theme';
import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { RenderResult } from '@dojo/framework/core/interfaces';

export interface AccordionPaneProperties {
	/* If true, only one TitlePane can be opened at a given time */
	exclusive?: boolean;
	/* The pane names */
	panes: string[];
}
interface AccordionPaneICache {
	openIndexes: Set<number>;
}

const icache = createICacheMiddleware<AccordionPaneICache>();

const factory = create({
	icache,
	theme
})
	.properties<AccordionPaneProperties>()
	.children<RenderResult>();

export const Accordion = factory(function Accordion({
	middleware: { icache, theme },
	properties,
	children
}) {
	const themedCss = theme.classes(css);
	const { exclusive, panes, variant, classes } = properties();

	const openIndexes = icache.getOrSet('openIndexes', new Set());

	const onOpen = (index: number) => {
		if (exclusive) {
			icache.set('openIndexes', new Set([index]));
		} else {
			const openIndexes = icache.getOrSet('openIndexes', new Set());
			openIndexes.add(index);
			icache.set('openIndexes', openIndexes);
		}
	};

	const onClose = (index: number) => {
		const openIndexes = icache.getOrSet('openIndexes', new Set());
		openIndexes.delete(index);
		icache.set('openIndexes', openIndexes);
	};

	return (
		<div classes={[theme.variant(), themedCss.root]}>
			{panes.map((paneName, index) => {
				return (
					<TitlePane
						key={`pane-${index}`}
						open={openIndexes.has(index)}
						onOpen={() => {
							onOpen(index);
						}}
						onClose={() => {
							onClose(index);
						}}
						theme={theme.compose(
							titlePaneCss,
							css,
							'pane'
						)}
						classes={classes}
						variant={variant}
						name={paneName}
					>
						{children()[index]}
					</TitlePane>
				);
			})}
		</div>
	);
});

export default Accordion;
