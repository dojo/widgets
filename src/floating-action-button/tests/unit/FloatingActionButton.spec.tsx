const { registerSuite } = intern.getInterface('object');

import harness from '@dojo/framework/testing/harness/harness';

import FloatingActionButton from '../../index';
import * as buttonCss from '../../../theme/default/button.m.css';
import * as css from '../../../theme/default/floating-action-button.m.css';
import { tsx } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import Button from '../../../button/index';
import { compareTheme } from '../../../common/tests/support/test-helpers';

const baseTemplate = assertionTemplate(() => (
	<Button
		theme={{ '@dojo/widgets/button': buttonCss }}
		classes={{
			'@dojo/widgets/button': {
				root: [false, false]
			}
		}}
	>
		<span aria="hidden" classes={css.effect} />
	</Button>
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
						size="extended"
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
							root: [css.extended, false]
						}
					}}
					type="submit"
					name="bar"
					disabled={true}
				>
					<span aria="hidden" classes={css.effect} />
				</Button>
			));
		},

		small() {
			const h = harness(
				() => (
					<FloatingActionButton size="small" type="submit" name="bar" disabled={true} />
				),
				[compareTheme]
			);
			h.expect(() => (
				<Button
					theme={{ '@dojo/widgets/button': buttonCss }}
					classes={{
						'@dojo/widgets/button': {
							root: [false, css.small]
						}
					}}
					type="submit"
					name="bar"
					disabled={true}
				>
					<span aria="hidden" classes={css.effect} />
				</Button>
			));
		}
	}
});
