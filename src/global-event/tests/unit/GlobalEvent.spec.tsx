const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import { stub, SinonStub } from 'sinon';

import global from '@dojo/framework/shim/global';
import { GlobalEvent } from './../../index';
import { harness } from '@dojo/framework/testing/harness';
import { w } from '@dojo/framework/core/vdom';

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

class TestGlobalEvent extends GlobalEvent {
	public onAttach() {
		super.onAttach();
	}

	public onDetach() {
		super.onDetach();
	}
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
		'Registers window listeners on attach'() {
			const widget = new TestGlobalEvent();
			const globalEvent = () => {};
			const focusEvent = () => {};
			widget.__setProperties__({ window: { focus: globalEvent }, key: 'global' });
			assert.strictEqual(windowAddEventlistenerStub.callCount, 1);
			widget.__setProperties__({ window: { focus: globalEvent }, key: 'global' });
			assert.strictEqual(windowAddEventlistenerStub.callCount, 1);
			widget.__setProperties__({
				window: { focus: focusEvent, keydown: () => {} },
				key: 'global'
			});
			assert.strictEqual(windowAddEventlistenerStub.callCount, 3);
			assert.strictEqual(windowRemoveEventlistenerStub.callCount, 1);
			widget.__setProperties__({ window: { focus: focusEvent }, key: 'global' });
			assert.strictEqual(windowAddEventlistenerStub.callCount, 3);
			assert.strictEqual(windowRemoveEventlistenerStub.callCount, 2);
			widget.onDetach();
			assert.strictEqual(windowRemoveEventlistenerStub.callCount, 3);
		},

		'Registers document listeners on attach'() {
			const widget = new TestGlobalEvent();
			const globalEvent = () => {};
			const focusEvent = () => {};
			widget.__setProperties__({ document: { focus: globalEvent }, key: 'global' });
			assert.strictEqual(documentAddEventlistenerStub.callCount, 1);
			widget.__setProperties__({ document: { focus: globalEvent }, key: 'global' });
			assert.strictEqual(documentAddEventlistenerStub.callCount, 1);
			widget.__setProperties__({
				document: { focus: focusEvent, keydown: () => {} },
				key: 'global'
			});
			assert.strictEqual(documentAddEventlistenerStub.callCount, 3);
			assert.strictEqual(documentRemoveEventlistenerStub.callCount, 1);
			widget.__setProperties__({ document: { focus: focusEvent }, key: 'global' });
			assert.strictEqual(documentAddEventlistenerStub.callCount, 3);
			assert.strictEqual(documentRemoveEventlistenerStub.callCount, 2);
			widget.onDetach();
			assert.strictEqual(documentRemoveEventlistenerStub.callCount, 3);
		},

		'Returns null when there are no children'() {
			const h = harness(() => w(GlobalEvent, {}));
			h.expect(() => null);
		},

		'Returns children if they exist'() {
			const h = harness(() => w(GlobalEvent, {}, ['child']));
			h.expect(() => ['child']);
		}
	}
});
