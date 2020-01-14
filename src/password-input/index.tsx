import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { create, tsx } from '@dojo/framework/core/vdom';
import Button from '../button';
import Icon from '../icon';
import ConstrainedInput, { ConstrainedInputProperties } from '../constrained-input';
import theme from '../middleware/theme';
import * as css from '../theme/default/password-input.m.css';
import * as textInputCss from '../theme/default/text-input.m.css';
import TextInput from '../text-input';
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
}).properties<PasswordInputProperties>();
export const PasswordInput = factory(function PasswordInput({
	middleware: { theme, icache },
	properties
}) {
	const props = properties();
	const showPassword = icache.getOrSet('showPassword', false);

	const trailing = (
		<Button
			type="button"
			onClick={() => {
				icache.set('showPassword', !showPassword);
			}}
			classes={{ '@dojo/widgets/button': { root: [css.togglePasswordButton] } }}
		>
			<Icon type={showPassword ? 'eyeSlashIcon' : 'eyeIcon'} />
		</Button>
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
			trailing={() => trailing}
		/>
	) : (
		<TextInput
			{...props}
			key="root"
			type={showPassword ? 'text' : 'password'}
			theme={theme.compose(
				textInputCss,
				css
			)}
			trailing={() => trailing}
			onValidate={handleValidation}
			valid={icache.get('valid')}
		/>
	);
});

export default PasswordInput;
