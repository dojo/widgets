import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode } from '@dojo/widget-core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/widget-core/mixins/Themed';
import { v } from '@dojo/widget-core/d';
import { CustomAriaProperties } from '../common/interfaces';
import { formatAriaProperties } from '../common/util';
import * as iconCss from '../theme/icon.m.css';
import { customElement } from '@dojo/widget-core/decorators/customElement';

export type IconType = keyof typeof iconCss;

/**
 * @type IconProperties
 *
 * Properties that can be set on an Icon component
 *
 * @property type           Icon type, e.g. downIcon, searchIcon, etc.
 */
export interface IconProperties extends ThemedProperties, CustomAriaProperties {
	type: IconType;
	onClick?(): void;
}

export const ThemedBase = ThemedMixin(WidgetBase);

@theme(iconCss)
@customElement<IconProperties>({
	tag: 'dojo-icon',
	properties: [
		'theme',
		'aria',
		'extraClasses'
	],
	attributes: [ 'type' ],
	events: [
		'onClick'
	]
})
export class IconBase<P extends IconProperties = IconProperties> extends ThemedBase<P, null> {
	private _onClick (event: MouseEvent) {
		event && event.stopPropagation();
		this.properties.onClick && this.properties.onClick();
	}

	protected render(): DNode {
		const {
			aria = {
				hidden: 'true'
			},
			type
		} = this.properties;

		return v('i', {
			...formatAriaProperties(aria),
			classes: this.theme([iconCss.icon, iconCss[type]]),
			onclick: this._onClick,
			role: 'presentation'
		});
	}
}

export default class Icon extends IconBase<IconProperties> {}
