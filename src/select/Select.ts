import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode } from '@dojo/widget-core/interfaces';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v, w } from '@dojo/widget-core/d';
import uuid from '@dojo/core/uuid';
import Label, { LabelOptions } from '../label/Label';
import * as css from './styles/select.m.css';

/**
 * @type SelectOption
 *
 * Properties that can be set on a Select component
 *
 * @property label				Text to display to the user
 * @property value				Option value
 * @property disabled			Toggle disabled status of the individual option
 * @property id						Optional custom id
 * @property selected			Toggle selected/deselected state for multiselect widgets
 */
export interface SelectOption {
	label: string;
	value: string;
	disabled?: boolean;
	id?: string;
	selected?: boolean;
}

/**
 * @type SelectProperties
 *
 * Properties that can be set on a Select component
 *
 * @property describedBy	ID of an element that provides more descriptive text
 * @property disabled			Prevents the user from interacting with the form field
 * @property formId				ID of a form element associated with the form field
 * @property invalid			Indicates the value entered in the form field is invalid
 * @property label				Label settings for form label text, position, and visibility
 * @property multiple			Whether the widget supports multiple selection
 * @property name					The form widget's name
 * @property options			Array of data for the select options' value, text content, and state
 * @property readOnly			Allows or prevents user interaction
 * @property renderOption	Custom render function for select options
 * @property required			Whether or not a value is required
 * @property useNatveSelect		Use the native <select> element if true
 * @property value				The current value
 * @property onBlur				Called when the input loses focus
 * @property onChange			Called when the node's 'change' event is fired
 * @property onClick			Called when the input is clicked
 * @property onFocus			Called when the input is focused
 * @property onKeyDown		Called on the input's keydown event
 */
export interface SelectProperties extends ThemeableProperties {
	describedBy?: string;
	disabled?: boolean;
	formId?: string;
	invalid?: boolean;
	label?: string | LabelOptions;
	multiple?: boolean;
	name?: string;
	options?: SelectOption[];
	readOnly?: boolean;
	renderOption?(option: SelectOption): DNode;
	required?: boolean;
	useNativeSelect?: boolean;
	value?: string;
	onBlur?(event: FocusEvent): void;
	onChange?(option: SelectOption): void;
	onClick?(event: MouseEvent): void;
	onFocus?(event: FocusEvent): void;
	onKeyDown?(event: KeyboardEvent): void;
}

// This should have a lookup somewhere
const keys = {
	escape: 27,
	enter: 13,
	space: 32,
	up: 38,
	down: 40,
	home: 36,
	end: 35
};

export const SelectBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class Select extends SelectBase<SelectProperties> {
	private _open = false;
	private _focusedIndex: number;
	private _selectId: string = uuid();

	// native select events
	private _onNativeBlur (event: FocusEvent) { this.properties.onBlur && this.properties.onBlur(event); }
	private _onNativeChange (event: Event) {
		const { options = [] } = this.properties;
		const option = options.filter((option: SelectOption) => option.value === (<HTMLInputElement> event.target).value)[0];
		this.properties.onChange && this.properties.onChange(option);
	}
	private _onNativeClick (event: MouseEvent) { this.properties.onClick && this.properties.onClick(event); }
	private _onNativeFocus (event: FocusEvent) { this.properties.onFocus && this.properties.onFocus(event); }
	private _onNativeKeyDown (event: KeyboardEvent) { this.properties.onKeyDown && this.properties.onKeyDown(event); }

	// custom select events
	private _onTriggerClick(event: MouseEvent) {
		this.properties.onClick && this.properties.onClick(event);

		this._open = !this._open;
		this._focusedIndex = this._focusedIndex || 0;
		this.invalidate();
	}

	private _onTriggerBlur() {
		this._open = false;
		this.invalidate();
	}

	private _onOptionClick(event: MouseEvent) {
		this.properties.onClick && this.properties.onClick(event);

		const {
			options = [],
			onChange
		} = this.properties;
		const clickedOption = options.filter((option: SelectOption, i: number) => {
			if (option.value === (<HTMLInputElement> event.target).value) {
				this._focusedIndex = i;
				return true;
			}
			return false;
		})[0];
		onChange && onChange(clickedOption);
	}

	private _onListboxKeyDown(event: KeyboardEvent) {
		this.properties.onKeyDown && this.properties.onKeyDown(event);

		const {
			options = [],
			onChange
		} = this.properties;
		const { _focusedIndex = 0 } = this;

		switch (event.which) {
			case keys.enter:
				onChange && onChange(options[_focusedIndex]);
				break;
			case keys.space:
				onChange && onChange(options[_focusedIndex]);
				break;
			case keys.escape:
				this._open = false;
				this.invalidate();
				break;
			case keys.down:
				event.preventDefault();
				this._focusedIndex = (_focusedIndex + 1) % options.length;
				this.invalidate();
				break;
			case keys.up:
				event.preventDefault();
				this._focusedIndex = (_focusedIndex - 1 + options.length) % options.length;
				this.invalidate();
				break;
			case keys.home:
				this._focusedIndex = 0;
				this.invalidate();
				break;
			case keys.end:
				this._focusedIndex = options.length - 1;
				this.invalidate();
				break;
		}
	}

	private _renderCustomOptions(): DNode[] {
		const {
			multiple,
			options = [],
			renderOption,
			value
		} = this.properties;

		const optionNodes = [];
		let optionNode, option;
		for (let i = 0; i < options.length; i++) {
			option = options[i];
			option.id = option.id || uuid() + '';
			option.selected = multiple ? option.selected : value === option.value;
			optionNode = renderOption ? renderOption(option) : option.label;

			optionNodes.push(v('div', {
				bind: this,
				role: 'option',
				id: option.id,
				classes: this.classes(this._focusedIndex === i ? css.focused : null, option.selected ? css.selected : null),
				'aria-disabled': option.disabled ? 'true' : null,
				'aria-selected': option.selected ? 'true' : 'false',
				onclick: this._onOptionClick
			}, [ optionNode ]));
		}

		return optionNodes;
	}

	renderNativeSelect(): DNode {
		const {
			describedBy,
			disabled,
			invalid,
			multiple,
			name,
			options = [],
			readOnly,
			required,
			value
		} = this.properties;

		/* create option nodes */
		const optionNodes = [];
		for (let option of options) {
			optionNodes.push(v('option', {
				value: option.value,
				innerHTML: option.label,
				disabled: option.disabled,
				selected: option.selected && multiple ? option.selected : null
			}));
		}

		return v('div', { classes: this.classes(css.inputWrapper) }, [
			v('select', {
				bind: this,
				classes: this.classes(css.input),
				'aria-describedby': describedBy,
				disabled,
				'aria-invalid': invalid ? 'true' : null,
				multiple: multiple ? true : null,
				name,
				readOnly,
				'aria-readonly': readOnly ? 'true' : null,
				required,
				value,
				onblur: this._onNativeBlur,
				onchange: this._onNativeChange,
				onclick: this._onNativeClick,
				onfocus: this._onNativeFocus,
				onkeydown: this._onNativeKeyDown
			}, optionNodes),
			v('span', {
				classes: this.classes(css.arrow)
			})
		]);
	}

	renderCustomMultiSelect(): DNode {
		const {
			describedBy,
			disabled,
			invalid,
			options = [],
			readOnly,
			required
		} = this.properties;

		const {
			_focusedIndex = 0
		} = this;

		return v('div', { classes: this.classes(css.inputWrapper) }, [
			v('div', {
				bind: this,
				role: 'listbox',
				classes: this.classes(css.input),
				disabled,
				'aria-describedby': describedBy,
				'aria-invalid': invalid ? 'true' : null,
				'aria-multiselectable': 'true',
				'aria-activedescendant': options[_focusedIndex].id,
				'aria-readonly': readOnly ? 'true' : null,
				'aria-required': required ? 'true' : null,
				tabIndex: 0,
				onblur: this._onNativeBlur,
				onfocus: this._onNativeFocus,
				onkeydown: this._onListboxKeyDown
			}, this._renderCustomOptions())
		]);
	}

	renderCustomSelect(): DNode {
		const {
			describedBy,
			disabled,
			invalid,
			options = [],
			readOnly,
			required,
			value
		} = this.properties;

		// create dropdown trigger (if single-select) and select box
		const {
			_open = false,
			_focusedIndex = 0,
			_selectId
		} = this;

		const selectedOption = options.filter((option: SelectOption) => option.value === value)[0] || options[0];

		return v('div', {
			classes: this.classes(css.inputWrapper, _open ? css.open : null)
		}, [
			v('button', {
				bind: this,
				type: 'button',
				classes: this.classes(css.trigger, css.input),
				disabled,
				'aria-controls': _selectId,
				'aria-owns': _selectId,
				'aria-expanded': _open + '',
				'aria-haspopup': 'listbox',
				'aria-activedescendant': options[_focusedIndex].id,
				value,
				onblur: this._onTriggerBlur,
				onclick: this._onTriggerClick,
				onfocus: this._onNativeFocus,
				onkeydown: this._onListboxKeyDown
			}, [ selectedOption.label ]),
			v('div', {
				bind: this,
				role: 'listbox',
				id: _selectId,
				classes: this.classes(css.dropdown),
				'aria-describedby': describedBy,
				'aria-invalid': invalid ? 'true' : null,
				'aria-readonly': readOnly ? 'true' : null,
				'aria-required': required ? 'true' : null
			}, this._renderCustomOptions())
		]);
	}

	render(): DNode {
		const {
			disabled,
			formId,
			invalid,
			label,
			multiple,
			readOnly,
			required,
			useNativeSelect = false
		} = this.properties;

		const stateClasses = [
			disabled ? css.disabled : null,
			invalid ? css.invalid : null,
			invalid === false ? css.valid : null,
			multiple ? css.multiselect : null,
			readOnly ? css.readonly : null,
			required ? css.required : null
		];

		let rootWidget;

		const select = useNativeSelect ? this.renderNativeSelect() : multiple ? this.renderCustomMultiSelect() : this.renderCustomSelect();

		if (label) {
			rootWidget = w(Label, {
				classes: this.classes(css.root, ...stateClasses),
				formId,
				label
			}, [ select ]);
		}
		else {
			rootWidget = v('div', {
				classes: this.classes(css.root, ...stateClasses)
			}, [ select ]);
		}

		return rootWidget;
	}
}
