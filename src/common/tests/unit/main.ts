import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as widgets from '../../../main';

registerSuite({
	name: 'main',

	api() {
		assert.isDefined(widgets.Dialog);
		assert.isDefined(widgets.SlidePane);
		assert.isDefined(widgets.Label);
		assert.isDefined(widgets.TextInput);
	}
});
