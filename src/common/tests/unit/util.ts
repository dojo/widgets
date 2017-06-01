import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as sinon from 'sinon';
import { Keys } from '../../util';

registerSuite({
	name: 'util',

	beforeEach() {
		sinon.spy(window, 'addEventListener');
		sinon.spy(window, 'removeEventListener');
	},

	afterEach() {
		(<any> window).addEventListener.restore();
		(<any> window).removeEventListener.restore();
	},

	Keys() {
		assert.strictEqual(Keys.Down, 40);
		assert.strictEqual(Keys.End, 35);
		assert.strictEqual(Keys.Enter, 13);
		assert.strictEqual(Keys.Escape, 27);
		assert.strictEqual(Keys.Home, 36);
		assert.strictEqual(Keys.Left, 37);
		assert.strictEqual(Keys.PageDown, 34);
		assert.strictEqual(Keys.PageUp, 33);
		assert.strictEqual(Keys.Right, 39);
		assert.strictEqual(Keys.Space, 32);
		assert.strictEqual(Keys.Tab, 9);
		assert.strictEqual(Keys.Up, 38);
	}
});
