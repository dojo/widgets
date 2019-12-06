const { describe, it, before } = intern.getInterface('bdd');
// const { assert } = intern.getPlugin('chai');
import { tsx } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
// import createNodeMock from '@dojo/framework/testing/mocks/middleware/node';
import Select from '../index';
import * as css from '../../theme/default/select.m.css';
// import { stub } from 'sinon';
import Popup from '../../popup';
import HelperText from '../../helper-text';
import { createHarness, compareTheme } from '../../common/tests/support/test-helpers';

const options = [{ value: 'dog' }, { value: 'cat' }, { value: 'fish' }];

const harness = createHarness([compareTheme]);

const baseTemplate = assertionTemplate(() => <div />);

describe('Select', () => {
	it('renders', () => {
		const h = harness(() => <Select onValue={() => {}} options={[]} />);

		h.expect(baseTemplate);
	});
});

// <div classes={[css.root, false, false, false]} key="root">
// 	{/* <Popup key="popup"
// 		>
// 			{{trigger: () => <button />, content: () => <div />}}
// 	</Popup> */}
// 	<HelperText key="helperText" text={''} />
// </div>
