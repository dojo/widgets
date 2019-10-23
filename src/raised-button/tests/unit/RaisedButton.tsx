const { registerSuite } = intern.getInterface('object');

import harness from '@dojo/framework/testing/harness';

import { RaisedButton } from '../../index';
import * as buttonCss from '../../../theme/button.m.css';
import { tsx } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import Button from '../../../button/index';

const { ' _key': key, ...buttonTheme } = buttonCss as any;
const theme = { '@dojo/widgets/button': buttonTheme };

const baseTemplate = assertionTemplate(() => <Button theme={theme} />);

registerSuite('RaisedButton', {
	tests: {
		'no content'() {
			const h = harness(() => <RaisedButton />);
			h.expect(baseTemplate);
		},

		'properties and attributes'() {
			const h = harness(() => <RaisedButton type="submit" name="bar" disabled={true} />);

			h.expect(() => <Button theme={theme} type="submit" name="bar" disabled={true} />);
		}
	}
});
