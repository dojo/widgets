const { it, describe } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

import { tsx } from '@dojo/framework/core/vdom';
import { renderer, assertion } from '@dojo/framework/testing/renderer';
import Spacer from '../Spacer';
import * as sinon from 'sinon';

describe('Spacer', () => {
	it('Default', () => {
		const r = renderer(() => <Spacer />);
		const expectedAssertion = assertion(() => undefined);
		r.expect(expectedAssertion);
	});

	it('With Child', () => {
		const r = renderer(() => (
			<Spacer>
				<div>Child</div>
			</Spacer>
		));
		const expectedAssertion = assertion(() => <div>Child</div>);
		r.expect(expectedAssertion);
	});

	it('With Span', () => {
		const stub = sinon.stub();
		const r = renderer(() => <Spacer span={2} spanCallback={stub} />);
		const expectedAssertion = assertion(() => undefined);
		r.expect(expectedAssertion);
		assert.isTrue(stub.calledOnce);
		assert.isTrue(stub.calledWith(2));
	});
});
