import { create, tsx } from '@dojo/framework/core/vdom';
import { checkboxGroup } from './middleware';
import { Checkbox } from '../Checkbox/index';
import { RenderResult } from '@dojo/framework/core/interfaces';

type CheckboxOptions = { value: string; label?: string }[];

interface CheckboxGroupProperties {
	name: string;
	label?: string;
	options: CheckboxOptions;
	onValue(value: string[]): void;
	renderer?(
		name: string,
		middleware: ReturnType<ReturnType<typeof checkboxGroup>['api']>,
		options: CheckboxOptions
	): RenderResult;
	initialValue?: string[];
}

const factory = create({ checkboxGroup }).properties<CheckboxGroupProperties>();

export const CheckboxGroup = factory(function({ properties, middleware: { checkboxGroup } }) {
	const { name, label, options, renderer, onValue, initialValue } = properties();

	const checkbox = checkboxGroup(onValue, initialValue);

	function renderCheckboxes() {
		if (renderer) {
			return renderer(name, checkbox, options);
		}
		return options.map(({ value, label }) => {
			const { checked } = checkbox(value);
			return (
				<Checkbox
					name={name}
					value={value}
					label={label || value}
					checked={checked()}
					onValue={(newChecked) => {
						checked(newChecked);
					}}
				/>
			);
		});
	}

	return (
		<fieldset name={name}>
			{label && <legend>{label}</legend>}
			{renderCheckboxes()}
		</fieldset>
	);
});

export default CheckboxGroup;
