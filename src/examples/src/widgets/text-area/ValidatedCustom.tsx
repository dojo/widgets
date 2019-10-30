import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import TextArea from '@dojo/widgets/text-area';

const factory = create({ icache });

export default factory(function ValidateCustom({ middleware: { icache } }) {
	const value = icache.getOrSet('value', '');
	const valid = icache.getOrSet('valid', {});
	return (
		<TextArea
			value={value}
			valid={valid}
			label="Custom Validated"
			helperText='Enter "valid" to be valid'
			required={true}
			customValidator={(value: string) => {
				if (value === 'valid') {
					return {
						valid: true,
						message: 'Value is valid!'
					};
				} else if (!value) {
					return undefined;
				} else {
					return {
						valid: false,
						message: 'Only "valid" is a valid input'
					};
				}
			}}
			onValue={(value) => {
				icache.set('value', value);
			}}
			onValidate={(valid?: boolean, message?: string) => {
				icache.set('valid', { valid, message });
			}}
		/>
	);
});
