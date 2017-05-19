import * as registerSuite from 'intern!object';
// import * as assert from 'intern/chai!assert';
// import { VNode } from '@dojo/interfaces/vdom';
import harness, { Harness } from '@dojo/test-extras/harness';
import Radio, { RadioProperties } from '../../Radio';
import Label from '../../../label/Label';
import { v, w } from '@dojo/widget-core/d';
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

		const expected = w(Label, {
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
	}

	// 'state classes'() {
	// 	const radio = new Radio();
	// 	radio.__setProperties__({
	// 		checked: true,
	// 		disabled: true,
	// 		invalid: true,
	// 		readOnly: true,
	// 		required: true
	// 	});
	// 	let vnode = <VNode> radio.__render__();

	// 	assert.isTrue(vnode.properties!.classes![css.checked]);
	// 	assert.isTrue(vnode.properties!.classes![css.disabled]);
	// 	assert.isTrue(vnode.properties!.classes![css.invalid]);
	// 	assert.isTrue(vnode.properties!.classes![css.readonly]);
	// 	assert.isTrue(vnode.properties!.classes![css.required]);

	// 	radio.__setProperties__({
	// 		checked: false,
	// 		disabled: false,
	// 		invalid: false,
	// 		readOnly: false,
	// 		required: false
	// 	});
	// 	vnode = <VNode> radio.__render__();
	// 	assert.isFalse(vnode.properties!.classes![css.checked]);
	// 	assert.isFalse(vnode.properties!.classes![css.disabled]);
	// 	assert.isTrue(vnode.properties!.classes![css.valid]);
	// 	assert.isFalse(vnode.properties!.classes![css.invalid]);
	// 	assert.isFalse(vnode.properties!.classes![css.readonly]);
	// 	assert.isFalse(vnode.properties!.classes![css.required]);

	// 	radio.__setProperties__({
	// 		invalid: undefined
	// 	});
	// 	vnode = <VNode> radio.__render__();
	// 	assert.isFalse(vnode.properties!.classes![css.valid]);
	// 	assert.isFalse(vnode.properties!.classes![css.invalid]);
	// },

	// events() {
	// 	let blurred = false,
	// 			changed = false,
	// 			clicked = false,
	// 			focused = false,
	// 			mousedown = false,
	// 			mouseup = false,
	// 			touchstart = false,
	// 			touchend = false,
	// 			touchcancel = false;

	// 	const radio = new Radio();
	// 	radio.__setProperties__({
	// 		onBlur: () => { blurred = true; },
	// 		onChange: () => { changed = true; },
	// 		onClick: () => { clicked = true; },
	// 		onFocus: () => { focused = true; },
	// 		onMouseDown: () => { mousedown = true; },
	// 		onMouseUp: () => { mouseup = true; },
	// 		onTouchStart: () => { touchstart = true; },
	// 		onTouchEnd: () => { touchend = true; },
	// 		onTouchCancel: () => { touchcancel = true; }
	// 	});

	// 	(<any> radio)._onBlur(<FocusEvent> {});
	// 	assert.isTrue(blurred);
	// 	(<any> radio)._onChange(<Event> {});
	// 	assert.isTrue(changed);
	// 	(<any> radio)._onClick(<MouseEvent> {});
	// 	assert.isTrue(clicked);
	// 	(<any> radio)._onFocus(<FocusEvent> {});
	// 	assert.isTrue(focused);
	// 	(<any> radio)._onMouseDown(<MouseEvent> {});
	// 	assert.isTrue(mousedown);
	// 	(<any> radio)._onMouseUp(<MouseEvent> {});
	// 	assert.isTrue(mouseup);
	// 	(<any> radio)._onTouchStart(<TouchEvent> {});
	// 	assert.isTrue(touchstart);
	// 	(<any> radio)._onTouchEnd(<TouchEvent> {});
	// 	assert.isTrue(touchend);
	// 	(<any> radio)._onTouchCancel(<TouchEvent> {});
	// 	assert.isTrue(touchcancel);
	// }
});
