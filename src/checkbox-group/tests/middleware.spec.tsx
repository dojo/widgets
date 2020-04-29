import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';

const { describe, it, afterEach } = intern.getInterface('bdd');
import { checkboxGroup as checkboxGroupMiddleware } from '../middleware';
const { assert } = intern.getPlugin('chai');
import { sandbox } from 'sinon';

const sb = sandbox.create();
const onValueStub = sb.stub();

const { callback } = checkboxGroupMiddleware();

function icacheFactory<T>() {
	return createICacheMiddleware<T>()().callback({
		id: 'test-cache',
		properties: () => ({}),
		children: () => [],
		middleware: { invalidator: sb.stub(), destroy: sb.stub() }
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

		assert.isFalse(test1Api.checked());
		test1Api.checked(true);
		assert.isTrue(test1Api.checked());
		assert.isTrue(onValueStub.calledWith(['test1']));
		test2Api.checked(true);
		assert.isTrue(onValueStub.calledWith(['test1', 'test2']));
		test1Api.checked(false);
		assert.isTrue(onValueStub.calledWith(['test2']));
	});
});
