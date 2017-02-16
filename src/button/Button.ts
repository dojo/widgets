import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v } from '@dojo/widget-core/d';
import * as css from './styles/button.css';

/**
 * @type ButtonProperties
 *
 * Properties that can be set on a Button component
 *
 * @property content			Text content of button
 * @property describedBy	ID of element with descriptive text
 * @property disabled			Whether the button is disabled or clickable
 * @property hasPopup			Whether the button triggers a popup
 * @property icon					Creates an icon button with the specified icon glyph
 * @property name					The button's name attribute
 * @property pressed			Indicates status of a toggle button
 * @property type					Button type can be "submit", "reset", "button", or "menu"
 * @property onClick			Called when the button is clicked
 */
export interface ButtonProperties extends ThemeableProperties {
	content?: string;
	describedBy?: string;
	disabled?: boolean;
	hasPopup?: boolean;
	icon?: string;
	name?: string;
	pressed?: boolean;
	type?: string;
	onClick?(event: MouseEvent): void;
}

@theme(css)
export default class Button extends ThemeableMixin(WidgetBase)<ButtonProperties> {
	onClick(event: MouseEvent) {
		this.properties.onClick && this.properties.onClick(event);
	}

	render() {
		const {
			content = '',
			describedBy = null,
			disabled = null,
			hasPopup = null,
			icon = null,
			name = null,
			pressed = null,
			type = null
		} = this.properties;

		const buttonNodeAttributes: any = {
			innerHTML: content,
			classes: this.classes(css.button).get(),
			'aria-describedby': describedBy,
			disabled,
			'aria-haspopup': typeof hasPopup === 'boolean' ? hasPopup.toString() : null,
			'data-dojo-icon': icon,
			name,
			'aria-pressed': typeof pressed === 'boolean' ? pressed.toString() : null,
			type,
			onclick: this.onClick
		};

		return v('button', buttonNodeAttributes);
	}
}
