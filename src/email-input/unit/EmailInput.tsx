const { registerSuite } = intern.getInterface('object');
import { tsx } from '@dojo/framework/core/vdom';

import EmailInput from '../index';
import { createHarness } from '../../common/tests/support/test-helpers';
import TextInput from '../../text-input';

const harness = createHarness([]);

const expected = <TextInput type={'email'} />;

registerSuite('EmailInput', {
	tests: {
		'default properties'() {
			const h = harness(() => <EmailInput />);
			h.expect(() => expected);
		}
	}
});
