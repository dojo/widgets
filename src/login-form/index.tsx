import { create, tsx } from '@dojo/framework/core/vdom';
import { theme, ThemeProperties } from '@dojo/framework/core/middleware/theme';
import { i18n } from '@dojo/framework/core/middleware/i18n';
import Button from '../button';
import TextInput from '../text-input';
import PasswordInput from '../password-input';
import Form, { FormProperties } from '../form';
import * as css from '../theme/default/login-form.m.css';
import bundle from './nls';
import { RenderResult } from '@dojo/framework/core/interfaces';

export interface LoginFormFields {
	username: string;
	password: string;
}

interface BaseFormProperties extends ThemeProperties {
	/* The initial value of the login form */
	initialValue?: Partial<LoginFormFields>;

	onSubmit?: never;
	action?: never;
}

type Omit<T, E> = Pick<T, Exclude<keyof T, E>>;

interface SubmitProperties extends Omit<BaseFormProperties, 'onSubmit'> {
	/** Callback for when the form is submitted with valid values */
	onSubmit(values: LoginFormFields): void;
}

interface ActionProperties extends Omit<BaseFormProperties, 'action'> {
	/** Action url for the form on submit */
	action: string;
	/** method of submit, defaults to `post` */
	method?: 'post' | 'get';
}

export type LoginFormChildren =
	| undefined
	| {
			forgotPassword?(): RenderResult;
			register?(): RenderResult;
	  };

export type LoginFormProperties = SubmitProperties | ActionProperties;

function isSubmitForm(properties: LoginFormProperties): properties is SubmitProperties {
	return (properties as SubmitProperties).onSubmit !== undefined;
}

const factory = create({ theme, i18n })
	.properties<LoginFormProperties>()
	.children<LoginFormChildren>();

const LoginForm = factory(function LoginForm({
	properties,
	children,
	middleware: { theme, i18n }
}) {
	const themedCss = theme.classes(css);

	let formProps: FormProperties = {};
	const props = properties();

	if (isSubmitForm(props)) {
		const { onSubmit, initialValue } = props;
		formProps = {
			onSubmit,
			initialValue
		};
	} else {
		const { action, initialValue, method } = props;
		formProps = {
			action,
			method,
			initialValue
		};
	}

	const [
		{ forgotPassword, register } = { forgotPassword: undefined, register: undefined }
	] = children();

	const { messages } = i18n.localize(bundle);

	return (
		<div classes={themedCss.root}>
			<Form key="form" {...formProps}>
				{({ field, valid }) => {
					const username = field('username', true);
					const password = field('password', true);

					return (
						<virtual>
							<div classes={themedCss.field}>
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
							<div classes={themedCss.field}>
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
							<div key="buttonHolder" classes={themedCss.buttonHolder}>
								<Button key="loginButton" type="submit" disabled={!valid()}>
									{messages.login}
								</Button>
							</div>
							{forgotPassword && (
								<div classes={themedCss.forgotPassword}>{forgotPassword()}</div>
							)}
							{register && <div classes={themedCss.register}>{register()}</div>}
						</virtual>
					);
				}}
			</Form>
		</div>
	);
});

export default LoginForm;
