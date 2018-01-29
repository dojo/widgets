const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import { stub, SinonStub } from 'sinon';

import global from '@dojo/shim/global';
import { GlobalEvent } from './../../GlobalEvent';
import { harness } from '@dojo/test-extras/harness';
import { w } from '@dojo/widget-core/d';

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
			widget.__setProperties__({ window: { focus: globalEvent }, key: 'global' });
			assert.strictEqual(windowAddEventlistenerStub.callCount, 1);
			widget.__setProperties__({ window: { focus: globalEvent }, key: 'global' });
			assert.strictEqual(windowAddEventlistenerStub.callCount, 1);
			widget.__setProperties__({ window: { focus: () => {} }, key: 'global' });
			assert.strictEqual(windowAddEventlistenerStub.callCount, 2);
			assert.strictEqual(windowRemoveEventlistenerStub.callCount, 1);
			widget.onDetach();
			assert.strictEqual(windowRemoveEventlistenerStub.callCount, 2);
		},

		'Registers document listeners on attach'() {
			const widget = new TestGlobalEvent();
			const globalEvent = () => {};
			widget.__setProperties__({ document: { focus: globalEvent }, key: 'global' });
			assert.strictEqual(documentAddEventlistenerStub.callCount, 1);
			widget.__setProperties__({ document: { focus: globalEvent }, key: 'global' });
			assert.strictEqual(documentAddEventlistenerStub.callCount, 1);
			widget.__setProperties__({ document: { focus: () => {} }, key: 'global' });
			assert.strictEqual(documentAddEventlistenerStub.callCount, 2);
			assert.strictEqual(documentRemoveEventlistenerStub.callCount, 1);
			widget.onDetach();
			assert.strictEqual(documentRemoveEventlistenerStub.callCount, 2);
		},

		'Returns null when there are no children'() {
			const h = harness(() => w(GlobalEvent, {}));
			h.expect(() => null);
		},

		'Returns children if they exist'() {
			const h = harness(() => w(GlobalEvent, {}, [ 'child' ]));
			h.expect(() => [ 'child' ]);
		}
	}
});
