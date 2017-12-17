const { assert } = intern.getPlugin('chai');
const { registerSuite } = intern.getInterface('object');

import { v, w } from '@dojo/widget-core/d';
import * as sinon from 'sinon';
import harness, { Harness } from '@dojo/test-extras/harness';

import * as css from '../../styles/accordionPane.m.css';
import AccordionPane from '../../AccordionPane';
import TitlePane from '../../../titlepane/TitlePane';

let pane: Harness<AccordionPane>;

registerSuite('AccordionPane', {
	beforeEach() {
		pane = harness(AccordionPane);
	},

	afterEach() {
		pane.destroy();
	},

	tests: {
		'default rendering'() {
			pane.expectRender(
				v(
					'div',
					{
						classes: css.root
					},
					[]
				)
			);
		},

		'default rendering with children'() {
			pane.setProperties({ openKeys: [] });

			pane.setChildren([
				w(TitlePane, { title: 'foo', key: 'foo', onRequestOpen: () => {} }),
				null,
				w(TitlePane, { title: 'bar', key: 'bar', onRequestClose: () => {} }),
				w(TitlePane, { title: 'baz', key: 'baz' })
			]);

			pane.expectRender(
				v(
					'div',
					{
						classes: css.root
					},
					[
						w(TitlePane, {
							key: 'foo',
							onRequestClose: pane.listener,
							onRequestOpen: pane.listener,
							open: false,
							theme: undefined,
							title: 'foo'
						}),
						w(TitlePane, {
							key: 'bar',
							onRequestClose: pane.listener,
							onRequestOpen: pane.listener,
							open: false,
							theme: undefined,
							title: 'bar'
						}),
						w(TitlePane, {
							key: 'baz',
							onRequestClose: pane.listener,
							onRequestOpen: pane.listener,
							open: false,
							theme: undefined,
							title: 'baz'
						})
					]
				)
			);
		},

		'onRequestOpen should be called'() {
			const onRequestOpen = sinon.stub();

			pane.setProperties({ onRequestOpen });

			pane.setChildren([w(TitlePane, { title: 'foo', key: 'foo' })]);

			pane.callListener('onRequestOpen', { key: 'foo' });
			assert.isTrue(onRequestOpen.calledWith('foo'));
		},

		'onRequestClose should be called'() {
			const onRequestClose = sinon.stub();

			pane.setProperties({ onRequestClose });

			pane.setChildren([w(TitlePane, { title: 'foo', key: 'foo' })]);

			pane.callListener('onRequestClose', { key: 'foo' });
			assert.isTrue(onRequestClose.calledWith('foo'));
		}
	}
});
