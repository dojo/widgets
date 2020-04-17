const { registerSuite } = intern.getInterface('object');

import harness from '@dojo/framework/testing/harness/harness';

import { RaisedButton } from '../../index';
import * as buttonCss from '../../../theme/default/button.m.css';
import { tsx } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import Button from '../../../button/index';
import { compareTheme } from '../../../common/tests/support/test-helpers';

const baseTemplate = assertionTemplate(() => (
	<Button theme={{ '@dojo/widgets/button': buttonCss }} />
));

registerSuite('RaisedButton', {
	tests: {
		'no content'() {
			const h = harness(() => <RaisedButton />, [compareTheme]);
			h.expect(baseTemplate);
		},

		'properties and attributes'() {
			const h = harness(() => <RaisedButton type="submit" name="bar" disabled={true} />, [
				compareTheme
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
