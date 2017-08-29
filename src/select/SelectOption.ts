import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode } from '@dojo/widget-core/interfaces';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v } from '@dojo/widget-core/d';
import * as css from './styles/select.m.css';

/**
 * @type OptionData
 * Settings passed down to the Option
 *
 * @property disabled     Toggle disabled status of the individual option
 * @property id           Optional custom id
 * @property label        Text to display to the user
 * @property selected     Toggle selected/deselected state for multiselect widgets
 * @property value        Option value
 */
export interface OptionData {
	disabled?: boolean;
	id?: string;
	label: string;
	selected?: boolean;
	value: string;
}

/**
 * @type SelectOptionProperties
 *
 * Properties that can be set on a Select component
 *
 * @property focused      Whether this is the currently focused option
 * @property index        Position of this option in list of options
 * @property optionData   Settings for this option
 * @property onMouseDown  Called on the mouse down event for this option
 * @property onClick      Called on the click event for this option
 */
export interface SelectOptionProperties extends ThemeableProperties {
	focused?: boolean;
	index: number;
	optionData: OptionData;
	onMouseDown?(): void;
	onClick?(event: MouseEvent, index: number): void;
}

export const SelectOptionBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class SelectOption extends SelectOptionBase<SelectOptionProperties> {
	private _onMouseDown() {
		const { onMouseDown } = this.properties;

		onMouseDown && onMouseDown();
	}

	private _onClick(event: MouseEvent) {
		const {
			index,
			onClick
		} = this.properties;

		onClick && onClick(event, index);
	}

	renderLabel(): DNode {
		return this.properties.optionData.label;
	}

	render(): DNode {
		const {
			focused,
			optionData
		} = this.properties;

		const optionClasses = [
			css.option,
			focused ? css.focused : null,
			optionData.selected ? css.selected : null,
			optionData.disabled ? css.disabledOption : null
		];

		return v('div', {
			role: 'option',
			id: optionData.id,
			classes: this.classes(...optionClasses),
			'aria-disabled': optionData.disabled ? 'true' : null,
			'aria-selected': optionData.selected ? 'true' : 'false',
			onclick: this._onClick,
			onmousedown: this._onMouseDown
		}, [ this.renderLabel() ]);
	}
}
