import { create, tsx } from '@dojo/framework/core/vdom';
import theme from '../middleware/theme';
import { formatAriaProperties } from '../common/util';
import * as css from '../theme/default/icon.m.css';

export type IconType = keyof typeof css;

export interface IconProperties {
	/** An optional, visually hidden label for the icon */
	altText?: string;
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
	/** Icon type, e.g. downIcon, searchIcon, etc. */
	type: IconType;
	/** Size modifier for the icon; small, medium or large */
	size?: 'small' | 'medium' | 'large';
}

const factory = create({ theme }).properties<IconProperties>();

export const Icon = factory(function Icon({ properties, middleware: { theme } }) {
	const { aria = {}, type, altText, size } = properties();

	const classes = theme.classes(css);
	const sizeClass = size && classes[size as keyof typeof classes];

	return (
		<i
			classes={[theme.variant(), classes.root, classes.icon, classes[type], sizeClass]}
			role="img"
			aria-hidden={altText ? 'false' : 'true'}
			aria-label={altText}
			{...formatAriaProperties(aria)}
		/>
	);
});

export default Icon;
