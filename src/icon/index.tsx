import { create, tsx } from '@dojo/framework/core/vdom';
import theme from '../middleware/theme';
import { formatAriaProperties } from '../common/util';
import * as css from '../theme/icon.m.css';
import * as baseCss from '../common/styles/base.m.css';

export type IconType = keyof typeof css;

export interface IconProperties {
	/** An optional, visually hidden label for the icon */
	altText?: string;
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
	/** Icon type, e.g. downIcon, searchIcon, etc. */
	type: IconType;
}

const factory = create({ theme }).properties<IconProperties>();

export const Icon = factory(function({ properties, middleware: { theme } }) {
	const {
		aria = {
			hidden: 'true'
		},
		type,
		altText
	} = properties();

	const themedCss = theme.classes(css);

	// TODO: figure out why these classes are superceeded

	return (
		<span>
			<i classes={[themedCss.icon, themedCss[type]]} {...formatAriaProperties(aria)}>
				<virtual>
					{altText ? <span classes={baseCss.visuallyHidden}>{altText}</span> : null}
				</virtual>
			</i>
		</span>
	);
});

export default Icon;
