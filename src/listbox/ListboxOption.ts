import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode } from '@dojo/widget-core/interfaces';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v } from '@dojo/widget-core/d';
import * as css from './styles/listbox.m.css';

/**
 * @type ListboxOptionProperties
 *
 * Properties that can be set on a ListboxOption
 *
 * @property active               Boolean whether or not the option is currently active
 * @property disabled             Boolean whether or not the option is disabled
 * @property getOptionLabel       Function to return string label based on option data
 * @property id                   Optional custom id for the listbox
 * @property option               Data for the option
 * @property selected             Boolean whether or not the option has been selected
 * @property onClick              Called when the option is clicked
 */

export interface ListboxOptionProperties extends ThemeableProperties {
	active?: boolean;
	disabled?: boolean;
	getOptionLabel?(option: any): DNode;
	id: string;
	option: any;
	selected?: boolean;
	onClick?(option: any): void;
}

export const ListboxOptionBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class ListboxOption extends ListboxOptionBase<ListboxOptionProperties> {
	private _onClick(event: MouseEvent) {
		const { option, onClick } = this.properties;
		onClick && onClick(option);
	}

	protected renderResult(): DNode {
		const { getOptionLabel, option } = this.properties;
		return getOptionLabel ? getOptionLabel(option) : `${option}`;
	}

	protected render() {
	const {
		active = false,
		disabled = false,
		id,
		selected = false
	} = this.properties;

	const optionClasses = [
		css.option,
		active ? css.activeOption : null,
		selected ? css.selectedOption : null,
		disabled ? css.disabledOption : null
	];

	return v('div', {
		'aria-disabled': disabled ? 'true' : null,
		'aria-selected': disabled ? null : String(selected),
		classes: this.classes(...optionClasses),
		id,
		role: 'option',
		onclick: this._onClick
		}, [ this.renderResult() ]);
	}
}
