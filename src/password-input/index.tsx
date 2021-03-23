import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { create, tsx } from '@dojo/framework/core/vdom';
import Icon from '../icon';
import ConstrainedInput, { ConstrainedInputProperties } from '../constrained-input';
import theme from '../middleware/theme';
import * as css from '../theme/default/password-input.m.css';
import * as textInputCss from '../theme/default/text-input.m.css';
import TextInput, { TextInputChildren } from '../text-input';
import { ValidationRules } from '../middleware/validation';

export type Omit<T, E> = Pick<T, Exclude<keyof T, E>>;

export interface PasswordInputProperties
	extends Omit<ConstrainedInputProperties, 'type' | 'rules'> {
	rules?: ValidationRules;
}

export interface PasswordInputState {
	showPassword: boolean;
	valid: { valid?: boolean; message?: string } | undefined;
}

const factory = create({
	icache: createICacheMiddleware<PasswordInputState>(),
	theme
})
	.properties<PasswordInputProperties>()
	.children<TextInputChildren | undefined>();

export const PasswordInput = factory(function PasswordInput({
	middleware: { theme, icache },
	properties,
	children
}) {
	const props = properties();
	const showPassword = icache.getOrSet('showPassword', false);
	const classes = theme.classes(css);

	const trailing = (
		<button
			onclick={(e) => {
				e.stopPropagation();
				icache.set('showPassword', !showPassword);
			}}
			classes={classes.toggleButton}
			type="button"
		>
			<Icon type={showPassword ? 'eyeSlashIcon' : 'eyeIcon'} />
		</button>
	);

	const handleValidation = (valid?: boolean, message?: string) => {
		icache.set('valid', { valid, message });
		props.onValidate && props.onValidate(valid);
	};

	return props.rules ? (
		<ConstrainedInput
			{...props}
			rules={props.rules}
			key="root"
			type={showPassword ? 'text' : 'password'}
			theme={theme.compose(
				textInputCss,
				css
			)}
		>
			{{ ...children()[0], trailing }}
		</ConstrainedInput>
	) : (
		<TextInput
			{...props}
			key="root"
			type={showPassword ? 'text' : 'password'}
			theme={theme.compose(
				textInputCss,
				css
			)}
			onValidate={handleValidation}
			valid={icache.get('valid')}
		>
			{{ ...children()[0], trailing }}
		</TextInput>
	);
});

export default PasswordInput;
