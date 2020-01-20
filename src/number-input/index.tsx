import { create, tsx } from '@dojo/framework/core/vdom';

import theme from '../middleware/theme';
import TextInput, { BaseInputProperties } from '../text-input';
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

const factory = create({ theme }).properties<NumberInputProperties>();

export default factory(function NumberInput({ properties, middleware: { theme } }) {
	const { initialValue, onValue } = properties();

	const valueAsString =
		initialValue !== undefined && initialValue !== null
			? initialValue.toString()
			: initialValue;

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
			initialValue={valueAsString}
			onValue={onValueAdapter}
			type="number"
			theme={theme.compose(
				textInputCss,
				numberInputCss
			)}
		/>
	);
});
