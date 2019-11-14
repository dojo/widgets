import { tsx, create } from '@dojo/framework/core/vdom';
import theme from '@dojo/framework/core/middleware/theme';
import focus from '@dojo/framework/core/middleware/focus';
import * as css from '../theme/switch.m.css';
import Label from '../label';
import { uuid } from '@dojo/framework/core/util';
import icache from '@dojo/framework/core/middleware/icache';
import { formatAriaProperties } from '../common/util';

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
	/** Handler for events triggered by switch losing focus */
	onBlur?(): void;
	/** Callback for the current value */
	onChange?: (checked: boolean) => void;
	/** Handler for events triggered by "on focus" */
	onFocus?(): void;
	/** Handler for events triggered by "on out" */
	onOut?(): void;
	/** Handler for events triggered by "on over" */
	onOver?(): void;
	/** Determines if this input is required, styles accordingly */
	required?: boolean;
	/** Determines if this input is valid */
	valid?: boolean;
	/** `id` set on the root button DOM node */
	widgetId?: string;
}

const factory = create({ theme, focus, icache }).properties<SwitchProperties>();

export default factory(function Switch({ properties, middleware: { theme, focus, icache } }) {
	const {
		aria = {},
		checked = false,
		disabled = false,
		label,
		labelHidden,
		name,
		onBlur,
		onChange,
		onFocus,
		onOut,
		onOver,
		required,
		valid,
		widgetId = uuid()
	} = properties();
	const themedCss = theme.classes(css);

	function _onChange(event: Event) {
		const checkbox = event.target as HTMLInputElement;
		onChange && onChange(checkbox.checked);
	}

	const focused = icache.getOrSet('focused', focus.isFocused('root'));

	return (
		<div
			key="root"
			classes={[
				themedCss.root,
				checked ? themedCss.checked : null,
				disabled ? themedCss.disabled : null,
				required ? themedCss.required : null,
				focused ? themedCss.focused : null,
				valid === false ? themedCss.invalid : null,
				valid === true ? themedCss.valid : null
			]}
		>
			<div classes={themedCss.track} />
			<div classes={themedCss.underlay}>
				<div classes={themedCss.thumb}>
					<input
						id={widgetId}
						{...formatAriaProperties(aria)}
						classes={themedCss.nativeControl}
						checked={checked}
						disabled={disabled}
						focus={focused}
						aria-invalid={valid === false ? 'true' : null}
						name={name}
						required={required}
						type="checkbox"
						role="switch"
						aria-checked={checked}
						key="input"
						onblur={() => {
							onBlur && onBlur();
						}}
						onchange={(event: Event) => _onChange(event)}
						onfocus={() => {
							onFocus && onFocus();
						}}
						onpointerenter={() => {
							onOver && onOver();
						}}
						onpointerleave={() => {
							onOut && onOut();
						}}
					/>
				</div>
			</div>
			{label && (
				<Label
					key="label"
					disabled={disabled}
					focused={focused}
					valid={valid}
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
