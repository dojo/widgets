import { create, tsx } from '@dojo/framework/core/vdom';
import LoginForm from '@dojo/widgets/login-form';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

export default factory(function ForgotPassword({ middleware: { icache } }) {
	return (
		<virtual>
			<LoginForm
				onSubmit={(values) => {
					icache.set('values', values);
				}}
				onForgotPassword={() => {
					const count = icache.getOrSet('count', 0);
					icache.set('count', count + 1);
				}}
			/>
			<pre>{`Submited Values: ${JSON.stringify(icache.getOrSet('values', {}))}
Forgot password click count: ${icache.getOrSet('count', 0)}`}</pre>
		</virtual>
	);
});
