import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import focus from '@dojo/framework/core/middleware/focus';
import dimensions from '@dojo/framework/core/middleware/dimensions';
import theme from '../middleware/theme';
import Menu, { MenuOption } from '../menu/index';
import * as menuCss from '../theme/default/menu.m.css';
import * as css from '../theme/default/context-menu.m.css';
import * as fixedCss from './context-menu.m.css';

export interface ContextMenuProperties {
	options: MenuOption[];
	onSelect(value: string): void;
}

interface ContextMenuICache {
	open: boolean;
	x: number;
	y: number;
}

const icache = createICacheMiddleware<ContextMenuICache>();
const factory = create({ icache, theme, focus, dimensions }).properties<ContextMenuProperties>();

const CursorWidth = 2;
const CursorHeight = 4;

export const ContextMenu = factory(function({
	properties,
	children,
	middleware: { icache, theme, focus, dimensions }
}) {
	function onClose() {
		icache.set('open', false);
	}
	const { options, onSelect } = properties();
	const open = icache.getOrSet('open', false);
	const x = icache.getOrSet('x', 0);
	const y = icache.getOrSet('y', 0);
	const wrapperDimensions = dimensions.get('wrapper');
	const bottomOfVisibleScreen =
		document.documentElement.scrollTop + document.documentElement.clientHeight;
	const willFit = y + wrapperDimensions.size.height <= bottomOfVisibleScreen;
	const classes = theme.classes(css);
	const wrapperStyles: { top: string; left: string; opacity: string } = {
		top: `${y - (willFit ? 0 : wrapperDimensions.size.height)}px`,
		left: `${x}px`,
		opacity: wrapperDimensions.size.height ? '1' : '0'
	};

	return (
		<virtual>
			<div
				classes={css.contentWrapper}
				key="content"
				oncontextmenu={(event: MouseEvent) => {
					event.preventDefault();
					focus.focus();
					icache.set('x', event.pageX - CursorWidth);
					icache.set('y', event.pageY - CursorHeight);
					icache.set('open', true);
				}}
			>
				{children()}
			</div>
			{open && (
				<body>
					<div key="underlay" classes={fixedCss.underlay} onclick={onClose} />
					<div
						key="wrapper"
						classes={[fixedCss.root, classes.wrapper]}
						styles={wrapperStyles}
					>
						<Menu
							key="menu"
							focus={focus.shouldFocus}
							theme={theme.compose(
								menuCss,
								css,
								'menu'
							)}
							options={options}
							onBlur={onClose}
							onRequestClose={onClose}
							onValue={(value) => {
								onClose();
								onSelect(value);
							}}
						/>
					</div>
				</body>
			)}
		</virtual>
	);
});

export default ContextMenu;
