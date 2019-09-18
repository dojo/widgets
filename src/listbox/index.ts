import { reference } from '@dojo/framework/core/diff';
import { diffProperty } from '@dojo/framework/core/decorators/diffProperty';
import Dimensions from '@dojo/framework/core/meta/Dimensions';
import { DNode } from '@dojo/framework/core/interfaces';
import { formatAriaProperties, Keys } from '../common/util';
import MetaBase from '@dojo/framework/core/meta/Base';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/core/mixins/Themed';
import { FocusMixin, FocusProperties } from '@dojo/framework/core/mixins/Focus';
import { uuid } from '@dojo/framework/core/util';
import { v, w } from '@dojo/framework/core/vdom';
import { WidgetBase } from '@dojo/framework/core/WidgetBase';

import * as css from '../theme/listbox.m.css';
import ListboxOption from './ListboxOption';
import { Focus } from '@dojo/framework/core/meta/Focus';
import Resize from '@dojo/framework/core/meta/Resize';

/* Default scroll meta */
export class ScrollMeta extends MetaBase {
	public scroll(key: string | number, amount: number): void {
		const node = this.getNode(key);
		if (node) {
			node.scrollTop = amount;
		}
	}
}

/**
 * @type ListboxProperties
 *
 * Properties that can be set on a Listbox component
 *
 * @property activeIndex          Index of the currently active listbox option
 * @property getOptionLabel       Function to return string label based on option data
 * @property getOptionDisabled    Function that accepts option data and returns a boolean for disabled/not disabled
 * @property getOptionId          Function that accepts option data and returns a string ID
 * @property getOptionSelected    Function that accepts option data and returns a boolean for selected/unselected
 * @property widgetId               Optional custom id for the root node of the listbox
 * @property focus                Indicates if the listbox needs focusing
 * @property multiselect          Adds currect semantics for a multiselect listbox
 * @property optionData           Array of data for listbox options
 * @property tabIndex             Listbox is in the focus order by default, but setting tabIndex: -1 will remove it
 * @property visualFocus          When controlling Listbox through an outside widget, e.g. in ComboBox, visualFocus mimics visual focus styling when true
 * @property onActiveIndexChange  Called with the index of the new requested active descendant
 * @property onOptionSelect       Called with the option data of the new requested selected item
 */

export interface ListboxProperties extends ThemedProperties, FocusProperties {
	aria?: { [key: string]: string | null };
	activeIndex?: number;
	getOptionDisabled?(option: any, index: number): boolean;
	getOptionId?(option: any, index: number): string;
	getOptionLabel?(option: any, index: number): DNode;
	getOptionSelected?(option: any, index: number): boolean;
	widgetId?: string;
	multiselect?: boolean;
	optionData?: any[];
	tabIndex?: number;
	visualFocus?: boolean;
	onActiveIndexChange?(index: number): void;
	onKeyDown?(event: KeyboardEvent): void;
	onOptionSelect?(option: any, index: number): void;
}

@theme(css)
@diffProperty('optionData', reference)
export class Listbox extends ThemedMixin(FocusMixin(WidgetBase))<ListboxProperties> {
	private _boundRenderOption = this.renderOption.bind(this);
	private _idBase = uuid();

	private _getOptionDisabled(option: any, index: number) {
		const { getOptionDisabled } = this.properties;
		return getOptionDisabled ? getOptionDisabled(option, index) : false;
	}

	private _getOptionId(index: number): string {
		const { optionData = [], getOptionId } = this.properties;
		return getOptionId ? getOptionId(optionData[index], index) : `${this._idBase}-${index}`;
	}

	private _onKeyDown(event: KeyboardEvent) {
		event.stopPropagation();
		const {
			activeIndex = 0,
			optionData = [],
			onActiveIndexChange,
			onOptionSelect,
			onKeyDown
		} = this.properties;

		onKeyDown && onKeyDown(event);

		const activeItem = optionData[activeIndex];
		let newIndex: number;

		switch (event.which) {
			case Keys.Enter:
			case Keys.Space:
				event.preventDefault();
				if (!this._getOptionDisabled(activeItem, activeIndex)) {
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
			case Keys.PageUp:
				onActiveIndexChange && onActiveIndexChange(0);
				break;
			case Keys.End:
			case Keys.PageDown:
				onActiveIndexChange && onActiveIndexChange(optionData.length - 1);
				break;
		}
	}

	private _onOptionClick(option: any, index: number) {
		const { onActiveIndexChange, onOptionSelect } = this.properties;
		if (!this._getOptionDisabled(option, index)) {
			onActiveIndexChange && onActiveIndexChange(index);
			onOptionSelect && onOptionSelect(option, index);
		}
	}

	protected animateScroll(scrollValue: number) {
		this.meta(ScrollMeta).scroll('root', scrollValue);
	}

	private _calculateScroll() {
		const { activeIndex = 0 } = this.properties;
		const menuDimensions = this.meta(Dimensions).get('root');
		const scrollOffset = menuDimensions.scroll.top;
		const menuHeight = menuDimensions.offset.height;
		const optionOffset = this.meta(Dimensions).get(this._getOptionId(activeIndex)).offset;

		if (optionOffset.top - scrollOffset < 0) {
			this.animateScroll(optionOffset.top);
		} else if (optionOffset.top + optionOffset.height > scrollOffset + menuHeight) {
			this.animateScroll(optionOffset.top + optionOffset.height - menuHeight);
		}
	}

	protected getModifierClasses() {
		const { visualFocus } = this.properties;
		const focus = this.meta(Focus).get('root');
		return [visualFocus || focus.containsFocus ? css.focused : null];
	}

	protected getOptionClasses(active: boolean, disabled: boolean, selected: boolean) {
		return [
			css.option,
			active ? css.activeOption : null,
			disabled ? css.disabledOption : null,
			selected ? css.selectedOption : null
		];
	}

	protected renderOptionLabel(option: any, index: number): DNode {
		const { getOptionLabel } = this.properties;
		return getOptionLabel ? getOptionLabel(option, index) : `${option}`;
	}

	protected renderOption(option: any, index: number): DNode {
		const { activeIndex = 0, getOptionSelected, theme, classes } = this.properties;

		const disabled = this._getOptionDisabled(option, index);
		const selected = getOptionSelected ? getOptionSelected(option, index) : false;

		return v('div', { key: this._getOptionId(index), role: 'presentation' }, [
			w(ListboxOption, {
				active: activeIndex === index,
				css: this.getOptionClasses(activeIndex === index, disabled, selected),
				classes,
				disabled,
				label: this.renderOptionLabel(option, index),
				id: this._getOptionId(index),
				index: index,
				key: `option-${index}`,
				option,
				selected,
				theme,
				onClick: this._onOptionClick
			})
		]);
	}

	protected renderOptions(): DNode[] {
		const { optionData = [] } = this.properties;

		return optionData.map(this._boundRenderOption);
	}

	protected render(): DNode {
		const {
			activeIndex = 0,
			aria = {},
			widgetId,
			multiselect = false,
			tabIndex = 0
		} = this.properties;
		const themeClasses = this.getModifierClasses();

		this.meta(Resize).get('root');
		this._calculateScroll();

		return v(
			'div',
			{
				...formatAriaProperties(aria),
				'aria-activedescendant': this._getOptionId(activeIndex),
				'aria-multiselectable': multiselect ? 'true' : null,
				classes: this.theme([css.root, ...themeClasses]),
				id: widgetId,
				focus: this.shouldFocus,
				key: 'root',
				role: 'listbox',
				tabIndex,
				onkeydown: this._onKeyDown
			},
			this.renderOptions()
		);
	}
}

export default Listbox;
