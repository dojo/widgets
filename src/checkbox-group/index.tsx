import { create, tsx } from '@dojo/framework/core/vdom';
import { checkboxGroup } from './middleware';
import { Checkbox } from '../checkbox/index';
import { RenderResult } from '@dojo/framework/core/interfaces';
import theme from '../middleware/theme';
import * as css from '../theme/default/checkbox-group.m.css';

type CheckboxOptions = { value: string; label?: string }[];

export interface CheckboxGroupProperties {
	/** The name attribute for this form group */
	name: string;
	/** Object containing the values / labels to create checkboxes for */
	options: CheckboxOptions;
	/** Callback for the current value */
	onValue(value: string[]): void;
	/** Initial value of the checkbox group */
	initialValue?: string[];
	/** A controlled value for the checkbox group */
	value?: string[];
}

export interface CheckboxGroupChildren {
	/** Custom renderer for the checkboxes, receives the checkbox group middleware and options */
	checkboxes?(
		name: string,
		middleware: ReturnType<ReturnType<typeof checkboxGroup>['api']>,
		options: CheckboxOptions
	): RenderResult;
	/** A label for the checkbox group */
	label?: RenderResult;
}

const factory = create({ checkboxGroup, theme })
	.properties<CheckboxGroupProperties>()
	.children<CheckboxGroupChildren | undefined>();

export const CheckboxGroup = factory(function({
	children,
	properties,
	middleware: { checkboxGroup, theme }
}) {
	const {
		name,
		options,
		onValue,
		initialValue,
		value,
		classes,
		theme: themeProp,
		variant
	} = properties();
	const [{ checkboxes, label } = { checkboxes: undefined, label: undefined }] = children();

	const checkbox = checkboxGroup(onValue, initialValue, value);
	const { root, legend } = theme.classes(css);

	function renderCheckboxes() {
		if (checkboxes) {
			return checkboxes(name, checkbox, options);
		}
		return options.map(({ value, label }) => {
			const { checked } = checkbox(value);
			return (
				<Checkbox
					name={name}
					value={value}
					checked={checked()}
					onValue={checked}
					classes={classes}
					theme={themeProp}
					variant={variant}
				>
					{label || value}
				</Checkbox>
			);
		});
	}

	return (
		<fieldset key="root" classes={[theme.variant(), root]} name={name}>
			{label && <legend classes={legend}>{label}</legend>}
			{renderCheckboxes()}
		</fieldset>
	);
});

export default CheckboxGroup;
