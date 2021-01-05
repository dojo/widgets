import { RenderResult } from '@dojo/framework/core/interfaces';
import focus from '@dojo/framework/core/middleware/focus';
import theme from '../middleware/theme';
import { uuid } from '@dojo/framework/core/util';
import { tsx, create } from '@dojo/framework/core/vdom';

import { formatAriaProperties } from '../common/util';
import Label from '../label/index';
import * as css from '../theme/default/checkbox.m.css';

export interface CheckboxProperties {
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
	/**  Checked/unchecked property of the control */
	checked: boolean;
	/** Set the disabled property of the control */
	disabled?: boolean;
	/** Hides the label from view while still remaining accessible for screen readers */
	labelHidden?: boolean;
	/** The name of the checkbox */
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
	onValue(checked: boolean): void;
	/** Makes the checkbox readonly (it may be focused but not changed) */
	readOnly?: boolean;
	/** Sets the checkbox input as required to complete the form */
	required?: boolean;
	/** Toggles the invalid/valid states of the Checkbox affecting how it is displayed */
	valid?: boolean;
	/** The current value */
	value?: string;
	/** The id used for the form input element */
	widgetId?: string;
}

const factory = create({ theme, focus })
	.properties<CheckboxProperties>()
	.children<RenderResult | undefined>();

export const Checkbox = factory(function Checkbox({
	children,
	properties,
	middleware: { theme, focus }
}) {
	const _uuid = uuid();
	const {
		aria = {},
		checked = false,
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
		variant,
		valid,
		value,
		widgetId = _uuid
	} = properties();

	const [label] = children();
	const themeCss = theme.classes(css);

	return (
		<div
			key="root"
			classes={[
				theme.variant(),
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
			<div classes={themeCss.inputWrapper}>
				<input
					id={widgetId}
					{...formatAriaProperties(aria)}
					classes={themeCss.input}
					checked={checked}
					disabled={disabled}
					focus={focus.shouldFocus()}
					aria-invalid={valid === false ? 'true' : undefined}
					name={name}
					readonly={readOnly}
					aria-readonly={readOnly === true ? 'true' : undefined}
					required={required}
					type="checkbox"
					value={value}
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
				<div classes={themeCss.background} />
			</div>
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
					forId={widgetId}
					secondary={true}
				>
					{label}
				</Label>
			)}
		</div>
	);
});

export default Checkbox;
