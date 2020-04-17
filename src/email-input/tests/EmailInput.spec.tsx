const { registerSuite } = intern.getInterface('object');
import { tsx } from '@dojo/framework/core/vdom';

import EmailInput from '../index';
import TextInput from '../../text-input';
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import { noop } from '../../common/tests/support/test-helpers';
import * as textInputCss from '../../theme/default/text-input.m.css';
import { compareTheme } from '../../common/tests/support/test-helpers';
import harness from '@dojo/framework/testing/harness/harness';

const expected = assertionTemplate(() => (
	<TextInput
		type={'email'}
		onValidate={noop}
		valid={{
			valid: undefined,
			message: undefined
		}}
		theme={{
			'@dojo/widgets/text-input': textInputCss
		}}
	/>
));

registerSuite('EmailInput', {
	tests: {
		'default properties'() {
			const h = harness(() => <EmailInput />, [compareTheme]);
			h.expect(expected);
		}
	}
});
