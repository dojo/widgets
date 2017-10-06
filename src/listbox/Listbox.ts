import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode, Constructor } from '@dojo/widget-core/interfaces';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { diffProperty } from '@dojo/widget-core/decorators/diffProperty';
import { reference } from '@dojo/widget-core/diff';
import { v, w } from '@dojo/widget-core/d';
import uuid from '@dojo/core/uuid';
import { Keys } from '../common/util';
import ListboxOption from './ListboxOption';
import * as css from './styles/listbox.m.css';

/**
 * @type ListboxProperties
 *
 * Properties that can be set on a Listbox component
 *
 * @property activeIndex          Index of the currently active listbox option
 * @property customOption         Custom widget constructor for options. Should extend ListboxOption
 * @property describedBy          ID of an element that provides more descriptive text
 * @property id                   Optional custom id for the listbox
 * @property optionData           Array of data for listbox options
 * @property getOptionLabel       Function to return string label based on option data
 * @property getOptionDisabled    Function that accepts option data and returns a boolean for disabled/not disabled
 * @property getOptionId          Required function that accepts option data and returns a string ID
 * @property getOptionSelected    Function that accepts option data and returns a boolean for selected/unselected
 * @property onActiveIndexChange  Called with the index of the new requested active descendant
 * @property onOptionSelect       Called with the option data of the new requested selected item
 */

export interface ListboxProperties extends ThemeableProperties {
	activeIndex?: number;
	CustomOption?: Constructor<ListboxOption>;
	describedBy?: string;
	id?: string;
	optionData?: any[];
	tabIndex?: number;
	getOptionLabel?(option: any): DNode;
	getOptionDisabled?(option: any): boolean;
	getOptionSelected?(option: any): boolean;
	onActiveIndexChange?(index: number): void;
	onOptionSelect?(option: any, index: number): void;
	onKeyDown?(event: KeyboardEvent): void;
}

export const ListboxBase = ThemeableMixin(WidgetBase);

@theme(css)
@diffProperty('optionData', reference)
export default class Listbox extends ListboxBase<ListboxProperties> {
	private _idBase = uuid();

	private _getOptionId(index: number) {
		return `${this._idBase}-${index}`;
	}

	private _onKeyDown(event: KeyboardEvent) {
		const {
			activeIndex = 0,
			optionData = [],
			getOptionDisabled = () => false,
			onActiveIndexChange,
			onOptionSelect,
			onKeyDown
		} = this.properties;

		onKeyDown && onKeyDown(event);

		const activeItem = optionData[activeIndex];
		let newIndex: number;

		switch (event.which) {
			case Keys.Enter:
				if (getOptionDisabled(activeItem)) {
					event.preventDefault();
				}
				else {
					onOptionSelect && onOptionSelect(activeItem, activeIndex);
				}
				break;
			case Keys.Space:
				if (getOptionDisabled(activeItem)) {
					event.preventDefault();
				}
				else {
					onOptionSelect && onOptionSelect(activeItem, activeIndex);
				}
				break;
			case Keys.Down:
				event.preventDefault();
				newIndex = (activeIndex + 1) % optionData.length;
				onActiveIndexChange && onActiveIndexChange(newIndex);
				break;
			case Keys.Up:
				event.preventDefault();
				newIndex = (activeIndex - 1 + optionData.length) % optionData.length;
				onActiveIndexChange && onActiveIndexChange(newIndex);
				break;
			case Keys.Home:
				onActiveIndexChange && onActiveIndexChange(0);
				break;
			case Keys.End:
				onActiveIndexChange && onActiveIndexChange(optionData.length - 1);
				break;
		}
	}

	protected renderOptions() {
		const {
			activeIndex = 0,
			CustomOption = ListboxOption,
			optionData = [],
			theme,
			getOptionLabel,
			getOptionDisabled = () => false,
			getOptionSelected = () => false,
			onOptionSelect
		} = this.properties;

		return optionData.map((option, i) => w(CustomOption, {
			active: activeIndex === i,
			disabled: getOptionDisabled(option),
			getOptionLabel,
			id: this._getOptionId(i),
			key: this._getOptionId(i),
			option,
			selected: getOptionSelected(option),
			theme,
			onClick: (data: any) => {
				onOptionSelect && onOptionSelect(data, i);
			}
		}));
	}

	protected render() {
		const {
			activeIndex = 0,
			describedBy,
			id,
			tabIndex = 0
		} = this.properties;

		return v('div', {
			'aria-activedescendant': this._getOptionId(activeIndex),
			classes: this.classes(css.root),
			describedBy,
			id,
			role: 'listbox',
			tabIndex,
			onkeydown: this._onKeyDown
		}, this.renderOptions());
	}
}
