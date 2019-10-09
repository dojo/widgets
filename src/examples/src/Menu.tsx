import { create, tsx } from '@dojo/framework/core/vdom';
import ActiveLink from './ActiveLink';

import * as css from './App.m.css';

interface MenuProperties {
	widgetNames: string[];
}

const factory = create().properties<MenuProperties>();

function formatMenuItem(widget: string) {
	return widget
		.split('-')
		.map((item) => `${item[0].toUpperCase()}${item.slice(1)}`)
		.join(' ');
}

export default factory(function Menu({ properties }) {
	const { widgetNames } = properties();
	return (
		<nav classes={css.nav}>
			<ul classes={css.menuList}>
				{widgetNames.map((widget) => {
					return (
						<li classes={css.menuItem}>
							<ActiveLink
								to="example"
								classes={css.menuLink}
								params={{ widget, example: 'basic' }}
								matchParams={{ widget }}
								activeClasses={[css.selected]}
							>
								{formatMenuItem(widget)}
							</ActiveLink>
						</li>
					);
				})}
			</ul>
		</nav>
	);
});
