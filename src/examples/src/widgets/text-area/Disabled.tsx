import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import TextArea from '@dojo/widgets/text-area';

const factory = create({ icache });

export default factory(function Disabled({ middleware: { icache } }) {
	const value = icache.getOrSet('value', 'Initial value');
	return <TextArea initialValue={value} label="Can't type here" disabled={true} />;
});
