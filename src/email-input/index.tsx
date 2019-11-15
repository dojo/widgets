import { TextInput, BaseInputProperties } from '../text-input/index';
import { tsx, create } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import theme from '../middleware/theme';
import * as textInputCss from '../theme/text-input.m.css';
import * as emailInputCss from '../theme/email-input.m.css';

export interface EmailInputProperties extends BaseInputProperties {}

interface EmailInputICache {
	valid?: boolean;
	message?: string;
}

const icache = createICacheMiddleware<EmailInputICache>();
const factory = create({ icache, theme }).properties<EmailInputProperties>();

export const EmailInput = factory(function({ properties, middleware: { icache, theme } }) {
	const { get, set } = icache;
	const props = properties();
	return (
		<TextInput
			{...props}
			type={'email'}
			onValidate={(valid, message) => {
				set('valid', valid);
				set('message', message);
				props.onValidate && props.onValidate(valid, message);
			}}
			valid={{ valid: get('valid'), message: get('message') }}
			theme={{
				...props.theme,
				'@dojo/widgets/text-input': theme.compose(
					textInputCss,
					emailInputCss
				)
			}}
		/>
	);
});

export default EmailInput;
