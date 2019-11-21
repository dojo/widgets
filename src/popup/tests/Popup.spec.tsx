const { describe, it, before, after } = intern.getInterface('bdd');
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

describe('Popup', () => {
	const triggerPosition = {
		top: 10,
		left: 10,
		right: 100,
		bottom: 100
	};

	const triggerSize = {
		height: 20,
		width: 50
	};

	it('Renders with content', () => {
		const h = harness(() => (
			<Popup triggerPosition={triggerPosition} triggerSize={triggerSize} onClose={() => {}}>
				hello world
			</Popup>
		));
		const helloWorldTemplate = baseTemplate.setChildren('@wrapper', () => ['hello world']);
		h.expect(helloWorldTemplate);
	});
});
