const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import * as sinon from 'sinon';
import { v, w } from '@dojo/widget-core/d';
import Focus from '@dojo/widget-core/meta/Focus';
import harness from '@dojo/test-extras/harness';

import Label from '../../../label/Label';
import Checkbox, { Mode, CheckboxProperties } from '../../Checkbox';
import * as css from '../../../theme/checkbox/checkbox.m.css';
import { noop, MockMetaMixin } from '../../../common/tests/support/test-helpers';

const expectedToggle = function(labels = false, checked = false) {
	if (labels) {
		return [
			v('div', {
				key: 'offLabel',
				classes: css.offLabel,
				'aria-hidden': checked ? 'true' : null
			}, [ 'off' ]),
			v('div', {
				key: 'toggle',
				classes: css.toggleSwitch
			}),
			v('div', {
				key: 'onLabel',
				classes: css.onLabel,
				'aria-hidden': checked ? null : 'true'
			}, [ 'on' ])
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

const compareId = { selector: 'input', property: 'id', comparator: (property: any) => typeof property === 'string' };
const compareForId = { selector: '@label', property: 'forId', comparator: (property: any) => typeof property === 'string' };

const expected = function(label = false, toggle = false, toggleLabels = false, checked = false) {
	return v('div', {
		key: 'root',
		classes: [ css.root, toggle ? css.toggle : null, checked ? css.checked : null, null, null, null, null, null, null ]
	}, [
		v('div', { classes: css.inputWrapper }, [
			...(toggle ? expectedToggle(toggleLabels, checked) : []),
			v('input', {
				id: '',
				classes: css.input,
				checked,
				disabled: undefined,
				'aria-invalid': null,
				name: undefined,
				readOnly: undefined,
				'aria-readonly': null,
				required: undefined,
				type: 'checkbox',
				value: undefined,
				onblur: noop,
				onchange: noop,
				onclick: noop,
				onfocus: noop,
				onmousedown: noop,
				onmouseup: noop,
				ontouchstart: noop,
				ontouchend: noop,
				ontouchcancel: noop
			})
		]),
		label ? w(Label, {
			key: 'label',
			theme: undefined,
			disabled: undefined,
			hidden: undefined,
			invalid: undefined,
			readOnly: undefined,
			required: undefined,
			forId: '',
			secondary: true
		}, [ 'foo' ]) : null
	]);
};

registerSuite('Checkbox', {
	tests: {
		'default properties'() {
			const h = harness(() => w(Checkbox, {}), [ compareId ]);
			h.expect(() => expected());
		},

		'custom properties'() {
			const h = harness(() => w(Checkbox, {
				aria: {
					describedBy: 'foo'
				},
				checked: true,
				id: 'foo',
				name: 'bar',
				value: 'baz'
			}), [ compareId ]);

			h.expect(() => v('div', {
				key: 'root',
				classes: [ css.root, null, css.checked, null, null, null, null, null, null ]
			}, [
				v('div', { classes: css.inputWrapper }, [
					v('input', {
						id: '',
						'aria-describedby': 'foo',
						name: 'bar',
						classes: css.input,
						checked: true,
						disabled: undefined,
						'aria-invalid': null,
						readOnly: undefined,
						'aria-readonly': null,
						required: undefined,
						type: 'checkbox',
						value: 'baz',
						onblur: noop,
						onchange: noop,
						onclick: noop,
						onfocus: noop,
						onmousedown: noop,
						onmouseup: noop,
						ontouchstart: noop,
						ontouchend: noop,
						ontouchcancel: noop
					})
				])
			]));
		},

		'label'() {
			const h = harness(() => w(Checkbox, {
				label: 'foo'
			}), [ compareId, compareForId ]);

			h.expect(() => expected(true));
		},

		'state classes'() {
			let invalid = true;
			let disabled = true;
			let readOnly = true;
			let required = true;
			const h = harness(() => w(Checkbox, {
				invalid,
				disabled,
				readOnly,
				required
			}), [ compareForId, compareId ]);

			h.expect(() => v('div', {
				key: 'root',
				classes: [ css.root, null, null, css.disabled, null, css.invalid, null, css.readonly, css.required ]
			}, [
				v('div', { classes: css.inputWrapper }, [
					v('input', {
						id: '',
						classes: css.input,
						checked: false,
						'aria-invalid': 'true',
						'aria-readonly': 'true',
						type: 'checkbox',
						value: undefined,
						name: undefined,
						onblur: noop,
						onchange: noop,
						onclick: noop,
						onfocus: noop,
						onmousedown: noop,
						onmouseup: noop,
						ontouchstart: noop,
						ontouchend: noop,
						ontouchcancel: noop,
						disabled: true,
						readOnly: true,
						required: true
					})
				])
			]));

			invalid = false;
			disabled = false;
			readOnly = false;
			required = false;

			h.expect(() => v('div', {
				key: 'root',
				classes: [ css.root, null, null, null, null, null, css.valid, null, null ]
			}, [
				v('div', { classes: css.inputWrapper }, [
					v('input', {
						id: '',
						classes: css.input,
						checked: false,
						'aria-invalid': null,
						'aria-readonly': null,
						type: 'checkbox',
						value: undefined,
						name: undefined,
						onblur: noop,
						onchange: noop,
						onclick: noop,
						onfocus: noop,
						onmousedown: noop,
						onmouseup: noop,
						ontouchstart: noop,
						ontouchend: noop,
						ontouchcancel: noop,
						disabled: false,
						readOnly: false,
						required: false
					})
				])
			]));
		},

		'state properties on label'() {
			const h = harness(() => w(Checkbox, {
				label: 'foo',
				invalid: true,
				disabled: true,
				readOnly: true,
				required: true
			}), [ compareId, compareForId ]);

			h.expect(() => v('div', {
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
			}, [
				v('div', { classes: css.inputWrapper }, [
					v('input', {
						disabled: true,
						classes: css.input,
						'aria-invalid': 'true',
						readOnly: true,
						'aria-readonly': 'true',
						required: true,
						checked: false,
						name: undefined,
						type: 'checkbox',
						value: undefined,
						id: '',
						onblur: noop,
						onchange: noop,
						onclick: noop,
						onfocus: noop,
						onmousedown: noop,
						onmouseup: noop,
						ontouchstart: noop,
						ontouchend: noop,
						ontouchcancel: noop
					})
				]),
				w(Label, {
					key: 'label',
					disabled: true,
					theme: undefined,
					readOnly: true,
					required: true,
					invalid: true,
					hidden: undefined,
					forId: '',
					secondary: true
				}, [ 'foo' ])
			]));
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
			const h = harness(() => w(MockMetaMixin(Checkbox, mockMeta), {}), [ compareId ]);
			h.expect(() => v('div', {
				key: 'root',
				classes: [ css.root, null, null, null, css.focused, null, null, null, null ]
			}, [
				v('div', { classes: css.inputWrapper }, [
					v('input', {
						id: '',
						classes: css.input,
						checked: false,
						disabled: undefined,
						'aria-invalid': null,
						name: undefined,
						readOnly: undefined,
						'aria-readonly': null,
						required: undefined,
						type: 'checkbox',
						value: undefined,
						onblur: noop,
						onchange: noop,
						onclick: noop,
						onfocus: noop,
						onmousedown: noop,
						onmouseup: noop,
						ontouchstart: noop,
						ontouchend: noop,
						ontouchcancel: noop
					})
				])
			]));
		},

		'toggle mode'() {
			let properties: CheckboxProperties = {
				mode: Mode.toggle
			};
			const h = harness(() => w(Checkbox, properties), [ compareId, compareForId ]);

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
			const onChange = sinon.stub();
			const onClick = sinon.stub();
			const onFocus = sinon.stub();
			const onMouseDown = sinon.stub();
			const onMouseUp = sinon.stub();
			const onTouchStart = sinon.stub();
			const onTouchEnd = sinon.stub();
			const onTouchCancel = sinon.stub();

			const h = harness(() => w(Checkbox, {
				onBlur,
				onChange,
				onClick,
				onFocus,
				onMouseDown,
				onMouseUp,
				onTouchStart,
				onTouchEnd,
				onTouchCancel
			}));

			h.trigger('input', 'onblur');
			assert.isTrue(onBlur.called, 'onBlur called');
			h.trigger('input', 'onchange');
			assert.isTrue(onChange.called, 'onChange called');
			h.trigger('input', 'onclick');
			assert.isTrue(onClick.called, 'onClick called');
			h.trigger('input', 'onfocus');
			assert.isTrue(onFocus.called, 'onFocus called');
			h.trigger('input', 'onmousedown');
			assert.isTrue(onMouseDown.called, 'onMouseDown called');
			h.trigger('input', 'onmouseup');
			assert.isTrue(onMouseUp.called, 'onMouseUp called');
			h.trigger('input', 'ontouchstart');
			assert.isTrue(onTouchStart.called, 'onTouchStart called');
			h.trigger('input', 'ontouchend');
			assert.isTrue(onTouchEnd.called, 'onTouchEnd called');
			h.trigger('input', 'ontouchcancel');
			assert.isTrue(onTouchCancel.called, 'onTouchCancel called');
		}
	}
});
