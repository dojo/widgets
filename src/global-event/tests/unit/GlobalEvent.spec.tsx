const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import { stub, SinonStub } from 'sinon';

import global from '@dojo/framework/shim/global';
import { GlobalEvent } from './../../index';
import { harness } from '@dojo/framework/testing/harness/harness';
import { tsx } from '@dojo/framework/core/vdom';

let windowAddEventlistenerStub: SinonStub;
let documentAddEventlistenerStub: SinonStub;
let windowRemoveEventlistenerStub: SinonStub;
let documentRemoveEventlistenerStub: SinonStub;

if (!global.document) {
	global.document = {
		addEventListener() {},
		removeEventListener() {}
	};
}

if (!global.window) {
	global.window = {
		addEventListener() {},
		removeEventListener() {}
	};
}

registerSuite('GlobalEvent', {
	beforeEach() {
		windowAddEventlistenerStub = stub(global.window, 'addEventListener');
		documentAddEventlistenerStub = stub(global.document, 'addEventListener');
		windowRemoveEventlistenerStub = stub(global.window, 'removeEventListener');
		documentRemoveEventlistenerStub = stub(global.document, 'removeEventListener');
	},

	afterEach() {
		windowAddEventlistenerStub.restore();
		documentAddEventlistenerStub.restore();
		windowRemoveEventlistenerStub.restore();
		documentRemoveEventlistenerStub.restore();
	},

	tests: {
		'Registers document listener'() {
			const globalEvent = () => {};
			const focusEvent = () => {};
			const keyDownEvent = () => {};

			let testEvent = globalEvent;
			const h = harness(() => <GlobalEvent document={{ focus: testEvent }} key="global" />);
			assert.strictEqual(documentAddEventlistenerStub.callCount, 0);

			h.expect(() => h.getRender());
			assert.strictEqual(documentAddEventlistenerStub.callCount, 1);
			assert.strictEqual(documentRemoveEventlistenerStub.callCount, 0);
			testEvent = focusEvent;

			h.expect(() => h.getRender());
			assert.strictEqual(documentAddEventlistenerStub.callCount, 2);
			assert.strictEqual(documentRemoveEventlistenerStub.callCount, 1);

			testEvent = keyDownEvent;
			h.expect(() => h.getRender());
			assert.strictEqual(documentAddEventlistenerStub.callCount, 3);
			assert.strictEqual(documentRemoveEventlistenerStub.callCount, 2);
		},

		'Registers window listener'() {
			const globalEvent = () => {};
			const focusEvent = () => {};
			const keyDownEvent = () => {};

			let testEvent = globalEvent;
			const h = harness(() => <GlobalEvent window={{ focus: testEvent }} key="global" />);
			assert.strictEqual(windowAddEventlistenerStub.callCount, 0);
			h.expect(() => h.getRender());
			assert.strictEqual(windowAddEventlistenerStub.callCount, 1);
			assert.strictEqual(windowRemoveEventlistenerStub.callCount, 0);
			testEvent = focusEvent;

			h.expect(() => h.getRender());
			assert.strictEqual(windowAddEventlistenerStub.callCount, 2);
			assert.strictEqual(windowRemoveEventlistenerStub.callCount, 1);

			testEvent = keyDownEvent;
			h.expect(() => h.getRender());
			assert.strictEqual(windowAddEventlistenerStub.callCount, 3);
			assert.strictEqual(windowRemoveEventlistenerStub.callCount, 2);
		},

		'Returns null when there are no children'() {
			const h = harness(() => <GlobalEvent />);
			h.expect(() => null);
		},

		'Returns children if they exist'() {
			const h = harness(() => <GlobalEvent>child</GlobalEvent>);
			h.expect(() => ['child']);
		}
	}
});
