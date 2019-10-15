import { create, tsx } from '@dojo/framework/core/vdom';

import { WidgetConfig } from './config';
import ActiveLink from './ActiveLink';

import * as css from './SideMenu.m.css';

interface SideMenuProperties {
	name: string;
	config: WidgetConfig;
}

const factory = create().properties<SideMenuProperties>();

export default factory(function SideMenu({ properties }) {
	const {
		name,
		config: { examples = [] }
	} = properties();
	return (
		<div classes={css.root}>
			<ul classes={css.menu}>
				<li classes={css.item}>
					<ActiveLink
						key="example"
						classes={css.link}
						to="example"
						params={{ widget: name, example: 'basic' }}
						activeClasses={[css.selected]}
					>
						Basic
					</ActiveLink>
				</li>
				{examples.map((example) => {
					return (
						<li classes={css.item}>
							<ActiveLink
								key={example.filename}
								classes={css.link}
								to="example"
								params={{
									widget: name,
									example: example.filename.toLowerCase()
								}}
								activeClasses={[css.selected]}
							>
								{example.filename.replace(/([A-Z])/g, ' $1').trim()}
							</ActiveLink>
						</li>
					);
				})}
			</ul>
		</div>
	);
});
