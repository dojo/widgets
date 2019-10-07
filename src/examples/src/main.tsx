import renderer, { tsx } from '@dojo/framework/core/vdom';
import TextInput from '@dojo/widgets/text-input';

const r = renderer(() => (
	<div>
		<TextInput />
		Hello, Dojo World!
	</div>
));
r.mount();
