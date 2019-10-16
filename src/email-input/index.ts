import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { DNode } from '@dojo/framework/core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/core/mixins/Themed';
import { v, w } from '@dojo/framework/core/vdom';
import { FocusMixin, FocusProperties } from '@dojo/framework/core/mixins/Focus';
import { uuid } from '@dojo/framework/core/util';
import * as css from '../theme/text-input.m.css';
import TextInput from '../text-input/index';

export interface EmailInputProperties extends ThemedProperties, FocusProperties {
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
	/** ID of an element that this input controls */
	controls?: string;
	/**  */
	disabled?: boolean;
	/**  */
	helperText?: string;
	/**  */
	label?: string;
	/**  */
	labelHidden?: boolean;
	/** Renderer for leading icon content */
	leading?: () => DNode;
	/**  */
	name?: string;
	/**  */
	onBlur?(): void;
	/**  */
	onFocus?(): void;
	/**  */
	onValidate?: (valid: boolean | undefined, message: string) => void;
	/**  */
	onValue?(value?: string): void;
	/**  */
	onClick?(): void;
	/**  */
	onOver?(): void;
	/**  */
	onOut?(): void;
	/** Placeholder text */
	placeholder?: string;
	/**  */
	readOnly?: boolean;
	/**  */
	required?: boolean;
	/** Renderer for trailing icon content */
	trailing?: () => DNode;
	/**  */
	valid?: { valid?: boolean; message?: string } | boolean;
	/** The current value */
	value?: string;
	/**  */
	widgetId?: string;
}

@theme(css)
export class EmailInput extends ThemedMixin(FocusMixin(WidgetBase))<EmailInputProperties> {
	private _uuid = uuid();

	protected render(): DNode {
		const {
			aria = {},
			classes,
			disabled,
			label,
			labelHidden = false,
			leading,
			name,
			placeholder,
			readOnly,
			required,
			theme,
			trailing,
			value,
			widgetId = this._uuid,
			helperText,
			onValidate,
			onValue,
			onBlur,
			onFocus,
			onClick,
			onOver,
			onOut,
			valid,
			controls
		} = this.properties;

		return v(
			'div',
			{
				key: 'root',
				role: 'presentation'
			},
			[
				w(TextInput, {
					aria,
					classes,
					controls,
					disabled,
					label,
					labelHidden,
					leading,
					name,
					placeholder,
					readOnly,
					required,
					theme,
					trailing,
					value,
					widgetId,
					helperText,
					onValue,
					onValidate,
					onBlur,
					onFocus,
					onClick,
					onOver,
					onOut,
					type: 'email',
					valid
				})
			]
		);
	}
}

export default EmailInput;
