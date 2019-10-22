import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import TextArea from '@dojo/widgets/text-area';

const factory = create({ icache });

export default factory(function ValidateRequired({ middleware: { icache } }) {
	const value = icache.getOrSet('value', '');
	const valid = icache.getOrSet('valid', {});
	return (
		<TextArea
			value={value}
			valid={valid}
			label="Required"
			required={true}
			onValue={(value) => {
				icache.set('value', value);
			}}
			onValidate={(valid?: boolean, message?: string) => {
				icache.set('valid', { valid, message });
			}}
		/>
	);
});
