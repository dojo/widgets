const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

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
			type: 'text'
		})
	]
);

registerSuite('TextInput', {
	tests: {
		'default properties'() {
			const h = harness(() => w(EmailInput, {}));
			h.expect(() => expected);
			assert(false);
		}
	}
});
