import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import TextInput from '@dojo/widgets/text-input';
import materialTheme from '@dojo/widgets/theme/material';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const value = icache.getOrSet('value', '');
	return (
		<TextInput
			theme={materialTheme}
			value={value}
			label="Hidden label"
			labelHidden
			onValue={(value) => {
				icache.set('value', value);
			}}
		/>
	);
});
