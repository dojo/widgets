import i18n from '@dojo/framework/core/middleware/i18n';
import theme from '@dojo/framework/core/middleware/theme';
import { create, tsx } from '@dojo/framework/core/vdom';

import * as css from '../theme/default/tab-controller.m.css';

export interface TabContentProperties {
	active?: boolean;
	closed?: boolean;
}

const factory = create({ i18n, theme }).properties<TabContentProperties>();

export const TabContent = factory(function TabContent({
	children,
	middleware: { theme },
	properties
}) {
	const { active, closed } = properties();
	const themeCss = theme.classes(css);

	return closed ? null : (
		<div classes={[theme.variant(), active ? themeCss.tab : undefined]} hidden={!active}>
			{children()}
		</div>
	);
});

export default TabContent;
