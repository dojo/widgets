const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import { stub, SinonStub } from 'sinon';

import global from '@dojo/framework/shim/global';
import { GlobalEvent } from './../../index';
import { harness } from '@dojo/framework/testing/harness';
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
			const h = harness(() => (
				<GlobalEvent document={{ focus: globalEvent }} key="global">
					child
				</GlobalEvent>
			));
			h.expect(() => h.getRender());

			// h.trigger(':root', (node: any) => node.children[0].focus);
			h.expect(() => h.getRender());

			assert.strictEqual(documentAddEventlistenerStub.callCount, 1);
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
