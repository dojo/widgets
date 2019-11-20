const { registerSuite } = intern.getInterface('object');
import { tsx } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import harness from '@dojo/framework/testing/harness';
import Popup from '../index';

const baseTemplate = assertionTemplate(() => <Popup />);

registerSuite('Popup', {
	tests: {
		'no content'() {
			const h = harness(() => <RaisedButton />, [compareTheme(buttonCss)]);
			h.expect(baseTemplate);
		}
	}
});
