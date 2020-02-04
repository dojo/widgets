import { create, tsx } from '@dojo/framework/core/vdom';
import theme, { ThemeProperties } from '../middleware/theme';
import { formatAriaProperties } from '../common/util';
import * as css from '../theme/default/icon.m.css';
import * as baseCss from '../common/styles/base.m.css';

export type IconType = keyof typeof css;

export interface IconProperties extends ThemeProperties {
	/** An optional, visually hidden label for the icon */
	altText?: string;
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
	/** Icon type, e.g. downIcon, searchIcon, etc. */
	type: IconType;
}

const factory = create({ theme }).properties<IconProperties>();

export const Icon = factory(function Icon({ properties, middleware: { theme } }) {
	const {
		aria = {
			hidden: 'true'
		},
		type,
		altText
	} = properties();

	const classes = theme.classes(css);

	return (
		<virtual>
			<i classes={[classes.icon, classes[type]]} {...formatAriaProperties(aria)} />
			{altText ? <span classes={baseCss.visuallyHidden}>{altText}</span> : null}
		</virtual>
	);
});

export default Icon;
