import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { FormLabelMixin, FormLabelMixinProperties } from '@dojo/widget-core/mixins/FormLabel';
import { v } from '@dojo/widget-core/d';
import * as css from './styles/textarea.css';

/**
 * @type TextareaProperties
 *
 * Properties that can be set on a TextInput component
 *
 * @property columns	Number of columns, controls the width of the textarea
 * @property rows			Number of rows, controls the height of the textarea
 * @property wrapText			Controls text wrapping. Can be "hard", "soft", or "off"
 * @property onInput	Called when the node's 'input' event is fired
 */
export interface TextareaProperties extends ThemeableProperties, FormLabelMixinProperties {
	columns?: number;
	rows?: number;
	wrapText?: string;
	onInput?(event: Event): void;
}

@theme(css)
export default class Textarea extends ThemeableMixin(FormLabelMixin(WidgetBase))<TextareaProperties> {
	onInput(event: Event) {
		this.properties.onInput && this.properties.onInput(event);
	}

	render() {
		const {
			columns = null,
			rows = null,
			wrapText = null
		} = this.properties;

		return v('textarea', {
			classes: this.classes(css.textarea).get(),
			cols: columns ? columns + '' : null,
			rows: rows ? rows + '' : null,
			wrap: wrapText,
			oninput: this.onInput
		});
	}
}
