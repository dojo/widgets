import { v, w } from '@dojo/widget-core/d';
import * as assert from 'intern/chai!assert';
import * as registerSuite from 'intern!object';
import * as sinon from 'sinon';
import harness, { Harness } from '@dojo/test-extras/harness';

import AccordionPane, { AccordionPaneProperties } from '../../AccordionPane';
import TitlePane from '../../../titlepane/TitlePane';

import * as css from '../../styles/accordionPane.m.css';

let pane: Harness<AccordionPaneProperties, typeof AccordionPane>;
registerSuite({
	name: 'AccordionPane',

	beforeEach() {
		pane = harness(AccordionPane);
	},

	afterEach() {
		pane.destroy();
	},

	'default rendering'() {
		pane.expectRender(v('div', {
			classes: pane.classes(css.root),
			key: 'root'
		}, []));
	},

	'default rendering with children'() {
		pane.setProperties({ openKeys: [] });

		pane.setChildren([
			w(TitlePane, { title: 'foo', key: 'foo', onRequestOpen: () => {} }),
			undefined,
			w(TitlePane, { title: 'bar', key: 'bar', onRequestClose: () => {} }),
			w(TitlePane, { title: 'baz', key: 'baz' })
		]);

		pane.expectRender(v('div', {
			classes: pane.classes(css.root),
			key: 'root'
		}, [
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
		]));
	},

	'onRequestOpen should be called'() {
		const onRequestOpen = sinon.stub();

		pane.setProperties({ onRequestOpen });

		pane.setChildren([
			w(TitlePane, { title: 'foo', key: 'foo' })
		]);

		pane.callListener('onRequestOpen', { key: 'foo' });
		assert.isTrue(onRequestOpen.calledOnce);
	},

	'onRequestClose should be called'() {
		const onRequestClose = sinon.stub();

		pane.setProperties({ onRequestClose });

		pane.setChildren([
			w(TitlePane, { title: 'foo', key: 'foo' })
		]);

		pane.callListener('onRequestClose', { key: 'foo' });
		assert.isTrue(onRequestClose.calledOnce);
	}
});
