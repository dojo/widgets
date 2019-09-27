import { create, tsx } from '@dojo/framework/core/vdom';
import { checkboxGroup } from './middleware';
import { Checkbox } from '../Checkbox/index';
import { RenderResult } from '@dojo/framework/core/interfaces';
import theme from '@dojo/framework/core/middleware/theme';
import * as css from '../theme/checbox-group.m.css';

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

const factory = create({ checkboxGroup, theme }).properties<CheckboxGroupProperties>();

export const CheckboxGroup = factory(function({
	properties,
	middleware: { checkboxGroup, theme }
}) {
	const { name, label, options, renderer, onValue, initialValue } = properties();

	const checkbox = checkboxGroup(onValue, initialValue);
	const { root, legend } = theme.classes(css);

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
					onValue={checked}
				/>
			);
		});
	}

	return (
		<fieldset classes={root} name={name}>
			{label && <legend classes={legend}>{label}</legend>}
			{renderCheckboxes()}
		</fieldset>
	);
});

export default CheckboxGroup;
