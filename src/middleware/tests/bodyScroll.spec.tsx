const { describe, it, beforeEach, afterEach } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import global from '@dojo/framework/shim/global';

import bodyScroll from '../bodyScroll';
import { stub, SinonStub } from 'sinon';

const destroyStub = stub();

function createMiddleware() {
	const { callback } = bodyScroll();
	const middleware = callback({
		id: 'test',
		middleware: {
			destroy: () => {
				destroyStub();
			}
		} as any,
		properties: () => ({}),
		children: () => []
	});

	return middleware;
}

let setPropertyStub: SinonStub;
let getPropertyStub: SinonStub;
let removePropertyStub: SinonStub;

describe('bodyScroll middleware', () => {
	beforeEach(() => {
		setPropertyStub = stub(global.document.body.style, 'setProperty');
		getPropertyStub = stub(global.document.body.style, 'getPropertyValue');
		removePropertyStub = stub(global.document.body.style, 'removeProperty');
	});

	afterEach(() => {
		setPropertyStub.restore();
		getPropertyStub.restore();
		removePropertyStub.restore();
	});

	it('disables body scroll', () => {
		const middleware = createMiddleware();
		middleware(false);
		assert.isTrue(getPropertyStub.calledWith('overflow'));
		assert.isTrue(setPropertyStub.calledWith('overflow', 'hidden'));
	});

	it('removes overflow property if no previous value', () => {
		const middleware = createMiddleware();
		middleware(false);
		getPropertyStub.reset();
		setPropertyStub.reset();

		middleware(true);
		assert.isTrue(setPropertyStub.notCalled);
		assert.isTrue(removePropertyStub.calledWith('overflow'));
	});

	it('restores overflow property if previous value present', () => {
		const middleware = createMiddleware();
		getPropertyStub.returns('test-value');
		middleware(false);
		getPropertyStub.reset();
		setPropertyStub.reset();

		middleware(true);
		assert.isTrue(removePropertyStub.notCalled);
		assert.isTrue(setPropertyStub.calledWith('overflow', 'test-value'));
	});

	it('does nothing if enable called when not disabled', () => {
		const middleware = createMiddleware();
		middleware(true);
		assert.isTrue(setPropertyStub.notCalled);
		assert.isTrue(getPropertyStub.notCalled);
		assert.isTrue(removePropertyStub.notCalled);
	});

	it('does nothing if disabled called when already disabled', () => {
		const middleware = createMiddleware();
		middleware(false);
		getPropertyStub.reset();
		setPropertyStub.reset();
		removePropertyStub.reset();

		middleware(false);
		assert.isTrue(setPropertyStub.notCalled);
		assert.isTrue(getPropertyStub.notCalled);
		assert.isTrue(removePropertyStub.notCalled);
	});
});
