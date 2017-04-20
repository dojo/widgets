import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as widgets from '../../../main';

registerSuite({
	name: 'main',

	api() {
		assert.isDefined(widgets.Dialog);
		assert.isDefined(widgets.SlidePane);
		assert.isDefined(widgets.TabPane);
		assert.isDefined(widgets.Label);
		assert.isDefined(widgets.Button);
		assert.isDefined(widgets.TextInput);
		assert.isDefined(widgets.Textarea);
		assert.isDefined(widgets.Checkbox);
		assert.isDefined(widgets.Radio);
		assert.isDefined(widgets.Slider);
		assert.isDefined(widgets.ComboBox);
		assert.isDefined(widgets.Select);
		assert.isDefined(widgets.Menu);
		assert.isDefined(widgets.MenuBar);
		assert.isDefined(widgets.MenuItem);
		assert.isDefined(widgets.SubMenu);
	}
});
