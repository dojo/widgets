const { registerSuite } = intern.getInterface('object');

import { v } from '@dojo/widget-core/d';
import harness, { Harness } from '@dojo/test-extras/harness';

import Tooltip, { Orientation } from './../../Tooltip';
import * as css from '../../../theme/tooltip/tooltip.m.css';
import * as fixedCss from '../../styles/tooltip.m.css';

let widget: Harness<Tooltip>;

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
				classes: [ css.right, fixedCss.rootFixed, fixedCss.rightFixed ]
			}, [
				v('div', { key: 'target' }, []),
				null
			]));
		},

		'should render content if open'() {
			widget.setProperties({
				content: 'foobar',
				open: true
			});

			widget.expectRender(v('div', {
				classes: [ css.right, fixedCss.rootFixed, fixedCss.rightFixed ]
			}, [
				v('div', { key: 'target' }, []),
				v('div', {
					key: 'content',
					classes: [ css.content, fixedCss.contentFixed ]
				}, [ 'foobar' ])
			]));
		},

		'should render correct orientation'() {
			widget.setProperties({
				orientation: Orientation.bottom,
				content: 'foobar'
			});

			widget.expectRender(v('div', {
				classes: [ css.bottom, fixedCss.rootFixed, fixedCss.bottomFixed ]
			}, [
				v('div', { key: 'target' }, []),
				null
			]));
		}
	}
});
