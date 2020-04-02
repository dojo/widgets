import { create, tsx } from '@dojo/framework/core/vdom';
import NumberInput from '@dojo/widgets/number-input';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

const Example = factory(function Example({ middleware: { icache } }) {
	const valid = icache.get<{ valid?: boolean; message?: string }>('valid');

	return (
		<NumberInput
			initialValue={42}
			min={40}
			max={50}
			valid={valid}
			onValidate={(valid, message) => {
				icache.set('valid', { valid, message });
			}}
		>
			{{ label: 'Value between 40 and 50' }}
		</NumberInput>
	);
});

export default Example;
