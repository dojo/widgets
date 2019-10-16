import { create, tsx } from '@dojo/framework/core/vdom';
import { DNode } from '@dojo/framework/core/interfaces';
import TextInput from '../../text-input';
import { ThemedProperties } from '@dojo/framework/core/middleware/theme';

export interface NumberInputProperties extends ThemedProperties {
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
	/**  */
	autocomplete?: boolean | string;
	/** ID of an element that this input controls */
	controls?: string;
	/**  */
	customValidator?: (value: string) => { valid?: boolean; message?: string } | void;
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
	/** The min value a number can be */
	min?: number;
	/** The max value a number can be */
	max?: number;
	/** The step to increment the number value by */
	step?: number;
	/**  */
	name?: string;
	/**  */
	onBlur?(): void;
	/**  */
	onFocus?(): void;
	/**  */
	onKeyDown?(key: number, preventDefault: () => void): void;
	/**  */
	onKeyUp?(key: number, preventDefault: () => void): void;
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
	/**  */
	pattern?: string | RegExp;
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
	value?: number;
	/**  */
	widgetId?: string;
}

const factory = create().properties<NumberInputProperties>();

export default factory(function NumberInput({ properties }) {
	const { value } = properties();
	const formattedValue = value !== undefined && value !== null ? value.toString() : '';

	return <TextInput {...properties()} value={formattedValue} type="number" />;
});
