const { registerSuite } = intern.getInterface('object');

import { v } from '@dojo/widget-core/d';
import harness, { Harness } from '@dojo/test-extras/harness';

import Tooltip, { Orientation } from './../../Tooltip';
import * as css from './../../styles/tooltip.m.css';

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
			// prettier-ignore
			widget.expectRender(v('div', {
				classes: [css.right, css.rootFixed, css.rightFixed]
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

			// prettier-ignore
			widget.expectRender(v('div', {
				classes: [css.right, css.rootFixed, css.rightFixed]
			}, [
				v('div', { key: 'target' }, []),
				v('div', {
					key: 'content',
					classes: [css.content, css.contentFixed]
				}, ['foobar'])
			]));
		},

		'should render correct orientation'() {
			widget.setProperties({
				orientation: Orientation.bottom,
				content: 'foobar'
			});

			// prettier-ignore
			widget.expectRender(v('div', {
				classes: [css.bottom, css.rootFixed, css.bottomFixed]
			}, [
				v('div', { key: 'target' }, []),
				null
			]));
		}
	}
});
