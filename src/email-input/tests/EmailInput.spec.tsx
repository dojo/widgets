const { registerSuite } = intern.getInterface('object');
import { tsx } from '@dojo/framework/core/vdom';

import EmailInput from '../index';
import TextInput from '../../text-input';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import { noop } from '../../common/tests/support/test-helpers';
import * as textInputCss from '../../theme/text-input.m.css';
import { compareTheme } from '../../common/tests/support/test-helpers';
import harness from '@dojo/framework/testing/harness';

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
			const h = harness(() => <EmailInput />, [compareTheme(textInputCss)]);
			h.expect(expected);
		}
	}
});
