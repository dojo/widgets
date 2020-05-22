import { create, tsx } from '@dojo/framework/core/vdom';
import theme from '../middleware/theme';
import List, { ListOption, defaultTransform as listTransform } from '../list/index';
import * as menuCss from '../theme/default/list.m.css';
import * as css from '../theme/default/context-menu.m.css';
import ContextPopup from '../context-popup';
import { createResourceMiddleware } from '@dojo/framework/core/middleware/resources';

export interface ContextMenuProperties {
	/* A callback that will be called with the value of whatever item is selected */
	onSelect(value: string): void;
}

const factory = create({ theme, resource: createResourceMiddleware<ListOption>() }).properties<
	ContextMenuProperties
>();

export const defaultTransform = listTransform;

export const ContextMenu = factory(function({ properties, children, middleware: { theme } }) {
	const { resource, onSelect } = properties();
	return (
		<ContextPopup>
			{{
				trigger: children(),
				content: ({ close, shouldFocus }) => (
					<List
						key="menu"
						focus={shouldFocus}
						theme={theme.compose(
							menuCss,
							css,
							'menu'
						)}
						menu
						resource={resource}
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
