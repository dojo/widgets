const { registerSuite } = intern.getInterface('object');
import { tsx } from '@dojo/framework/core/vdom';

import EmailInput from '../index';
import { createHarness } from '../../common/tests/support/test-helpers';
import TextInput from '../../text-input';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import { noop } from '../../common/tests/support/test-helpers';

const harness = createHarness([]);

const expected = assertionTemplate(() => (
	<TextInput
		type={'email'}
		onValidate={noop}
		valid={{
			valid: undefined,
			message: undefined
		}}
	/>
));

registerSuite('EmailInput', {
	tests: {
		'default properties'() {
			const h = harness(() => <EmailInput />);
			h.expect(expected);
		}
	}
});
