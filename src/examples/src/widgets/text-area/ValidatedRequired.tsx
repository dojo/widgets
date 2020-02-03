import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import TextArea from '@dojo/widgets/text-area';

const factory = create({ icache });

export default factory(function ValidateRequired({ middleware: { icache } }) {
	const valid = icache.getOrSet('valid', {});
	return (
		<TextArea
			valid={valid}
			label="Required"
			required={true}
			onValidate={(valid?: boolean, message?: string) => {
				icache.set('valid', { valid, message });
			}}
		/>
	);
});
