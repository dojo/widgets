import { create, tsx } from '@dojo/framework/core/vdom';
import ActiveLink from './ActiveLink';

import * as css from './Menu.m.css';
import { formatWidgetName } from './App';

interface MenuProperties {
	widgetNames: string[];
}

const factory = create().properties<MenuProperties>();

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
								params={{ widget, example: 'basic', active: 'example' }}
								matchParams={{ widget }}
								activeClasses={[css.selected]}
							>
								{formatWidgetName(widget)}
							</ActiveLink>
						</li>
					);
				})}
			</ul>
		</nav>
	);
});
