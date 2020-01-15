import { create, tsx } from '@dojo/framework/core/vdom';
import LoginForm from '@dojo/widgets/login-form';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	return (
		<LoginForm
			onSubmit={(values) => {
				console.log(values);
			}}
			initialValue={{ username: 'bob' }}
			onForgotPassword={() => alert}
		/>
	);
});
