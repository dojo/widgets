const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import * as sinon from 'sinon';

import has from '@dojo/has/has';
import { v, w } from '@dojo/widget-core/d';
import { assignProperties, assignChildProperties, compareProperty } from '@dojo/test-extras/support/d';
import harness, { Harness } from '@dojo/test-extras/harness';

import Label from '../../../label/Label';
import Checkbox, { Mode } from '../../Checkbox';
import * as css from '../../../theme/checkbox/checkbox.m.css';

const compareId = compareProperty((value: any) => {
	return typeof value === 'string';
});

const expectedToggle = function(widget: Harness<Checkbox>, labels = false) {
	if (labels) {
		return [
			v('div', {
				key: 'offLabel',
				classes: css.offLabel,
				'aria-hidden': null
			}, [ 'off' ]),
			v('div', {
				key: 'toggle',
				classes: css.toggleSwitch
			}),
			v('div', {
				key: 'onLabel',
				classes: css.onLabel,
				'aria-hidden': 'true'
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

const expected = function(widget: Harness<Checkbox>, label = false, toggle = false, toggleLabels = false) {
	const children = [
		v('div', { classes: css.inputWrapper }, [
			...(toggle ? expectedToggle(widget, toggleLabels) : []),
			v('input', {
				id: <any> compareId,
				classes: css.input,
				checked: false,
				'aria-describedby': undefined,
				disabled: undefined,
				'aria-invalid': null,
				name: undefined,
				readOnly: undefined,
				'aria-readonly': null,
				required: undefined,
				type: 'checkbox',
				value: undefined,
				onblur: widget.listener,
				onchange: widget.listener,
				onclick: widget.listener,
				onfocus: widget.listener,
				onmousedown: widget.listener,
				onmouseup: widget.listener,
				ontouchstart: widget.listener,
				ontouchend: widget.listener,
				ontouchcancel: widget.listener
			})
		]),
		label ? w(Label, {
			theme: undefined,
			disabled: undefined,
			hidden: undefined,
			invalid: undefined,
			readOnly: undefined,
			required: undefined,
			forId: <any> compareId,
			secondary: true
		}, [ 'foo' ]) : null
	];

	return v('div', {
		key: 'root',
		classes: [ css.root, null, null, null, null, null, null, null, null ]
	}, children);
};

let widget: Harness<Checkbox>;

registerSuite('Checkbox', {
	beforeEach() {
		widget = harness(Checkbox);
	},

	afterEach() {
		widget.destroy();
	},

	tests: {
		'default properties'() {
			widget.expectRender(expected(widget));
		},

		'custom properties'() {
			widget.setProperties({
				checked: true,
				describedBy: 'foo',
				name: 'bar',
				value: 'baz'
			});

			const expectedVdom = expected(widget);
			assignChildProperties(expectedVdom, '0,0', {
				checked: true,
				'aria-describedby': 'foo',
				name: 'bar',
				value: 'baz'
			});
			assignProperties(expectedVdom, {
				classes: [ css.root, null, css.checked, null, null, null, null, null, null ]
			});

			widget.expectRender(expectedVdom);
		},

		'label'() {
			widget.setProperties({
				label: 'foo'
			});

			widget.expectRender(expected(widget, true));
		},

		'state classes'() {
			widget.setProperties({
				invalid: true,
				disabled: true,
				readOnly: true,
				required: true
			});

			let expectedVdom = expected(widget);
			assignChildProperties(expectedVdom, '0,0', {
				disabled: true,
				'aria-invalid': 'true',
				readOnly: true,
				'aria-readonly': 'true',
				required: true
			});
			assignProperties(expectedVdom, {
				classes: [ css.root, null, null, css.disabled, null, css.invalid, null, css.readonly, css.required ]
			});

			widget.expectRender(expectedVdom, 'Widget should be invalid, disabled, read-only, and required');

			widget.setProperties({
				invalid: false,
				disabled: false,
				readOnly: false,
				required: false
			});
			expectedVdom = expected(widget);

			assignChildProperties(expectedVdom, '0,0', {
				disabled: false,
				readOnly: false,
				required: false
			});
			assignProperties(expectedVdom, {
				classes: [ css.root, null, null, null, null, null, css.valid, null, null ]
			});

			widget.expectRender(expectedVdom, 'State classes should be false, css.valid should be true');
		},

		'state properties on label'() {
			widget.setProperties({
				label: 'foo',
				invalid: true,
				disabled: true,
				readOnly: true,
				required: true
			});

			const expectedVdom = expected(widget, true);
			assignChildProperties(expectedVdom, '0,0', {
				disabled: true,
				'aria-invalid': 'true',
				readOnly: true,
				'aria-readonly': 'true',
				required: true
			});

			assignChildProperties(expectedVdom, 1, {
				disabled: true,
				readOnly: true,
				required: true,
				invalid: true
			});

			assignProperties(expectedVdom, {
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
			});

			widget.expectRender(expectedVdom);
		},

		'focused class'() {
			let expectedVdom = expected(widget);
			widget.expectRender(expectedVdom);

			widget.sendEvent('focus', { selector: 'input' });
			expectedVdom = expected(widget);
			assignProperties(expectedVdom, {
				classes: [ css.root, null, null, null, css.focused, null, null, null, null ]
			});
			widget.expectRender(expectedVdom, 'Should have focused class after focus event');

			widget.sendEvent('blur', { selector: 'input' });
			expectedVdom = expected(widget);
			widget.expectRender(expectedVdom, 'Should not have focused class after blur event');
		},

		'toggle mode'() {
			widget.setProperties({
				mode: Mode.toggle
			});
			let expectedVdom = expected(widget, false, true);
			assignProperties(expectedVdom, {
				classes: [ css.root, css.toggle, null, null, null, null, null, null, null ]
			});
			widget.expectRender(expectedVdom, 'Toggle input without toggle labels');

			widget.setProperties({
				mode: Mode.toggle,
				offLabel: 'off',
				onLabel: 'on'
			});
			expectedVdom = expected(widget, false, true, true);
			assignProperties(expectedVdom, {
				classes: [ css.root, css.toggle, null, null, null, null, null, null, null ]
			});
			widget.expectRender(expectedVdom, 'Toggle input with toggle labels');

			widget.setProperties({
				checked: true,
				mode: Mode.toggle,
				offLabel: 'off',
				onLabel: 'on'
			});
			expectedVdom = expected(widget, false, true, true);
			assignProperties(expectedVdom, {
				classes: [ css.root, css.toggle, css.checked, null, null, null, null, null, null ]
			});
			assignChildProperties(expectedVdom, '0,3', {
				checked: true
			});
			assignChildProperties(expectedVdom, '0,0', {
				'aria-hidden': 'true'
			});
			assignChildProperties(expectedVdom, '0,2', {
				'aria-hidden': null
			});
			widget.expectRender(expectedVdom, 'Checked toggle input with toggle labels');
		},

		events() {
			const onBlur = sinon.stub();
			const onChange = sinon.stub();
			const onClick = sinon.stub();
			const onFocus = sinon.stub();
			const onMouseDown = sinon.stub();
			const onMouseUp = sinon.stub();

			widget.setProperties({
				onBlur,
				onChange,
				onClick,
				onFocus,
				onMouseDown,
				onMouseUp
			});

			widget.sendEvent('blur', { selector: 'input' });
			assert.isTrue(onBlur.called, 'onBlur called');
			widget.sendEvent('change', { selector: 'input' });
			assert.isTrue(onChange.called, 'onChange called');
			widget.sendEvent('click', { selector: 'input' });
			assert.isTrue(onClick.called, 'onClick called');
			widget.sendEvent('focus', { selector: 'input' });
			assert.isTrue(onFocus.called, 'onFocus called');
			widget.sendEvent('mousedown', { selector: 'input' });
			assert.isTrue(onMouseDown.called, 'onMouseDown called');
			widget.sendEvent('mouseup', { selector: 'input' });
			assert.isTrue(onMouseUp.called, 'onMouseUp called');
		},

		'touch events'() {
			if (!has('touch')) {
				this.skip('Environment not support touch events');
			}

			const onTouchStart = sinon.stub();
			const onTouchEnd = sinon.stub();
			const onTouchCancel = sinon.stub();

			widget.setProperties({
				onTouchStart,
				onTouchEnd,
				onTouchCancel
			});

			widget.sendEvent('touchstart', { selector: 'input' });
			assert.isTrue(onTouchStart.called, 'onTouchStart called');
			widget.sendEvent('touchend', { selector: 'input' });
			assert.isTrue(onTouchEnd.called, 'onTouchEnd called');
			widget.sendEvent('touchcancel', { selector: 'input' });
			assert.isTrue(onTouchCancel.called, 'onTouchCancel called');
		}
	}
});
