import { create, tsx } from '@dojo/framework/core/vdom';

import { WidgetConfig } from './config';
import ActiveLink from './ActiveLink';

import * as css from './App.m.css';

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
		<div classes={css.menu}>
			<ul classes={css.columnMenuList}>
				<li classes={css.columnMenuItem}>
					<ActiveLink
						key="example"
						classes={css.columnMenuLink}
						to="example"
						params={{ widget: name, example: 'basic' }}
						activeClasses={[css.columnMenuLinkSelected]}
					>
						Basic
					</ActiveLink>
				</li>
				{examples.map((example) => {
					return (
						<li classes={css.columnMenuItem}>
							<ActiveLink
								key={example.filename}
								classes={css.columnMenuLink}
								to="example"
								params={{
									widget: name,
									example: example.filename.toLowerCase()
								}}
								activeClasses={[css.columnMenuLinkSelected]}
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
