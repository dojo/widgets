import harness from '@dojo/framework/testing/harness';

import ConstrainedInput from '../..';
import { tsx, create } from '@dojo/framework/core/vdom';
import TextInput from '../../../text-input';
import validation from '../../../middleware/validation';
import { compareTheme } from '../../../common/tests/support/test-helpers';
import * as textInputCss from '../../../theme/text-input.m.css';

const { describe, it } = intern.getInterface('bdd');

function createMockValidationMiddleware(validator: Function) {
	const factory = create();
	return factory(() => {
		return () => {
			function f() {
				return validator;
			}
			f.describe = () => ['description'];

			return f;
		};
	});
}

const rules = { length: { min: 0 } };

describe('ConstrainedInput', () => {
	it('renders with default properties', () => {
		const h = harness(() => <ConstrainedInput rules={rules} />, {
			middleware: [[validation, createMockValidationMiddleware(() => true)]],
			customComparator: [compareTheme(textInputCss)]
		});

		h.expect(() => (
			<TextInput
				key="root"
				theme={{ '@dojo/widgets/text-input': textInputCss }}
				customValidator={() => {}}
				valid={undefined}
				onValidate={() => {}}
				helperText="description"
			/>
		));
	});

	it('passes properties to the input widget', () => {
		const h = harness(() => <ConstrainedInput rules={rules} label="Test Label" />, {
			middleware: [[validation, createMockValidationMiddleware(() => true)]],
			customComparator: [compareTheme(textInputCss)]
		});
		h.expect(() => (
			<TextInput
				key="root"
				theme={{ '@dojo/widgets/text-input': textInputCss }}
				customValidator={() => {}}
				valid={undefined}
				onValidate={() => {}}
				helperText="description"
				label="Test Label"
			/>
		));
	});

	it('handles validation and messaging', () => {
		const h = harness(
			() => (
				<ConstrainedInput
					rules={{
						length: {
							min: 1
						}
					}}
				/>
			),
			{
				middleware: [[validation, createMockValidationMiddleware(() => true)]],
				customComparator: [compareTheme(textInputCss)]
			}
		);

		h.expect(() => (
			<TextInput
				key="root"
				theme={{ '@dojo/widgets/text-input': textInputCss }}
				customValidator={() => {}}
				valid={undefined}
				onValidate={() => {}}
				helperText={'description'}
			/>
		));

		h.trigger('@root', 'onValidate', false, 'invalid');

		h.expect(() => (
			<TextInput
				key="root"
				theme={{ '@dojo/widgets/text-input': textInputCss }}
				customValidator={() => {}}
				valid={{ valid: false, message: 'invalid' }}
				onValidate={() => {}}
				helperText={'description'}
			/>
		));

		h.trigger('@root', 'onValidate', true);

		h.expect(() => (
			<TextInput
				key="root"
				theme={{ '@dojo/widgets/text-input': textInputCss }}
				customValidator={() => {}}
				valid={{ valid: true, message: undefined }}
				onValidate={() => {}}
				helperText={undefined}
			/>
		));
	});
});
