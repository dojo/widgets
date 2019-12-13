import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { create, tsx } from '@dojo/framework/core/vdom';
import Button from '../button';
import Icon from '../icon';
import ConstrainedInput, { ConstrainedInputProperties } from '../constrained-input';
import theme from '../middleware/theme';
import * as css from '../theme/default/password-input.m.css';
import * as textInputCss from '../theme/default/text-input.m.css';

export interface PasswordInputProperties extends Exclude<ConstrainedInputProperties, 'type'> {}

export interface PasswordInputState {
	showPassword: boolean;
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
			onClick={() => {
				icache.set('showPassword', !showPassword);
			}}
			classes={{ '@dojo/widgets/button': { root: [css.togglePasswordButton] } }}
		>
			<Icon type={showPassword ? 'eyeSlashIcon' : 'eyeIcon'} />
		</Button>
	);

	return (
		<ConstrainedInput
			{...props}
			key="root"
			type={showPassword ? 'text' : 'password'}
			theme={theme.compose(
				textInputCss,
				css
			)}
			trailing={() => trailing}
		/>
	);
});

export default PasswordInput;
