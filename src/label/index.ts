import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { DNode } from '@dojo/framework/core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/core/mixins/Themed';
import { v } from '@dojo/framework/core/vdom';
import { CustomAriaProperties } from '../common/interfaces';
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
export interface LabelProperties extends ThemedProperties, CustomAriaProperties {
	forId?: string;
	disabled?: boolean;
	focused?: boolean;
	readOnly?: boolean;
	required?: boolean;
	invalid?: boolean;
	hidden?: boolean;
	secondary?: boolean;
	widgetId?: string;
}

@theme(css)
export class Label extends ThemedMixin(WidgetBase)<LabelProperties> {
	protected getRootClasses(): (string | null)[] {
		const { disabled, focused, invalid, readOnly, required, secondary } = this.properties;
		return [
			css.root,
			disabled ? css.disabled : null,
			focused ? css.focused : null,
			invalid === true ? css.invalid : null,
			invalid === false ? css.valid : null,
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
