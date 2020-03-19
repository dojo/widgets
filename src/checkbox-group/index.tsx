import { create, tsx } from '@dojo/framework/core/vdom';
import { checkboxGroup } from './middleware';
import { Checkbox } from '../checkbox/index';
import { RenderResult } from '@dojo/framework/core/interfaces';
import theme from '@dojo/framework/core/middleware/theme';
import * as css from '../theme/default/checkbox-group.m.css';

type CheckboxOptions = { value: string; label?: string }[];

export interface CheckboxGroupProperties {
	/** The name attribute for this form group */
	name: string;
	/** The label to be displayed in the legend */
	label?: string;
	/** Object containing the values / labels to create checkboxes for */
	options: CheckboxOptions;
	/** Callback for the current value */
	onValue(value: string[]): void;
	/** Initial value of the checkbox group */
	initialValue?: string[];
}

export interface CheckboxGroupChildren {
	/** Custom renderer for the checkboxes, receives the checkbox group middleware and options */
	(
		name: string,
		middleware: ReturnType<ReturnType<typeof checkboxGroup>['api']>,
		options: CheckboxOptions
	): RenderResult;
}

const factory = create({ checkboxGroup, theme })
	.properties<CheckboxGroupProperties>()
	.children<CheckboxGroupChildren | undefined>();

export const CheckboxGroup = factory(function({
	children,
	properties,
	middleware: { checkboxGroup, theme }
}) {
	const { name, label, options, onValue, initialValue } = properties();
	const [renderer] = children();

	const checkbox = checkboxGroup(onValue, initialValue);
	const { root, legend } = theme.classes(css);

	function renderCheckboxes() {
		if (typeof renderer === 'function') {
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
		<fieldset key="root" classes={root} name={name}>
			{label && <legend classes={legend}>{label}</legend>}
			{renderCheckboxes()}
		</fieldset>
	);
});

export default CheckboxGroup;
