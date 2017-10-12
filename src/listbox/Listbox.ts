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
 * @property getOptionId          Function that accepts option data and returns a string ID
 * @property getOptionSelected    Function that accepts option data and returns a boolean for selected/unselected
 * @property onActiveIndexChange  Called with the index of the new requested active descendant
 * @property onOptionSelect       Called with the option data of the new requested selected item
 */

export interface ListboxProperties extends ThemeableProperties {
	activeIndex?: number;
	CustomOption?: Constructor<ListboxOption>;
	describedBy?: string;
	focused?: boolean;
	id?: string;
	multiselect?: boolean;
	optionData?: any[];
	tabIndex?: number;
	getOptionDisabled?(option: any, index: number): boolean;
	getOptionId?(option: any, index: number): string;
	getOptionLabel?(option: any): DNode;
	getOptionSelected?(option: any, index: number): boolean;
	onActiveIndexChange?(index: number, key: string | number): void;
	onOptionSelect?(option: any, index: number, key: string | number): void;
	onBlur?(event: FocusEvent, key: string | number): void;
	onKeyDown?(event: KeyboardEvent, key: string | number): void;
}

export const ListboxBase = ThemeableMixin(WidgetBase);

@theme(css)
@diffProperty('optionData', reference)
export default class Listbox extends ListboxBase<ListboxProperties> {
	private _idBase = uuid();

	private _getOptionId(index: number) {
		const { optionData = [], getOptionId } = this.properties;
		return getOptionId ? getOptionId(optionData[index], index) : `${this._idBase}-${index}`;
	}

	private _onBlur(event: FocusEvent) {
		const { key = '', onBlur } = this.properties;
		onBlur && onBlur(event, key);
	}

	private _onKeyDown(event: KeyboardEvent) {
		const {
			activeIndex = 0,
			key = '',
			optionData = [],
			getOptionDisabled = () => false,
			onActiveIndexChange,
			onOptionSelect,
			onKeyDown
		} = this.properties;

		onKeyDown && onKeyDown(event, key);

		const activeItem = optionData[activeIndex];
		let newIndex: number;

		switch (event.which) {
			case Keys.Enter:
				if (getOptionDisabled(activeItem, activeIndex)) {
					event.preventDefault();
				}
				else {
					onOptionSelect && onOptionSelect(activeItem, activeIndex, key);
				}
				break;
			case Keys.Space:
				if (getOptionDisabled(activeItem, activeIndex)) {
					event.preventDefault();
				}
				else {
					onOptionSelect && onOptionSelect(activeItem, activeIndex, key);
				}
				break;
			case Keys.Down:
				event.preventDefault();
				newIndex = (activeIndex + 1) % optionData.length;
				onActiveIndexChange && onActiveIndexChange(newIndex, key);
				break;
			case Keys.Up:
				event.preventDefault();
				newIndex = (activeIndex - 1 + optionData.length) % optionData.length;
				onActiveIndexChange && onActiveIndexChange(newIndex, key);
				break;
			case Keys.Home:
				onActiveIndexChange && onActiveIndexChange(0, key);
				break;
			case Keys.End:
				onActiveIndexChange && onActiveIndexChange(optionData.length - 1, key);
				break;
		}
	}

	protected getRootClasses() {
		const { focused } = this.properties;
		return this.classes(
			css.root,
			focused ? css.focused : null
		);
	}

	protected renderOptions() {
		const {
			activeIndex = 0,
			CustomOption = ListboxOption,
			key = '',
			optionData = [],
			theme,
			getOptionLabel,
			getOptionDisabled = () => false,
			getOptionSelected = () => false,
			onActiveIndexChange,
			onOptionSelect
		} = this.properties;

		return optionData.map((option, i) => w(CustomOption, {
			active: activeIndex === i,
			disabled: getOptionDisabled(option, i),
			getOptionLabel,
			id: this._getOptionId(i),
			key: this._getOptionId(i),
			option,
			selected: getOptionSelected(option, i),
			theme,
			onClick: (data: any) => {
				if (!getOptionDisabled(option, i)) {
					onActiveIndexChange && onActiveIndexChange(i, key);
					onOptionSelect && onOptionSelect(data, i, key);
				}
			}
		}));
	}

	protected render() {
		const {
			activeIndex = 0,
			describedBy,
			id,
			multiselect = false,
			tabIndex = 0
		} = this.properties;

		return v('div', {
			'aria-activedescendant': this._getOptionId(activeIndex),
			'aria-multiselectable': multiselect ? 'true' : null,
			classes: this.getRootClasses(),
			describedBy,
			id,
			role: 'listbox',
			tabIndex,
			onblur: this._onBlur,
			onkeydown: this._onKeyDown
		}, this.renderOptions());
	}
}
