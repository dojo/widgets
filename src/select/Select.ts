import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode } from '@dojo/widget-core/interfaces';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v, w } from '@dojo/widget-core/d';
import uuid from '@dojo/core/uuid';
import Label, { LabelOptions } from '../label/Label';
import * as css from './styles/select.css';

export interface SelectOption {
	value: string;
	label: string;
	id?: string;
	disabled?: boolean;
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
 * @property onKeyPress		Called on the input's keypress event
 * @property onKeyUp			Called on the input's keyup event
 * @property onMouseDown	Called on the input's mousedown event
 * @property onMouseUp		Called on the input's mouseup event
 * @property onTouchStart	Called on the input's touchstart event
 * @property onTouchEnd		Called on the input's touchend event
 * @property onTouchCancel	Called on the input's touchcancel event
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
	onChange?(value: string): void;
	onClick?(event: MouseEvent): void;
	onFocus?(event: FocusEvent): void;
	onKeyDown?(event: KeyboardEvent): void;
	onKeyPress?(event: KeyboardEvent): void;
	onKeyUp?(event: KeyboardEvent): void;
	onMouseDown?(event: MouseEvent): void;
	onMouseUp?(event: MouseEvent): void;
	onTouchStart?(event: TouchEvent): void;
	onTouchEnd?(event: TouchEvent): void;
	onTouchCancel?(event: TouchEvent): void;
}

// This should have a lookup somewhere
const keys = {
	escape: 27,
	enter: 13,
	space: 32,
	up: 38,
	down: 40
};

export const SelectBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class Select extends SelectBase<SelectProperties> {
	private _open = false;
	private _focusedIndex: number;

	// default form events
	onBlur (event: FocusEvent) { this.properties.onBlur && this.properties.onBlur(event); }
	onChange (event: Event, value?: string) {
		value = value || (<HTMLInputElement> event.target).value;
		this.properties.onChange && this.properties.onChange(value);
	}
	onClick (event: MouseEvent) { this.properties.onClick && this.properties.onClick(event); }
	onFocus (event: FocusEvent) { this.properties.onFocus && this.properties.onFocus(event); }
	onKeyDown (event: KeyboardEvent) { this.properties.onKeyDown && this.properties.onKeyDown(event); }
	onKeyPress (event: KeyboardEvent) { this.properties.onKeyPress && this.properties.onKeyPress(event); }
	onKeyUp (event: KeyboardEvent) { this.properties.onKeyUp && this.properties.onKeyUp(event); }
	onMouseDown (event: MouseEvent) { this.properties.onMouseDown && this.properties.onMouseDown(event); }
	onMouseUp (event: MouseEvent) { this.properties.onMouseUp && this.properties.onMouseUp(event); }
	onTouchStart (event: TouchEvent) { this.properties.onTouchStart && this.properties.onTouchStart(event); }
	onTouchEnd (event: TouchEvent) { this.properties.onTouchEnd && this.properties.onTouchEnd(event); }
	onTouchCancel (event: TouchEvent) { this.properties.onTouchCancel && this.properties.onTouchCancel(event); }

	private _keyHandlers = {
		[keys.enter](this: Select, event: KeyboardEvent) {
			const { options = [] } = this.properties;
			const { _focusedIndex = 0 } = this;
			this.onChange(event, options[_focusedIndex].value);
		},
		[keys.space](this: Select, event: KeyboardEvent) {
			const { options = [] } = this.properties;
			const { _focusedIndex = 0 } = this;
			this.onChange(event, options[_focusedIndex].value);
		},
		[keys.escape](this: Select) {
			this._open = false;
			this.invalidate();
		},
		[keys.down](this: Select) {
			const { options = [] } = this.properties;
			const { _focusedIndex = 0 } = this;

			this._focusedIndex = (_focusedIndex + 1) % options.length;
			this.invalidate();
		}
	};

	// custom events
	private _onTriggerClick(event: MouseEvent) {
		this.properties.onClick && this.properties.onClick(event);
		this._open = !this._open;
		this._focusedIndex = this._focusedIndex || 0;
		this.invalidate();
	}

	private _onListboxKeyDown(event: KeyboardEvent) {
		this._keyHandlers[event.which] && this._keyHandlers[event.which].call(this, event);
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
				'aria-invalid': invalid + '',
				multiple: multiple ? true : null,
				name,
				readOnly,
				'aria-readonly': readOnly ? 'true' : null,
				required,
				value,
				onblur: this.onBlur,
				onchange: this.onChange,
				onclick: this.onClick,
				onfocus: this.onFocus,
				onkeydown: this.onKeyDown,
				onkeypress: this.onKeyPress,
				onkeyup: this.onKeyUp,
				onmousedown: this.onMouseDown,
				onmouseup: this.onMouseUp,
				ontouchstart: this.onTouchStart,
				ontouchend: this.onTouchEnd,
				ontouchcancel: this.onTouchCancel
			}, optionNodes),
			v('span', {
				classes: this.classes(css.arrow)
			})
		]);
	}

	renderCustomSelect(): DNode {
		const {
			describedBy,
			disabled,
			invalid,
			multiple,
			options = [],
			readOnly,
			renderOption,
			required,
			value
		} = this.properties;

		// create option nodes
		const optionNodes = [];
		let optionNode, option;
		for (let i = 0; i < options.length; i++) {
			option = options[i];
			option.id = option.id || uuid() + '';

			if (renderOption) {
				optionNode = renderOption(option);
			}
			else {
				optionNode = option.label;
			}
			optionNodes.push(v('div', {
				role: 'option',
				id: option.id,
				classes: this.classes(this._focusedIndex === i ? css.focused : null, option.selected ? css.selected : null),
				'aria-disabled': option.disabled ? 'true' : null,
				'aria-selected': option.selected ? 'true' : 'false'
			}, [ optionNode ]));
		}

		const {
			_open = false,
			_focusedIndex = 0
		} = this;

		// menu dropdown id
		const selectId = uuid();

		return v('div', {
			classes: this.classes(css.inputWrapper, _open ? css.open : null)
		}, [
			v('button', {
				bind: this,
				type: 'button',
				classes: this.classes(css.trigger),
				disabled,
				'aria-describedby': describedBy,
				'aria-controls': selectId,
				'aria-owns': selectId,
				'aria-expanded': _open + '',
				'aria-haspopup': 'listbox',
				'aria-activedescendant': options[_focusedIndex].id,
				value,
				onclick: this._onTriggerClick,
				onkeydown: this._onListboxKeyDown
			}, [ options[0].label ]),
			v('div', {
				bind: this,
				role: 'listbox',
				id: selectId,
				classes: this.classes(css.dropdown),
				'aria-invalid': invalid ? 'true' : null,
				'aria-multiselectable': multiple ? 'true' : null,
				'aria-readonly': readOnly ? 'true' : null,
				'aria-required': required ? 'true' : null
			}, optionNodes)
		]);
	}

	render(): DNode {
		const {
			disabled,
			formId,
			invalid,
			label,
			readOnly,
			required,
			useNativeSelect = false
		} = this.properties;

		const stateClasses = [
			disabled ? css.disabled : null,
			invalid ? css.invalid : null,
			invalid === false ? css.valid : null,
			readOnly ? css.readonly : null,
			required ? css.required : null
		];

		let rootWidget;

		const select = useNativeSelect ? this.renderNativeSelect() : this.renderCustomSelect();

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
