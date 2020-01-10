import { create, tsx } from '@dojo/framework/core/vdom';
import theme from '../middleware/theme';
import Menu, { MenuOption } from '../menu/index';
import * as menuCss from '../theme/default/menu.m.css';
import * as css from '../theme/default/context-menu.m.css';
import ContextPopup from '../context-popup';

export interface ContextMenuProperties {
	options: MenuOption[];
	onSelect(value: string): void;
}

const factory = create({ theme }).properties<ContextMenuProperties>();

export const ContextMenu = factory(function({ properties, children, middleware: { theme } }) {
	const { options, onSelect } = properties();
	return (
		<ContextPopup>
			{{
				trigger: () => children(),
				content: ({ close, shouldFocus }) => (
					<Menu
						key="menu"
						focus={shouldFocus}
						theme={theme.compose(
							menuCss,
							css,
							'menu'
						)}
						options={options}
						total={options.length}
						onBlur={close}
						onRequestClose={close}
						onValue={(value) => {
							close();
							onSelect(value);
						}}
					/>
				)
			}}
		</ContextPopup>
	);
});

export default ContextMenu;
