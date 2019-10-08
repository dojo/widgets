import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import ActiveLink from '@dojo/framework/routing/ActiveLink';

import * as css from './Menu.m.css';

const factory = create({ icache }).properties<{ widgets: string[] }>();

export default factory(function Menu({ properties }) {
	const { widgets } = properties();

	return (
		<div classes={[css.root]}>
			<a classes={[css.trigger]}>
				<i classes={[css.icon, 'fa', 'fa-bars']} />
				<h1 classes={[css.title]}>Hello</h1>
			</a>
			<nav classes={[css.nav]}>
				<ul>
					{widgets.map((widget) => {
						return (
							<li>
								<ActiveLink
									classes={[css.link]}
									activeClasses={[css.active]}
									to="example"
									params={{ widget }}
								>
									<em>{widget}</em>
								</ActiveLink>
							</li>
						);
					})}
				</ul>
			</nav>
		</div>
	);
});
