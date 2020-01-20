import { focus } from '@dojo/framework/core/middleware/focus';
import { i18n } from '@dojo/framework/core/middleware/i18n';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { create, tsx } from '@dojo/framework/core/vdom';
import HelperText from '../helper-text';
import theme from '../middleware/theme';
import * as css from '../theme/default/native-select.m.css';
import Icon from '../icon';
import Label from '../label';

export type MenuOption = { value: string; label?: string; disabled?: boolean };

export interface NativeSelectProperties {
	/** Callback called when user selects a value */
	onValue?(value: string): void;
	/** The initial selected value */
	initialValue?: string;
	/** Options to display within the menu */
	options: MenuOption[];
	/** Property to determine if the input is disabled */
	disabled?: boolean;
	/** Sets the helper text of the input */
	helperText?: string;
	/** The label to show */
	label?: string;
	/** Boolean to indicate if field is required */
	required?: boolean;
	/** Used to specify the name of the control */
	name?: string;
	/** Represents the number of rows the are visible at one time */
	size?: number;
	/** Handler for events triggered by select field losing focus */
	onBlur?(): void;
	/** Handler for events triggered by the select element being focused */
	onFocus?(): void;
}

interface NativeSelectICache {
	initial: string;
	value: string;
}

const icache = createICacheMiddleware<NativeSelectICache>();

const factory = create({ icache, focus, theme, i18n }).properties<NativeSelectProperties>();

export const NativeSelect = factory(function NativeSelect({
	properties,
	id,
	middleware: { icache, theme }
}) {
	const {
		classes,
		disabled,
		helperText,
		initialValue,
		label,
		onValue,
		options,
		required,
		name,
		size,
		onFocus,
		onBlur,
		theme: themeProp
	} = properties();

	if (initialValue !== undefined && initialValue !== icache.get('initial')) {
		icache.set('initial', initialValue);
		icache.set('value', initialValue);
	}

	const selectedValue = icache.get('value');
	const themedCss = theme.classes(css);

	return (
		<div
			classes={[
				themedCss.root,
				disabled && themedCss.disabled,
				required && themedCss.required
			]}
			key="root"
		>
			<Label
				theme={themeProp}
				classes={classes}
				disabled={disabled}
				forId={id}
				required={required}
			>
				{label}
			</Label>
			<div classes={themedCss.inputWrapper}>
				<select
					key="native-select"
					onchange={(event: Event) => {
						const targetElement = event.target as HTMLInputElement;
						selectedValue !== icache.get('value') &&
							icache.set('value', targetElement.value);
						onValue && onValue(targetElement.value);
					}}
					disabled={disabled}
					name={name}
					required={required}
					id={id}
					size={size}
					onfocus={() => {
						onFocus && onFocus();
					}}
					onblur={() => {
						onBlur && onBlur();
					}}
					class={themedCss.select}
				>
					{options.map(({ value, label, disabled = false }, index) => {
						return (
							<option
								key={`option-${index}`}
								value={value}
								disabled={disabled}
								selected={selectedValue === value}
							>
								{label ? label : value}
							</option>
						);
					})}
				</select>
				<span classes={themedCss.arrow}>
					<Icon type="downIcon" theme={themeProp} classes={classes} />
				</span>
			</div>
			<HelperText key="helperText" text={helperText} />
		</div>
	);
});

export default NativeSelect;
