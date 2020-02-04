import * as css from '../theme/radio-group.m.css';
import theme, { ThemeProperties } from '@dojo/framework/core/middleware/theme';
import { Radio } from '../radio/index';
import { RenderResult } from '@dojo/framework/core/interfaces';
import { create, tsx } from '@dojo/framework/core/vdom';
import { radioGroup } from './middleware';

type RadioOptions = { value: string; label?: string }[];

interface RadioGroupProperties extends ThemeProperties {
	/** Initial value of the radio group */
	initialValue?: string;
	/** The label to be displayed in the legend */
	label?: string;
	/** The name attribute for this form group */
	name: string;
	/** Callback for the current value */
	onValue(value: string): void;
	/** Object containing the values / labels to create radios for */
	options: RadioOptions;
	/** Custom renderer for the radios, receives the radio group middleware and options */
	renderer?(
		name: string,
		middleware: ReturnType<ReturnType<typeof radioGroup>['api']>,
		options: RadioOptions
	): RenderResult;
}

const factory = create({ radioGroup, theme }).properties<RadioGroupProperties>();

export const RadioGroup = factory(function({ properties, middleware: { radioGroup, theme } }) {
	const { name, label, options, renderer, onValue, initialValue } = properties();
	const radio = radioGroup(onValue, initialValue || '');
	const { root, legend } = theme.classes(css);

	function renderRadios() {
		if (renderer) {
			return renderer(name, radio, options);
		}
		return options.map(({ value, label }) => {
			const { checked } = radio(value);
			return (
				<Radio
					checked={checked()}
					label={label || value}
					name={name}
					onValue={checked}
					value={value}
				/>
			);
		});
	}

	return (
		<fieldset key="root" classes={root} name={name}>
			{label && <legend classes={legend}>{label}</legend>}
			{renderRadios()}
		</fieldset>
	);
});

export default RadioGroup;
