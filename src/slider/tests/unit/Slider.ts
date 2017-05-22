import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import harness, { Harness } from '@dojo/test-extras/harness';
import { assignProperties, assignChildProperties, compareProperty } from '@dojo/test-extras/support/d';
import Slider, { SliderProperties } from '../../Slider';
import { v, w } from '@dojo/widget-core/d';
import Label from '../../../label/Label';
import has from '@dojo/has/has';
import * as css from '../../styles/slider.m.css';

let slider: Harness<SliderProperties, typeof Slider>;

const idComparator = compareProperty((value) => {
	return typeof value === 'string';
});

registerSuite({
	name: 'Slider unit tests',

	beforeEach() {
		slider = harness(Slider);
	},
	afterEach() {
		slider.destroy();
	},

	'default render'() {
		const expected = v('div', {
			classes: slider.classes(css.root)
		}, [
			v('div', {
				classes: slider.classes(css.inputWrapper),
				styles: {}
			}, [
				v('input', {
					classes: slider.classes(css.input, css.nativeInput),
					'aria-describedby': undefined,
					disabled: undefined,
					id: <any> idComparator,
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
					onblur: slider.listener,
					onchange: slider.listener,
					onclick: slider.listener,
					onfocus: slider.listener,
					oninput: slider.listener,
					onkeydown: slider.listener,
					onkeypress: slider.listener,
					onkeyup: slider.listener,
					onmousedown: slider.listener,
					onmouseup: slider.listener,
					ontouchstart: slider.listener,
					ontouchend: slider.listener,
					ontouchcancel: slider.listener
				}),
				v('div', {
					classes: slider.classes(css.track),
					'aria-hidden': 'true',
					styles: {}
				}, [
					v('span', {
						classes: slider.classes(css.fill),
						styles: { width: '0%' }
					}),
					v('span', {
						classes: slider.classes(css.thumb),
						styles: { left: '0%' }
					})
				]),
				v('output', {
					classes: slider.classes(css.output),
					for: idComparator
				}, [ '0' ])
			])
		]);
		slider.expectRender(expected);
	},
	'render with properties'() {
		slider.setProperties({
			describedBy: 'id1',
			disabled: true,
			formId: 'id2',
			invalid: true,
			label: 'foo',
			max: 6,
			min: 0,
			name: 'bar',
			output: () => v('span', { innerHTML: 'baz'}),
			readOnly: true,
			required: true,
			step: 2,
			value: 6
		});
		const expected = w(Label, {
			extraClasses: {
				root: [css.root, css.disabled, css.invalid, css.readonly, css.required].join(' ')
			},
			formId: 'id2',
			label: 'foo'
		}, [
			v('div', {
				classes: slider.classes(css.inputWrapper),
				styles: {}
			}, [
				v('input', {
					classes: slider.classes(css.input, css.nativeInput),
					'aria-describedby': 'id1',
					disabled: true,
					id: <any> idComparator,
					'aria-invalid': 'true',
					max: '6',
					min: '0',
					name: 'bar',
					readOnly: true,
					'aria-readonly': 'true',
					required: true,
					step: '2',
					styles: {},
					type: 'range',
					value: '6',
					onblur: slider.listener,
					onchange: slider.listener,
					onclick: slider.listener,
					onfocus: slider.listener,
					oninput: slider.listener,
					onkeydown: slider.listener,
					onkeypress: slider.listener,
					onkeyup: slider.listener,
					onmousedown: slider.listener,
					onmouseup: slider.listener,
					ontouchstart: slider.listener,
					ontouchend: slider.listener,
					ontouchcancel: slider.listener
				}),
				v('div', {
					classes: slider.classes(css.track),
					'aria-hidden': 'true',
					styles: {}
				}, [
					v('span', {
						classes: slider.classes(css.fill),
						styles: { width: '100%' }
					}),
					v('span', {
						classes: slider.classes(css.thumb),
						styles: { left: '100%' }
					})
				]),
				v('output', {
					classes: slider.classes(css.output),
					for: idComparator
				}, [ v('span', {
					innerHTML: 'baz'
				}) ])
			])
		]);
		slider.expectRender(expected);
	},
	'vertical slider with height change'() {
		slider.setProperties({
			min: 20,
			vertical: true
		});

		const expected = v('div', {
			classes: slider.classes(css.root, css.vertical)
		}, [
			v('div', {
				classes: slider.classes(css.inputWrapper),
				styles: { height: '200px' }
			}, [
				v('input', {
					classes: slider.classes(css.input, css.nativeInput),
					'aria-describedby': undefined,
					disabled: undefined,
					id: <any> idComparator,
					'aria-invalid': null,
					max: '100',
					min: '20',
					name: undefined,
					readOnly: undefined,
					'aria-readonly': null,
					required: undefined,
					step: '1',
					styles: { width: '200px' },
					type: 'range',
					value: '20',
					onblur: slider.listener,
					onchange: slider.listener,
					onclick: slider.listener,
					onfocus: slider.listener,
					oninput: slider.listener,
					onkeydown: slider.listener,
					onkeypress: slider.listener,
					onkeyup: slider.listener,
					onmousedown: slider.listener,
					onmouseup: slider.listener,
					ontouchstart: slider.listener,
					ontouchend: slider.listener,
					ontouchcancel: slider.listener
				}),
				v('div', {
					classes: slider.classes(css.track),
					'aria-hidden': 'true',
					styles: { width: '200px' }
				}, [
					v('span', {
						classes: slider.classes(css.fill),
						styles: { width: '20%' }
					}),
					v('span', {
						classes: slider.classes(css.thumb),
						styles: { left: '20%' }
					})
				]),
				v('output', {
					classes: slider.classes(css.output),
					for: idComparator
				}, [ '20' ])
			])
		]);
		slider.expectRender(expected);

		slider.setProperties({
			min: 20,
			vertical: true,
			verticalHeight: '300px'
		});
		assignChildProperties(expected, '0,1,0', {
			classes: slider.classes(css.fill)
		});
		assignChildProperties(expected, '0,1,1', {
			classes: slider.classes(css.thumb)
		});
		assignChildProperties(expected, '0,0', {
			classes: slider.classes(css.input, css.nativeInput),
			styles: { width: '300px' }
		});
		assignChildProperties(expected, '0,1', {
			classes: slider.classes(css.track),
			styles: { width: '300px' }
		});
		assignChildProperties(expected, '0,2', {
			classes: slider.classes(css.output)
		});
		assignChildProperties(expected, '0', {
			classes: slider.classes(css.inputWrapper),
			styles: { height: '300px' }
		});
		assignProperties(expected, {
			classes: slider.classes(css.root, css.vertical)
		});
		slider.expectRender(expected);
	},
	'state classes'() {
		slider.setProperties({
			disabled: true,
			invalid: true,
			readOnly: true,
			required: true,
			vertical: true
		});
		const expected = v('div', {
			classes: slider.classes(css.root, css.disabled, css.invalid, css.readonly, css.required, css.vertical)
		}, [
			v('div', {
				classes: slider.classes(css.inputWrapper),
				styles: { height: '200px' }
			}, [
				v('input', {
					classes: slider.classes(css.input, css.nativeInput),
					'aria-describedby': undefined,
					disabled: true,
					id: <any> idComparator,
					'aria-invalid': 'true',
					max: '100',
					min: '0',
					name: undefined,
					readOnly: true,
					'aria-readonly': 'true',
					required: true,
					step: '1',
					styles: { width: '200px' },
					type: 'range',
					value: '0',
					onblur: slider.listener,
					onchange: slider.listener,
					onclick: slider.listener,
					onfocus: slider.listener,
					oninput: slider.listener,
					onkeydown: slider.listener,
					onkeypress: slider.listener,
					onkeyup: slider.listener,
					onmousedown: slider.listener,
					onmouseup: slider.listener,
					ontouchstart: slider.listener,
					ontouchend: slider.listener,
					ontouchcancel: slider.listener
				}),
				v('div', {
					classes: slider.classes(css.track),
					'aria-hidden': 'true',
					styles: { width: '200px' }
				}, [
					v('span', {
						classes: slider.classes(css.fill),
						styles: { width: '0%' }
					}),
					v('span', {
						classes: slider.classes(css.thumb),
						styles: { left: '0%' }
					})
				]),
				v('output', {
					classes: slider.classes(css.output),
					for: idComparator
				}, [ '0' ])
			])
		]);
		slider.expectRender(expected);

		slider.setProperties({
			disabled: false,
			invalid: false,
			readOnly: false,
			required: false,
			vertical: false
		});
		assignChildProperties(expected, '0,1,0', {
			classes: slider.classes(css.fill)
		});
		assignChildProperties(expected, '0,1,1', {
			classes: slider.classes(css.thumb)
		});
		assignChildProperties(expected, '0,0', {
			classes: slider.classes(css.input, css.nativeInput),
			'aria-invalid': null,
			'aria-readonly': null,
			readOnly: false,
			required: false,
			disabled: false,
			styles: {}
		});
		assignChildProperties(expected, '0,1', {
			classes: slider.classes(css.track),
			styles: {}
		});
		assignChildProperties(expected, '0,2', {
			classes: slider.classes(css.output)
		});
		assignChildProperties(expected, '0', {
			classes: slider.classes(css.inputWrapper),
			styles: {}
		});
		assignProperties(expected, {
			classes: slider.classes(css.root, css.valid)
		});
		slider.expectRender(expected);
	},

	'events'() {
		// TODO this is borrowed from: https://github.com/msssk/widgets/blob/672a53433159cce85418f322cbcd5e3c9d1e94bb/src/checkbox/tests/unit/Checkbox.ts#L212
		// Will need to clean it up once this piece of code is landed somewhere.
		const hasTouch = has('host-node') || 'ontouchstart' in document || ('onpointerdown' in document && navigator.maxTouchPoints > 0);

		let blurred = false,
		changed = false,
		clicked = false,
		focused = false,
		input = false,
		keydown = false,
		keypress = false,
		keyup = false,
		mousedown = false,
		mouseup = false,
		touchstart = false,
		touchend = false,
		touchcancel = false;

		slider.setProperties({
			onBlur: () => { blurred = true; },
			onChange: () => { changed = true; },
			onClick: () => { clicked = true; },
			onFocus: () => { focused = true; },
			onInput: () => { input = true; },
			onKeyDown: () => { keydown = true; },
			onKeyPress: () => { keypress = true; },
			onKeyUp: () => { keyup = true; },
			onMouseDown: () => { mousedown = true; },
			onMouseUp: () => { mouseup = true; },
			onTouchStart: () => { touchstart = true; },
			onTouchEnd: () => { touchend = true; },
			onTouchCancel: () => { touchcancel = true; }
		});

		slider.sendEvent('blur', { selector: 'input'});
		assert.isTrue(blurred);
		slider.sendEvent('change', { selector: 'input'});
		assert.isTrue(changed);
		slider.sendEvent('click', { selector: 'input'});
		assert.isTrue(clicked);
		slider.sendEvent('focus', { selector: 'input'});
		assert.isTrue(focused);
		slider.sendEvent('input', { selector: 'input'});
		assert.isTrue(input);
		slider.sendEvent('keydown', { selector: 'input'});
		assert.isTrue(keydown);
		slider.sendEvent('keypress', { selector: 'input'});
		assert.isTrue(keypress);
		slider.sendEvent('keyup', { selector: 'input'});
		assert.isTrue(keyup);
		slider.sendEvent('mousedown', { selector: 'input'});
		assert.isTrue(mousedown);
		slider.sendEvent('mouseup', { selector: 'input'});
		assert.isTrue(mouseup);
		if (hasTouch) {
			slider.sendEvent('touchstart', { selector: 'input'});
			assert.isTrue(touchstart);
			slider.sendEvent('touchend', { selector: 'input'});
			assert.isTrue(touchend);
			slider.sendEvent('touchcancel', { selector: 'input'});
			assert.isTrue(touchcancel);
		}
	}
});
