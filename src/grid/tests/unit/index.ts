const { describe, it } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import LeGrid from '../../index';
import Grid from '../../widgets/Grid';

describe('Index', () => {
	it('should re-export the grid', () => {
		assert.isOk(LeGrid);
		assert.strictEqual(LeGrid, Grid);
	});
});
