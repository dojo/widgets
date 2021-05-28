import { v, create } from '@dojo/framework/core/vdom';
import theme from '../middleware/theme';

import * as css from '../theme/default/text.m.css';

export interface TextProperties {
	size?: 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';
	inverse?: boolean;
	truncated?: boolean;
	as?: string;
}

const factory = create({ theme }).properties<TextProperties>();

const Text = factory(function Text({ middleware: { theme }, properties, children }) {
	const themedCss = theme.classes(css);
	const { as = 'p', truncated = false, size = 'm', inverse = false } = properties();

	let sizeClass = themedCss.m;
	switch (size) {
		case 'xs':
			sizeClass = themedCss.xs;
			break;
		case 's':
			sizeClass = themedCss.s;
			break;
		case 'l':
			sizeClass = themedCss.l;
			break;
		case 'xl':
			sizeClass = themedCss.xl;
			break;
		case 'xxl':
			sizeClass = themedCss.xxl;
			break;
	}

	return v(
		as,
		{
			classes: [
				theme.variant(),
				themedCss.root,
				sizeClass,
				truncated && themedCss.truncate,
				inverse && themedCss.inverse,
				themedCss.primary
			]
		},
		children()
	);
});

export default Text;
