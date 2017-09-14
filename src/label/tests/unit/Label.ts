import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';

import harness, { Harness } from '@dojo/test-extras/harness';
import { v } from '@dojo/widget-core/d';

import Label, { LabelProperties, parseLabelClasses } from '../../Label';
import * as css from '../../styles/label.m.css';
import * as baseCss from '../../../common/styles/base.m.css';

let widget: Harness<LabelProperties, typeof Label>;

registerSuite({
	name: 'Label',

	beforeEach() {
		widget = harness(Label);
	},

	afterEach() {
		widget.destroy();
	},

	simple() {
		widget.setProperties({
			label: 'baz'
		});

		widget.expectRender(v('label', {
			classes: widget.classes(css.root),
			for: undefined,
			form: undefined
		}, [
			v('span', {
				innerHTML: 'baz'
			})
		]));
	},

	hidden() {
		widget.setProperties({
			label: {
				content: 'baz',
				hidden: true
			}
		});

		widget.expectRender(v('label', {
			classes: widget.classes(css.root),
			for: undefined,
			form: undefined
		}, [
			v('span', {
				classes: widget.classes(baseCss.visuallyHidden),
				innerHTML: 'baz'
			})
		]));
	},

	'with children'() {
		widget.setProperties({
			forId: 'id',
			formId: 'foo',
			label: 'baz'
		});
		widget.setChildren([
			v('div', [ 'First' ]),
			v('div', [ 'Second' ])
		]);

		widget.expectRender(v('label', {
			classes: widget.classes(css.root),
			for: 'id',
			form: 'foo'
		}, [
			v('span', {
				innerHTML: 'baz'
			}),
			v('div', [ 'First' ]),
			v('div', [ 'Second' ])
		]));
	},

	'label after'() {
		widget.setProperties({
			formId: 'foo',
			label: {
				content: 'baz',
				before: false
			}
		});
		widget.setChildren([
			v('div', [ 'child' ])
		]);

		widget.expectRender(v('label', {
			classes: widget.classes(css.root),
			for: undefined,
			form: 'foo'
		}, [
			v('div', [ 'child' ]),
			v('span', {
				innerHTML: 'baz'
			})
		]));
	},

	parseLabelClasses() {
		const classes = {
			foo: true,
			bar: false,
			baz: true
		};
		const result = parseLabelClasses(classes);

		assert.strictEqual('foo baz', result);
	}
});
