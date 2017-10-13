const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import harness, { Harness } from '@dojo/test-extras/harness';
import { v } from '@dojo/widget-core/d';

import Label, { LabelProperties, parseLabelClasses } from '../../Label';
import * as css from '../../styles/label.m.css';
import * as baseCss from '../../../common/styles/base.m.css';

let widget: Harness<LabelProperties, typeof Label>;

registerSuite('Label', {

	beforeEach() {
		widget = harness(Label);
	},

	afterEach() {
		widget.destroy();
	},

	tests: {
		simple() {
			widget.setProperties({
				label: 'baz'
			});

			widget.expectRender(v('label', {
				classes: widget.classes(css.root),
				for: undefined
			}, [
				v('span', {
					innerHTML: 'baz',
					classes: widget.classes(css.labelText)
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
				for: undefined
			}, [
				v('span', {
					classes: widget.classes(css.labelText, baseCss.visuallyHidden),
					innerHTML: 'baz'
				})
			]));
		},

		'with children'() {
			widget.setProperties({
				forId: 'id',
				label: 'baz'
			});
			widget.setChildren([
				v('div', [ 'First' ]),
				v('div', [ 'Second' ])
			]);

			widget.expectRender(v('label', {
				classes: widget.classes(css.root),
				for: 'id'
			}, [
				v('span', {
					innerHTML: 'baz',
					classes: widget.classes(css.labelText)
				}),
				v('div', [ 'First' ]),
				v('div', [ 'Second' ])
			]));
		},

		'label after'() {
			widget.setProperties({
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
				for: undefined
			}, [
				v('div', [ 'child' ]),
				v('span', {
					innerHTML: 'baz',
					classes: widget.classes(css.labelText)
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
	}
});
