import { create, tsx } from '@dojo/framework/core/vdom';
import TextInput, { BaseInputProperties } from '../../text-input';

export interface NumberInputProperties extends BaseInputProperties<{ value: number }> {
	/** The min value a number can be */
	min?: number;
	/** The max value a number can be */
	max?: number;
	/** The step to increment the number value by */
	step?: number;
}

const factory = create().properties<NumberInputProperties>();

export default factory(function NumberInput({ properties }) {
	const { value, onValue } = properties();

	const valueAsString = value !== undefined && value !== null ? value.toString() : value;

	function onValueAdapter(valueAsString: string | undefined) {
		console.log('1');
		if (!onValue) {
			return;
		}
		console.log('2');
		if (valueAsString === undefined) {
			console.log('3');
			onValue();
		} else {
			console.log('4');
			onValue(parseFloat(valueAsString));
		}
	}

	return (
		<TextInput
			assertion-key="textInput"
			{...properties()}
			value={valueAsString}
			onValue={onValueAdapter}
			type="number"
		/>
	);
});
