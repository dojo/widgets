const { registerSuite } = intern.getInterface('object');
import { tsx } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import harness from '@dojo/framework/testing/harness';
import Popup from '../index';
import * as css from '../../theme/popup.m.css';
import * as fixedCss from '../popup.m.css';

const baseTemplate = assertionTemplate(() => (
	<body>
		<div key="underlay" classes={[css.underlay, false]} onclick={() => {}} />
		<div key="wrapper" classes={fixedCss.root} styles={{}} />
	</body>
));

registerSuite('Popup', {
	tests: {
		'no content'() {
			const h = harness(() => <Popup triggerDimensions>hello</Popup>);
			h.expect(baseTemplate);
		}
	}
});
