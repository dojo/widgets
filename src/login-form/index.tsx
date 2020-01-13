import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';

import Button from '@dojo/widgets/button';
import TextInput from '@dojo/widgets/text-input';
import PasswordInput from '@dojo/widgets/password-input';
import Form from '@dojo/widgets/form';

const icache = createICacheMiddleware();
const factory = create({ icache });

const LoginForm = factory(function LoginForm({ middleware: { icache } }) {
	return (
		<Form
			onSubmit={(values) => {
				console.log('values: ', JSON.stringify(values));
			}}
		>
			{({ field, reset }) => {
				const username = field('username', true);
				const password = field('password', true);

				return (
					<virtual>
						<TextInput
							key="username"
							label="Username"
							name="username"
							required={true}
							value={username.value()}
							valid={username.valid()}
							onValue={username.value}
							onValidate={username.valid}
						/>
						<PasswordInput
							key="password"
							label="Password"
							name="password"
							required={password.required()}
							value={password.value()}
							onValue={password.value}
							onValidate={password.valid}
						/>
						<Button type="button" onClick={reset}>
							Reset
						</Button>
						<Button type="submit">Submit</Button>
					</virtual>
				);
			}}
		</Form>
	);
});

export default LoginForm;
