const { registerSuite } = intern.getInterface('object');

import harness from '@dojo/framework/testing/harness';

import FloatingActionButton from '../../index';
import * as buttonCss from '../../../theme/default/button.m.css';
import * as css from '../../../theme/default/floating-action-button.m.css';
import { tsx } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import Button from '../../../button/index';
import { compareTheme } from '../../../common/tests/support/test-helpers';

const baseTemplate = assertionTemplate(() => (
	<Button
		theme={{ '@dojo/widgets/button': buttonCss }}
		classes={{
			'@dojo/widgets/button': {
				root: [undefined]
			}
		}}
	/>
));

registerSuite('FloatingActionButton', {
	tests: {
		'no content'() {
			const h = harness(() => <FloatingActionButton />, [compareTheme]);
			h.expect(baseTemplate);
		},

		'extended, properties, and attributes'() {
			const h = harness(
				() => (
					<FloatingActionButton
						extended={true}
						type="submit"
						name="bar"
						disabled={true}
					/>
				),
				[compareTheme]
			);
			h.expect(() => (
				<Button
					theme={{ '@dojo/widgets/button': buttonCss }}
					classes={{
						'@dojo/widgets/button': {
							root: [css.extended]
						}
					}}
					type="submit"
					name="bar"
					disabled={true}
				/>
			));
		}
	}
});
