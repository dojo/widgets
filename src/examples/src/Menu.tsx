import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';

import * as css from './Menu.m.css';

const factory = create({ icache }).properties<any>();

export default factory(function Menu({ properties }) {
	// const { config, onAutoNavChange, autoNav } = properties();

	return (
		<div classes={[css.root]}>
			<a classes={[css.trigger]}>
				<i classes={[css.icon, 'fa', 'fa-bars']} />
				<h1 classes={[css.title]}>Hello</h1>
			</a>
			<nav classes={[css.nav]}>
				<ul>
				</ul>
			</nav>
		</div>
	);
});
