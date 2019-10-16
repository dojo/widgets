import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { DNode } from '@dojo/framework/core/interfaces';
import { ThemedMixin, ThemedProperties } from '@dojo/framework/core/mixins/Themed';
import { FocusMixin, FocusProperties } from '@dojo/framework/core/mixins/Focus';
import TextInput from '../text-input/index';
import { tsx } from '@dojo/framework/core/vdom';

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

export class EmailInput extends ThemedMixin(FocusMixin(WidgetBase))<EmailInputProperties> {
	protected render(): DNode {
		return <TextInput {...this.properties} type={'email'} />;
	}
}

export default EmailInput;
