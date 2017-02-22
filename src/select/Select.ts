import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { FormLabelMixin, FormLabelMixinProperties, LabelProperties } from '@dojo/widget-core/mixins/FormLabel';
import { v } from '@dojo/widget-core/d';
import * as css from './styles/select.css';

/**
 * @type SelectProperties
 *
 * Properties that can be set on a Select component
 *
 * @property options	object of select options in the format [key: value]: option name
 * @property onChange	Called when the select input's 'change' event is fired
 */
export interface SelectProperties extends ThemeableProperties, FormLabelMixinProperties {
	options?: {
		[key: string]: string
	};
	label?: string | LabelProperties;
	onChange?(event: Event): void;
}

@theme(css)
export default class Select extends ThemeableMixin(FormLabelMixin(WidgetBase))<SelectProperties> {
	onChange(event: Event) {
		this.properties.onChange && this.properties.onChange(event);
	}

	render() {
		const {
			options = {}
		} = this.properties;
		const optionNodes = [];

		for (let key in options) {
			optionNodes.push(v('option', {
				value: key,
				innerHTML: options[key]
			}));
		}

		return v('select', {
			classes: this.classes(css.root).get(),
			onchange: this.onChange
		}, optionNodes);
	}
}
