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
 */
export interface TextInputProperties extends ThemeableProperties, FormLabelMixinProperties {
	type?: string;
	onInput?(event: Event): void;
}

@theme(css)
export default class TextInput extends ThemeableMixin(FormLabelMixin(WidgetBase))<TextInputProperties> {
	onInput(event: Event) {
		this.properties.onInput && this.properties.onInput(event);
	}

	render() {
		const {
			type = 'text'
		} = this.properties;

		return v('input', {
			classes: this.classes(css.textinput).get(),
			type: type,
			oninput: this.onInput
		});
	}
}
