const { assert } = intern.getPlugin('chai');
const { registerSuite } = intern.getInterface('object');

import { v, w } from '@dojo/widget-core/d';
import * as sinon from 'sinon';
import harness from '@dojo/test-extras/harness';

import * as css from '../../../theme/accordionpane/accordionPane.m.css';
import AccordionPane from '../../AccordionPane';
import TitlePane from '../../../titlepane/TitlePane';
import { noop } from '../../../common/tests/support/test-helpers';

registerSuite('AccordionPane', {
	tests: {
		'default rendering'() {
			const h = harness(() => w(AccordionPane, {}));
			h.expect(() => v('div', {
				classes: css.root
			}, []));
		},

		'default rendering with children'() {
			const h = harness(() => w(AccordionPane, { openKeys: [] }, [
				w(TitlePane, { title: 'foo', key: 'foo', onRequestOpen: () => {} }),
				null,
				w(TitlePane, { title: 'bar', key: 'bar', onRequestClose: () => {} }),
				w(TitlePane, { title: 'baz', key: 'baz' })
			]));

			h.expect(() => v('div', {
				classes: css.root
			}, [
				w(TitlePane, {
					key: 'foo',
					onRequestClose: noop,
					onRequestOpen: noop,
					open: false,
					theme: undefined,
					title: 'foo'
				}),
				w(TitlePane, {
					key: 'bar',
					onRequestClose: noop,
					onRequestOpen: noop,
					open: false,
					theme: undefined,
					title: 'bar'
				}),
				w(TitlePane, {
					key: 'baz',
					onRequestClose: noop,
					onRequestOpen: noop,
					open: false,
					theme: undefined,
					title: 'baz'
				})
			]));
		},

		'onRequestOpen should be called'() {
			const onRequestOpen = sinon.stub();
			const h = harness(() => w(AccordionPane, { onRequestOpen }, [
				w(TitlePane, { title: 'foo', key: 'foo' })
			]));
			h.trigger('@foo', 'onRequestOpen');
			assert.isTrue(onRequestOpen.calledWith('foo'));
		},

		'onRequestClose should be called'() {
			const onRequestClose = sinon.stub();
			const h = harness(() => w(AccordionPane, { onRequestClose }, [
				w(TitlePane, { title: 'foo', key: 'foo' })
			]));

			h.trigger('@foo', 'onRequestClose');
			assert.isTrue(onRequestClose.calledWith('foo'));
		}
	}
});
