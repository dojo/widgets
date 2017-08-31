import * as registerSuite from 'intern!object';
import has, { add } from '@dojo/has/has';
import * as assert from 'intern/chai!assert';
import * as widgets from '../../../main';

add('touch', () => {
	/* Since jsdom will fake it anyways, no problem pretending we can do touch in NodeJS */
	return Boolean('ontouchstart' in window || has('host-node'));
});

registerSuite({
	name: 'main',

	api() {
		assert.isDefined(widgets.Button);
		assert.isDefined(widgets.Checkbox);
		assert.isDefined(widgets.ComboBox);
		assert.isDefined(widgets.Dialog);
		assert.isDefined(widgets.Label);
		assert.isDefined(widgets.Radio);
		assert.isDefined(widgets.Select);
		assert.isDefined(widgets.SlidePane);
		assert.isDefined(widgets.Slider);
		assert.isDefined(widgets.Tab);
		assert.isDefined(widgets.TabController);
		assert.isDefined(widgets.Textarea);
		assert.isDefined(widgets.TextInput);
		assert.isDefined(widgets.TitlePane);
	}
});
