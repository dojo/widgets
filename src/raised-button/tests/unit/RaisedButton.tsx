const { registerSuite } = intern.getInterface('object');

import harness from '@dojo/framework/testing/harness';

import { RaisedButton } from '../../index';
import * as css from '../../../theme/raised-button.m.css';
import { tsx } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import Button from '../../../button/index';

const baseAssertion = assertionTemplate(() => (
	<Button classes={{ '@dojo/widgets/button': { root: [css.root], disabled: [css.disabled] } }} />
));

registerSuite('RaisedButton', {
	tests: {
		'no content'() {
			const h = harness(() => <RaisedButton />);
			h.expect(baseAssertion);
		},

		'properties and attributes'() {
			const h = harness(() => (
				<RaisedButton
					type="submit"
					name="bar"
					disabled={true}
					classes={{
						'@dojo/widgets/button': {
							root: ['someOtherClass']
						}
					}}
				/>
			));

			h.expect(
				baseAssertion
					.setProperty(':root', 'classes', {
						'@dojo/widgets/button': {
							root: [css.root, 'someOtherClass'],
							disabled: [css.disabled]
						}
					})
					.setProperty(':root', 'type', 'submit')
					.setProperty(':root', 'name', 'bar')
					.setProperty(':root', 'disabled', true)
			);
		}
	}
});
