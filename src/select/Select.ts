import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { diffProperty } from '@dojo/widget-core/decorators/diffProperty';
import { Constructor, DNode } from '@dojo/widget-core/interfaces';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v, w } from '@dojo/widget-core/d';
import { auto } from '@dojo/widget-core/diff';
import uuid from '@dojo/core/uuid';
import { assign } from '@dojo/core/lang';
import { find } from '@dojo/shim/array';
import { Keys } from '../common/util';
import Label, { LabelOptions, parseLabelClasses } from '../label/Label';
import SelectOption, { OptionData } from './SelectOption';
import * as css from './styles/select.m.css';
import * as iconCss from '../common/styles/icons.m.css';

/**
 * @type SelectProperties
 *
 * Properties that can be set on a Select component
 *
 * @property CustomOption   Custom widget constructor for options. Should use SelectOption as a base
 * @property describedBy    ID of an element that provides more descriptive text
 * @property disabled       Prevents the user from interacting with the form field
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
	CustomOption?: Constructor<SelectOption>;
	describedBy?: string;
	disabled?: boolean;
	invalid?: boolean;
	label?: string | LabelOptions;
	multiple?: boolean;
	name?: string;
	options?: OptionData[];
	readOnly?: boolean;
	required?: boolean;
	useNativeElement?: boolean;
	value?: string;
	onBlur?(event: FocusEvent): void;
	onChange?(option: OptionData): void;
	onClick?(event: MouseEvent): void;
	onFocus?(event: FocusEvent): void;
	onKeyDown?(event: KeyboardEvent): void;
}

export const SelectBase = ThemeableMixin(WidgetBase);

@theme(css)
@theme(iconCss)
export default class Select extends SelectBase<SelectProperties> {
	private _focusedIndex = 0;
	private _ignoreBlur = false;
	private _open = false;
	private _selectId = uuid();
	private _options: OptionData[] = [];

	private _onBlur (event: FocusEvent) { this.properties.onBlur && this.properties.onBlur(event); }
	private _onClick (event: MouseEvent) { this.properties.onClick && this.properties.onClick(event); }
	private _onFocus (event: FocusEvent) { this.properties.onFocus && this.properties.onFocus(event); }
	private _onKeyDown (event: KeyboardEvent) { this.properties.onKeyDown && this.properties.onKeyDown(event); }

	// native select events
	private _onNativeChange (event: Event) {
		const {
			onChange
		} = this.properties;
		const value = (<HTMLInputElement> event.target).value;
		const option = find(this._options, (option: OptionData) => option.value === value)!;
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
			onChange,
			onClick
		} = this.properties;

		onClick && onClick(event);

		const option = this._options[index];

		// if the option exists and isn't disabled, focus it and fire onChange
		if (option && !option.disabled) {
			this._focusedIndex = index;
			onChange && onChange(option);
			this._closeSelect();
		}
		else {
			// prevent the menu from closing when clicking on disabled options
			event.preventDefault();
		}
	}

	private _onListboxKeyDown(event: KeyboardEvent) {
		this.properties.onKeyDown && this.properties.onKeyDown(event);

		const {
			multiple,
			onChange
		} = this.properties;
		const { _focusedIndex } = this;

		switch (event.which) {
			case Keys.Enter:
				if (this._options[_focusedIndex].disabled) {
					event.preventDefault();
				}
				else {
					onChange && onChange(this._options[_focusedIndex]);
				}
				break;
			case Keys.Space:
				if (this._options[_focusedIndex].disabled) {
					event.preventDefault();
				}
				else {
					onChange && onChange(this._options[_focusedIndex]);
				}
				break;
			case Keys.Escape:
				this._closeSelect();
				break;
			case Keys.Down:
				event.preventDefault();
				if (this._open || multiple) {
					this._focusedIndex = (_focusedIndex + 1) % this._options.length;
				} else {
					this._openSelect();
				}
				this.invalidate();
				break;
			case Keys.Up:
				event.preventDefault();
				this._focusedIndex = (_focusedIndex - 1 + this._options.length) % this._options.length;
				this.invalidate();
				break;
			case Keys.Home:
				this._focusedIndex = 0;
				this.invalidate();
				break;
			case Keys.End:
				this._focusedIndex = this._options.length - 1;
				this.invalidate();
				break;
		}
	}

	private _renderCustomOptions(): DNode[] {
		const {
			CustomOption = SelectOption,
			multiple,
			value,
			theme
		} = this.properties;

		const optionNodes = this._options.map((option, i) => w(CustomOption, {
			focused: this._focusedIndex === i,
			index: i,
			key: i + '',
			optionData: assign({}, option, {
				id: option.id,
				selected: multiple ? option.selected : value === option.value
			}),
			onMouseDown: this._onOptionMouseDown,
			onClick: this._onOptionClick,
			theme
		}));

		return optionNodes;
	}

	@diffProperty('options', auto)
	protected onOptionsChange(previousProperties: { options: OptionData[] }, newProperties: { options: OptionData[] }) {
		const {
			options = []
		} = newProperties;

		this._options = options.map((option) => {
			return { id: uuid(), ...option };
		});
	}

	protected renderNativeSelect(): DNode {
		const {
			describedBy,
			disabled,
			invalid,
			multiple,
			name,
			readOnly,
			required,
			value
		} = this.properties;

		/* create option nodes */
		const optionNodes = this._options.map(option => v('option', {
			value: option.value,
			innerHTML: option.label,
			disabled: option.disabled,
			selected: option.selected && multiple ? option.selected : null
		}));

		return v('div', { classes: this.classes(css.inputWrapper) }, [
			v('select', {
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
			multiple ? null : v('span', { classes: this.classes(css.arrow) }, [
				v('i', { classes: this.classes(iconCss.icon, iconCss.downIcon),
					role: 'presentation', 'aria-hidden': 'true'
				})
			])
		]);
	}

	protected renderCustomMultiSelect(): DNode {
		const {
			_focusedIndex
		} = this;
		const {
			describedBy,
			disabled,
			invalid,
			readOnly,
			required
		} = this.properties;

		return v('div', { classes: this.classes(css.inputWrapper) }, [
			v('div', {
				role: 'listbox',
				classes: this.classes(css.input),
				disabled,
				'aria-describedby': describedBy,
				'aria-invalid': invalid ? 'true' : null,
				'aria-multiselectable': 'true',
				'aria-activedescendant': this._options.length > 0 ? this._options[_focusedIndex].id : null,
				'aria-readonly': readOnly ? 'true' : null,
				'aria-required': required ? 'true' : null,
				tabIndex: 0,
				onblur: this._onBlur,
				onfocus: this._onFocus,
				onkeydown: this._onListboxKeyDown
			}, this._renderCustomOptions())
		]);
	}

	protected renderCustomSelect(): DNode {
		const {
			describedBy,
			disabled,
			invalid,
			readOnly,
			required,
			value
		} = this.properties;

		const {
			_open,
			_focusedIndex,
			_selectId
		} = this;

		const selectedOption = find(this._options, (option: OptionData) => option.value === value) || this._options[0];

		// create dropdown trigger and select box
		return v('div', {
			classes: this.classes(css.inputWrapper, _open ? css.open : null)
		}, [
			v('button', {
				classes: this.classes(css.trigger),
				disabled,
				'aria-controls': _selectId,
				'aria-owns': _selectId,
				'aria-expanded': _open + '',
				'aria-haspopup': 'listbox',
				'aria-activedescendant': this._options.length > 0 ? this._options[_focusedIndex].id : null,
				value,
				onblur: this._onTriggerBlur,
				onclick: this._onTriggerClick,
				onfocus: this._onFocus,
				onkeydown: this._onListboxKeyDown
			}, [ selectedOption ? selectedOption.label : '' ]),
			v('span', { classes: this.classes(css.arrow) }, [
				v('i', {
					classes: this.classes(iconCss.icon, iconCss.downIcon),
					role: 'presentation', 'aria-hidden': 'true'
				})
			]),
			v('div', {
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

	protected render(): DNode {
		const {
			disabled,
			invalid,
			label,
			multiple,
			readOnly,
			required,
			useNativeElement = false,
			theme
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

		if (useNativeElement) {
			select = this.renderNativeSelect();
		}
		else {
			select = multiple ? this.renderCustomMultiSelect() : this.renderCustomSelect();
		}

		if (label) {
			rootWidget = w(Label, {
				extraClasses: { root: parseLabelClasses(this.classes(css.root, ...stateClasses)()) },
				label,
				theme
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
