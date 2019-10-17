import { TextInput, BaseInputProperties } from '../text-input/index';
import { tsx, create } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';

export interface EmailInputProperties extends BaseInputProperties {}

const factory = create({ icache }).properties<EmailInputProperties>();

export const EmailInput = factory(function({ properties, middleware: { icache } }) {
	const { get, set } = icache;
	const props = properties();
	return (
		<TextInput
			{...properties()}
			type={'email'}
			onValidate={(valid, message) => {
				set('valid', valid);
				set('message', message);
				props.onValidate && props.onValidate(valid, message);
			}}
			valid={{ valid: get('valid'), message: get('message') }}
		/>
	);
});

export default EmailInput;
