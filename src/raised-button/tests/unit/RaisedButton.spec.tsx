const { registerSuite } = intern.getInterface('object');

import { RaisedButton } from '../../index';
import * as buttonCss from '../../../theme/default/button.m.css';
import { tsx } from '@dojo/framework/core/vdom';
import Button from '../../../button/index';
import renderer, { assertion, wrap } from '@dojo/framework/testing/renderer';
import { createTestTheme } from '../../../common/tests/support/test-helpers';

const WrappedButton = wrap(Button);

const baseAssertion = assertion(() => <WrappedButton theme={createTestTheme(buttonCss)} />);

registerSuite('RaisedButton', {
	tests: {
		'no content'() {
			const r = renderer(() => <RaisedButton />);
			r.expect(baseAssertion);
		},

		'properties and attributes'() {
			const r = renderer(() => <RaisedButton type="submit" name="bar" disabled={true} />);
			r.expect(
				baseAssertion
					.setProperty(WrappedButton, 'type', 'submit')
					.setProperty(WrappedButton, 'name', 'bar')
					.setProperty(WrappedButton, 'disabled', true)
			);
		},

		'should pass children'() {
			const r = renderer(() => <RaisedButton>{{ label: 'Text' }}</RaisedButton>);
			r.expect(baseAssertion.replaceChildren(WrappedButton, () => ({ label: 'Text' })));
		}
	}
});
