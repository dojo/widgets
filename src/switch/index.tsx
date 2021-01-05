import { RenderResult } from '@dojo/framework/core/interfaces';
import focus from '@dojo/framework/core/middleware/focus';
import theme from '../middleware/theme';
import { create, tsx } from '@dojo/framework/core/vdom';

import { formatAriaProperties } from '../common/util';
import Label from '../label';
import * as css from '../theme/default/switch.m.css';

interface SwitchProperties {
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
	/** Whether the switch is disabled or clickable */
	disabled?: boolean;
	/** Whether the label is hidden or displayed */
	labelHidden?: boolean;
	/** The name attribute for the switch */
	name?: string;
	/** Handler for events triggered by switch losing focus */
	onBlur?(): void;
	/** Handler for events triggered by "on focus" */
	onFocus?(): void;
	/** Handler for events triggered by "on out" */
	onOut?(): void;
	/** Handler for events triggered by "on over" */
	onOver?(): void;
	/** Handler for when the value of the widget changes */
	onValue(checked: boolean): void;
	/** Makes the switch readonly (it may be focused but not changed) */
	readOnly?: boolean;
	/** Determines if this input is required, styles accordingly */
	required?: boolean;
	/** Toggles the invalid/valid states of the switch */
	valid?: boolean;
	/** The current value; checked state of the switch */
	value: boolean;
}

export interface SwitchChildren {
	/** The label to be displayed for the switch */
	label?: RenderResult;
	/** Label to show in the "off" position of the switch */
	offLabel?: RenderResult;
	/** Label to show in the "on" position of the switch */
	onLabel?: RenderResult;
}

const factory = create({ theme, focus })
	.properties<SwitchProperties>()
	.children<SwitchChildren | undefined>();

export default factory(function Switch({ children, properties, id, middleware: { theme, focus } }) {
	const {
		aria = {},
		classes,
		disabled,
		labelHidden,
		name,
		onBlur,
		onFocus,
		onValue,
		onOut,
		onOver,
		readOnly,
		required,
		theme: themeProp,
		valid,
		variant,
		value = false
	} = properties();

	const [{ label, offLabel, onLabel } = {} as SwitchChildren] = children();
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
					aria-hidden={value ? 'true' : undefined}
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
							aria-invalid={valid === false ? 'true' : undefined}
							name={name}
							readonly={readOnly}
							aria-readonly={readOnly === true ? 'true' : undefined}
							required={required}
							type="checkbox"
							value={`${value}`}
							role="switch"
							aria-checked={value ? 'true' : 'false'}
							onblur={() => onBlur && onBlur()}
							onchange={(event: Event) => {
								event.stopPropagation();
								const checkbox = event.target as HTMLInputElement;
								onValue(checkbox.checked);
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
					aria-hidden={value ? undefined : 'true'}
				>
					{onLabel}
				</div>
			)}
			{label && (
				<Label
					key="label"
					classes={classes}
					theme={themeProp}
					variant={variant}
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
