import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode } from '@dojo/widget-core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/widget-core/mixins/Themed';
import { v } from '@dojo/widget-core/d';
import * as themeCss from '../theme/label/label.m.css';
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

export const ThemedBase = ThemedMixin(WidgetBase);

@theme(themeCss)
export default class Label<P extends LabelProperties = LabelProperties> extends ThemedBase<P>  {

	protected getRootClasses(): (string | null)[] {
		const {
			disabled,
			invalid,
			readOnly,
			required,
			secondary
		} = this.properties;
		return [
			themeCss.root,
			disabled ? themeCss.disabled : null,
			invalid === true ? themeCss.invalid : null,
			invalid === false ? themeCss.valid : null,
			readOnly ? themeCss.readonly : null,
			required ? themeCss.required : null,
			secondary ? themeCss.secondary : null
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
