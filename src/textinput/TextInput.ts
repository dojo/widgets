import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { FormLabelMixin, FormLabelMixinProperties } from '@dojo/widget-core/mixins/FormLabel';
import { v } from '@dojo/widget-core/d';
import * as css from './styles/textinput.css';

/**
 * @type TextInputProperties
 *
 * Properties that can be set on a TextInput component
 *
 * @property type			Input type, e.g. text, email, tel, etc.
 * @property onInput	Called when the node's 'input' event is fired
 * @property onChange	Called when the node's 'change' event is fired
 * @property onFocus	Called when the input is focused
 * @property onBlur		Called when the input loses focus
 */
export interface TextInputProperties extends ThemeableProperties, FormLabelMixinProperties {
	type?: string;
	onInput?(event: Event): void;
	onChange?(event: Event): void;
	onFocus?(event: Event): void;
	onBlur?(event: Event): void;
}

@theme(css)
export default class TextInput extends ThemeableMixin(FormLabelMixin(WidgetBase))<TextInputProperties> {
	onInput(event: Event) {
		this.properties.onInput && this.properties.onInput(event);
	}

	onChange(event: Event) {
		this.properties.onChange && this.properties.onChange(event);
	}

	onFocus(event: FocusEvent) {
		this.properties.onFocus && this.properties.onFocus(event);
	}

	onBlur(event: FocusEvent) {
		this.properties.onBlur && this.properties.onBlur(event);
	}

	render() {
		const {
			type = 'text',
			invalid
		} = this.properties;

		const classes = [
			css.root,
			typeof invalid === 'boolean' ? invalid ? css.invalid : css.valid : null
		];

		return v('input', {
			classes: this.classes(...classes).get(),
			type: type,
			oninput: this.onInput,
			onchange: this.onChange,
			onfocus: this.onFocus,
			onblur: this.onBlur
		});
	}
}
