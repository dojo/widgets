import TextInput, { TextInputProperties } from '../text-input';
import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import validation, { ValidationRules } from '../middleware/validation';
import theme from '../middleware/theme';
import * as constrainedInputCss from '../theme/constrained-input.m.css';
import * as textInputCss from '../theme/text-input.m.css';

export interface ConstrainedInputProperties
	extends Exclude<
		TextInputProperties,
		'onValidate' | 'valid' | 'helperText' | 'customValidator'
	> {
	/** Validation rules applied to this input */
	rules: ValidationRules;
	/** Callback fired when the input validation changes */
	onValidate?: (valid?: boolean) => void;
}

const factory = create({ icache, validation, theme }).properties<ConstrainedInputProperties>();
export const ConstrainedInput = factory(function ConstrainedInput({
	middleware: { icache, validation, theme },
	properties
}) {
	const { rules, onValidate, ...props } = properties();
	const valid = icache.get<{ valid?: boolean; message?: string }>('valid');

	const validator = validation(rules);

	const handleValidation = (valid?: boolean, message?: string) => {
		icache.set('valid', { valid, message });

		onValidate && onValidate(valid);
	};

	return (
		<TextInput
			key="root"
			{...props}
			theme={{
				...props.theme,
				'@dojo/widgets/text-input': theme.compose(
					textInputCss,
					constrainedInputCss
				)
			}}
			customValidator={validator}
			valid={valid}
			onValidate={handleValidation}
			helperText={valid && valid.valid === true ? undefined : validator.describe().join(' ')}
		/>
	);
});

export default ConstrainedInput;
