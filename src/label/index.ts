import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { DNode } from '@dojo/framework/core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/core/mixins/Themed';
import { v } from '@dojo/framework/core/vdom';
import { formatAriaProperties } from '../common/util';
import * as css from '../theme/label.m.css';
import * as baseCss from '../common/styles/base.m.css';

/**
 * @type LabelProperties
 *
 * Properties that can be set on a Label component
 *
 * @property forId     ID to explicitly associate the label with an input element
 * @property disabled
 * @property focused
 * @property readOnly
 * @property required
 * @property invalid
 * @property hidden
 * @property secondary
 */
export interface LabelProperties extends ThemedProperties {
	aria?: { [key: string]: string | null };
	forId?: string;
	disabled?: boolean;
	focused?: boolean;
	readOnly?: boolean;
	required?: boolean;
	valid?: boolean;
	hidden?: boolean;
	secondary?: boolean;
	widgetId?: string;
}

@theme(css)
export class Label extends ThemedMixin(WidgetBase)<LabelProperties> {
	protected getRootClasses(): (string | null)[] {
		const { disabled, focused, valid, readOnly, required, secondary } = this.properties;
		return [
			css.root,
			disabled ? css.disabled : null,
			focused ? css.focused : null,
			valid === true ? css.valid : null,
			valid === false ? css.invalid : null,
			readOnly ? css.readonly : null,
			required ? css.required : null,
			secondary ? css.secondary : null
		];
	}

	render(): DNode {
		const { aria = {}, forId, hidden, widgetId } = this.properties;

		return v(
			'label',
			{
				...formatAriaProperties(aria),
				id: widgetId,
				classes: [
					...this.theme(this.getRootClasses()),
					hidden ? baseCss.visuallyHidden : null
				],
				for: forId
			},
			this.children
		);
	}
}

export default Label;
