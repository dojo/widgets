const { registerSuite } = intern.getInterface('object');

import { tsx } from '@dojo/framework/core/vdom';
import renderer, { assertion, wrap } from '@dojo/framework/testing/renderer';

import OutlinedButton from '../../index';
import * as buttonCss from '../../../theme/default/button.m.css';
import Button from '../../../button/index';
import { createTestTheme } from '../../../common/tests/support/test-helpers';

const WrappedButton = wrap(Button);

const baseAssertion = assertion(() => <WrappedButton theme={createTestTheme(buttonCss)} />);

registerSuite('OutlinedButton', {
	tests: {
		'no content'() {
			const r = renderer(() => <OutlinedButton />);
			r.expect(baseAssertion);
		},

		'properties and children'() {
			const r = renderer(() => <OutlinedButton type="submit" name="bar" disabled={true} />);
			r.expect(
				baseAssertion
					.setProperty(WrappedButton, 'type', 'submit')
					.setProperty(WrappedButton, 'name', 'bar')
					.setProperty(WrappedButton, 'disabled', true)
			);
		},

		'should pass children'() {
			const r = renderer(() => <OutlinedButton>{{ label: 'Text' }}</OutlinedButton>);
			r.expect(baseAssertion.replaceChildren(WrappedButton, () => ({ label: 'Text' })));
		}
	}
});
