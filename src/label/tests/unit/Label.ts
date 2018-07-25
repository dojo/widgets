const { registerSuite } = intern.getInterface('object');

import harness from '@dojo/framework/testing/harness';
import { v, w } from '@dojo/framework/widget-core/d';

import Label from '../../index';
import * as css from '../../../theme/label.m.css';
import * as baseCss from '../../../common/styles/base.m.css';

registerSuite('Label', {

	tests: {
		simple() {
			const h = harness(() => w(Label, {}, [ 'baz' ]));
			h.expect(() => v('label', {
				classes: [
					css.root,
					null,
					null,
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
			const h = harness(() => w(Label, {
				forId: 'foo',
				aria: {
					describedBy: 'bar'
				},
				disabled: true,
				focused: true,
				readOnly: true,
				required: true,
				invalid: true,
				secondary: true
			}, [ 'baz' ]));

			h.expect(() => v('label', {
				classes: [
					css.root,
					css.disabled,
					css.focused,
					css.invalid,
					null,
					css.readonly,
					css.required,
					css.secondary,
					null
				],
				for: 'foo',
				'aria-describedby': 'bar'
			}, [ 'baz' ]));
		},

		hidden() {
			const h = harness(() => w(Label, {
				hidden: true
			}, [ 'baz' ]));

			h.expect(() => (v('label', {
				classes: [
					css.root,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					baseCss.visuallyHidden ],
				for: undefined
			}, [ 'baz' ])));
		}
	}
});
