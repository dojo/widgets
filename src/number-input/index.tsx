import { create, tsx } from '@dojo/framework/core/vdom';

import theme from '../middleware/theme';
import TextInput, { BaseInputProperties, TextInputChildren } from '../text-input';
import * as textInputCss from '../theme/default/text-input.m.css';
import * as numberInputCss from '../theme/default/number-input.m.css';

export interface NumberInputProperties extends BaseInputProperties<{ value: number }> {
	/** The min value a number can be */
	min?: number;
	/** The max value a number can be */
	max?: number;
	/** The step to increment the number value by */
	step?: number;
	/** Represents if the input value is valid */
	valid?: { valid?: boolean; message?: string } | boolean;
}

const factory = create({ theme })
	.properties<NumberInputProperties>()
	.children<TextInputChildren | undefined>();

export default factory(function NumberInput({ properties, children, middleware: { theme } }) {
	const { initialValue, value, onValue } = properties();

	function onValueAdapter(valueAsString: string | undefined) {
		if (!onValue) {
			return;
		}
		if (valueAsString === undefined || valueAsString === '') {
			onValue();
		} else {
			onValue(parseFloat(valueAsString));
		}
	}

	return (
		<TextInput
			{...properties()}
			value={value === undefined ? value : `${value}`}
			initialValue={initialValue === undefined ? initialValue : `${initialValue}`}
			onValue={onValueAdapter}
			type="number"
			theme={theme.compose(
				textInputCss,
				numberInputCss
			)}
		>
			{children()[0]}
		</TextInput>
	);
});
