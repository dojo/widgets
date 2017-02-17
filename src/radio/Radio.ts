import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { FormLabelMixin, FormLabelMixinProperties } from '@dojo/widget-core/mixins/FormLabel';
import { v } from '@dojo/widget-core/d';
import * as css from './styles/radio.css';

/**
 * @type RadioProperties
 *
 * Properties that can be set on a Radio component
 *
 * @property checked		Checked/unchecked property of the radio
 * @property onChange		Called when the radio is toggled
 */
export interface RadioProperties extends ThemeableProperties, FormLabelMixinProperties {
	checked?: boolean;
	onChange?(event: Event): void;
}

@theme(css)
export default class Radio extends ThemeableMixin(FormLabelMixin(WidgetBase))<RadioProperties> {
	onChange(event: Event) {
		this.properties.onChange && this.properties.onChange(event);
	}

	render() {
		const {
			checked = false
		} = this.properties;

		return v('input', {
			classes: this.classes(css.radio).get(),
			checked: checked ? checked : null,
			type: 'radio',
			onchange: this.onChange
		});
	}
}
