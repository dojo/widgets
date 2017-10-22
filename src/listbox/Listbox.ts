import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode } from '@dojo/widget-core/interfaces';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { diffProperty } from '@dojo/widget-core/decorators/diffProperty';
import { auto, reference } from '@dojo/widget-core/diff';
import { v, w } from '@dojo/widget-core/d';
import Dimensions from '@dojo/widget-core/meta/Dimensions';
import uuid from '@dojo/core/uuid';
import { Keys } from '../common/util';
import * as css from './styles/listbox.m.css';

/* Listbox Option sub-widget */
export interface ListboxOptionProperties extends ThemeableProperties {
	active?: boolean;
	classes?: (string | null)[];
	disabled?: boolean;
	label: DNode;
	id: string;
	option: any;
	selected?: boolean;
	onClick?(option: any): void;
}

const ListboxOptionBase = ThemeableMixin(WidgetBase);

@theme(css)
export class ListboxOption extends ListboxOptionBase<ListboxOptionProperties> {
	private _onClick(event: MouseEvent) {
		const { option, onClick } = this.properties;
		onClick && onClick(option);
	}

	protected render() {
		const {
			classes = [],
			disabled = false,
			id,
			label,
			selected = false
		} = this.properties;

		return v('div', {
			'aria-disabled': disabled ? 'true' : null,
			'aria-selected': disabled ? null : String(selected),
			classes: this.classes(...classes),
			id,
			role: 'option',
			onclick: this._onClick
		}, [ label ]);
	}
}

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
	describedBy?: string;
	visualFocus?: boolean;
	id?: string;
	multiselect?: boolean;
	optionData?: any[];
	tabIndex?: number;
	getOptionDisabled?(option: any, index: number): boolean;
	getOptionId?(option: any, index: number): string;
	getOptionLabel?(option: any, index: number): DNode;
	getOptionSelected?(option: any, index: number): boolean;
	onActiveIndexChange?(index: number, key: string | number): void;
	onOptionSelect?(option: any, index: number, key: string | number): void;
	onKeyDown?(event: KeyboardEvent, key: string | number): void;
}

export const ListboxBase = ThemeableMixin(WidgetBase);

@theme(css)
@diffProperty('optionData', reference)
export default class Listbox extends ListboxBase<ListboxProperties> {
	private _scroll: number | undefined;
	private _idBase = uuid();

	private _getOptionId(index: number): string {
		const { optionData = [], getOptionId } = this.properties;
		return getOptionId ? getOptionId(optionData[index], index) : `${this._idBase}-${index}`;
	}

	private _onKeyDown(event: KeyboardEvent) {
		const {
			activeIndex = 0,
			key = '',
			optionData = [],
			getOptionDisabled = (option: any, index: number) => false,
			onActiveIndexChange,
			onOptionSelect,
			onKeyDown
		} = this.properties;

		onKeyDown && onKeyDown(event, key);

		const activeItem = optionData[activeIndex];
		let newIndex: number;

		switch (event.which) {
			case Keys.Enter:
			case Keys.Space:
				event.preventDefault();
				if (!getOptionDisabled(activeItem, activeIndex)) {
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

	protected animateScroll(element: HTMLElement, scrollValue: number) {
		element.scrollTop = scrollValue;
	}

	@diffProperty('activeIndex', auto)
	protected calculateScroll(previousProperties: ListboxProperties, { activeIndex = 0 }: ListboxProperties) {
		const scrollOffset = this.meta(Dimensions).get('root').scroll.top;
		const menuHeight = this.meta(Dimensions).get('root').offset.height;
		const optionOffset = this.meta(Dimensions).get(this._getOptionId(activeIndex)).offset;

		if (optionOffset.top - scrollOffset < 0) {
			this._scroll = optionOffset.top;
			this.invalidate();
		}

		else if ((optionOffset.top + optionOffset.height) > (scrollOffset + menuHeight)) {
			this._scroll = optionOffset.top + optionOffset.height - menuHeight;
			this.invalidate();
		}
	}

	protected getModifierClasses() {
		const { visualFocus } = this.properties;
		return [
			visualFocus ? css.focused : null
		];
	}

	protected getOptionClasses(active: boolean, disabled: boolean, selected: boolean) {
		return [
			css.option,
			active ? css.activeOption : null,
			disabled ? css.disabledOption : null,
			selected ? css.selectedOption : null
		];
	}

	protected onElementCreated(element: HTMLElement, key: string) {
		if (key === 'root' && typeof this._scroll === 'number') {
			this.animateScroll(element, this._scroll);
			this._scroll = undefined;
		}
	}

	protected onElementUpdated(element: HTMLElement, key: string) {
		if (key === 'root' && typeof this._scroll === 'number') {
			this.animateScroll(element, this._scroll);
			this._scroll = undefined;
		}
	}

	protected renderOptionLabel(option: any, index: number): DNode {
		const { getOptionLabel } = this.properties;
		return getOptionLabel ? getOptionLabel(option, index) : `${option}`;
	}

	protected renderOption(option: any, index: number): DNode {
		const {
			activeIndex = 0,
			key = '',
			getOptionDisabled = (option: any, index: number) => false,
			getOptionSelected = (option: any, index: number) => false,
			theme,
			onActiveIndexChange,
			onOptionSelect
		} = this.properties;

		const disabled = getOptionDisabled(option, index);
		const selected = getOptionSelected(option, index);

		return v('div', { key: this._getOptionId(index) }, [
			w(ListboxOption, {
				active: activeIndex === index,
				classes: this.getOptionClasses(activeIndex === index, disabled, selected),
				disabled,
				label: this.renderOptionLabel(option, index),
				id: this._getOptionId(index),
				key: `option-${index}`,
				option,
				selected,
				theme,
				onClick: (data: any) => {
					if (!getOptionDisabled(option, index)) {
						onActiveIndexChange && onActiveIndexChange(index, key);
						onOptionSelect && onOptionSelect(data, index, key);
					}
				}
			})
		]);
	}

	protected renderOptions(): DNode[] {
		const {
			optionData = []
		} = this.properties;

		return optionData.map(this.renderOption.bind(this));
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
			classes: this.classes(css.root, ...this.getModifierClasses()),
			describedBy,
			id,
			key: 'root',
			role: 'listbox',
			tabIndex,
			onkeydown: this._onKeyDown
		}, this.renderOptions());
	}
}
