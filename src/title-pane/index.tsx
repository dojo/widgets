import * as css from '../theme/default/title-pane.m.css';
import * as fixedCss from './styles/title-pane.m.css';
import Icon from '../icon';
import dimensions from '@dojo/framework/core/middleware/dimensions';
import focus from '@dojo/framework/core/middleware/focus';
import theme from '../middleware/theme';
import { RenderResult } from '@dojo/framework/core/interfaces';
import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';

export interface TitlePaneProperties {
	/** If false the pane will not collapse in response to clicking the title */
	closeable?: boolean;
	/** 'aria-level' for the title's DOM node */
	headingLevel?: number;
	/** If true the pane is opened and content is visible initially */
	initialOpen?: boolean;
	/** Called when the title of a closed pane is clicked */
	onClose?(): void;
	/** Called when the title of an open pane is clicked */
	onOpen?(): void;
}

export interface TitlePaneICache {
	initialOpen?: boolean;
	open?: boolean;
}

export type TitlePaneChildren = {
	/** Renderer for the pane content */
	content?(): RenderResult;
	/** Renderer for the pane title */
	title(): RenderResult;
};

const factory = create({
	dimensions,
	focus,
	icache: createICacheMiddleware<TitlePaneICache>(),
	theme
})
	.properties<TitlePaneProperties>()
	.children<TitlePaneChildren>();

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
		theme: themeProp
	} = properties();
	const { content, title } = children()[0];

	let open = icache.get('open');
	let performTransition = false;
	const existingInitialOpen = icache.get('initialOpen');
	if (existingInitialOpen !== initialOpen) {
		icache.set('open', initialOpen);
		icache.set('initialOpen', initialOpen);
		open = initialOpen;
		onOpen && onOpen();
		performTransition = true;
	}

	console.log(open ? '0px' : `-${dimensions.get('content').offset.height}px`);

	return (
		<div classes={[themeCss.root, open ? themeCss.open : null, fixedCss.rootFixed]}>
			<div
				aria-level={headingLevel ? `${headingLevel}` : null}
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
					aria-expanded={`${open}`}
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
						<Icon type={open ? 'downIcon' : 'rightIcon'} theme={themeProp} />
					</span>
					{title()}
				</button>
			</div>
			<div
				aria-hidden={open ? null : 'true'}
				aria-labelledby={`${id}-title`}
				classes={[
					themeCss.content,
					performTransition ? themeCss.contentTransition : null,
					fixedCss.contentFixed
				]}
				id={`${id}-content`}
				key="content"
				styles={{
					marginTop: open ? '0px' : `-${dimensions.get('content').offset.height}px`
				}}
			>
				{content && content()}
			</div>
		</div>
	);
});

export default TitlePane;
