import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as sinon from 'sinon';

import has from '@dojo/has/has';
import { v, w } from '@dojo/widget-core/d';
import { assignProperties, assignChildProperties, compareProperty, replaceChild } from '@dojo/test-extras/support/d';
import harness, { Harness } from '@dojo/test-extras/harness';

import Label from '../../../label/Label';
import Slider, { SliderProperties } from '../../Slider';
import * as css from '../../styles/slider.m.css';

const compareId = compareProperty((value: any) => {
	return typeof value === 'string';
});

const expected = function(widget: any, label = false, tooltip = false) {
	const sliderVdom = v('div', {
		classes: widget.classes(css.inputWrapper, css.inputWrapperFixed),
		styles: {}
	}, [
		v('input', {
			classes: widget.classes(css.input, css.nativeInput),
			'aria-describedby': undefined,
			disabled: undefined,
			id: <any> compareId,
			'aria-invalid': null,
			max: '100',
			min: '0',
			name: undefined,
			readOnly: undefined,
			'aria-readonly': null,
			required: undefined,
			step: '1',
			styles: {},
			type: 'range',
			value: '0',
			onblur: widget.listener,
			onchange: widget.listener,
			onclick: widget.listener,
			onfocus: widget.listener,
			oninput: widget.listener,
			onkeydown: widget.listener,
			onkeypress: widget.listener,
			onkeyup: widget.listener,
			onmousedown: widget.listener,
			onmouseup: widget.listener,
			ontouchstart: widget.listener,
			ontouchend: widget.listener,
			ontouchcancel: widget.listener
		}),
		v('div', {
			classes: widget.classes(css.track, css.trackFixed),
			'aria-hidden': 'true',
			styles: {}
		}, [
			v('span', {
				classes: widget.classes(css.fill, css.fillFixed),
				styles: { width: '0%' }
			}),
			v('span', {
				classes: widget.classes(css.thumb, css.thumbFixed),
				styles: { left: '0%' }
			})
		]),
		v('output', {
			classes: widget.classes(css.output, tooltip ? css.outputTooltip : null),
			for: <any> compareId,
			styles: {}
		}, [ '0' ])
	]);

	if (label) {
		return w(Label, {
			extraClasses: { root: `${css.root} ${css.rootFixed}` },
			label: 'foo',
			formId: undefined,
			theme: undefined
		}, [ sliderVdom ]);
	}
	else {
		return v('div', {
			classes: widget.classes(css.root, css.rootFixed)
		}, [ sliderVdom ]);
	}
};

let widget: Harness<SliderProperties, typeof Slider>;

registerSuite({
	name: 'Slider',

	beforeEach() {
		widget = harness(Slider);
	},

	afterEach() {
		widget.destroy();
	},

	'default properties'() {
		widget.expectRender(expected(widget));
	},

	'custom properties'() {
		widget.setProperties({
			describedBy: 'foo',
			max: 60,
			min: 10,
			name: 'bar',
			output: () => 'tribbles',
			outputIsTooltip: true,
			step: 5,
			value: 35
		});

		const expectedVdom = expected(widget, false, true);
		assignChildProperties(expectedVdom, '0,0', {
			'aria-describedby': 'foo',
			max: '60',
			min: '10',
			name: 'bar',
			step: '5',
			value: '35'
		});
		assignChildProperties(expectedVdom, '0,1,0', {
			styles: { width: '50%' }
		});
		assignChildProperties(expectedVdom, '0,1,1', {
			styles: { left: '50%' }
		});
		assignChildProperties(expectedVdom, '0,2', {
			styles: { left: '50%' }
		});
		replaceChild(expectedVdom, '0,2,0', 'tribbles');

		widget.expectRender(expectedVdom);
	},

	'vertical slider': {
		'default properties'() {
			widget.setProperties({
				vertical: true
			});

			const expectedVdom = expected(widget);
			assignChildProperties(expectedVdom, '0', {
				styles: { height: '200px' }
			});
			assignChildProperties(expectedVdom, '0,0', {
				styles: { width: '200px' }
			});
			assignChildProperties(expectedVdom, '0,1', {
				styles: { width: '200px' }
			});
			assignProperties(expectedVdom, {
				classes: widget.classes(css.root, css.vertical, css.rootFixed)
			});

			widget.expectRender(expectedVdom);
		},

		'custom properties'() {
			widget.setProperties({
				max: 10,
				min: 5,
				outputIsTooltip: true,
				value: 6,
				vertical: true,
				verticalHeight: '100px'
			});

			const expectedVdom = expected(widget, false, true);
			assignChildProperties(expectedVdom, '0', {
				styles: { height: '100px' }
			});
			assignChildProperties(expectedVdom, '0,0', {
				max: '10',
				min: '5',
				styles: { width: '100px' },
				value: '6'
			});
			replaceChild(expectedVdom, '0,2,0', '6');
			assignChildProperties(expectedVdom, '0,1', {
				styles: { width: '100px' }
			});
			assignChildProperties(expectedVdom, '0,1,0', {
				styles: { width: '20%' }
			});
			assignChildProperties(expectedVdom, '0,1,1', {
				styles: { left: '20%' }
			});
			assignChildProperties(expectedVdom, '0,2', {
				styles: { top: '80%' }
			});
			assignProperties(expectedVdom, {
				classes: widget.classes(css.root, css.vertical, css.rootFixed)
			});

			widget.expectRender(expectedVdom);
		}
	},

	'min and max should be respected'() {
		widget.setProperties({
			max: 40,
			value: 100
		});

		let expectedVdom = expected(widget);
		assignChildProperties(expectedVdom, '0,0', {
			max: '40',
			value: '40'
		});
		replaceChild(expectedVdom, '0,2,0', '40');
		assignChildProperties(expectedVdom, '0,1,0', {
			styles: { width: '100%' }
		});
		assignChildProperties(expectedVdom, '0,1,1', {
			styles: { left: '100%' }
		});

		widget.expectRender(expectedVdom, 'If value property exceeds max, value is set to max');

		widget.setProperties({
			min: 30,
			value: 20
		});
		expectedVdom = expected(widget);
		assignChildProperties(expectedVdom, '0,0', {
			min: '30',
			value: '30'
		});
		replaceChild(expectedVdom, '0,2,0', '30');

		widget.expectRender(expectedVdom, 'If value property is below min, value is set to min');
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
			classes: widget.classes(css.root, css.disabled, css.invalid, css.readonly, css.required, css.rootFixed)
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
			classes: widget.classes(css.root, css.valid, css.rootFixed)
		});

		widget.expectRender(expectedVdom, 'State classes should be false, css.valid should be true');
	},

	'state classes on label'() {
		widget.setProperties({
			label: 'foo',
			formId: 'bar',
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
		assignProperties(expectedVdom, {
			extraClasses: { root: `${css.root} ${css.disabled} ${css.invalid} ${css.readonly} ${css.required} ${css.rootFixed}` },
			formId: 'bar'
		});

		widget.expectRender(expectedVdom);
	},

	events() {
		const onBlur = sinon.stub();
		const onChange = sinon.stub();
		const onClick = sinon.stub();
		const onFocus = sinon.stub();
		const onInput = sinon.stub();
		const onKeyDown = sinon.stub();
		const onKeyPress = sinon.stub();
		const onKeyUp = sinon.stub();
		const onMouseDown = sinon.stub();
		const onMouseUp = sinon.stub();

		widget.setProperties({
			onBlur,
			onChange,
			onClick,
			onFocus,
			onInput,
			onKeyDown,
			onKeyPress,
			onKeyUp,
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
		widget.sendEvent('input', { selector: 'input' });
		assert.isTrue(onInput.called, 'onInput called');
		widget.sendEvent('keydown', { selector: 'input' });
		assert.isTrue(onKeyDown.called, 'onKeyDown called');
		widget.sendEvent('keypress', { selector: 'input' });
		assert.isTrue(onKeyPress.called, 'onKeyPress called');
		widget.sendEvent('keyup', { selector: 'input' });
		assert.isTrue(onKeyUp.called, 'onKeyUp called');
		widget.sendEvent('mousedown', { selector: 'input' });
		assert.isTrue(onMouseDown.called, 'onMouseDown called');
		widget.sendEvent('mouseup', { selector: 'input' });
		assert.isTrue(onMouseUp.called, 'onMouseUp called');
	},

	'touch events'(this: any) {
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
});
