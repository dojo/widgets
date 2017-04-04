import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode } from '@dojo/widget-core/interfaces';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v, w } from '@dojo/widget-core/d';
import uuid from '@dojo/core/uuid';
import { find } from '@dojo/shim/array';
import Label, { LabelOptions } from '../label/Label';
import * as css from './styles/select.m.css';

/**
 * @type SelectOption
 *
 * Properties that can be set on a Select component
 *
 * @property label        Text to display to the user
 * @property value        Option value
 * @property disabled     Toggle disabled status of the individual option
 * @property id           Optional custom id
 * @property selected     Toggle selected/deselected state for multiselect widgets
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
 * @property describedBy    ID of an element that provides more descriptive text
 * @property disabled       Prevents the user from interacting with the form field
 * @property formId         ID of a form element associated with the form field
 * @property invalid        Indicates the value entered in the form field is invalid
 * @property label          Label settings for form label text, position, and visibility
 * @property multiple       Whether the widget supports multiple selection
 * @property name           The form widget's name
 * @property options        Array of data for the select options' value, text content, and state
 * @property readOnly       Allows or prevents user interaction
 * @property renderOption   Custom render function for select options
 * @property required       Whether or not a value is required
 * @property useNatveSelect Use the native <select> element if true
 * @property value          The current value
 * @property onBlur         Called when the input loses focus
 * @property onChange       Called when the node's 'change' event is fired
 * @property onClick        Called when the input is clicked
 * @property onFocus        Called when the input is focused
 * @property onKeyDown      Called on the input's keydown event
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
	private _focusedIndex: number;
	private _ignoreBlur: boolean;
	private _open: boolean;
	private _selectId: string;

	private _onBlur (event: FocusEvent) { this.properties.onBlur && this.properties.onBlur(event); }
	private _onClick (event: MouseEvent) { this.properties.onClick && this.properties.onClick(event); }
	private _onFocus (event: FocusEvent) { this.properties.onFocus && this.properties.onFocus(event); }
	private _onKeyDown (event: KeyboardEvent) { this.properties.onKeyDown && this.properties.onKeyDown(event); }

	constructor() {
		super();

		this._focusedIndex = 0;
		this._ignoreBlur = false;
		this._open = false;
		this._selectId = uuid();
	}

	// native select events
	private _onNativeChange (event: Event) {
		const {
			options = [],
			onChange
		} = this.properties;
		const value = (<HTMLInputElement> event.target).value;
		const option = find(options, (option: SelectOption) => option.value === value);
		onChange && onChange(option);
	}

	// custom select events
	private _openSelect() {
		this._open = true;
		this._ignoreBlur = false;
		this._focusedIndex = this._focusedIndex || 0;
		this.invalidate();
	}
	private _closeSelect() {
		this._open = false;
		this.invalidate();
	}

	private _onTriggerClick(event: MouseEvent) {
		this.properties.onClick && this.properties.onClick(event);

		this._open ? this._closeSelect() : this._openSelect();
	}

	private _onTriggerBlur(event: FocusEvent) {
		if (!this._ignoreBlur) {
			this.properties.onBlur && this.properties.onBlur(event);
			this._closeSelect();
		}
	}

	private _onOptionMouseDown() {
		this._ignoreBlur = true;
	}

	private _onOptionClick(event: MouseEvent) {
		const {
			options = [],
			onChange,
			onClick
		} = this.properties;

		onClick && onClick(event);

		// find parent option node, and get index
		let optionNode = <HTMLElement> event.target;
		while (!optionNode.hasAttribute('data-dojo-index') && optionNode.parentElement) {
			optionNode = optionNode.parentElement;
		}

		const index = optionNode.getAttribute('data-dojo-index');
		if (index) {
			const option = options[parseInt(index, 10)];

			if (option && !option.disabled) {
				this._focusedIndex = parseInt(index, 10);
				onChange && onChange(option);
			}
			else {
				event.preventDefault();
			}
		}
	}

	private _onListboxKeyDown(event: KeyboardEvent) {
		this.properties.onKeyDown && this.properties.onKeyDown(event);

		const {
			options = [],
			multiple,
			onChange
		} = this.properties;
		const { _focusedIndex } = this;

		switch (event.which) {
			case keys.enter:
				if (options[_focusedIndex].disabled) {
					event.preventDefault();
				}
				else {
					onChange && onChange(options[_focusedIndex]);
				}
				break;
			case keys.space:
				if (options[_focusedIndex].disabled) {
					event.preventDefault();
				}
				else {
					onChange && onChange(options[_focusedIndex]);
				}
				break;
			case keys.escape:
				this._closeSelect();
				break;
			case keys.down:
				event.preventDefault();
				if (this._open || multiple) {
					this._focusedIndex = (_focusedIndex + 1) % options.length;
				} else {
					this._openSelect();
				}
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

			const optionClasses = [
				css.option,
				this._focusedIndex === i ? css.focused : null,
				option.selected ? css.selected : null,
				option.disabled ? css.disabledOption : null
			];

			optionNodes.push(v('div', {
				bind: this,
				role: 'option',
				id: option.id,
				classes: this.classes(...optionClasses),
				'aria-disabled': option.disabled ? 'true' : null,
				'aria-selected': option.selected ? 'true' : 'false',
				'data-dojo-index': i + '',
				onclick: this._onOptionClick,
				onmousedown: this._onOptionMouseDown
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
				onblur: this._onBlur,
				onchange: this._onNativeChange,
				onclick: this._onClick,
				onfocus: this._onFocus,
				onkeydown: this._onKeyDown
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
			_focusedIndex
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
				'aria-activedescendant': options.length > 0 ? options[_focusedIndex].id : null,
				'aria-readonly': readOnly ? 'true' : null,
				'aria-required': required ? 'true' : null,
				tabIndex: 0,
				onblur: this._onBlur,
				onfocus: this._onFocus,
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

		const {
			_open,
			_focusedIndex,
			_selectId
		} = this;

		const selectedOption = find(options, (option: SelectOption) => option.value === value) || options[0];

		// create dropdown trigger and select box
		return v('div', {
			classes: this.classes(css.inputWrapper, _open ? css.open : null)
		}, [
			v('button', {
				bind: this,
				classes: this.classes(css.trigger, css.input),
				disabled,
				'aria-controls': _selectId,
				'aria-owns': _selectId,
				'aria-expanded': _open + '',
				'aria-haspopup': 'listbox',
				'aria-activedescendant': options.length > 0 ? options[_focusedIndex].id : null,
				value,
				onblur: this._onTriggerBlur,
				onclick: this._onTriggerClick,
				onfocus: this._onFocus,
				onkeydown: this._onListboxKeyDown
			}, [ selectedOption ? selectedOption.label : '' ]),
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

		let rootWidget, select;

		if (useNativeSelect) {
			select = this.renderNativeSelect();
		}
		else {
			select = multiple ? this.renderCustomMultiSelect() : this.renderCustomSelect();
		}

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
