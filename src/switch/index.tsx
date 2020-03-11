import { DNode } from '@dojo/framework/core/interfaces';
import focus from '@dojo/framework/core/middleware/focus';
import { FocusProperties } from '@dojo/framework/core/mixins/Focus';
import theme, { ThemeProperties } from '@dojo/framework/core/middleware/theme';
import { create, tsx } from '@dojo/framework/core/vdom';

import { formatAriaProperties } from '../common/util';
import Label from '../label';
import * as css from '../theme/default/switch.m.css';

interface SwitchProperties extends ThemeProperties, FocusProperties {
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
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
	/** Toggles the invalid/valid states of the switch */
	valid?: boolean;
	/** The current value; checked state of the switch */
	value?: boolean;
}

const factory = create({ theme, focus }).properties<SwitchProperties>();

export default factory(function Switch({ properties, id, middleware: { theme, focus } }) {
	const {
		aria = {},
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
		theme: themeProp,
		valid,
		value = false
	} = properties();

	const themedCss = theme.classes(css);
	const idBase = `switch-${id}`;

	return (
		<div
			key="root"
			classes={[
				theme.variant(),
				themedCss.root,
				value ? themedCss.checked : null,
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
					aria-hidden={value ? 'true' : null}
				>
					{offLabel}
				</div>
			)}
			<div classes={themedCss.inputWrapper}>
				<div classes={themedCss.track} />
				<div classes={themedCss.underlay}>
					<div classes={themedCss.thumb}>
						<input
							id={idBase}
							{...formatAriaProperties(aria)}
							classes={themedCss.nativeControl}
							checked={value}
							disabled={disabled}
							focus={focus.shouldFocus()}
							aria-invalid={valid === false ? 'true' : null}
							name={name}
							readonly={readOnly}
							aria-readonly={readOnly === true ? 'true' : null}
							required={required}
							type="checkbox"
							value={`${value}`}
							role="switch"
							aria-checked={value}
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
				<div key="onLabel" classes={themedCss.onLabel} aria-hidden={value ? null : 'true'}>
					{onLabel}
				</div>
			)}
			{label && (
				<Label
					key="label"
					classes={classes}
					theme={themeProp}
					disabled={disabled}
					focused={focus.isFocused('root')}
					valid={valid}
					readOnly={readOnly}
					required={required}
					hidden={labelHidden}
					forId={idBase}
					secondary={true}
				>
					{label}
				</Label>
			)}
		</div>
	);
});
