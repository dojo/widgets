import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import TextArea from '@dojo/widgets/text-area';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function ValidateCustom({ middleware: { icache } }) {
	const valid = icache.getOrSet('valid', {});
	return (
		<Example>
			<TextArea
				valid={valid}
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
				onValidate={(valid?: boolean, message?: string) => {
					icache.set('valid', { valid, message });
				}}
			>
				Custom Validated
			</TextArea>
		</Example>
	);
});
