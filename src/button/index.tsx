import { focus } from '@dojo/framework/core/middleware/focus';
import { create, tsx } from '@dojo/framework/core/vdom';

import { formatAriaProperties, isRenderResult } from '../common/util';
import { theme } from '../middleware/theme';
import * as css from '../theme/default/button.m.css';
import { RenderResult } from '@dojo/framework/core/interfaces';

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
	/** Button type can be "submit", "reset", "button", or "menu" */
	type?: 'submit' | 'reset' | 'button' | 'menu';
	/**  Defines a value for the button submitted with form data */
	value?: string;
	/** `id` set on the root button DOM node */
	widgetId?: string;
	/** The title text for the button node */
	title?: string;
	/** The kind of button */
	kind?: 'contained' | 'outlined' | 'text';
	/** Where to add the icon. Default to "before" */
	iconPosition?: 'before' | 'after';
}
export interface ButtonChildren {
	/** The icon for the button */
	icon?: RenderResult;
	/** The label for the button */
	label?: RenderResult;
}

const factory = create({ focus, theme })
	.properties<ButtonProperties>()
	// [ButtonChildren] is needed for variant buttons to type correctly
	.children<ButtonChildren | [ButtonChildren] | RenderResult | RenderResult[]>();

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
		type = 'button',
		value,
		onClick,
		onOut,
		onOver,
		onDown,
		onUp,
		onBlur,
		onFocus,
		title,
		kind = 'contained',
		iconPosition = 'before'
	} = properties();

	const themeCss = theme.classes(css);
	const idBase = widgetId || `button-${id}`;

	const [labelChild] = children();
	const { label, icon = undefined } = isRenderResult(labelChild)
		? { label: children() }
		: labelChild;
	const iconOnly = icon && !label;
	const iconSpan = <span classes={themeCss.icon}>{icon}</span>;

	return (
		<button
			classes={[
				theme.variant(),
				themeCss.root,
				disabled ? themeCss.disabled : null,
				kind === 'text' ? themeCss.text : null,
				kind === 'contained' ? themeCss.contained : null,
				kind === 'outlined' ? themeCss.outlined : null,
				iconOnly ? themeCss.iconOnly : null
			]}
			title={title}
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
		>
			{icon && iconPosition === 'before' ? iconSpan : undefined}
			{label ? <span classes={themeCss.label}>{label}</span> : undefined}
			{icon && iconPosition === 'after' ? iconSpan : undefined}
		</button>
	);
});

export default Button;
