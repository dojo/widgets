const { registerSuite } = intern.getInterface('object');

import { v } from '@dojo/widget-core/d';
import harness, { Harness } from '@dojo/test-extras/harness';

import Tooltip, { TooltipProperties } from './../../Tooltip';
import * as css from './../../styles/tooltip.m.css';

let widget: Harness<TooltipProperties, typeof Tooltip>;

registerSuite('Tooltip', {
	beforeEach() {
		widget = harness(Tooltip);
	},

	afterEach() {
		widget.destroy();
	},

	tests: {
		'should construct Tooltip'() {
			widget.expectRender(v('div', {
				classes: widget.classes(css.root)
			}, [ null ]));
		}
	}
});
