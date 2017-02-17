import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { FormLabelMixin, FormLabelMixinProperties } from '@dojo/widget-core/mixins/FormLabel';
import { v } from '@dojo/widget-core/d';
import * as css from './styles/checkbox.css';

/**
 * @type CheckboxProperties
 *
 * Properties that can be set on a Checkbox component
 *
 * @property checked		Checked/unchecked property of the checkbox
 * @property onChange		Called when the checkbox is toggled
 */
export interface CheckboxProperties extends ThemeableProperties, FormLabelMixinProperties {
	checked?: boolean;
	onChange?(event: Event): void;
}

@theme(css)
export default class Checkbox extends ThemeableMixin(FormLabelMixin(WidgetBase))<CheckboxProperties> {
	onChange(event: Event) {
		this.properties.onChange && this.properties.onChange(event);
	}

	render() {
		const {
			checked = false
		} = this.properties;

		return v('input', {
			classes: this.classes(css.checkbox).get(),
			checked: checked ? checked : null,
			type: 'checkbox',
			onchange: this.onChange
		});
	}
}
