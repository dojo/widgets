import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { diffProperty } from '@dojo/widget-core/decorators/diffProperty';
import { reference } from '@dojo/widget-core/diff';
import { DNode } from '@dojo/widget-core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/widget-core/mixins/Themed';
import { v, w } from '@dojo/widget-core/d';
import uuid from '@dojo/core/uuid';
import { find } from '@dojo/shim/array';
import { Keys } from '../common/util';
import { LabeledProperties, InputProperties } from '../common/interfaces';
import Label from '../label/Label';
import Listbox from '../listbox/Listbox';
import * as css from './styles/select.m.css';
import * as iconCss from '../common/styles/icons.m.css';

/**
 * @type SelectProperties
 *
 * Properties that can be set on a Select component
 *
 * @property getOptionDisabled Function that accepts an option's data and index and returns a boolean
 * @property getOptionId       Function that accepts an option's data and index and returns a string id
 * @property getOptionLabel    Function that accepts an option's data and index and returns a DNode label
 * @property getOptionSelected Function that accepts an option's data and index and returns a boolean
 * @property getOptionValue    Function that accepts an option's data and index and returns a string value
 * @property options           Array of any type of data for the options
 * @property placeholder       Optional placeholder text, only valid for custom select widgets (useNativeElement must be false or undefined)
 * @property useNativeElement  Use the native <select> element if true
 * @property value           The current value
 */
export interface SelectProperties extends ThemedProperties, InputProperties, LabeledProperties {
	getOptionDisabled?(option: any, index: number): boolean;
	getOptionId?(option: any, index: number): string;
	getOptionLabel?(option: any): DNode;
	getOptionSelected?(option: any, index: number): boolean;
	getOptionValue?(option: any, index: number): string;
	options?: any[];
	placeholder?: string;
	useNativeElement?: boolean;
	onBlur?(key?: string | number): void;
	onChange?(option: any, key?: string | number): void;
	onFocus?(key?: string | number): void;
	value?: string;
}

export const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
@theme(iconCss)
@diffProperty('options', reference)
export default class Select<P extends SelectProperties = SelectProperties> extends ThemedBase<P, null> {
	private _callTriggerFocus = false;
	private _callListboxFocus = false;
	private _focusedIndex = 0;
	private _ignoreBlur = false;
	private _open = false;
	private _baseId = uuid();

	private _getOptionLabel(option: any) {
		const { getOptionLabel } = this.properties;
		const fallback = option ? `${option}` : '';
		return getOptionLabel ? getOptionLabel(option) : fallback;
	}

	private _onBlur(event: FocusEvent) {
		this.properties.onBlur && this.properties.onBlur(this.properties.key || '');
	}
	private _onFocus(event: FocusEvent) {
		this.properties.onFocus && this.properties.onFocus(this.properties.key || '');
	}

	// native select events
	private _onNativeChange(event: Event) {
		const { key, getOptionValue, options = [], onChange } = this.properties;
		const value = (<HTMLInputElement>event.target).value;
		const option = find(
			options,
			(option: any, index: number) => (getOptionValue ? getOptionValue(option, index) === value : false)
		);
		option && onChange && onChange(option, key);
	}

	// custom select events
	private _openSelect() {
		this._callListboxFocus = true;
		this._ignoreBlur = true;
		this._open = true;
		this._focusedIndex = this._focusedIndex || 0;
		this.invalidate();
	}

	private _closeSelect() {
		this._ignoreBlur = true;
		this._open = false;
		this.invalidate();
	}

	private _onDropdownKeyDown(event: KeyboardEvent) {
		if (event.which === Keys.Escape) {
			this._callTriggerFocus = true;
			this._closeSelect();
		}
	}

	private _onTriggerClick(event: MouseEvent) {
		this._open ? this._closeSelect() : this._openSelect();
	}

	private _onTriggerBlur(event: FocusEvent) {
		if (this._ignoreBlur) {
			this._ignoreBlur = false;
			return;
		}

		const { key, onBlur } = this.properties;
		onBlur && onBlur(key);
		this._closeSelect();
	}

	private _onTriggerKeyDown(event: KeyboardEvent) {
		if (event.which === Keys.Down) {
			this._openSelect();
		}
	}

	private _onTriggerMouseDown() {
		this._ignoreBlur = true;
	}

	private _onListboxBlur(event: FocusEvent) {
		if (this._ignoreBlur) {
			this._ignoreBlur = false;
			return;
		}

		const { key, onBlur } = this.properties;
		onBlur && onBlur(key);
		this._closeSelect();
	}

	protected getRootClasses() {
		const { disabled, invalid, readOnly, required } = this.properties;

		return [
			css.root,
			disabled ? css.disabled : null,
			invalid === true ? css.invalid : null,
			invalid === false ? css.valid : null,
			readOnly ? css.readonly : null,
			required ? css.required : null
		];
	}

	protected onElementUpdated(element: HTMLElement, key: string) {
		if (key === 'root' && this._callListboxFocus) {
			this._callListboxFocus = false;
			const listbox = <HTMLElement>element.querySelector('[role="listbox"]');
			listbox && listbox.focus();
		}

		if (key === 'trigger' && this._callTriggerFocus) {
			this._callTriggerFocus = false;
			element.focus();
		}
	}

	protected renderExpandIcon(): DNode {
		return v('span', { classes: this.theme(css.arrow) }, [
			v('i', {
				classes: this.theme([iconCss.icon, iconCss.downIcon]),
				role: 'presentation',
				'aria-hidden': 'true'
			})
		]);
	}

	protected renderNativeSelect(): DNode {
		const {
			describedBy,
			disabled,
			getOptionDisabled,
			getOptionId,
			getOptionSelected,
			getOptionValue,
			invalid,
			name,
			options = [],
			readOnly,
			required,
			value
		} = this.properties;

		/* create option nodes */
		const optionNodes = options.map((option, i) =>
			v(
				'option',
				{
					value: getOptionValue ? getOptionValue(option, i) : '',
					id: getOptionId ? getOptionId(option, i) : undefined,
					disabled: getOptionDisabled ? getOptionDisabled(option, i) : undefined,
					selected: getOptionSelected ? getOptionSelected(option, i) : undefined
				},
				[this._getOptionLabel(option)]
			)
		);

		return v('div', { classes: this.theme(css.inputWrapper) }, [
			v(
				'select',
				{
					classes: this.theme(css.input),
					'aria-describedby': describedBy,
					disabled,
					'aria-invalid': invalid ? 'true' : null,
					name,
					readOnly,
					'aria-readonly': readOnly ? 'true' : null,
					required,
					value,
					onblur: this._onBlur,
					onchange: this._onNativeChange,
					onfocus: this._onFocus
				},
				optionNodes
			),
			this.renderExpandIcon()
		]);
	}

	protected renderCustomSelect(): DNode {
		const {
			describedBy,
			getOptionDisabled,
			getOptionId,
			getOptionLabel,
			getOptionSelected,
			key,
			options = [],
			theme,
			onChange
		} = this.properties;

		const { _open, _focusedIndex, _baseId } = this;

		// create dropdown trigger and select box
		return v(
			'div',
			{
				key: 'wrapper',
				classes: this.theme([css.inputWrapper, _open ? css.open : null])
			},
			[
				...this.renderCustomTrigger(),
				v(
					'div',
					{
						classes: this.theme(css.dropdown),
						onfocusout: this._onListboxBlur,
						onkeydown: this._onDropdownKeyDown
					},
					[
						w(Listbox, {
							key: 'listbox',
							activeIndex: _focusedIndex,
							describedBy,
							id: _baseId,
							optionData: options,
							tabIndex: _open ? 0 : -1,
							getOptionDisabled,
							getOptionId,
							getOptionLabel,
							getOptionSelected,
							theme,
							onActiveIndexChange: (index: number) => {
								this._focusedIndex = index;
								this.invalidate();
							},
							onOptionSelect: (option: any) => {
								onChange && onChange(option, key);
								this._callTriggerFocus = true;
								this._closeSelect();
							}
						})
					]
				)
			]
		);
	}

	protected renderCustomTrigger(): DNode[] {
		const {
			describedBy,
			disabled,
			getOptionSelected,
			invalid,
			options = [],
			placeholder,
			readOnly,
			required,
			value
		} = this.properties;

		let label: DNode;
		let isPlaceholder = false;

		const selectedOption = find(options, (option: any, index: number) => {
			return getOptionSelected ? getOptionSelected(option, index) : false;
		});

		if (selectedOption) {
			label = this._getOptionLabel(selectedOption);
		} else {
			isPlaceholder = true;
			label = placeholder ? placeholder : this._getOptionLabel(options[0]);
		}

		return [
			v(
				'button',
				{
					'aria-controls': this._baseId,
					'aria-expanded': `${this._open}`,
					'aria-haspopup': 'listbox',
					'aria-invalid': invalid ? 'true' : null,
					'aria-readonly': readOnly ? 'true' : null,
					'aria-required': required ? 'true' : null,
					classes: this.theme([css.trigger, isPlaceholder ? css.placeholder : null]),
					describedBy,
					disabled,
					key: 'trigger',
					value,
					onblur: this._onTriggerBlur,
					onclick: this._onTriggerClick,
					onfocus: this._onFocus,
					onkeydown: this._onTriggerKeyDown,
					onmousedown: this._onTriggerMouseDown
				},
				[label]
			),
			this.renderExpandIcon()
		];
	}

	protected render(): DNode {
		const {
			label,
			labelHidden,
			labelAfter,
			disabled,
			invalid,
			readOnly,
			required,
			useNativeElement = false,
			theme
		} = this.properties;

		const children = [
			label
				? w(
						Label,
						{
							theme,
							disabled,
							invalid,
							readOnly,
							required,
							hidden: labelHidden,
							forId: this._baseId
						},
						[label]
					)
				: null,
			useNativeElement ? this.renderNativeSelect() : this.renderCustomSelect()
		];

		return v(
			'div',
			{
				key: 'root',
				classes: this.theme(this.getRootClasses())
			},
			labelAfter ? children.reverse() : children
		);
	}
}
