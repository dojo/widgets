import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import EmailInput from '@dojo/widgets/email-input';

const factory = create({ icache });

const Example = factory(function({ middleware: { icache } }) {
	const value = icache.getOrSet('value', '');
	return (
		<EmailInput
			value={value}
			onValue={(value) => {
				icache.set('value', value);
			}}
		/>
	);
});

export default Example;
