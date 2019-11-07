const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import { formatAriaProperties, Keys } from '../../util';

registerSuite('util', {
	keys() {
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
	},

	formatAriaProperties() {
		assert.deepEqual(formatAriaProperties({}), {}, 'handles empty object');

		const aria = {
			describedBy: 'foo',
			controls: 'bar'
		};
		const formattedAria = formatAriaProperties(aria);
		assert.strictEqual(Object.keys(formattedAria).length, 2);
		assert.strictEqual(formattedAria['aria-describedby'], 'foo');
		assert.strictEqual(formattedAria['aria-controls'], 'bar');
	}
});
