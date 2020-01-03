import { DNode } from '@dojo/framework/core/interfaces';
import focus from '@dojo/framework/core/middleware/focus';
import coreTheme from '@dojo/framework/core/middleware/theme';
import { uuid } from '@dojo/framework/core/util';
import { create, tsx } from '@dojo/framework/core/vdom';

import { formatAriaProperties } from '../common/util';
import Label from '../label';
import * as css from '../theme/default/switch.m.css';

interface SwitchProperties {
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
	/**  Checked/unchecked property of the switch */
	checked?: boolean;
	/** Whether the switch is disabled or clickable */
	disabled?: boolean;
	/** The label to be displayed for the switch */
	label?: string;
	/** Whether the label is hidden or displayed */
	labelHidden?: boolean;
	/** The name attribute for the switch */
	name?: string;
	/** Label to show in the "off" position of the switch */
	offLabel?: DNode;
	/** Handler for events triggered by switch losing focus */
	onBlur?(): void;
	/** Handler for events triggered by "on focus" */
	onFocus?(): void;
	/** Label to show in the "on" position of the switch */
	onLabel?: DNode;
	/** Handler for events triggered by "on out" */
	onOut?(): void;
	/** Handler for events triggered by "on over" */
	onOver?(): void;
	/** Handler for when the value of the widget changes */
	onValue?(checked: boolean): void;
	/** Makes the switch readonly (it may be focused but not changed) */
	readOnly?: boolean;
	/** Determines if this input is required, styles accordingly */
	required?: boolean;
	/** Determines if this input is valid */
	valid?: boolean;
	/** The current value */
	value?: string;
	/** `id` set on the root button DOM node */
	widgetId?: string;
}

const factory = create({ coreTheme, focus }).properties<SwitchProperties>();

export default factory(function Switch({ properties, middleware: { coreTheme, focus } }) {
	const {
		aria = {},
		checked = false,
		classes,
		disabled,
		label,
		labelHidden,
		name,
		offLabel,
		onBlur,
		onFocus,
		onValue,
		onLabel,
		onOut,
		onOver,
		readOnly,
		required,
		theme,
		valid,
		value,
		widgetId = uuid()
	} = properties();

	const themedCss = coreTheme.classes(css);

	return (
		<div
			key="root"
			classes={[
				themedCss.root,
				checked ? themedCss.checked : null,
				disabled ? themedCss.disabled : null,
				focus.isFocused('root') ? themedCss.focused : null,
				valid === false ? themedCss.invalid : null,
				valid === true ? themedCss.valid : null,
				readOnly ? themedCss.readonly : null,
				required ? themedCss.required : null
			]}
		>
			{offLabel && (
				<div
					key="offlabel"
					classes={themedCss.offLabel}
					aria-hidden={checked ? 'true' : null}
				>
					{offLabel}
				</div>
			)}
			<div classes={themedCss.inputWrapper}>
				<div classes={themedCss.track} />
				<div classes={themedCss.underlay}>
					<div classes={themedCss.thumb}>
						<input
							id={widgetId}
							{...formatAriaProperties(aria)}
							classes={themedCss.nativeControl}
							checked={checked}
							disabled={disabled}
							focus={focus.shouldFocus()}
							aria-invalid={valid === false ? 'true' : null}
							name={name}
							readonly={readOnly}
							aria-readonly={readOnly === true ? 'true' : null}
							required={required}
							type="checkbox"
							value={value}
							role="switch"
							aria-checked={checked}
							onblur={() => onBlur && onBlur()}
							onchange={(event: Event) => {
								event.stopPropagation();
								const checkbox = event.target as HTMLInputElement;
								onValue && onValue(checkbox.checked);
							}}
							onfocus={() => onFocus && onFocus()}
							onpointerenter={() => onOver && onOver()}
							onpointerleave={() => onOut && onOut()}
						/>
					</div>
				</div>
			</div>
			{onLabel && (
				<div
					key="onLabel"
					classes={themedCss.onLabel}
					aria-hidden={checked ? null : 'true'}
				>
					{onLabel}
				</div>
			)}
			{label && (
				<Label
					key="label"
					classes={classes}
					theme={theme}
					disabled={disabled}
					focused={focus.isFocused('root')}
					valid={valid}
					readOnly={readOnly}
					required={required}
					hidden={labelHidden}
					forId={widgetId}
					secondary={true}
				>
					{label}
				</Label>
			)}
		</div>
	);
});
