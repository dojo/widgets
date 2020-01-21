import { create, tsx } from '@dojo/framework/core/vdom';
import LoginForm from '@dojo/widgets/login-form';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

export default factory(function RegisterLink({ middleware: { icache } }) {
	return (
		<virtual>
			<LoginForm
				onSubmit={(values) => {
					icache.set('values', values);
				}}
			>
				{{
					register: () => (
						<a
							onclick={() => {
								const count = icache.getOrSet('count', 0);
								icache.set('count', count + 1);
							}}
						>
							Click to register
						</a>
					)
				}}
			</LoginForm>
			<pre>{`Submited Values: ${JSON.stringify(icache.getOrSet('values', {}))}
Register click count: ${icache.getOrSet('count', 0)}`}</pre>
		</virtual>
	);
});
