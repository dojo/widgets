import { create, tsx } from '@dojo/framework/core/vdom';
import ActiveLink from './ActiveLink';

import * as css from './Menu.m.css';

interface MenuProperties {
	widgetNames: string[];
}

const factory = create().properties<MenuProperties>();

export function formatMenuItem(widget: string) {
	return widget
		.split('-')
		.map((item) => `${item[0].toUpperCase()}${item.slice(1)}`)
		.join(' ');
}

export default factory(function Menu({ properties }) {
	const { widgetNames } = properties();
	return (
		<nav classes={css.root}>
			<ul classes={css.menu}>
				<li classes={css.item}>
					<ActiveLink to="landing" classes={css.link} activeClasses={[css.selected]}>
						Overview
					</ActiveLink>
				</li>
				{widgetNames.map((widget) => {
					return (
						<li classes={css.item}>
							<ActiveLink
								to="example"
								classes={css.link}
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
