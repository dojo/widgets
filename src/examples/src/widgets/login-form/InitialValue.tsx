import { create, tsx } from '@dojo/framework/core/vdom';
import LoginForm from '@dojo/widgets/login-form';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

export default factory(function InitialValue({ middleware: { icache } }) {
	return (
		<virtual>
			<LoginForm
				onSubmit={(values) => {
					icache.set('values', values);
				}}
				initialValue={{ username: 'test-user' }}
			/>
			<pre>{`Submited Values: ${JSON.stringify(icache.getOrSet('values', {}))}`}</pre>
		</virtual>
	);
});
