import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { DNode } from '@dojo/framework/core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/core/mixins/Themed';
import { v } from '@dojo/framework/core/vdom';
import { formatAriaProperties } from '../common/util';
import * as css from '../theme/icon.m.css';
import * as baseCss from '../common/styles/base.m.css';

export type IconType = keyof typeof css;

export interface IconProperties extends ThemedProperties {
	/** An optional, visually hidden label for the icon */
	altText?: string;
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
	/** Icon type, e.g. downIcon, searchIcon, etc. */
	type: IconType;
}

@theme(css)
export class Icon extends ThemedMixin(WidgetBase)<IconProperties> {
	protected renderAltText(altText: string): DNode {
		return v('span', { classes: [baseCss.visuallyHidden] }, [altText]);
	}

	render(): DNode {
		const {
			aria = {
				hidden: 'true'
			},
			type,
			altText
		} = this.properties;

		return v('span', { classes: this.theme(css.root) }, [
			v('i', {
				...formatAriaProperties(aria),
				classes: this.theme([css.icon, css[type]])
			}),
			altText ? this.renderAltText(altText) : null
		]);
	}
}

export default Icon;
