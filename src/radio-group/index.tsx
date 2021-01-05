import * as css from '../theme/default/radio-group.m.css';
import theme from '../middleware/theme';
import { Radio } from '../radio/index';
import { RenderResult } from '@dojo/framework/core/interfaces';
import { create, tsx } from '@dojo/framework/core/vdom';
import { radioGroup } from './middleware';

type RadioOptions = { value: string; label?: string }[];

export interface RadioGroupProperties {
	/** Initial value of the radio group */
	initialValue?: string;
	/** Controlled value property */
	value?: string;
	/** The name attribute for this form group */
	name: string;
	/** Callback for the current value */
	onValue(value: string): void;
	/** Object containing the values / labels to create radios for */
	options: RadioOptions;
}

export interface RadioGroupChildren {
	/** Custom renderer for the radios, receives the radio group middleware and options */
	radios?(
		name: string,
		middleware: ReturnType<ReturnType<typeof radioGroup>['api']>,
		options: RadioOptions
	): RenderResult;
	label?: RenderResult;
}

const factory = create({ radioGroup, theme })
	.properties<RadioGroupProperties>()
	.children<RadioGroupChildren | undefined>();

export const RadioGroup = factory(function({
	children,
	properties,
	middleware: { radioGroup, theme }
}) {
	const {
		name,
		options,
		onValue,
		value,
		initialValue,
		theme: themeCss,
		classes,
		variant
	} = properties();
	const [{ radios, label } = { radios: undefined, label: undefined }] = children();
	const radio = radioGroup(onValue, initialValue || '', value);
	const { root, legend } = theme.classes(css);

	function renderRadios() {
		if (radios) {
			return radios(name, radio, options);
		}
		return options.map(({ value, label }) => {
			const { checked } = radio(value);
			return (
				<Radio
					checked={checked()}
					name={name}
					onValue={checked}
					value={value}
					theme={themeCss}
					classes={classes}
					variant={variant}
				>
					{label || value}
				</Radio>
			);
		});
	}

	return (
		<fieldset key="root" classes={[theme.variant(), root]} name={name}>
			{label && <legend classes={legend}>{label}</legend>}
			{renderRadios()}
		</fieldset>
	);
});

export default RadioGroup;
