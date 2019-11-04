import { create, tsx } from '@dojo/framework/core/vdom';
import Select from '@dojo/widgets/select';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

const options = [
	{
		value: 'cat',
		label: 'Cat'
	},
	{
		value: 'dog',
		label: 'Dog'
	},
	{
		value: 'hamster',
		label: 'Hamster'
	},
	{
		value: 'goat',
		label: 'Goat',
		disabled: true
	}
];

export default factory(function NonNative({ middleware: { icache } }) {
	const value = icache.get<string>('value');

	return (
		<Select
			label="Advanced Options"
			getOptionDisabled={(option) => Boolean(option.disabled)}
			getOptionLabel={(option) => option.label}
			getOptionValue={(option) => option.value}
			value={value}
			options={options}
			getOptionSelected={(option) => !!value && option.value === value}
			onValue={(option) => {
				icache.set('value', option.value);
			}}
		/>
	);
});
