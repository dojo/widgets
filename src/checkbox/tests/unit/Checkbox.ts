const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import * as sinon from 'sinon';
import { v, w } from '@dojo/framework/core/vdom';
import Focus from '@dojo/framework/core/meta/Focus';
import harness from '@dojo/framework/testing/harness';

import Label from '../../../label/index';
import Checkbox, { Mode, CheckboxProperties } from '../../index';
import * as css from '../../../theme/checkbox.m.css';
import { noop, MockMetaMixin, stubEvent } from '../../../common/tests/support/test-helpers';

const expectedToggle = function(labels = false, checked = false) {
	if (labels) {
		return [
			v(
				'div',
				{
					key: 'offLabel',
					classes: css.offLabel,
					'aria-hidden': checked ? 'true' : null
				},
				['off']
			),
			v('div', {
				key: 'toggle',
				classes: css.toggleSwitch
			}),
			v(
				'div',
				{
					key: 'onLabel',
					classes: css.onLabel,
					'aria-hidden': checked ? null : 'true'
				},
				['on']
			)
		];
	}

	return [
		null,
		v('div', {
			key: 'toggle',
			classes: css.toggleSwitch
		}),
		null
	];
};

const compareId = {
	selector: 'input',
	property: 'id',
	comparator: (property: any) => typeof property === 'string'
};
const compareForId = {
	selector: '@label',
	property: 'forId',
	comparator: (property: any) => typeof property === 'string'
};

const expected = function(label = false, toggle = false, toggleLabels = false, checked = false) {
	return v(
		'div',
		{
			key: 'root',
			classes: [
				css.root,
				toggle ? css.toggle : null,
				checked ? css.checked : null,
				null,
				null,
				null,
				null,
				null,
				null
			]
		},
		[
			v('div', { classes: css.inputWrapper }, [
				...(toggle ? expectedToggle(toggleLabels, checked) : []),
				v('input', {
					id: '',
					classes: css.input,
					checked,
					disabled: undefined,
					focus: noop,
					'aria-invalid': null,
					name: undefined,
					readOnly: undefined,
					'aria-readonly': null,
					required: undefined,
					type: 'checkbox',
					onblur: noop,
					onchange: noop,
					onfocus: noop
				})
			]),
			label
				? w(
						Label,
						{
							key: 'label',
							theme: undefined,
							classes: undefined,
							disabled: undefined,
							focused: false,
							hidden: undefined,
							valid: undefined,
							readOnly: undefined,
							required: undefined,
							forId: '',
							secondary: true
						},
						['foo']
				  )
				: null
		]
	);
};

registerSuite('Checkbox', {
	tests: {
		'default properties'() {
			const h = harness(() => w(Checkbox, {}), [compareId]);
			h.expect(() => expected());
		},

		'custom properties'() {
			const h = harness(
				() =>
					w(Checkbox, {
						aria: {
							describedBy: 'foo'
						},
						checked: true,
						id: 'foo',
						name: 'bar'
					}),
				[compareId]
			);

			h.expect(() =>
				v(
					'div',
					{
						key: 'root',
						classes: [css.root, null, css.checked, null, null, null, null, null, null]
					},
					[
						v('div', { classes: css.inputWrapper }, [
							v('input', {
								id: '',
								'aria-describedby': 'foo',
								name: 'bar',
								classes: css.input,
								checked: true,
								disabled: undefined,
								focus: noop,
								'aria-invalid': null,
								readOnly: undefined,
								'aria-readonly': null,
								required: undefined,
								type: 'checkbox',
								onblur: noop,
								onchange: noop,
								onfocus: noop
							})
						])
					]
				)
			);
		},

		label() {
			const h = harness(
				() =>
					w(Checkbox, {
						label: 'foo'
					}),
				[compareId, compareForId]
			);

			h.expect(() => expected(true));
		},

		'state classes'() {
			let valid = false;
			let disabled = true;
			let readOnly = true;
			let required = true;
			const h = harness(
				() =>
					w(Checkbox, {
						valid,
						disabled,
						readOnly,
						required
					}),
				[compareForId, compareId]
			);

			h.expect(() =>
				v(
					'div',
					{
						key: 'root',
						classes: [
							css.root,
							null,
							null,
							css.disabled,
							null,
							css.invalid,
							null,
							css.readonly,
							css.required
						]
					},
					[
						v('div', { classes: css.inputWrapper }, [
							v('input', {
								id: '',
								classes: css.input,
								checked: false,
								focus: noop,
								'aria-invalid': 'true',
								'aria-readonly': 'true',
								type: 'checkbox',
								name: undefined,
								onblur: noop,
								onchange: noop,
								onfocus: noop,
								disabled: true,
								readOnly: true,
								required: true
							})
						])
					]
				)
			);

			valid = true;
			disabled = false;
			readOnly = false;
			required = false;

			h.expect(() =>
				v(
					'div',
					{
						key: 'root',
						classes: [css.root, null, null, null, null, null, css.valid, null, null]
					},
					[
						v('div', { classes: css.inputWrapper }, [
							v('input', {
								id: '',
								classes: css.input,
								checked: false,
								focus: noop,
								'aria-invalid': null,
								'aria-readonly': null,
								type: 'checkbox',
								name: undefined,
								onblur: noop,
								onchange: noop,
								onfocus: noop,
								disabled: false,
								readOnly: false,
								required: false
							})
						])
					]
				)
			);
		},

		'state properties on label'() {
			const h = harness(
				() =>
					w(Checkbox, {
						label: 'foo',
						valid: false,
						disabled: true,
						readOnly: true,
						required: true
					}),
				[compareId, compareForId]
			);

			h.expect(() =>
				v(
					'div',
					{
						key: 'root',
						classes: [
							css.root,
							null,
							null,
							css.disabled,
							null,
							css.invalid,
							null,
							css.readonly,
							css.required
						]
					},
					[
						v('div', { classes: css.inputWrapper }, [
							v('input', {
								disabled: true,
								classes: css.input,
								focus: noop,
								'aria-invalid': 'true',
								readOnly: true,
								'aria-readonly': 'true',
								required: true,
								checked: false,
								name: undefined,
								type: 'checkbox',
								id: '',
								onblur: noop,
								onchange: noop,
								onfocus: noop
							})
						]),
						w(
							Label,
							{
								key: 'label',
								disabled: true,
								focused: false,
								theme: undefined,
								classes: undefined,
								readOnly: true,
								required: true,
								valid: false,
								hidden: undefined,
								forId: '',
								secondary: true
							},
							['foo']
						)
					]
				)
			);
		},

		'focused class'() {
			const mockMeta = sinon.stub();
			const mockFocusGet = sinon.stub().returns({
				active: false,
				containsFocus: true
			});
			mockMeta.withArgs(Focus).returns({
				get: mockFocusGet
			});
			const h = harness(() => w(MockMetaMixin(Checkbox, mockMeta), {}), [compareId]);
			h.expect(() =>
				v(
					'div',
					{
						key: 'root',
						classes: [css.root, null, null, null, css.focused, null, null, null, null]
					},
					[
						v('div', { classes: css.inputWrapper }, [
							v('input', {
								id: '',
								classes: css.input,
								checked: false,
								disabled: undefined,
								focus: noop,
								'aria-invalid': null,
								name: undefined,
								readOnly: undefined,
								'aria-readonly': null,
								required: undefined,
								type: 'checkbox',
								onblur: noop,
								onchange: noop,
								onfocus: noop
							})
						])
					]
				)
			);
		},

		'toggle mode'() {
			let properties: CheckboxProperties = {
				mode: Mode.toggle
			};
			const h = harness(() => w(Checkbox, properties), [compareId, compareForId]);

			h.expect(() => expected(false, true));

			properties = {
				mode: Mode.toggle,
				offLabel: 'off',
				onLabel: 'on'
			};
			h.expect(() => expected(false, true, true));

			properties = {
				checked: true,
				mode: Mode.toggle,
				offLabel: 'off',
				onLabel: 'on'
			};
			h.expect(() => expected(false, true, true, true));
		},

		events() {
			const onBlur = sinon.stub();
			const onValue = sinon.stub();
			const onFocus = sinon.stub();

			const h = harness(() =>
				w(Checkbox, {
					onBlur,
					onValue,
					onFocus
				})
			);

			h.trigger('input', 'onblur', stubEvent);
			assert.isTrue(onBlur.called, 'onBlur called');
			h.trigger('input', 'onchange', stubEvent);
			assert.isTrue(onValue.called, 'onChange called');
			h.trigger('input', 'onfocus', stubEvent);
			assert.isTrue(onFocus.called, 'onFocus called');
		}
	}
});
