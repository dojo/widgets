import assertionTemplate from '@dojo/framework/testing/assertionTemplate';

const { registerSuite } = intern.getInterface('object');

import { tsx } from '@dojo/framework/core/vdom';
import harness from '@dojo/framework/testing/harness';

import OutlinedButton from '../../index';
import * as buttonCss from '../../../theme/button.m.css';
import Button from '../../../button/index';
import { compareTheme } from '../../../common/tests/support/test-helpers';

const baseAssertion = assertionTemplate(() => (
	<Button theme={{ '@dojo/widgets/button': buttonCss }} />
));
registerSuite('OutlinedButton', {
	tests: {
		'no content'() {
			const h = harness(() => <OutlinedButton />, [compareTheme(buttonCss)]);
			h.expect(baseAssertion);
		},

		'properties and children'() {
			const h = harness(() => <OutlinedButton type="submit" name="bar" disabled={true} />, [
				compareTheme(buttonCss)
			]);
			h.expect(() => (
				<Button
					theme={{ '@dojo/widgets/button': buttonCss }}
					type="submit"
					name="bar"
					disabled={true}
				/>
			));
		}
	}
});
