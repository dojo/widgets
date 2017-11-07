const { registerSuite } = intern.getInterface('object');

import { v } from '@dojo/widget-core/d';
import harness, { Harness } from '@dojo/test-extras/harness';

import Tooltip, { TooltipProperties, Orientation } from './../../Tooltip';
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
				classes: widget.classes(css.rootFixed, css.right, css.rightFixed)
			}, [
				v('div'),
				null
			]));
		},

		'should render content if open'() {
			widget.setProperties({
				content: 'foobar',
				open: true
			});

			widget.expectRender(v('div', {
				classes: widget.classes(css.rootFixed, css.right, css.rightFixed)
			}, [
				v('div'),
				v('div', {
					classes: widget.classes(css.content, css.contentFixed)
				}, ['foobar' ])
			]));
		},

		'should render correct orientation'() {
			widget.setProperties({
				orientation: Orientation.bottom,
				content: 'foobar'
			});

			widget.expectRender(v('div', {
				classes: widget.classes(css.rootFixed, css.bottom, css.bottomFixed)
			}, [
				v('div'),
				null
			]));
		}
	}
});
