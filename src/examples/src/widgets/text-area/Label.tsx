import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import TextArea from '@dojo/widgets/text-area';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const value = icache.getOrSet('value', '');
	return (
		<TextArea
			label="Textarea with label"
			value={value}
			onValue={(value) => {
				icache.set('value', value);
			}}
		/>
	);
});
