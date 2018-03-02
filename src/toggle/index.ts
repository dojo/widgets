import { DNode, VNode } from '@dojo/widget-core/interfaces';
import { theme } from '@dojo/widget-core/mixins/Themed';
import {
	CheckboxBase,
	CheckboxProperties,
	CheckboxElementAttributes,
	CheckboxElementEvents,
	CheckboxElementProperties
} from '../checkbox/index';
import { v } from '@dojo/widget-core/d';
import * as css from '../theme/toggle.m.css';
import { customElement } from '@dojo/widget-core/decorators/customElement';

/**
 * @type ToggleProperties
 *
 * Properties that can be set on a Toggle component
 *
 * @property offLabel       Label to show in the "off" positin of a toggle
 * @property onLabel        Label to show in the "on" positin of a toggle
 */
export interface ToggleProperties extends CheckboxProperties {
	offLabel?: DNode;
	onLabel?: DNode;
}

const ToggleElementProperties =
	(<(keyof ToggleProperties)[]> CheckboxElementProperties).concat(
		['offLabel', 'onLabel']
	);

@theme(css)
@customElement<ToggleProperties>({
	tag: 'dojo-toggle',
	properties: ToggleElementProperties,
	attributes: CheckboxElementAttributes,
	events: CheckboxElementEvents
})
export default class ToggleBase extends CheckboxBase<ToggleProperties> {
	protected renderInput(): DNode[] {
		const { checked, onLabel, offLabel } = this.properties;

		return [
			offLabel
				? v(
						'div',
						{
							key: 'offLabel',
							classes: this.theme(css.offLabel),
							'aria-hidden': checked ? 'true' : null
						},
						[offLabel]
					)
				: null,
			v('div', {
				key: 'toggle',
				classes: this.theme(css.toggleSwitch)
			}),
			onLabel
				? v(
						'div',
						{
							key: 'onLabel',
							classes: this.theme(css.onLabel),
							'aria-hidden': checked ? null : 'true'
						},
						[onLabel]
					)
				: null,
			...super.renderInput()
		];
	}
}
