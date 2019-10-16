import { tsx } from '@dojo/framework/core/vdom';
const { registerSuite } = intern.getInterface('object');
// const { assert } = intern.getPlugin('chai');

// import * as sinon from 'sinon';

import { harness } from '@dojo/framework/testing/harness';
import NumberInput from '../../NumberInput';
import TextInput from '../../../../text-input';

const expected = function() {
	return <TextInput type="number" value="" />;
};

registerSuite('NumberInput', {
	tests: {
		'default properties'() {
			const h = harness(() => <NumberInput />);
			h.expect(expected);
		}
	}
});
