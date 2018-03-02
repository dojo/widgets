const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import * as sinon from 'sinon';
import { v, w } from '@dojo/widget-core/d';
import Focus from '@dojo/widget-core/meta/Focus';
import harness from '@dojo/test-extras/harness';

import Label from '../../../label/index';
import Checkbox, { CheckboxProperties } from '../../index';
import * as css from '../../../theme/checkbox.m.css';
import { noop, MockMetaMixin, stubEvent } from '../../../common/tests/support/test-helpers';

const compareId = { selector: 'input', property: 'id', comparator: (property: any) => typeof property === 'string' };
const compareForId = { selector: '@label', property: 'forId', comparator: (property: any) => typeof property === 'string' };

const expected = function(label = false, toggle = false, toggleLabels = false, checked = false) {
	return v('div', {
		key: 'root',
		classes: [ css.root, checked ? css.checked : null, null, null, null, null, null, null ]
	}, [
		v('div', { classes: css.inputWrapper }, [
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
			focused: false,
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
				classes: [ css.root, css.checked, null, null, null, null, null, null ]
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
				classes: [ css.root, null, css.disabled, null, css.invalid, null, css.readonly, css.required ]
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
				classes: [ css.root, null, null, null, null, css.valid, null, null ]
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
					focused: false,
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
				classes: [ css.root, null, null, css.focused, null, null, null, null ]
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

			h.trigger('input', 'onblur', stubEvent);
			assert.isTrue(onBlur.called, 'onBlur called');
			h.trigger('input', 'onchange', stubEvent);
			assert.isTrue(onChange.called, 'onChange called');
			h.trigger('input', 'onclick', stubEvent);
			assert.isTrue(onClick.called, 'onClick called');
			h.trigger('input', 'onfocus', stubEvent);
			assert.isTrue(onFocus.called, 'onFocus called');
			h.trigger('input', 'onmousedown', stubEvent);
			assert.isTrue(onMouseDown.called, 'onMouseDown called');
			h.trigger('input', 'onmouseup', stubEvent);
			assert.isTrue(onMouseUp.called, 'onMouseUp called');
			h.trigger('input', 'ontouchstart', stubEvent);
			assert.isTrue(onTouchStart.called, 'onTouchStart called');
			h.trigger('input', 'ontouchend', stubEvent);
			assert.isTrue(onTouchEnd.called, 'onTouchEnd called');
			h.trigger('input', 'ontouchcancel', stubEvent);
			assert.isTrue(onTouchCancel.called, 'onTouchCancel called');
		}
	}
});
