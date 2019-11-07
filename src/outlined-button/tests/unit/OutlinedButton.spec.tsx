import assertionTemplate from '@dojo/framework/testing/assertionTemplate';

const { registerSuite } = intern.getInterface('object');

import { tsx } from '@dojo/framework/core/vdom';
import harness from '@dojo/framework/testing/harness';

import OutlinedButton from '../../index';
import * as css from '../../../theme/outlined-button.m.css';
import Button, { ButtonProperties } from '../../../button/index';

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
			const properties: ButtonProperties = {
				type: 'submit',
				name: 'bar',
				disabled: true
			};
			const children = ['foo', 'bar'];
			const h = harness(() => <OutlinedButton {...properties}>{children}</OutlinedButton>);

			const assertion = Object.keys(properties)
				.reduce(
					(assertion, key) =>
						assertion.setProperty(':root', key, (properties as any)[key]),
					baseAssertion
				)
				.setChildren(':root', children);
			h.expect(assertion);
		}
	}
});
