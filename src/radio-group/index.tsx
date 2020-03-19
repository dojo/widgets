import * as css from '../theme/default/radio-group.m.css';
import theme from '@dojo/framework/core/middleware/theme';
import { Radio } from '../radio/index';
import { RenderResult } from '@dojo/framework/core/interfaces';
import { create, tsx } from '@dojo/framework/core/vdom';
import { radioGroup } from './middleware';

type RadioOptions = { value: string; label?: string }[];

export interface RadioGroupProperties {
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
}

export interface RadioGroupChildren {
	/** Custom renderer for the radios, receives the radio group middleware and options */
	(
		name: string,
		middleware: ReturnType<ReturnType<typeof radioGroup>['api']>,
		options: RadioOptions
	): RenderResult;
}

const factory = create({ radioGroup, theme })
	.properties<RadioGroupProperties>()
	.children<RadioGroupChildren | undefined>();

export const RadioGroup = factory(function({
	children,
	properties,
	middleware: { radioGroup, theme }
}) {
	const { name, label, options, onValue, initialValue } = properties();
	const [renderer] = children();
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
