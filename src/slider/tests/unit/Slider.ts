const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import * as sinon from 'sinon';

import has from '@dojo/has/has';
import { v, w } from '@dojo/widget-core/d';
import { assignProperties, assignChildProperties, compareProperty, replaceChild, findKey } from '@dojo/test-extras/support/d';
import harness, { Harness } from '@dojo/test-extras/harness';

import Label from '../../../label/Label';
import Slider from '../../Slider';
import * as css from '../../../theme/slider/slider.m.css';
import * as fixedCss from '../../styles/slider.m.css';

const compareId = compareProperty((value: any) => {
	return typeof value === 'string';
});

const expected = function(widget: any, label = false, tooltip = false) {
	const sliderVdom = v('div', {
		classes: [ css.inputWrapper, fixedCss.inputWrapperFixed ],
		styles: {}
	}, [
		v('input', {
			key: 'input',
			classes: [ css.input, fixedCss.nativeInput ],
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
			classes: [ css.track, fixedCss.trackFixed ],
			'aria-hidden': 'true',
			styles: {}
		}, [
			v('span', {
				classes: [ css.fill, fixedCss.fillFixed ],
				styles: { width: '0%' }
			}),
			v('span', {
				classes: [ css.thumb, fixedCss.thumbFixed ],
				styles: { left: '0%' }
			})
		]),
		v('output', {
			classes: [ css.output, tooltip ? fixedCss.outputTooltip : null ],
			for: <any> compareId,
			styles: {}
		}, [ '0' ])
	]);

	return v('div', {
		key: 'root',
		classes: [ css.root, null, null, null, null, null, null, fixedCss.rootFixed ]
	}, [
		label ? w(Label, {
			theme: undefined,
			disabled: undefined,
			hidden: undefined,
			invalid: undefined,
			readOnly: undefined,
			required: undefined,
			forId: <any> compareId
		}, [ 'foo' ]) : null,
		sliderVdom
	]);
};

let widget: Harness<Slider>;

registerSuite('Slider', {

	beforeEach() {
		widget = harness(Slider);
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
				aria: { describedBy: 'foo' },
				max: 60,
				min: 10,
				name: 'bar',
				output: () => 'tribbles',
				outputIsTooltip: true,
				step: 5,
				value: 35
			});

			const expectedVdom = expected(widget, false, true);
			assignProperties(findKey(expectedVdom, 'input')!, {
				'aria-describedby': 'foo',
				max: '60',
				min: '10',
				name: 'bar',
				step: '5',
				value: '35'
			});
			assignChildProperties(expectedVdom, '1,1,0', {
				styles: { width: '50%' }
			});
			assignChildProperties(expectedVdom, '1,1,1', {
				styles: { left: '50%' }
			});
			assignChildProperties(expectedVdom, '1,2', {
				styles: { left: '50%' }
			});
			replaceChild(expectedVdom, '1,2,0', 'tribbles');

			widget.expectRender(expectedVdom);
		},

		'vertical slider': {
			'default properties'() {
				widget.setProperties({
					vertical: true
				});

				const expectedVdom = expected(widget);
				assignChildProperties(expectedVdom, '1', {
					styles: { height: '200px' }
				});
				assignProperties(findKey(expectedVdom, 'input')!, {
					styles: { width: '200px' }
				});
				assignChildProperties(expectedVdom, '1,1', {
					styles: { width: '200px' }
				});
				assignProperties(expectedVdom, {
					classes: [ css.root, null, null, null, null, null, css.vertical, fixedCss.rootFixed ]
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
				assignChildProperties(expectedVdom, '1', {
					styles: { height: '100px' }
				});
				assignProperties(findKey(expectedVdom, 'input')!, {
					max: '10',
					min: '5',
					styles: { width: '100px' },
					value: '6'
				});
				replaceChild(expectedVdom, '1,2,0', '6');
				assignChildProperties(expectedVdom, '1,1', {
					styles: { width: '100px' }
				});
				assignChildProperties(expectedVdom, '1,1,0', {
					styles: { width: '20%' }
				});
				assignChildProperties(expectedVdom, '1,1,1', {
					styles: { left: '20%' }
				});
				assignChildProperties(expectedVdom, '1,2', {
					styles: { top: '80%' }
				});
				assignProperties(expectedVdom, {
					classes: [ css.root, null, null, null, null, null, css.vertical, fixedCss.rootFixed ]
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
			assignProperties(findKey(expectedVdom, 'input')!, {
				max: '40',
				value: '40'
			});
			replaceChild(expectedVdom, '1,2,0', '40');
			assignChildProperties(expectedVdom, '1,1,0', {
				styles: { width: '100%' }
			});
			assignChildProperties(expectedVdom, '1,1,1', {
				styles: { left: '100%' }
			});

			widget.expectRender(expectedVdom, 'If value property exceeds max, value is set to max');

			widget.setProperties({
				min: 30,
				value: 20
			});
			expectedVdom = expected(widget);
			assignProperties(findKey(expectedVdom, 'input')!, {
				min: '30',
				value: '30'
			});
			replaceChild(expectedVdom, '1,2,0', '30');

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
			assignProperties(findKey(expectedVdom, 'input')!, {
				disabled: true,
				'aria-invalid': 'true',
				readOnly: true,
				'aria-readonly': 'true',
				required: true
			});
			assignProperties(expectedVdom, {
				classes: [ css.root, css.disabled, css.invalid, null, css.readonly, css.required, null, fixedCss.rootFixed ]
			});

			widget.expectRender(expectedVdom, 'Widget should be invalid, disabled, read-only, and required');

			widget.setProperties({
				invalid: false,
				disabled: false,
				readOnly: false,
				required: false
			});
			expectedVdom = expected(widget);

			assignProperties(findKey(expectedVdom, 'input')!, {
				disabled: false,
				readOnly: false,
				required: false
			});
			assignProperties(expectedVdom, {
				classes: [ css.root, null, null, css.valid, null, null, null, fixedCss.rootFixed ]
			});

			widget.expectRender(expectedVdom, 'State classes should be false, css.valid should be true');
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
