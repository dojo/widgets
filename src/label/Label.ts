import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode } from '@dojo/widget-core/interfaces';
import { ThemeableMixin, ThemeableProperties, theme, ClassesFunctionChain } from '@dojo/widget-core/mixins/Themeable';
import { RegistryMixin, RegistryMixinProperties } from '@dojo/widget-core/mixins/Registry';
import { v } from '@dojo/widget-core/d';
import { assign } from '@dojo/core/lang';
import * as baseCss from '../common/styles/base.m.css';

/**
 * Label settings for form label text content, position (before or after), and visibility
 */
export interface LabelOptions {
	content: string;
	before?: boolean;
	hidden?: boolean;
}

/**
 * Default settings for form labels
 */
const labelDefaults = {
	content: '',
	before: true,
	hidden: false
};

/**
 * @type LabelWidgetProperties
 *
 * Properties that can be set on a Label component
 *
 * @property classes    Optional classes to be set on the label node
 * @property formId     ID of a form element associated with the form field
 * @property label      Label settings for form label text, position, and visibility
 */
export interface LabelProperties extends ThemeableProperties, RegistryMixinProperties {
	classes?: ClassesFunctionChain;
	formId?: string;
	label: string | LabelOptions;
}

export const LabelBase = RegistryMixin(ThemeableMixin(WidgetBase));

@theme(baseCss)
export default class Label extends LabelBase<LabelProperties>  {

	render(): DNode {
		const {
			formId,
			label,
			classes = {}
		} = this.properties;

		// assign string or object label properites with defaults
		let labelProps: LabelOptions;
		if (typeof label === 'string') {
			labelProps = assign({}, labelDefaults, { content: label });
		}
		else {
			labelProps = assign({}, labelDefaults, label);
		}

		// add label text node to children
		const labelText = v('span', {
			innerHTML: labelProps.content,
			classes: this.classes().fixed(labelProps.hidden ? baseCss.visuallyHidden : null)
		});
		if (labelProps.before) {
			this.children.unshift(labelText);
		}
		else {
			this.children.push(labelText);
		}

		return v('label', {
			'form': formId,
			classes: classes
		}, this.children);
	}
}
