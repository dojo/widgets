import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';

import has from '@dojo/has/has';
import harness, { Harness } from '@dojo/test-extras/harness';
import { assignProperties, assignChildProperties } from '@dojo/test-extras/support/d';
import { v, w } from '@dojo/widget-core/d';
import Textarea, { TextareaProperties } from '../../Textarea';
import * as css from '../../styles/textarea.m.css';
import Label, {parseLabelClasses} from '../../../label/Label';

let widget: Harness<TextareaProperties, typeof Textarea>;

registerSuite({
	name: 'Textarea',

	beforeEach() {
		widget = harness(Textarea);
	},

	afterEach() {
		widget.destroy();
	},

	simple() {
		widget.expectRender(v('div', {
			classes: widget.classes(css.root)
		}, [
			v('div', { classes: widget.classes(css.inputWrapper) }, [
				v('textarea', {
					classes: widget.classes(css.input),
					cols: null,
					'aria-describedby': undefined,
					disabled: undefined,
					'aria-invalid': null,
					maxlength: null,
					minlength: null,
					name: undefined,
					placeholder: undefined,
					readOnly: undefined,
					'aria-readonly': null,
					required: undefined,
					rows: null,
					value: undefined,
					wrap: undefined,
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
				})
			])
		]));
	},

	'with label'() {
		widget.setProperties({
			label: 'foo'
		});

		widget.expectRender(w(Label, {
			extraClasses: {
				root: css.root
			},
			label: 'foo',
			formId: undefined
		}, [ v('div', { classes: widget.classes(css.inputWrapper) }, [
				v('textarea', {
					classes: widget.classes(css.input),
					cols: null,
					'aria-describedby': undefined,
					disabled: undefined,
					'aria-invalid': null,
					maxlength: null,
					minlength: null,
					name: undefined,
					placeholder: undefined,
					readOnly: undefined,
					'aria-readonly': null,
					required: undefined,
					rows: null,
					value: undefined,
					wrap: undefined,
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
				})
			])
		]));
	},

	'state classes'() {
		widget.setProperties({
			invalid: true,
			disabled: true,
			readOnly: true,
			required: true
		});

		const expected = v('div', {
			classes: widget.classes(css.root, css.invalid, css.disabled, css.readonly, css.required)
		}, [
			v('div', { classes: widget.classes(css.inputWrapper) }, [
				v('textarea', {
					classes: widget.classes(css.input),
					cols: null,
					'aria-describedby': undefined,
					disabled: true,
					'aria-invalid': 'true',
					maxlength: null,
					minlength: null,
					name: undefined,
					placeholder: undefined,
					readOnly: true,
					'aria-readonly': 'true',
					required: true,
					rows: null,
					value: undefined,
					wrap: undefined,
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
				})
			])
		]);
		widget.expectRender(expected);

		widget.setProperties({
			invalid: false,
			disabled: false,
			readOnly: false,
			required: false
		});

		assignChildProperties(expected, '0', {
			classes: widget.classes(css.inputWrapper)
		});
		assignChildProperties(expected, '0,0', {
			disabled: false,
			readOnly: false,
			required: false,
			'aria-readonly': null,
			'aria-invalid': null,
			classes: widget.classes(css.input)
		});
		assignProperties(expected, {
			classes: widget.classes(css.root, css.valid)
		});

		widget.expectRender(expected);
	},

	'properties'() {
		widget.setProperties({
			columns: 30,
			rows: 10,
			wrapText: 'hard',
			describedBy: 'id1',
			disabled: true,
			formId: 'id2',
			invalid: true,
			label: 'foo',
			maxLength: 50,
			minLength: 5,
			name: 'bar',
			placeholder: 'baz',
			readOnly: true,
			required: true,
			value: 'qux'
		});

		const root = parseLabelClasses(widget.classes(css.root, css.disabled, css.invalid, css.readonly, css.required)());
		widget.resetClasses();
		widget.expectRender(w(Label, {
			extraClasses: { root },
			label: 'foo',
			formId: 'id2'
		}, [ v('div', {classes: widget.classes(css.inputWrapper)}, [
			v('textarea', {
				classes: widget.classes(css.input),
				cols: '30',
				'aria-describedby': 'id1',
				disabled: true,
				'aria-invalid': 'true',
				maxlength: '50',
				minlength: '5',
				name: 'bar',
				placeholder: 'baz',
				readOnly: true,
				'aria-readonly': 'true',
				required: true,
				rows: '10',
				value: 'qux',
				wrap: 'hard',
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
			})
			])
		]));
	},

	events() {
		// TODO this is borrowed from: https://github.com/msssk/widgets/blob/672a53433159cce85418f322cbcd5e3c9d1e94bb/src/checkbox/tests/unit/Checkbox.ts#L212
		// Will need to clean it up once this piece of code is landed somewhere.
		const hasTouch = has('host-node') || 'ontouchstart' in document || ('onpointerdown' in document && navigator.maxTouchPoints > 0);
		let blurred = false;
		let changed = false;
		let clicked = false;
		let focused = false;
		let input = false;
		let keydown = false;
		let keypress = false;
		let keyup = false;
		let mousedown = false;
		let mouseup = false;
		let touchstart = false;
		let touchend = false;
		let touchcancel = false;

		widget.setProperties({
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

		widget.sendEvent('blur', { selector: 'textarea' });
		assert.isTrue(blurred, 'Didn\'t run onBlur');
		widget.sendEvent('change', { selector: 'textarea' });
		assert.isTrue(changed, 'Didn\'t run onChange');
		widget.sendEvent('click', { selector: 'textarea' });
		assert.isTrue(clicked, 'Didn\'t run onClick');
		widget.sendEvent('focus', { selector: 'textarea' });
		assert.isTrue(focused, 'Didn\'t run onFocus');
		widget.sendEvent('input', { selector: 'textarea' });
		assert.isTrue(input, 'Didn\'t run onInpput');
		widget.sendEvent('keydown', { selector: 'textarea' });
		assert.isTrue(keydown, 'Didn\'t run onKeyDown');
		widget.sendEvent('keypress', { selector: 'textarea' });
		assert.isTrue(keypress, 'Didn\'t run onKeyPress');
		widget.sendEvent('keyup', { selector: 'textarea' });
		assert.isTrue(keyup, 'Didn\'t run onKeyUp');
		widget.sendEvent('mousedown', { selector: 'textarea' });
		assert.isTrue(mousedown, 'Didn\'t run onMouseDown');
		widget.sendEvent('mouseup', { selector: 'textarea' });
		assert.isTrue(mouseup, 'Didn\'t run onMouseUp');
		if (hasTouch) {
			widget.sendEvent('touchstart', { selector: 'textarea' });
			assert.isTrue(touchstart, 'Didn\'t run onTouchStart');
			widget.sendEvent('touchend', { selector: 'textarea' });
			assert.isTrue(touchend, 'Didn\'t run onTouchEnd');
			widget.sendEvent('touchcancel', { selector: 'textarea' });
			assert.isTrue(touchcancel, 'Didn\'t run onTouchCancel');
		}
	}
});
