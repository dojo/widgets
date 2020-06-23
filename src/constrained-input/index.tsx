import TextInput, { BaseInputProperties, TextInputType, TextInputChildren } from '../text-input';
import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import validation, { ValidationRules } from '../middleware/validation';
import theme from '../middleware/theme';
import * as constrainedInputCss from '../theme/default/constrained-input.m.css';
import * as textInputCss from '../theme/default/text-input.m.css';

export interface ConstrainedInputProperties extends BaseInputProperties {
	/** Validation rules applied to this input */
	rules: ValidationRules;
	/** Callback fired when the input validation changes */
	onValidate?: (valid?: boolean) => void;
	/** Input type, text or email, tel, etc. */
	type?: TextInputType;
}

export interface ConstrainedInputState {
	valid: { valid?: boolean; message?: string } | undefined;
}

const factory = create({
	icache: createICacheMiddleware<ConstrainedInputState>(),
	validation,
	theme
})
	.properties<ConstrainedInputProperties>()
	.children<TextInputChildren | undefined>();

export const ConstrainedInput = factory(function ConstrainedInput({
	middleware: { icache, validation, theme },
	properties,
	children
}) {
	const { rules, onValidate, helperText, ...props } = properties();
	const valid = icache.get('valid');

	const validator = validation(rules);

	const handleValidation = (valid?: boolean, message?: string) => {
		icache.set('valid', { valid, message });
		onValidate && onValidate(valid);
	};

	const generatedDescribeHelperText =
		valid && valid.valid === true ? undefined : validator.describe().join(' ');

	return (
		<TextInput
			key="root"
			{...props}
			theme={theme.compose(
				textInputCss,
				constrainedInputCss
			)}
			customValidator={validator}
			valid={valid}
			onValidate={handleValidation}
			helperText={helperText ? helperText : generatedDescribeHelperText}
		>
			{children()[0]}
		</TextInput>
	);
});

export default ConstrainedInput;
