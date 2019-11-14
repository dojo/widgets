import { checkboxGroup as checkboxGroupMiddleware } from '../middleware';
const { assert } = intern.getPlugin('chai');
import { sandbox } from 'sinon';
import cacheMiddleware from '@dojo/framework/core/middleware/cache';
import icacheMiddleware from '@dojo/framework/core/middleware/icache';
import { it, describe, afterEach } from 'intern/lib/interfaces/bdd';

const sb = sandbox.create();
const onValueStub = sb.stub();

const { callback } = checkboxGroupMiddleware();

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

describe('CheckboxGroup-middleware', () => {
	afterEach(() => {
		sb.resetHistory();
	});

	it('converts checked values to arrays', () => {
		const checkboxGroup = callback({
			id: 'checkboxgroup-test',
			middleware: { icache: icacheFactory() },
			properties: () => ({}),
			children: () => []
		})(onValueStub);

		const test1Api = checkboxGroup('test1');
		const test2Api = checkboxGroup('test2');

		assert.isUndefined(test1Api.checked());
		test1Api.checked(true);
		assert.isTrue(test1Api.checked());
		assert.isTrue(onValueStub.calledWith(['test1']));
		test2Api.checked(true);
		assert.isTrue(onValueStub.calledWith(['test1', 'test2']));
		test1Api.checked(false);
		assert.isTrue(onValueStub.calledWith(['test2']));
	});
});
