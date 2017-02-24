import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { FormLabelMixin, FormLabelMixinProperties } from '@dojo/widget-core/mixins/FormLabel';
import { v } from '@dojo/widget-core/d';
import * as css from './styles/checkbox.css';

/**
 * @type CheckboxProperties
 *
 * Properties that can be set on a Checkbox component
 *
 * @property checked		Checked/unchecked property of the checkbox
 * @property onBlur				Called when the input loses focus
 * @property onChange			Called when the node's 'change' event is fired
 * @property onClick			Called when the input is clicked
 * @property onFocus			Called when the input is focused
 * @property onMouseDown	Called on the input's mousedown event
 * @property onMouseUp		Called on the input's mouseup event
 * @property onTouchStart	Called on the input's touchstart event
 * @property onTouchEnd		Called on the input's touchend event
 * @property onTouchCancel	Called on the input's touchcancel event
 */
export interface CheckboxProperties extends ThemeableProperties, FormLabelMixinProperties {
	checked?: boolean;
	onBlur?(event: FocusEvent): void;
	onChange?(event: Event): void;
	onClick?(event: MouseEvent): void;
	onFocus?(event: FocusEvent): void;
	onMouseDown?(event: MouseEvent): void;
	onMouseUp?(event: MouseEvent): void;
	onTouchStart?(event: TouchEvent): void;
	onTouchEnd?(event: TouchEvent): void;
	onTouchCancel?(event: TouchEvent): void;
}

const CheckboxBase = ThemeableMixin(FormLabelMixin(WidgetBase));

@theme(css)
export default class Checkbox extends CheckboxBase<CheckboxProperties> {
	render() {
		const {
			checked = false,
			onBlur,
			onChange,
			onClick,
			onFocus,
			onMouseDown,
			onMouseUp,
			onTouchStart,
			onTouchEnd,
			onTouchCancel
		} = this.properties;

		return v('input', {
			classes: this.classes(css.root).get(),
			checked: checked,
			type: 'checkbox',
			onblur: onBlur,
			onchange: onChange,
			onclick: onClick,
			onfocus: onFocus,
			onmousedown: onMouseDown,
			onmouseup: onMouseUp,
			ontouchstart: onTouchStart,
			ontouchend: onTouchEnd,
			ontouchcancel: onTouchCancel
		});
	}
}
