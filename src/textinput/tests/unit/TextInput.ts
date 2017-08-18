import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';

import has from '@dojo/has/has';
import { v, w } from '@dojo/widget-core/d';
import { assignProperties, assignChildProperties } from '@dojo/test-extras/support/d';
import harness, { Harness } from '@dojo/test-extras/harness';

import Label from '../../../label/Label';
import TextInput, { TextInputProperties } from '../../TextInput';
import * as css from '../../styles/textinput.m.css';

const hasTouch = (function (): boolean {
	/* Since jsdom will fake it anyways, no problem pretending we can do touch in NodeJS */
	return Boolean('ontouchstart' in window || has('host-node'));
})();

const expected = function(widget: any, label = false) {
	const inputVdom = v('div', { classes: widget.classes(css.inputWrapper) }, [
		v('input', {
			classes: widget.classes(css.input),
			'aria-controls': undefined,
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
			type: 'text',
			value: undefined,
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
		}, [ inputVdom ]);
	}
	else {
		return v('div', {
			classes: widget.classes(css.root)
		}, [ inputVdom ]);
	}
};

let widget: Harness<TextInputProperties, typeof TextInput>;

registerSuite({
	name: 'TextInput',

	beforeEach() {
		widget = harness(TextInput);
	},

	afterEach() {
		widget.destroy();
	},

	'default properties'() {
		widget.expectRender(expected(widget));
	},

	'custom properties'() {
		widget.setProperties({
			controls: 'foo',
			describedBy: 'bar',
			maxLength: 50,
			minLength: 10,
			name: 'baz',
			placeholder: 'qux',
			type: 'email',
			value: 'hello world'
		});

		const expectedVdom = expected(widget);
		assignChildProperties(expectedVdom, '0,0', {
			'aria-controls': 'foo',
			'aria-describedby': 'bar',
			maxlength: '50',
			minlength: '10',
			name: 'baz',
			placeholder: 'qux',
			type: 'email',
			value: 'hello world'
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
			extraClasses: { root: `${css.root} ${css.disabled} ${css.invalid} ${css.readonly} ${css.required}` }
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

		widget.sendEvent('blur', { selector: 'input' });
		assert.isTrue(blurred, 'Didn\'t run onBlur');
		widget.sendEvent('change', { selector: 'input' });
		assert.isTrue(changed, 'Didn\'t run onChange');
		widget.sendEvent('click', { selector: 'input' });
		assert.isTrue(clicked, 'Didn\'t run onClick');
		widget.sendEvent('focus', { selector: 'input' });
		assert.isTrue(focused, 'Didn\'t run onFocus');
		widget.sendEvent('input', { selector: 'input' });
		assert.isTrue(input, 'Didn\'t run onInpput');
		widget.sendEvent('keydown', { selector: 'input' });
		assert.isTrue(keydown, 'Didn\'t run onKeyDown');
		widget.sendEvent('keypress', { selector: 'input' });
		assert.isTrue(keypress, 'Didn\'t run onKeyPress');
		widget.sendEvent('keyup', { selector: 'input' });
		assert.isTrue(keyup, 'Didn\'t run onKeyUp');
		widget.sendEvent('mousedown', { selector: 'input' });
		assert.isTrue(mousedown, 'Didn\'t run onMouseDown');
		widget.sendEvent('mouseup', { selector: 'input' });
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

		widget.sendEvent('touchstart', { selector: 'input' });
		assert.isTrue(touchstart, 'Didn\'t run onTouchStart');
		widget.sendEvent('touchend', { selector: 'input' });
		assert.isTrue(touchend, 'Didn\'t run onTouchEnd');
		widget.sendEvent('touchcancel', { selector: 'input' });
		assert.isTrue(touchcancel, 'Didn\'t run onTouchCancel');
	}
});
