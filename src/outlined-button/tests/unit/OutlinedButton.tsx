import assertionTemplate from '@dojo/framework/testing/assertionTemplate';

const { registerSuite } = intern.getInterface('object');

import { tsx } from '@dojo/framework/core/vdom';
import harness from '@dojo/framework/testing/harness';

import OutlinedButton from '../../index';
import * as css from '../../../theme/outlined-button.m.css';
import Button from '../../../button/index';

const baseAssertion = assertionTemplate(() => (
	<Button classes={{ '@dojo/widgets/button': { root: [css.root] } }} />
));
registerSuite('OutlinedButton', {
	tests: {
		'no content'() {
			const h = harness(() => <OutlinedButton />);

			h.expect(baseAssertion);
		},

		'properties and children'() {
			const children = ['foo', 'bar'];
			const h = harness(() => (
				<OutlinedButton
					type="submit"
					name="bar"
					disabled={true}
					classes={{
						'@dojo/widgets/button': {
							root: ['someOtherClass']
						}
					}}
				>
					{children}
				</OutlinedButton>
			));

			h.expect(
				baseAssertion
					.setProperty(':root', 'classes', {
						'@dojo/widgets/button': { root: [css.root, 'someOtherClass'] }
					})
					.setProperty(':root', 'type', 'submit')
					.setProperty(':root', 'name', 'bar')
					.setProperty(':root', 'disabled', true)
					.setChildren(':root', () => children)
			);
		}
	}
});
