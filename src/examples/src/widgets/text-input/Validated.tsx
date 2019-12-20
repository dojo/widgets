import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import TextInput from '@dojo/widgets/text-input';
import materialTheme from '@dojo/widgets/theme/material';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const value = icache.getOrSet('value', '');
	const valid = icache.get<{ valid?: boolean; message?: string }>('valid');
	return (
		<TextInput
			theme={materialTheme}
			value={value}
			label="Type 'foo' or 'bar'"
			valid={valid}
			required
			onValidate={(valid, message) => {
				icache.set('valid', { valid, message });
			}}
			pattern="foo|bar"
			onValue={(value) => {
				icache.set('value', value);
			}}
		/>
	);
});
