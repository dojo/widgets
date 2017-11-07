import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode, SupportedClassName } from '@dojo/widget-core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/widget-core/mixins/Themed';
import { v } from '@dojo/widget-core/d';
import { assign } from '@dojo/core/lang';
import * as css from './styles/label.m.css';
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
 * @type LabelProperties
 *
 * Properties that can be set on a Label component
 *
 * @property forId     ID to explicitly associate the label with an input element
 * @property label      Label settings for form label text, position, and visibility
 */
export interface LabelProperties extends ThemedProperties {
	forId?: string;
	label: string | LabelOptions;
}

/**
 * This is a helper function for using `extraClasses` with Label.
 * It can be used as follows:
 * extraClasses: { root: parseLabelClasses(this.theme([ css.class1, css.class2 ])) }
 */
export function parseLabelClasses(classes: SupportedClassName | SupportedClassName[]): string {
	return Array.isArray(classes) ? classes.filter((str) => str).join(' ') : classes || '';
}

export const LabelBase = ThemedMixin(WidgetBase);

@theme(css)
export default class Label extends LabelBase<LabelProperties>  {

	render(): DNode {
		const {
			forId,
			label
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
			classes: [ this.theme(css.labelText), labelProps.hidden ? baseCss.visuallyHidden : null ]
		});
		if (labelProps.before) {
			this.children.unshift(labelText);
		}
		else {
			this.children.push(labelText);
		}

		return v('label', {
			classes: this.theme(css.root),
			for: forId
		}, this.children);
	}
}
