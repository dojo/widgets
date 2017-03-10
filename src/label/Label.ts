import { WidgetBase, onPropertiesChanged } from '@dojo/widget-core/WidgetBase';
import { DNode, PropertiesChangeEvent } from '@dojo/widget-core/interfaces';
import FactoryRegistry from '@dojo/widget-core/FactoryRegistry';
import { ThemeableMixin, ThemeableProperties, theme, ClassesFunctionChain } from '@dojo/widget-core/mixins/Themeable';
import { v } from '@dojo/widget-core/d';
import { assign } from '@dojo/core/lang';
import * as baseCss from '../common/styles/base.css';
import { includes } from '@dojo/shim/array';

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
 * @property classes	Optional classes to be set on the label node
 * @property formId		ID of a form element associated with the form field
 * @property label		Label settings for form label text, position, and visibility
 * @property registry	A widget registry to pass down to children
 */
export interface LabelProperties extends ThemeableProperties {
	classes?: ClassesFunctionChain;
	formId?: string;
	label: string | LabelOptions;
	registry?: FactoryRegistry;
}

export const LabelBase = ThemeableMixin(WidgetBase);

@theme(baseCss)
export default class Label extends LabelBase<LabelProperties>  {
	@onPropertiesChanged
	protected onPropertiesChanged(evt: PropertiesChangeEvent<this, LabelProperties>) {
		if (includes(evt.changedPropertyKeys, 'registry')) {
			this.registry = evt.properties.registry;
		}
	}

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
