import { create, tsx } from '@dojo/framework/core/vdom';
import i18n from '@dojo/framework/core/middleware/i18n';
import theme from '../middleware/theme';

import * as css from '../theme/default/pagination.m.css';

export interface PageLinkProperties {
	onClick(): void;
}

const factory = create({ theme, i18n }).properties<PageLinkProperties>();

export default factory(function PageLink({ middleware: { theme }, properties, children }) {
	const { onClick } = properties();
	const classes = theme.classes(css);

	return (
		<button
			classes={classes.link}
			onclick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				onClick();
			}}
		>
			{children()}
		</button>
	);
});
