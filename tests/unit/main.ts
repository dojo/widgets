import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as widgets from '../../src/main';

registerSuite({
	name: 'main',

	api() {
		assert.isDefined(widgets.createDialog);
		assert.isDefined(widgets.createSlidePanel);
	}
});
