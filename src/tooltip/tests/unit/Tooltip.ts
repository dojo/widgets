const { registerSuite } = intern.getInterface('object');

import { v, w } from '@dojo/widget-core/d';
import harness from '@dojo/test-extras/harness';

import Tooltip, { Orientation } from '../../index';
import * as css from '../../../theme/tooltip.m.css';
import * as fixedCss from '../../styles/tooltip.m.css';

registerSuite('Tooltip', {
	tests: {
		'should construct Tooltip'() {
			const h = harness(() => w(Tooltip, { content: '' }));
			h.expect(() => v('div', {
				classes: [ css.right, fixedCss.rootFixed, fixedCss.rightFixed ]
			}, [
				v('div', { key: 'target' }, []),
				null
			]));
		},

		'should render content if open'() {
			const h = harness(() => w(Tooltip, {
				content: 'foobar',
				open: true
			}));

			h.expect(() => v('div', {
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
			const h = harness(() => w(Tooltip, {
				orientation: Orientation.bottom,
				content: 'foobar'
			}));

			h.expect(() => v('div', {
				classes: [ css.bottom, fixedCss.rootFixed, fixedCss.bottomFixed ]
			}, [
				v('div', { key: 'target' }, []),
				null
			]));
		},

		'should render aria properties'() {
			const h = harness(() => w(Tooltip, {
				aria: { describedBy: 'foo' },
				content: 'bar',
				open: true
			}));

			h.expect(() => v('div', {
				classes: [ css.right, fixedCss.rootFixed, fixedCss.rightFixed ]
			}, [
				v('div', { key: 'target' }, []),
				v('div', {
					key: 'content',
					'aria-describedby': 'foo',
					classes: [ css.content, fixedCss.contentFixed ]
				}, [ 'bar' ])
			]));
		}
	}
});
