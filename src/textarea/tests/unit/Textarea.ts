import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';

import has from '@dojo/has/has';
import { v, w } from '@dojo/widget-core/d';
import { assignProperties, assignChildProperties } from '@dojo/test-extras/support/d';
import harness, { Harness } from '@dojo/test-extras/harness';

import Label from '../../../label/Label';
import Textarea, { TextareaProperties } from '../../Textarea';
import * as css from '../../styles/textarea.m.css';

const hasTouch = (function (): boolean {
	/* Since jsdom will fake it anyways, no problem pretending we can do touch in NodeJS */
	return Boolean('ontouchstart' in window || has('host-node'));
})();

const expected = function(widget: any, label = false) {
	const textareaVdom = v('div', { classes: widget.classes(css.inputWrapper) }, [
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
	]);

	if (label) {
		return w(Label, {
			extraClasses: { root: css.root },
			label: 'foo',
			formId: undefined,
			theme: undefined
		}, [ textareaVdom ]);
	}
	else {
		return v('div', {
			classes: widget.classes(css.root)
		}, [ textareaVdom ]);
	}
};

let widget: Harness<TextareaProperties, typeof Textarea>;

registerSuite({
	name: 'Textarea',

	beforeEach() {
		widget = harness(Textarea);
	},

	afterEach() {
		widget.destroy();
	},

	'default properties'() {
		widget.expectRender(expected(widget));
	},

	'custom properties'() {
		widget.setProperties({
			columns: 15,
			describedBy: 'foo',
			maxLength: 50,
			minLength: 10,
			name: 'bar',
			placeholder: 'baz',
			rows: 42,
			value: 'qux',
			wrapText: 'soft'
		});

		const expectedVdom = expected(widget);
		assignChildProperties(expectedVdom, '0,0', {
			cols: '15',
			'aria-describedby': 'foo',
			maxlength: '50',
			minlength: '10',
			name: 'bar',
			placeholder: 'baz',
			rows: '42',
			value: 'qux',
			wrap: 'soft'
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
			classes: widget.classes(css.root, css.invalid, css.disabled, css.readonly, css.required)
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
			classes: widget.classes(css.root, css.valid)
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
			extraClasses: { root: `${css.root} ${css.disabled} ${css.invalid} ${css.readonly} ${css.required}` },
			formId: 'bar'
		});
		widget.expectRender(expectedVdom);
	},

	events() {
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
			onMouseUp: () => { mouseup = true; }
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
	},

	'touch events'(this: any) {
		if (!hasTouch) {
			this.skip('Environment not support touch events');
		}

		let touchstart = false;
		let touchend = false;
		let touchcancel = false;

		widget.setProperties({
			onTouchStart: () => { touchstart = true; },
			onTouchEnd: () => { touchend = true; },
			onTouchCancel: () => { touchcancel = true; }
		});

		widget.sendEvent('touchstart', { selector: 'textarea' });
		assert.isTrue(touchstart, 'Didn\'t run onTouchStart');
		widget.sendEvent('touchend', { selector: 'textarea' });
		assert.isTrue(touchend, 'Didn\'t run onTouchEnd');
		widget.sendEvent('touchcancel', { selector: 'textarea' });
		assert.isTrue(touchcancel, 'Didn\'t run onTouchCancel');
	}
});
