import { WidgetBase, diffProperty } from '@dojo/widget-core/WidgetBase';
import { DNode, Constructor } from '@dojo/widget-core/interfaces';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import WidgetRegistry from '@dojo/widget-core/WidgetRegistry';
import { v, w } from '@dojo/widget-core/d';
import { reference } from '@dojo/widget-core/diff';
import uuid from '@dojo/core/uuid';
import { includes, findIndex } from '@dojo/shim/array';
import { Keys } from '../common/util';
import ListboxOption from './ListboxOption';
import * as css from './styles/listbox.m.css';

/**
 * @type ListboxProperties
 *
 * Properties that can be set on a Listbox component
 *
 * @property activeItem           Option data for the currently active listbox option
 * @property customOption         Custom widget constructor for options. Should extend ListboxOption
 * @property describedBy          ID of an element that provides more descriptive text
 * @property id                   Optional custom id for the listbox
 * @property optionData           Array of data for listbox options
 * @property getOptionLabel       Function to return string label based on option data
 * @property getOptionDisabled    Function that accepts option data and returns a boolean for disabled/not disabled
 * @property getOptionId          Required function that accepts option data and returns a string ID
 * @property getOptionSelected    Function that accepts option data and returns a boolean for selected/unselected
 * @property onActiveOptionChange   Called with the option data of the new requested active descendant
 * @property onOptionSelect         Called with the option data of the new requested selected item
 */

export interface ListboxProperties extends ThemeableProperties {
	activeItem?: any;
	customOption?: Constructor<ListboxOption>;
	describedBy?: string;
	id?: string;
	optionData?: any[];
	getOptionLabel?(option: any): DNode;
	getOptionDisabled?(option: any): boolean;
	getOptionId(option: any): string;
	getOptionSelected?(option: any): boolean;
	onActiveOptionChange?(option: any): void;
	onOptionSelect?(option: any): void;
	onKeyDown?(event: KeyboardEvent): void;
}

export const ListboxBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class Listbox extends ListboxBase<ListboxProperties> {
	private _focused = false;
	private _registry: WidgetRegistry;

	constructor() {
		/* istanbul ignore next: disregard transpiled `super`'s "else" block */
		super();

		this._registry = this._createRegistry(ListboxOption);
		this.getRegistries().add(this._registry);
	}

	private _createRegistry(customOption: Constructor<ListboxOption>) {
		const registry = new WidgetRegistry();
		registry.define('listbox-option', customOption);

		return registry;
	}

	private _getOptionIndex(option: any) {
		const { optionData = [], getOptionId } = this.properties;
		return findIndex(optionData, (data: any) => {
			return getOptionId(option) === getOptionId(data);
		});
	}

	private _onKeyDown(event: KeyboardEvent) {
		const {
			activeItem,
			optionData = [],
			getOptionDisabled = () => false,
			onActiveOptionChange,
			onOptionSelect,
			onKeyDown
		} = this.properties;

		onKeyDown && onKeyDown(event);

		const currentIndex = activeItem ? this._getOptionIndex(activeItem) : 0;
		let newIndex: number;

		switch (event.which) {
			case Keys.Enter:
				if (getOptionDisabled(activeItem)) {
					event.preventDefault();
				}
				else {
					onOptionSelect && onOptionSelect(activeItem);
				}
				break;
			case Keys.Space:
				if (getOptionDisabled(activeItem)) {
					event.preventDefault();
				}
				else {
					onOptionSelect && onOptionSelect(activeItem);
				}
				break;
			case Keys.Down:
				event.preventDefault();
				newIndex = (currentIndex + 1) % optionData.length;
				onActiveOptionChange && onActiveOptionChange(optionData[newIndex]);
				break;
			case Keys.Up:
				event.preventDefault();
				newIndex = (currentIndex - 1 + optionData.length) % optionData.length;
				onActiveOptionChange && onActiveOptionChange(optionData[newIndex]);
				break;
			case Keys.Home:
				onActiveOptionChange && onActiveOptionChange(optionData[0]);
				break;
			case Keys.End:
				onActiveOptionChange && onActiveOptionChange(optionData[optionData.length - 1]);
				break;
		}
	}

	@diffProperty('customOption', reference)
	protected onCustomOptionChange(previousProperties: any, newProperties: any) {
		const {
			customOption = ListboxOption
		} = newProperties;

		const registry = this._createRegistry(customOption);
		this.getRegistries().replace(this._registry, registry);
		this._registry = registry;
	}

	protected renderOptions() {
		const {
			activeItem,
			optionData = [],
			getOptionLabel,
			getOptionDisabled = () => false,
			getOptionId,
			getOptionSelected = () => false,
			onOptionSelect
		} = this.properties;

		return optionData.map((option, i) => w<ListboxOption>('listbox-option', {
			active: getOptionId(option) === activeItem,
			disabled: getOptionDisabled(option),
			getOptionLabel,
			id: getOptionId(option),
			option,
			selected: getOptionSelected(option),
			onClick: (event, data) => {
				onOptionSelect && onOptionSelect(data);
			}
		}));
	}

	protected render() {
		const {
			activeItem,
			describedBy,
			id,
			getOptionId,
			optionData = []
		} = this.properties;

		const activeDescendant = activeItem ? getOptionId(activeItem) : getOptionId(optionData[0]);

		return v('div', {
			classes: this.classes(css.root),
			describedBy,
			id,
			role: 'listbox'
		});
	}
}
