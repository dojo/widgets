import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import harness, { Harness } from '@dojo/test-extras/harness';
import { assignProperties, assignChildProperties } from '@dojo/test-extras/support/d';
import Radio, { RadioProperties } from '../../Radio';
import Label from '../../../label/Label';
import { v, w } from '@dojo/widget-core/d';
import has from '@dojo/has/has';
import * as css from '../../styles/radio.m.css';

let radio: Harness<RadioProperties, typeof Radio>;

registerSuite({
	name: 'Radio unit tests',

	beforeEach() {
		radio = harness(Radio);
	},
	afterEach() {
		radio.destroy();
	},

	'default render'() {
		const expected = v('div', {
			classes: radio.classes(css.root)
		}, [
			v('div', {
				classes: radio.classes(css.inputWrapper)
			}, [
				v('input', {
					classes: radio.classes(css.input),
					type: 'radio',
					checked: false,
					disabled: undefined,
					name: undefined,
					readOnly: undefined,
					required: undefined,
					value: undefined,
					'aria-describedby': undefined,
					'aria-invalid': null,
					'aria-readonly': null,
					'onblur': radio.listener,
					'onchange': radio.listener,
					'onclick': radio.listener,
					'onfocus': radio.listener,
					'onmousedown': radio.listener,
					'onmouseup': radio.listener,
					'ontouchcancel': radio.listener,
					'ontouchend': radio.listener,
					'ontouchstart': radio.listener
				})
			])
		]);
		radio.expectRender(expected);
	},
	'render with properties'() {
		radio.setProperties({
			checked: true,
			describedBy: 'id1',
			disabled: true,
			invalid: true,
			name: 'bar',
			readOnly: true,
			required: true,
			value: 'qux'
		});

		const expected = v('div', {
			classes: radio.classes(css.root, css.checked, css.disabled, css.invalid, css.readonly, css.required)
		}, [
			v('div', {
				classes: radio.classes(css.inputWrapper)
			}, [
				v('input', {
					classes: radio.classes(css.input),
					type: 'radio',
					checked: true,
					disabled: true,
					name: 'bar',
					readOnly: true,
					required: true,
					value: 'qux',
					'aria-describedby': 'id1',
					'aria-invalid': 'true',
					'aria-readonly': 'true',
					'onblur': radio.listener,
					'onchange': radio.listener,
					'onclick': radio.listener,
					'onfocus': radio.listener,
					'onmousedown': radio.listener,
					'onmouseup': radio.listener,
					'ontouchcancel': radio.listener,
					'ontouchend': radio.listener,
					'ontouchstart': radio.listener
				})
			])
		]);
		radio.expectRender(expected);
	},
	'render with label'() {
		radio.setProperties({
			formId: 'id2',
			label: 'foo'
		});

		const expected = w<any>(Label, {
			extraClasses: {
				// root: parseLabelClasses(<any> radio.classes(css.root, css.checked, css.disabled, css.invalid, css.readonly, css.required))
				root: css.root
			},
			formId: 'id2',
			label: 'foo'
		}, [
			v('div', {
				classes: radio.classes(css.inputWrapper)
			}, [
				v('input', {
					classes: radio.classes(css.input),
					type: 'radio',
					checked: false,
					disabled: undefined,
					name: undefined,
					readOnly: undefined,
					required: undefined,
					value: undefined,
					'aria-describedby': undefined,
					'aria-invalid': null,
					'aria-readonly': null,
					'onblur': radio.listener,
					'onchange': radio.listener,
					'onclick': radio.listener,
					'onfocus': radio.listener,
					'onmousedown': radio.listener,
					'onmouseup': radio.listener,
					'ontouchcancel': radio.listener,
					'ontouchend': radio.listener,
					'ontouchstart': radio.listener
				})
			])
		]);
		radio.expectRender(expected);
	},
	'render with state change'() {
		radio.setProperties({
			checked: true,
			disabled: true,
			invalid: true,
			readOnly: true,
			required: true
		});

		const expected = v('div', {
			classes: radio.classes(css.root, css.checked, css.disabled, css.invalid, css.readonly, css.required)
		}, [
			v('div', {
				classes: radio.classes(css.inputWrapper)
			}, [
				v('input', {
					classes: radio.classes(css.input),
					type: 'radio',
					checked: true,
					disabled: true,
					name: undefined,
					readOnly: true,
					required: true,
					value: undefined,
					'aria-describedby': undefined,
					'aria-invalid': 'true',
					'aria-readonly': 'true',
					'onblur': radio.listener,
					'onchange': radio.listener,
					'onclick': radio.listener,
					'onfocus': radio.listener,
					'onmousedown': radio.listener,
					'onmouseup': radio.listener,
					'ontouchcancel': radio.listener,
					'ontouchend': radio.listener,
					'ontouchstart': radio.listener
				})
			])
		]);
		radio.expectRender(expected);

		radio.setProperties({
			checked: false,
			disabled: false,
			invalid: false,
			readOnly: false,
			required: false
		});
		assignChildProperties(expected, '0,0', {
			classes: radio.classes(css.input),
			checked: false,
			disabled: false,
			readOnly: false,
			required: false,
			'aria-readonly': null,
			'aria-invalid': null
		});
		assignChildProperties(expected, '0', {
			classes: radio.classes(css.inputWrapper)
		});
		assignProperties(expected, {
			classes: radio.classes(css.root, css.valid)
		});
		radio.expectRender(expected);

		radio.setProperties({
			invalid: undefined
		});
		assignChildProperties(expected, '0,0', {
			classes: radio.classes(css.input),
			disabled: undefined,
			readOnly: undefined,
			required: undefined
		});
		assignChildProperties(expected, '0', {
			classes: radio.classes(css.inputWrapper)
		});
		assignProperties(expected, {
			classes: radio.classes(css.root)
		});
		radio.expectRender(expected);

	},
	'events setup'() {
		// TODO this is borrowed from: https://github.com/msssk/widgets/blob/672a53433159cce85418f322cbcd5e3c9d1e94bb/src/checkbox/tests/unit/Checkbox.ts#L212
		// Will need to clean it up once this piece of code is landed somewhere.
		const hasTouch = has('host-node') || 'ontouchstart' in document || ('onpointerdown' in document && navigator.maxTouchPoints > 0);

		let blurred = false,
				changed = false,
				clicked = false,
				focused = false,
				mousedown = false,
				mouseup = false,
				touchstart = false,
				touchend = false,
				touchcancel = false;

		radio.setProperties({
			onBlur: () => { blurred = true; },
			onChange: () => { changed = true; },
			onClick: () => { clicked = true; },
			onFocus: () => { focused = true; },
			onMouseDown: () => { mousedown = true; },
			onMouseUp: () => { mouseup = true; },
			onTouchStart: () => { touchstart = true; },
			onTouchEnd: () => { touchend = true; },
			onTouchCancel: () => { touchcancel = true; }
		});

		radio.sendEvent('blur', { selector: 'input'});
		assert.isTrue(blurred);
		radio.sendEvent('change', { selector: 'input' });
		assert.isTrue(changed);
		radio.sendEvent('click', { selector: 'input' });
		assert.isTrue(clicked);
		radio.sendEvent('focus', { selector: 'input' });
		assert.isTrue(focused);
		radio.sendEvent('mousedown', { selector: 'input' });
		assert.isTrue(mousedown);
		radio.sendEvent('mouseup', { selector: 'input' });
		assert.isTrue(mouseup);
		if (hasTouch) {
			radio.sendEvent('touchstart', { selector: 'input' });
			assert.isTrue(touchstart);
			radio.sendEvent('touchend', { selector: 'input' });
			assert.isTrue(touchend);
			radio.sendEvent('touchcancel', { selector: 'input' });
			assert.isTrue(touchcancel);

		}
	}
});
