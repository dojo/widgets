import global from '@dojo/shim/global';
import { stub, SinonStub } from 'sinon';

export const enum Keys {
	Down = 40,
	End = 35,
	Enter = 13,
	Escape = 27,
	Home = 36,
	Left = 37,
	PageDown = 34,
	PageUp = 33,
	Right = 39,
	Space = 32,
	Tab = 9,
	Up = 38
}

export function createResolvers() {
	let rAFStub: SinonStub;
	let rICStub: SinonStub;

	function resolveRAF() {
		for (let i = 0; i < rAFStub.callCount; i++) {
			rAFStub.getCall(i).args[0]();
		}
		rAFStub.reset();
	}

	function resolveRIC() {
		for (let i = 0; i < rICStub.callCount; i++) {
			rICStub.getCall(i).args[0]();
		}
		rICStub.reset();
	}

	return {
		resolve() {
			resolveRAF();
			resolveRIC();
		},
		stub() {
			rAFStub = stub(global, 'requestAnimationFrame').returns(1);
			if (global.requestIdleCallback) {
				rICStub = stub(global, 'requestIdleCallback').returns(1);
			}
			else {
				rICStub = stub(global, 'setTimeout').returns(1);
			}
		},
		restore() {
			rAFStub.restore();
			rICStub.restore();
		}
	};
}
