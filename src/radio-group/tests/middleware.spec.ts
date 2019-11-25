const { assert } = intern.getPlugin('chai');
const { describe, it, afterEach } = intern.getInterface('bdd');
import cacheMiddleware from '@dojo/framework/core/middleware/cache';
import icacheMiddleware from '@dojo/framework/core/middleware/icache';
import { radioGroup as radioGroupMiddleware } from '../middleware';
import { sandbox } from 'sinon';

const sb = sandbox.create();
const onValueStub = sb.stub();
const { callback } = radioGroupMiddleware();

function cacheFactory() {
	return cacheMiddleware().callback({
		id: 'test-cache',
		properties: () => ({}),
		children: () => [],
		middleware: { destroy: sb.stub() }
	});
}

function icacheFactory() {
	return icacheMiddleware().callback({
		id: 'test-cache',
		properties: () => ({}),
		children: () => [],
		middleware: { cache: cacheFactory(), invalidator: sb.stub() }
	});
}

describe('RadioGroup-middleware', () => {
	afterEach(() => {
		sb.resetHistory();
	});

	it('converts checked values to arrays', () => {
		const radioGroup = callback({
			id: 'radiogroup-test',
			middleware: { icache: icacheFactory() },
			properties: () => ({}),
			children: () => []
		})(onValueStub);

		const test1Api = radioGroup('test1');
		const test2Api = radioGroup('test2');

		assert.isUndefined(test1Api.checked());
		test1Api.checked(true);
		assert.isTrue(test1Api.checked());
		assert.isTrue(onValueStub.calledWith('test1'));
		test2Api.checked(true);
		assert.isTrue(onValueStub.calledWith('test2'));
		test1Api.checked(false);
		assert.isUndefined(test1Api.checked());
	});
});
