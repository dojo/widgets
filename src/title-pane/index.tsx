import dimensions from '@dojo/framework/core/middleware/dimensions';
import focus from '@dojo/framework/core/middleware/focus';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { create, tsx } from '@dojo/framework/core/vdom';

import Icon from '../icon';
import theme from '../middleware/theme';
import * as css from '../theme/default/title-pane.m.css';
import * as fixedCss from './styles/title-pane.m.css';

export interface TitlePaneProperties {
	/** If false the pane will not collapse in response to clicking the title */
	closeable?: boolean;
	/** 'aria-level' for the title's DOM node */
	headingLevel?: number;
	/** If true the pane is opened and content is visible initially */
	initialOpen?: boolean;
	/** Explicitly control TitlePane */
	open?: boolean;
	/** Called when the title of a closed pane is clicked */
	onClose?(): void;
	/** Called when the title of an open pane is clicked */
	onOpen?(): void;
	/** The displayed title name for this pane */
	name: string;
}

export interface TitlePaneICache {
	initialOpen?: boolean;
	open?: boolean;
}

const factory = create({
	dimensions,
	focus,
	icache: createICacheMiddleware<TitlePaneICache>(),
	theme
}).properties<TitlePaneProperties>();

export const TitlePane = factory(function TitlePane({
	id,
	children,
	properties,
	middleware: { dimensions, focus, icache, theme }
}) {
	const themeCss = theme.classes(css);
	const {
		closeable = true,
		headingLevel,
		initialOpen,
		onClose,
		onOpen,
		name,
		theme: themeProp,
		classes,
		variant
	} = properties();
	let { open } = properties();

	const firstRender = icache.get('open') === undefined;
	if (open === undefined) {
		open = icache.get('open');
		const existingInitialOpen = icache.get('initialOpen');

		if (initialOpen !== existingInitialOpen) {
			icache.set('open', initialOpen);
			icache.set('initialOpen', initialOpen);
			open = initialOpen;
		}
	}

	return (
		<div
			classes={[
				theme.variant(),
				themeCss.root,
				open ? themeCss.open : null,
				fixedCss.rootFixed
			]}
		>
			<div
				aria-level={headingLevel ? `${headingLevel}` : undefined}
				classes={[
					themeCss.title,
					closeable ? themeCss.closeable : null,
					fixedCss.titleFixed,
					closeable ? fixedCss.closeableFixed : null
				]}
				role="heading"
			>
				<button
					aria-controls={`${id}-content`}
					aria-expanded={open ? 'true' : 'false'}
					disabled={!closeable}
					classes={[fixedCss.titleButtonFixed, themeCss.titleButton]}
					focus={focus.isFocused('title-button')}
					key="title-button"
					onclick={(event: MouseEvent) => {
						event.stopPropagation();
						icache.set('open', !open);
						if (open) {
							onClose && onClose();
						} else {
							onOpen && onOpen();
						}
					}}
					type="button"
				>
					<span classes={themeCss.arrow}>
						<Icon
							type={open ? 'downIcon' : 'rightIcon'}
							theme={themeProp}
							classes={classes}
							variant={variant}
						/>
					</span>
					{name}
				</button>
			</div>
			<div
				aria-hidden={open ? undefined : 'true'}
				aria-labelledby={`${id}-title`}
				classes={[
					themeCss.content,
					!firstRender && themeCss.contentTransition,
					fixedCss.contentFixed
				]}
				id={`${id}-content`}
				key="content"
				styles={{
					marginTop: open ? '0px' : `-${dimensions.get('content').offset.height}px`
				}}
			>
				{children()}
			</div>
		</div>
	);
});

export default TitlePane;
