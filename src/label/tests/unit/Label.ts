const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import harness, { Harness } from '@dojo/test-extras/harness';
import { v } from '@dojo/widget-core/d';

import Label, { parseLabelClasses } from '../../Label';
import * as css from '../../styles/label.m.css';
import * as baseCss from '../../../common/styles/base.m.css';

let widget: Harness<Label>;

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
				classes: css.root,
				for: undefined
			}, [
				v('span', {
					innerHTML: 'baz',
					classes: [ css.labelText, null ]
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
				classes: css.root,
				for: undefined
			}, [
				v('span', {
					classes: [ css.labelText, baseCss.visuallyHidden ],
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
				classes: css.root,
				for: 'id'
			}, [
				v('span', {
					innerHTML: 'baz',
					classes: [ css.labelText, null ]
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
				classes: css.root,
				for: undefined
			}, [
				v('div', [ 'child' ]),
				v('span', {
					innerHTML: 'baz',
					classes: [ css.labelText, null ]
				})
			]));
		},

		parseLabelClasses() {
			const result = parseLabelClasses([ 'foo', null, 'baz' ]);

			assert.strictEqual('foo baz', result);
		}
	}
});
