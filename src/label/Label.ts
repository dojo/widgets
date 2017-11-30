import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode } from '@dojo/widget-core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/widget-core/mixins/Themed';
import { v } from '@dojo/widget-core/d';
import * as css from './styles/label.m.css';
import * as baseCss from '../common/styles/base.m.css';

/**
 * @type LabelProperties
 *
 * Properties that can be set on a Label component
 *
 * @property forId     ID to explicitly associate the label with an input element
 * @property disabled
 * @property readOnly
 * @property required
 * @property invalid
 * @property hidden
 * @property secondary
 */
export interface LabelProperties extends ThemedProperties {
	forId?: string;
	disabled?: boolean;
	readOnly?: boolean;
	required?: boolean;
	invalid?: boolean;
	hidden?: boolean;
	secondary?: boolean;
}

export const LabelBase = ThemedMixin(WidgetBase);

@theme(css)
export default class Label extends LabelBase<LabelProperties>  {

	protected getRootClasses(): (string | null)[] {
		const {
			disabled,
			invalid,
			readOnly,
			required,
			secondary
		} = this.properties;
		return [
			css.root,
			disabled ? css.disabled : null,
			invalid ? css.invalid : null,
			invalid === false ? css.valid : null,
			readOnly ? css.readonly : null,
			required ? css.required : null,
			secondary ? css.secondary : null
		];
	}

	render(): DNode {
		const { forId, hidden } = this.properties;

		return v('label', {
			classes: [
				...this.theme(this.getRootClasses()),
				hidden ? baseCss.visuallyHidden : null
			],
			for: forId
		}, this.children);
	}
}
