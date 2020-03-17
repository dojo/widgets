import { focus } from '@dojo/framework/core/middleware/focus';
import { FocusProperties } from '@dojo/framework/core/mixins/Focus';
import { uuid } from '@dojo/framework/core/util';
import { create, tsx } from '@dojo/framework/core/vdom';

import { formatAriaProperties } from '../common/util';
import Label from '../label';
import theme, { ThemeProperties } from '../middleware/theme';
import * as css from '../theme/default/radio.m.css';

interface RadioProperties extends ThemeProperties, FocusProperties {
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
	/** Checked/unchecked property of the radio */
	checked?: boolean;
	/** Set the disabled property of the control */
	disabled?: boolean;
	/** Adds a <label> element with the supplied text */
	label?: string;
	/** Adds the label element after (true) or before (false) */
	labelAfter?: boolean;
	/** Hides the label from view while still remaining accessible for screen readers */
	labelHidden?: boolean;
	/** The name of the radio button */
	name?: string;
	/** Handler for when the element is blurred */
	onBlur?(): void;
	/** Handler for when the element is focused */
	onFocus?(): void;
	/** Handler for when the pointer moves out of the element */
	onOut?(): void;
	/** Handler for when the pointer moves over the element */
	onOver?(): void;
	/** Handler for when the value of the widget changes */
	onValue?(checked: boolean): void;
	/** Makes the radio readonly (it may be focused but not changed) */
	readOnly?: boolean;
	/** Sets the radio input as required to complete the form */
	required?: boolean;
	/** Toggles the invalid/valid states of the Radio affecting how it is displayed */
	valid?: boolean;
	/** The current value */
	value?: string;
	/** The id used for the form input element */
	widgetId?: string;
}

const factory = create({ focus, theme }).properties<RadioProperties>();

export const Radio = factory(function Radio({ properties, middleware: { focus, theme } }) {
	const _uuid = uuid();
	const {
		aria = {},
		checked = false,
		classes,
		disabled,
		label,
		labelAfter = true,
		labelHidden,
		name,
		onBlur,
		onFocus,
		onOut,
		onOver,
		onValue,
		readOnly,
		required,
		theme: themeProp,
		valid,
		value,
		widgetId = _uuid
	} = properties();

	const themeCss = theme.classes(css);

	return (
		<div
			key="root"
			classes={[
				themeCss.root,
				checked ? themeCss.checked : null,
				disabled ? themeCss.disabled : null,
				focus.isFocused('root') ? themeCss.focused : null,
				valid === false ? themeCss.invalid : null,
				valid === true ? themeCss.valid : null,
				readOnly ? themeCss.readonly : null,
				required ? themeCss.required : null
			]}
		>
			{!labelAfter && label ? (
				<Label
					key="label"
					classes={classes}
					theme={themeProp}
					disabled={disabled}
					focused={focus.isFocused('root')}
					forId={widgetId}
					valid={valid}
					readOnly={readOnly}
					hidden={labelHidden}
					required={required}
					secondary={true}
				>
					{label}
				</Label>
			) : null}
			<div classes={themeCss.inputWrapper}>
				<input
					id={widgetId}
					{...formatAriaProperties(aria)}
					classes={themeCss.input}
					checked={checked}
					disabled={disabled}
					focus={focus.shouldFocus()}
					aria-invalid={valid === false ? 'true' : null}
					name={name}
					readonly={readOnly}
					aria-readonly={readOnly === true ? 'true' : null}
					required={required}
					type="radio"
					value={value}
					onblur={() => onBlur && onBlur()}
					onchange={(event: Event) => {
						event.stopPropagation();
						const radio = event.target as HTMLInputElement;
						onValue && onValue(radio.checked);
					}}
					onfocus={() => onFocus && onFocus()}
					onpointerenter={() => onOver && onOver()}
					onpointerleave={() => onOut && onOut()}
				/>
				<div classes={themeCss.radioBackground}>
					<div classes={themeCss.radioOuter} />
					<div classes={themeCss.radioInner} />
				</div>
			</div>
			{labelAfter && label ? (
				<Label
					key="labelAfter"
					classes={classes}
					theme={themeProp}
					disabled={disabled}
					focused={focus.isFocused('root')}
					forId={widgetId}
					valid={valid}
					readOnly={readOnly}
					hidden={labelHidden}
					required={required}
					secondary={true}
				>
					{label}
				</Label>
			) : null}
		</div>
	);
});

export default Radio;
