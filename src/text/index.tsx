import { v, create } from '@dojo/framework/core/vdom';
import theme from '../middleware/theme';

import * as css from '../theme/default/text.m.css';
import * as fixedCss from './styles/Text.m.css';

export interface TextProperties {
	size?: 'x-small' | 'small' | 'medium' | 'large' | 'x-large' | 'xx-large';
	weight?: 'light' | 'normal' | 'heavy';
	inverse?: boolean;
	truncated?: boolean;
	as?: string;
	uppercase?: boolean;
}

const factory = create({ theme }).properties<TextProperties>();

const Text = factory(function Text({ middleware: { theme }, properties, children }) {
	const themedCss = theme.classes(css);
	const {
		as = 'p',
		truncated = false,
		size = 'm',
		inverse = false,
		uppercase = false,
		weight = 'normal'
	} = properties();

	let sizeClass = themedCss.medium;
	switch (size) {
		case 'x-small':
			sizeClass = themedCss.xSmall;
			break;
		case 'small':
			sizeClass = themedCss.small;
			break;
		case 'large':
			sizeClass = themedCss.large;
			break;
		case 'x-large':
			sizeClass = themedCss.xLarge;
			break;
		case 'xx-large':
			sizeClass = themedCss.xxLarge;
			break;
	}
	let weightClass = themedCss.normal;
	switch (weight) {
		case 'light':
			weightClass = themedCss.light;
			break;
		case 'heavy':
			weightClass = themedCss.heavy;
			break;
	}

	return v(
		as,
		{
			classes: [
				theme.variant(),
				themedCss.root,
				sizeClass,
				weightClass,
				truncated && fixedCss.truncate,
				inverse && themedCss.inverse,
				themedCss.primary,
				uppercase && fixedCss.uppercase
			]
		},
		children()
	);
});

export default Text;
