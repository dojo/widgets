import { create, tsx } from '@dojo/framework/core/vdom';
import { theme, ThemeProperties } from '@dojo/framework/core/middleware/theme';
import { i18n } from '@dojo/framework/core/middleware/i18n';
import Button from '../button';
import TextInput from '../text-input';
import PasswordInput from '../password-input';
import Form from '../form';
import * as css from '../theme/default/login-form.m.css';
import { RenderResult } from '@dojo/framework/core/interfaces';
import bundle from './loginForm.nls';

export interface LoginFormFields {
	username: string;
	password: string;
}

export interface LoginFormProperties extends ThemeProperties {
	/* onSubmit callback called when the login for is submitted with username / password values */
	onSubmit(values: LoginFormFields): void;
	/* When specified, will render a forgotten password link which calls this callback function */
	onForgotPassword?(): void;
	/* When specified, will be used to generate the forgotten password link */
	forgotPasswordRenderer?(): RenderResult;
	/* The initial value of the login form */
	initialValue?: Partial<LoginFormFields>;
}

const factory = create({ theme, i18n }).properties<LoginFormProperties>();

const LoginForm = factory(function LoginForm({ properties, middleware: { theme, i18n } }) {
	const classes = theme.classes(css);
	const { onForgotPassword, forgotPasswordRenderer, onSubmit, initialValue } = properties();

	const { messages } = i18n.localize(bundle);
	const showForgotPassword = onForgotPassword || forgotPasswordRenderer;

	function renderForgotPassword() {
		if (forgotPasswordRenderer) {
			return forgotPasswordRenderer();
		} else if (onForgotPassword) {
			return (
				<a
					classes={classes.forgotPasswordLink}
					onclick={(e) => {
						e.stopPropagation();
						e.preventDefault();
						onForgotPassword();
					}}
				>
					{messages.forgot}
				</a>
			);
		}
	}

	return (
		<div classes={classes.root}>
			<Form onSubmit={onSubmit} initialValue={initialValue}>
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
									required={true}
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
							<div classes={classes.buttonHolder}>
								<Button key="loginButton" type="submit" disabled={!valid()}>
									{messages.login}
								</Button>
							</div>
							{showForgotPassword && (
								<div classes={classes.forgotPassword}>{renderForgotPassword()}</div>
							)}
						</virtual>
					);
				}}
			</Form>
		</div>
	);
});

export default LoginForm;
