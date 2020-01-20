import { create, tsx } from '@dojo/framework/core/vdom';
import { theme, ThemeProperties } from '@dojo/framework/core/middleware/theme';
import { i18n } from '@dojo/framework/core/middleware/i18n';
import Button from '../button';
import TextInput from '../text-input';
import PasswordInput from '../password-input';
import Form, { SubmitFormProperties, ActionFormProperties, FormProperties } from '../form';
import * as css from '../theme/default/login-form.m.css';
import bundle from './nls';

export interface LoginFormFields {
	username: string;
	password: string;
}

interface BaseFormProperties extends ThemeProperties {
	/* When specified, will render a forgotten password link which calls this callback function */
	onForgotPassword?(): void;
	/* The initial value of the login form */
	initialValue?: Partial<LoginFormFields>;
}

type SubmitProperties = BaseFormProperties & SubmitFormProperties<LoginFormFields>;
type ActionProperties = BaseFormProperties & ActionFormProperties;

export type LoginFormProperties = SubmitProperties | ActionProperties;

const factory = create({ theme, i18n }).properties<LoginFormProperties>();

const LoginForm = factory(function LoginForm({ properties, middleware: { theme, i18n } }) {
	const classes = theme.classes(css);

	let formProps: FormProperties = {};
	const props = properties();

	if (props.onSubmit) {
		const { onSubmit, initialValue } = props;
		formProps = {
			onSubmit,
			initialValue
		};
	} else if (props.action) {
		const { action, initialValue, method } = props;
		formProps = {
			action,
			method,
			initialValue
		};
	}

	const { onForgotPassword } = props;
	const { messages } = i18n.localize(bundle);

	return (
		<div classes={classes.root}>
			<Form key="form" {...formProps}>
				{({ field, valid }) => {
					const username = field('username', true);
					const password = field('password', true);

					return (
						<virtual>
							<div classes={classes.field}>
								<TextInput
									key="username"
									label={messages.username}
									name="username"
									required={username.required()}
									value={username.value()}
									valid={username.valid()}
									onValue={username.value}
									onValidate={username.valid}
								/>
							</div>
							<div classes={classes.field}>
								<PasswordInput
									key="password"
									label={messages.password}
									name="password"
									required={password.required()}
									value={password.value()}
									onValue={password.value}
									onValidate={password.valid}
								/>
							</div>
							<div key="buttonHolder" classes={classes.buttonHolder}>
								<Button key="loginButton" type="submit" disabled={!valid()}>
									{messages.login}
								</Button>
							</div>
							{onForgotPassword && (
								<div classes={classes.forgotPassword}>
									<a
										key="forgotPasswordLink"
										classes={classes.forgotPasswordLink}
										onclick={(e) => {
											e.stopPropagation();
											e.preventDefault();
											onForgotPassword();
										}}
									>
										{messages.forgot}
									</a>
								</div>
							)}
						</virtual>
					);
				}}
			</Form>
		</div>
	);
});

export default LoginForm;
