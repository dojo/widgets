const { registerSuite } = intern.getInterface('object');

import harness, { Harness } from '@dojo/test-extras/harness';
import { v } from '@dojo/widget-core/d';

import Label from '../../Label';
import * as css from '../../../theme/label/label.m.css';
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
			widget.setChildren([ 'baz' ]);

			widget.expectRender(v('label', {
				classes: [
					css.root,
					null,
					null,
					null,
					null,
					null,
					null
				],
				for: undefined
			}, [
				'baz'
			]));
		},

		custom() {
			widget.setProperties({
				forId: 'foo',
				aria: {
					describedBy: 'bar'
				},
				disabled: true,
				readOnly: true,
				required: true,
				invalid: true,
				secondary: true
			});
			widget.setChildren([ 'baz' ]);

			widget.expectRender(v('label', {
				classes: [
					css.root,
					css.disabled,
					css.invalid,
					null,
					css.readonly,
					css.required,
					css.secondary
				],
				for: 'foo',
				'aria-describedby': 'bar'
			}, [
				'baz'
			]));
		},

		hidden() {
			widget.setProperties({
				hidden: true
			});

			widget.setChildren([ 'baz' ]);

			widget.expectRender(v('label', {
				classes: [
					css.root,
					null,
					null,
					null,
					null,
					null,
					baseCss.visuallyHidden ],
				for: undefined
			}, [
				'baz'
			]));
		}
	}
});
