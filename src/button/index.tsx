import { focus } from '@dojo/framework/core/middleware/focus';
import { create, tsx } from '@dojo/framework/core/vdom';

import { formatAriaProperties } from '../common/util';
import { theme } from '../middleware/theme';
import * as css from '../theme/default/button.m.css';

export interface ButtonProperties {
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
	/** Whether the button is disabled or clickable */
	disabled?: boolean;
	/** The name of the button */
	name?: string;
	/** Handler for events triggered by button losing focus */
	onBlur?(): void;
	/** Handler for events triggered by a button click */
	onClick?(): void;
	/** Handler for events triggered by "on down" */
	onDown?(): void;
	/** Handler for events triggered by "on focus" */
	onFocus?(): void;
	/** Handler for events triggered by "on out" */
	onOut?(): void;
	/** Handler for events triggered by "on over" */
	onOver?(): void;
	/** Handler for events triggered by "on up" */
	onUp?(): void;
	/** Indicates status of a toggle button */
	pressed?: boolean;
	/** Button type can be "submit", "reset", "button", or "menu" */
	type?: 'submit' | 'reset' | 'button' | 'menu';
	/**  Defines a value for the button submitted with form data */
	value?: string;
	/** `id` set on the root button DOM node */
	widgetId?: string;
}

const factory = create({ focus, theme }).properties<ButtonProperties>();

export const Button = factory(function Button({
	children,
	id,
	middleware: { focus, theme },
	properties
}) {
	const {
		aria = {},
		disabled,
		widgetId,
		name,
		pressed,
		type = 'button',
		value,
		onClick,
		onOut,
		onOver,
		onDown,
		onUp,
		onBlur,
		onFocus
	} = properties();

	const themeCss = theme.classes(css);
	const idBase = widgetId || `button-${id}`;

	return (
		<button
			classes={[
				theme.variant(),
				themeCss.root,
				disabled ? themeCss.disabled : null,
				pressed ? themeCss.pressed : null
			]}
			disabled={disabled}
			id={idBase}
			focus={focus.shouldFocus()}
			name={name}
			type={type}
			value={value}
			onblur={() => onBlur && onBlur()}
			onclick={(event: MouseEvent) => {
				event.stopPropagation();
				onClick && onClick();
			}}
			onfocus={() => onFocus && onFocus()}
			onpointerenter={() => onOver && onOver()}
			onpointerleave={() => onOut && onOut()}
			onpointerdown={() => onDown && onDown()}
			onpointerup={() => onUp && onUp()}
			{...formatAriaProperties(aria)}
			aria-pressed={typeof pressed === 'boolean' ? pressed.toString() : null}
		>
			<span classes={themeCss.label}>{children()}</span>
		</button>
	);
});

export default Button;
