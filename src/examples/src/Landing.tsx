import { create, tsx } from '@dojo/framework/core/vdom';
import block from '@dojo/framework/core/middleware/block';

import * as css from './Landing.m.css';
import { formatMenuItem } from './Menu';
import ActiveLink from './ActiveLink';

interface LandingProperties {
	widgets: string[];
}

const factory = create({ block }).properties<LandingProperties>();

export default factory(function Landing({ properties, middleware: { block } }) {
	const { widgets } = properties();

	return (
		<div classes={css.root}>
			<h1>Dojo Widgets</h1>

			<section>
				<ul>
					{widgets.map((widget) => {
						return (
							<li classes={css.listItem}>
								<ActiveLink
									activeClasses={[]}
									to="example"
									params={{ widget, example: 'basic' }}
									matchParams={{ widget }}
								>
									{formatMenuItem(widget)}
								</ActiveLink>
							</li>
						);
					})}
				</ul>
			</section>
		</div>
	);
});
