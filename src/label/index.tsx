import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { DNode } from '@dojo/framework/core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/core/mixins/Themed';
import { v } from '@dojo/framework/core/vdom';
import { formatAriaProperties } from '../common/util';
import * as css from '../theme/default/label.m.css';
import * as baseCss from '../common/styles/base.m.css';

export interface LabelProperties extends ThemedProperties {
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
	/** If the label should be disabled */
	disabled?: boolean;
	/** If the label is focused */
	focused?: boolean;
	/** ID to explicitly associate the label with an input element */
	forId?: string;
	/** If the label should be invisible (it will remain accessible to screen readers) */
	hidden?: boolean;
	/** If the label is read only */
	readOnly?: boolean;
	/** If the label is required */
	required?: boolean;
	/** If the label should use the secondary styling */
	secondary?: boolean;
	/** If the label is valid */
	valid?: boolean;
	/** ID of the underlying label element */
	widgetId?: string;
	/** Indicates that the label or it's control are active, will add extra style class */
	active?: boolean;
}

@theme(css)
export class Label extends ThemedMixin(WidgetBase)<LabelProperties> {
	protected getRootClasses(): (string | null)[] {
		const { disabled, focused, valid, readOnly, required, secondary, active } = this.properties;
		return [
			css.root,
			disabled ? css.disabled : null,
			focused ? css.focused : null,
			valid === true ? css.valid : null,
			valid === false ? css.invalid : null,
			readOnly ? css.readonly : null,
			required ? css.required : null,
			secondary ? css.secondary : null,
			active ? css.active : null
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
					this.variant(),
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
