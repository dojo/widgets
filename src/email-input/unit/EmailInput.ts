const { registerSuite } = intern.getInterface('object');

import { v, w } from '@dojo/framework/core/vdom';

import EmailInput from '../index';
import { createHarness } from '../../common/tests/support/test-helpers';
import TextInput from '../../text-input';

const harness = createHarness([]);

const expected = v(
	'div',
	{
		key: 'root',
		role: 'presentation'
	},
	[
		w(TextInput, {
			type: 'email',
			aria: {},
			classes: undefined,
			controls: undefined,
			disabled: undefined,
			label: undefined,
			labelHidden: false,
			leading: undefined,
			name: undefined,
			placeholder: undefined,
			readOnly: undefined,
			required: undefined,
			theme: undefined,
			trailing: undefined,
			value: undefined,
			widgetId: undefined,
			helperText: undefined,
			onValue: undefined,
			onValidate: undefined,
			onBlur: undefined,
			onFocus: undefined,
			onClick: undefined,
			onOver: undefined,
			onOut: undefined,
			valid: undefined
		})
	]
);

registerSuite('EmailInput', {
	tests: {
		'default properties'() {
			const h = harness(() => w(EmailInput, {}));
			h.expect(() => expected);
		}
	}
});
