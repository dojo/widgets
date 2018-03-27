import { auto, reference } from '@dojo/widget-core/diff';
import { diffProperty } from '@dojo/widget-core/decorators/diffProperty';
import Dimensions from '@dojo/widget-core/meta/Dimensions';
import { DNode } from '@dojo/widget-core/interfaces';
import { CustomAriaProperties } from '../common/interfaces';
import { formatAriaProperties, Keys } from '../common/util';
import MetaBase from '@dojo/widget-core/meta/Base';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/widget-core/mixins/Themed';
import uuid from '@dojo/core/uuid';
import { v, w } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';

import * as css from '../theme/listbox.m.css';
import ListboxOption from './ListboxOption';
import { Focus } from '@dojo/widget-core/meta/Focus';
import { customElement } from '@dojo/widget-core/decorators/customElement';

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
 * @property rootId               Optional custom id for the root node of the listbox
 * @property focus                Indicates if the listbox needs focusing
 * @property multiselect          Adds currect semantics for a multiselect listbox
 * @property optionData           Array of data for listbox options
 * @property tabIndex             Listbox is in the focus order by default, but setting tabIndex: -1 will remove it
 * @property visualFocus          When controlling Listbox through an outside widget, e.g. in ComboBox, visualFocus mimics visual focus styling when true
 * @property onActiveIndexChange  Called with the index of the new requested active descendant
 * @property onOptionSelect       Called with the option data of the new requested selected item
 */

export interface ListboxProperties extends ThemedProperties, CustomAriaProperties {
	activeIndex?: number;
	getOptionDisabled?(option: any, index: number): boolean;
	getOptionId?(option: any, index: number): string;
	getOptionLabel?(option: any, index: number): DNode;
	getOptionSelected?(option: any, index: number): boolean;
	rootId?: string;
	focus?: boolean;
	multiselect?: boolean;
	optionData?: any[];
	tabIndex?: number;
	visualFocus?: boolean;
	onActiveIndexChange?(index: number, key?: string | number): void;
	onKeyDown?(event: KeyboardEvent, key?: string | number): void;
	onOptionSelect?(option: any, index: number, key?: string | number): void;
}

export const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
@diffProperty('optionData', reference)
@customElement<ListboxProperties>({
	tag: 'dojo-listbox',
	properties: [
		'activeIndex',
		'focus',
		'multiselect',
		'tabIndex',
		'visualFocus',
		'optionData',
		'getOptionDisabled',
		'getOptionId',
		'getOptionLabel',
		'getOptionSelected'
	],
	attributes: [
		'rootId'
	],
	events: [
		'onActiveIndexChange',
		'onKeyDown',
		'onOptionSelect'
	]
})
export class ListboxBase<P extends ListboxProperties = ListboxProperties> extends ThemedBase<P, null> {
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
			key,
			optionData = [],
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
				if (!this._getOptionDisabled(activeItem, activeIndex)) {
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

	private _onOptionClick(option: any, index: number, key?: string | number) {
		const { onActiveIndexChange, onOptionSelect } = this.properties;
		if (!this._getOptionDisabled(option, index)) {
			onActiveIndexChange && onActiveIndexChange(index, key);
			onOptionSelect && onOptionSelect(option, index, key);
		}
	}

	protected animateScroll(scrollValue: number) {
		this.meta(ScrollMeta).scroll('root', scrollValue);
	}

	@diffProperty('activeIndex', auto)
	protected calculateScroll(previousProperties: ListboxProperties, { activeIndex = 0 }: ListboxProperties) {
		const menuDimensions = this.meta(Dimensions).get('root');
		const scrollOffset = menuDimensions.scroll.top;
		const menuHeight = menuDimensions.offset.height;
		const optionOffset = this.meta(Dimensions).get(this._getOptionId(activeIndex)).offset;

		if (optionOffset.top - scrollOffset < 0) {
			this.animateScroll(optionOffset.top);
		}

		else if ((optionOffset.top + optionOffset.height) > (scrollOffset + menuHeight)) {
			this.animateScroll(optionOffset.top + optionOffset.height - menuHeight);
		}
	}

	protected getModifierClasses() {
		const { visualFocus } = this.properties;
		const focus = this.meta(Focus).get('root');
		return [
			(visualFocus || focus.containsFocus) ? css.focused : null
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

	protected renderOptionLabel(option: any, index: number): DNode {
		const { getOptionLabel } = this.properties;
		return getOptionLabel ? getOptionLabel(option, index) : `${option}`;
	}

	protected renderOption(option: any, index: number): DNode {
		const {
			activeIndex = 0,
			getOptionSelected,
			theme
		} = this.properties;

		const disabled = this._getOptionDisabled(option, index);
		const selected = getOptionSelected ? getOptionSelected(option, index) : false;

		return v('div', { key: this._getOptionId(index) }, [
			w(ListboxOption, {
				active: activeIndex === index,
				classes: this.getOptionClasses(activeIndex === index, disabled, selected),
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
		const {
			optionData = []
		} = this.properties;

		return optionData.map(this._boundRenderOption);
	}

	protected render(): DNode {
		const {
			activeIndex = 0,
			aria = {},
			rootId,
			multiselect = false,
			focus,
			tabIndex = 0
		} = this.properties;
		const themeClasses = this.getModifierClasses();

		return v('div', () => {
			if (focus) {
				this.meta(Focus).set('root');
			}

			return {
				...formatAriaProperties(aria),
				'aria-activedescendant': this._getOptionId(activeIndex),
				'aria-multiselectable': multiselect ? 'true' : null,
				classes: this.theme([ css.root, ...themeClasses ]),
				id: rootId,
				key: 'root',
				role: 'listbox',
				tabIndex,
				onkeydown: this._onKeyDown
			};
		}, this.renderOptions());
	}
}

export default class Listbox extends ListboxBase<ListboxProperties> {}
