import { WidgetBase, onPropertiesChanged } from '@dojo/widget-core/WidgetBase';
import { DNode, PropertiesChangeEvent } from '@dojo/widget-core/interfaces';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import WidgetRegistry from '@dojo/widget-core/WidgetRegistry';
import { v, w } from '@dojo/widget-core/d';
import uuid from '@dojo/core/uuid';
import { assign } from '@dojo/core/lang';
import { find, includes } from '@dojo/shim/array';
import Label, { LabelOptions } from '../label/Label';
import SelectOption, { OptionData } from './SelectOption';
import * as css from './styles/select.m.css';

/**
 * @type SelectProperties
 *
 * Properties that can be set on a Select component
 *
 * @property customOption   Custom widget constructor for options. Should use SelectOption as a base
 * @property describedBy    ID of an element that provides more descriptive text
 * @property disabled       Prevents the user from interacting with the form field
 * @property formId         ID of a form element associated with the form field
 * @property invalid        Indicates the value entered in the form field is invalid
 * @property label          Label settings for form label text, position, and visibility
 * @property multiple       Whether the widget supports multiple selection
 * @property name           The form widget's name
 * @property options        Array of data for the select options' value, text content, and state
 * @property readOnly       Allows or prevents user interaction
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
	customOption?: any;
	describedBy?: string;
	disabled?: boolean;
	formId?: string;
	invalid?: boolean;
	label?: string | LabelOptions;
	multiple?: boolean;
	name?: string;
	options?: OptionData[];
	readOnly?: boolean;
	required?: boolean;
	useNativeSelect?: boolean;
	value?: string;
	onBlur?(event: FocusEvent): void;
	onChange?(option: OptionData): void;
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

	private _createRegistry(customOption: any) {
		const registry = new WidgetRegistry();
		registry.define('select-option', customOption);

		return registry;
	}

	// native select events
	private _onNativeChange (event: Event) {
		const {
			options = [],
			onChange
		} = this.properties;
		const value = (<HTMLInputElement> event.target).value;
		const option = find(options, (option: OptionData) => option.value === value);
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

	private _onOptionClick(event: MouseEvent, index: number) {
		const {
			options = [],
			onChange,
			onClick
		} = this.properties;

		onClick && onClick(event);

		const option = options[index];

		// if the option exists and isn't disabled, focus it and fire onChange
		if (option && !option.disabled) {
			this._focusedIndex = index;
			onChange && onChange(option);
		}
		else {
			// prevent the menu from closing when clicking on disabled options
			event.preventDefault();
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
			value
		} = this.properties;

		const optionNodes = options.map((option, i) => w('select-option', {
			bind: this,
			focused: this._focusedIndex === i,
			index: i,
			key: i + '',
			optionData: assign({}, option, <any> {
				id: option.id || uuid() + '',
				selected: multiple ? option.selected : value === option.value
			}),
			onMouseDown: this._onOptionMouseDown,
			onClick: this._onOptionClick
		}));

		return optionNodes;
	}

	@onPropertiesChanged()
	protected onPropertiesChanged(evt: PropertiesChangeEvent<this, SelectProperties>) {
		const {
			customOption = SelectOption
		} = this.properties;

		if ( !this.registry || includes(evt.changedPropertyKeys, 'customOption')) {
			this.registry = this._createRegistry(customOption);
		}
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
		const optionNodes = options.map(option => v('option', {
			value: option.value,
			innerHTML: option.label,
			disabled: option.disabled,
			selected: option.selected && multiple ? option.selected : null
		}));

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

		const selectedOption = find(options, (option: OptionData) => option.value === value) || options[0];

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
				label,
				registry: this.registry
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
