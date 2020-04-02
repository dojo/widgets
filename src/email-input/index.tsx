import { TextInput, BaseInputProperties, TextInputChildren } from '../text-input/index';
import { tsx, create } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import theme from '../middleware/theme';
import * as textInputCss from '../theme/default/text-input.m.css';
import * as emailInputCss from '../theme/default/email-input.m.css';

export interface EmailInputProperties extends BaseInputProperties {}

interface EmailInputICache {
	valid?: boolean;
	message?: string;
}

const icache = createICacheMiddleware<EmailInputICache>();
const factory = create({ icache, theme })
	.properties<EmailInputProperties>()
	.children<TextInputChildren | undefined>();

export const EmailInput = factory(function({
	properties,
	children,
	middleware: { icache, theme }
}) {
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
			theme={theme.compose(
				textInputCss,
				emailInputCss
			)}
		>
			{children()[0]}
		</TextInput>
	);
});

export default EmailInput;
