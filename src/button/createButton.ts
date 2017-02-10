import { DNode, Widget, WidgetProperties, WidgetFactory } from '@dojo/widget-core/interfaces';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import { v } from '@dojo/widget-core/d';
import themeable, { ThemeableMixin } from '@dojo/widget-core/mixins/themeable';
import * as css from './styles/button.css';

export interface ButtonProperties extends WidgetProperties {
	/*
	 * Text content of button
	 */
	content?: string;

	/**
	 * The button's name attribute
	 */
	name?: string;

	/*
	 * Called when the button is clicked
	 */
	onClick?(event: MouseEvent): void;

	/*
	 * Button type can be "submit", "reset", "button", or "menu"
	 */
	type?: string;

	/*
	 * Creates an icon button with the specified icon glyph
	 */
	icon?: string;

	/*
	 * Whether the button is disabled or clickable
	 */
	disabled?: boolean;

	/**
	 * ID of element with descriptive text
	 */
	describedBy?: string;

	/**
	 * Indicates status of a toggle button
	 */
	pressed?: boolean;

	/**
	 * Whether the button triggers a popup
	 */
	hasPopup?: boolean;
}

export type Button = Widget<ButtonProperties> & ThemeableMixin & {
	onClick(event?: MouseEvent): void;
};

export interface ButtonFactory extends WidgetFactory<Button, ButtonProperties> { }

const createButton: ButtonFactory = createWidgetBase.mixin(themeable).mixin({
	mixin: {
		baseClasses: css,
		onClick(this: Button, event: MouseEvent) {
			this.properties.onClick && this.properties.onClick(event);
		},
		render(this: Button): DNode {
			const {
				content = '',
				type,
				name,
				icon,
				disabled,
				pressed,
				describedBy,
				hasPopup
			} = this.properties;
			const buttonNodeAttributes: any = {
				innerHTML: content,
				classes: this.classes(css.button).get(),
				onclick: this.onClick
			};

			type ? buttonNodeAttributes.type = type : false;
			name ? buttonNodeAttributes.name = name : false;
			icon ? buttonNodeAttributes['data-dojo-icon'] = icon : false;
			disabled ? buttonNodeAttributes.disabled = disabled : false;
			pressed ? buttonNodeAttributes['aria-pressed'] = pressed : false;
			describedBy ? buttonNodeAttributes['aria-describedby'] = describedBy : false;
			hasPopup ? buttonNodeAttributes['aria-haspopup'] = hasPopup : false;

			return v('button', buttonNodeAttributes);
		}
	}
});

export default createButton;
