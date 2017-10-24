const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import * as sinon from 'sinon';

import harness, { Harness } from '@dojo/test-extras/harness';
import { assignProperties, assignChildProperties, compareProperty, findIndex } from '@dojo/test-extras/support/d';
import { v, w } from '@dojo/widget-core/d';
import { Keys } from '../../../common/util';

import Select, { SelectProperties } from '../../Select';
import Listbox from '../../../listbox/Listbox';
import Label from '../../../label/Label';
import * as css from '../../styles/select.m.css';
import * as iconCss from '../../../common/styles/icons.m.css';

let widget: Harness<SelectProperties, typeof Select>;

const compareId = compareProperty((value: any) => {
	return typeof value === 'string';
});

interface TestEventInit extends EventInit {
	which: number;
}

const testOptions: any[] = [
	{
		label: 'One',
		value: 'one'
	},
	{
		label: 'Two',
		value: 'two'
	},
	{
		label: 'Three',
		value: 'three',
		disabled: true
	}
];

const testProperties: Partial<SelectProperties> = {
	describedBy: 'foo',
	disabled: true,
	invalid: true,
	getOptionDisabled: (option: any, index: number) => !!option.disabled,
	getOptionId: (option: any, index: number) => option.value,
	getOptionLabel: (option: any) => option.label,
	getOptionSelected: (option: any, index: number) => option.value === 'two',
	getOptionValue: (option: any, index: number) => option.value,
	name: 'foo',
	options: testOptions,
	readOnly: true,
	required: true,
	value: 'two'
};

const expectedNative = function(widget: any, useTestProperties = false) {
	return v('div', { classes: widget.classes(css.inputWrapper) }, [
		v('select', {
			classes: widget.classes(css.input),
			'aria-describedby': useTestProperties ? 'foo' : undefined,
			disabled: useTestProperties ? true : undefined,
			'aria-invalid': useTestProperties ? 'true' : null,
			name: useTestProperties ? 'foo' : undefined,
			readOnly: useTestProperties ? true : undefined,
			'aria-readonly': useTestProperties ? 'true' : null,
			required: useTestProperties ? true : undefined,
			value: useTestProperties ? 'two' : undefined,
			onblur: widget.listener,
			onchange: widget.listener,
			onfocus: widget.listener
		}, [
			v('option', {
				value: useTestProperties ? 'one' : '',
				id: useTestProperties ? 'one' : undefined,
				disabled: useTestProperties ? false : undefined,
				selected: useTestProperties ? false : undefined
			}, [ useTestProperties ? 'One' : '' ]),
			v('option', {
				value: useTestProperties ? 'two' : '',
				id: useTestProperties ? 'two' : undefined,
				disabled: useTestProperties ? false : undefined,
				selected: useTestProperties ? true : undefined
			}, [ useTestProperties ? 'Two' : '' ]),
			v('option', {
				value: useTestProperties ? 'three' : '',
				id: useTestProperties ? 'three' : undefined,
				disabled: useTestProperties ? true : undefined,
				selected: useTestProperties ? false : undefined
			}, [ useTestProperties ? 'Three' : '' ])
		]),
		v('span', { classes: widget.classes(css.arrow) }, [
			v('i', { classes: widget.classes(iconCss.icon, iconCss.downIcon),
				role: 'presentation', 'aria-hidden': 'true'
			})
		])
	]);
};

const expectedSingle = function(widget: any, useTestProperties = false, open = false) {
	return v('div', {
		classes: widget.classes(css.inputWrapper, open ? css.open : null),
		key: 'root'
	}, [
		v('button', {
			'aria-controls': <any> compareId,
			'aria-expanded': open ? 'true' : 'false',
			'aria-haspopup': 'listbox',
			'aria-invalid': useTestProperties ? 'true' : null,
			'aria-readonly': useTestProperties ? 'true' : null,
			'aria-required': useTestProperties ? 'true' : null,
			classes: widget.classes(css.trigger),
			describedBy: useTestProperties ? 'foo' : undefined,
			disabled: useTestProperties ? true : undefined,
			key: 'trigger',
			value: useTestProperties ? 'two' : undefined,
			onblur: widget.listener,
			onclick: widget.listener,
			onfocus: widget.listener,
			onkeydown: widget.listener,
			onmousedown: widget.listener
		}, [ useTestProperties ? 'Two' : '' ]),
		v('span', { classes: widget.classes(css.arrow) }, [
			v('i', {
				classes: widget.classes(iconCss.icon, iconCss.downIcon),
				role: 'presentation',
				'aria-hidden': 'true'
			})
		]),
		v('div', {
			classes: widget.classes(css.dropdown),
			onfocusout: widget.listener,
			onkeydown: widget.listener
		}, [
			w(Listbox, {
				activeIndex: 0,
				describedBy: useTestProperties ? 'foo' : undefined,
				id: <any> compareId,
				optionData: useTestProperties ? testOptions : [],
				tabIndex: open ? 0 : -1,
				getOptionDisabled: useTestProperties ? widget.listener : undefined,
				getOptionId: useTestProperties ? widget.listener : undefined,
				getOptionLabel: useTestProperties ? widget.listener : undefined,
				getOptionSelected: useTestProperties ? widget.listener : undefined,
				theme: undefined,
				onActiveIndexChange: widget.listener,
				onOptionSelect: widget.listener
			})
		])
	]);
};

function isOpen(widget: any): boolean {
	const vdom = widget.getRender();
	const button = findIndex(vdom, '0,0');
	return (<any> button)!.properties!['aria-expanded'] === 'true';
}

const expected = function(widget: any, selectVdom: any, label = false) {
	if (label) {
		return w(Label, {
			extraClasses: { root: css.root },
			forId: <any> compareId,
			label: 'foo',
			theme: undefined
		}, [ selectVdom ]);
	}
	else {
		return v('div', {
			classes: widget.classes(css.root)
		}, [ selectVdom ]);
	}
};

registerSuite('Select', {

	beforeEach() {
		widget = harness(Select);
	},

	afterEach() {
		widget.destroy();
	},

	tests: {

		'Native Single Select': {
			'default properties'() {
				widget.setProperties({
					options: testOptions,
					useNativeElement: true
				});

				let selectVdom = expectedNative(widget);
				widget.expectRender(expected(widget, selectVdom));
			},

			'custom properties'() {
				widget.setProperties({
					...testProperties,
					useNativeElement: true
				});

				const selectVdom = expectedNative(widget, true);
				const expectedVdom = expected(widget, selectVdom);
				assignProperties(expectedVdom, {
					classes: widget.classes(css.root, css.disabled, css.invalid, css.readonly, css.required)
				});

				widget.expectRender(expectedVdom);
			},

			'basic events'() {
				const onBlur = sinon.stub();
				const onFocus = sinon.stub();

				widget.setProperties({
					useNativeElement: true,
					onBlur,
					onFocus
				});

				widget.sendEvent('blur', { selector: 'select' });
				assert.isTrue(onBlur.called, 'onBlur called');
				widget.sendEvent('focus', { selector: 'select' });
				assert.isTrue(onFocus.called, 'onFocus called');
			},

			'onChange called with correct option'() {
				const onChange = sinon.stub();
				widget.setProperties({
					getOptionValue: testProperties.getOptionValue,
					options: testOptions,
					useNativeElement: true,
					onChange
				});

				widget.sendEvent('change', { selector: 'option' });
				assert.isTrue(onChange.calledWith(testOptions[0]), 'onChange should be called with the first entry in the testOptions array');
			},

			'events called with widget key'() {
				const onBlur = sinon.stub();
				const onFocus = sinon.stub();
				const onChange = sinon.stub();
				widget.setProperties({
					key: 'foo',
					getOptionValue: testProperties.getOptionValue,
					useNativeElement: true,
					options: testOptions,
					onBlur,
					onFocus,
					onChange
				});

				widget.sendEvent('blur', { selector: 'select' });
				assert.isTrue(onBlur.calledWith('foo'), 'onBlur called with foo key');
				widget.sendEvent('focus', { selector: 'select' });
				assert.isTrue(onFocus.calledWith('foo'), 'onFocus called with foo key');
				widget.sendEvent('change', { selector: 'option' });
				assert.isTrue(onChange.calledWith(testOptions[0], 'foo'), 'onChange called with foo key');
			}
		},

		'Custom Single-select': {
			'default properties'() {
				let selectVdom = expectedSingle(widget);
				widget.expectRender(expected(widget, selectVdom));
			},

			'custom properties'() {
				widget.setProperties(testProperties);

				const selectVdom = expectedSingle(widget, true);
				const expectedVdom = expected(widget, selectVdom);
				assignProperties(expectedVdom, {
					classes: widget.classes(css.root, css.disabled, css.invalid, css.readonly, css.required)
				});
				widget.expectRender(expectedVdom);
			},

			'open/close on trigger click'() {
				widget.setProperties({
					...testProperties
				});
				let selectVdom = expected(widget, expectedSingle(widget, true));
				assignProperties(selectVdom, {
					classes: widget.classes(css.root, css.disabled, css.invalid, css.readonly, css.required)
				});
				widget.expectRender(selectVdom, 'Dropdown is closed before click');

				widget.sendEvent('click', { selector: 'button' });

				selectVdom = expected(widget, expectedSingle(widget, true, true));
				assignProperties(selectVdom, {
					classes: widget.classes(css.root, css.disabled, css.invalid, css.readonly, css.required)
				});
				widget.expectRender(selectVdom, 'Open on first click');

				widget.sendEvent('click', { selector: 'button' });
				selectVdom = expected(widget, expectedSingle(widget, true));
				assignProperties(selectVdom, {
					classes: widget.classes(css.root, css.disabled, css.invalid, css.readonly, css.required)
				});
				widget.expectRender(selectVdom, 'Close on second click');
			},

			'select options'() {
				const onChange = sinon.stub();

				widget.setProperties({
					options: testOptions,
					onChange
				});

				widget.sendEvent('click', { key: 'trigger' });
				assert.isTrue(isOpen(widget), 'Widget opens on button click');

				widget.callListener('onOptionSelect', { args: [ testOptions[1] ], index: '0,2,0' });
				assert.isFalse(isOpen(widget), 'Widget closes on option select');
				assert.isTrue(onChange.calledOnce, 'onChange handler called when option selected');

				// open widget a second time
				widget.sendEvent('click', { key: 'trigger' });

				widget.sendEvent('mousedown', { key: 'trigger' });
				widget.sendEvent('focusout', { selector: `.${css.dropdown}` });
				widget.sendEvent('click', { key: 'trigger' });
				assert.isFalse(isOpen(widget), 'Widget closes on second button click');
			},

			'change active option'() {
				widget.setProperties({
					...testProperties
				});
				let selectVdom = expected(widget, expectedSingle(widget, true));
				assignProperties(selectVdom, {
					classes: widget.classes(css.root, css.disabled, css.invalid, css.readonly, css.required)
				});
				widget.callListener('onActiveIndexChange', { args: [ 1 ], index: '0,2,0' });

				selectVdom = expected(widget, expectedSingle(widget, true));
				assignProperties(selectVdom, {
					classes: widget.classes(css.root, css.disabled, css.invalid, css.readonly, css.required)
				});
				assignProperties(selectVdom, {
					classes: widget.classes(css.root, css.disabled, css.invalid, css.readonly, css.required)
				});
				assignChildProperties(selectVdom, '0,2,0', { activeIndex: 1 });

				widget.expectRender(selectVdom);
			},

			'open/close with keyboard'() {
				widget.setProperties({
					options: testOptions
				});

				widget.sendEvent<TestEventInit>('keydown', {
					eventInit: {
						which: Keys.Down
					},
					key: 'trigger'
				});
				assert.isTrue(isOpen(widget), 'Dropdown opens with down arrow on button');

				widget.sendEvent<TestEventInit>('keydown', {
					eventInit: {
						which: Keys.Enter
					},
					selector: `.${css.dropdown}`
				});
				assert.isTrue(isOpen(widget), 'Dropdown does not close with any key');

				widget.sendEvent<TestEventInit>('keydown', {
					eventInit: {
						which: Keys.Escape
					},
					selector: `.${css.dropdown}`
				});
				assert.isFalse(isOpen(widget), 'Dropdown closes with escape key on dropdown');

				widget.sendEvent<TestEventInit>('keydown', {
					eventInit: {
						which: Keys.Up
					},
					key: 'trigger'
				});
				assert.isFalse(isOpen(widget), 'Dropdown does not open with any key');
			},

			'close on listbox blur'() {
				const onBlur = sinon.stub();
				widget.setProperties({
					options: testOptions,
					onBlur
				});

				widget.sendEvent('click', { key: 'trigger' });
				widget.sendEvent('blur', { key: 'trigger' }); // fake trigger blur after opening dropdown
				assert.isTrue(isOpen(widget), 'Dropdown opens with click on button');

				widget.sendEvent('focusout', { selector: `.${css.dropdown}` });
				assert.isFalse(isOpen(widget), 'Dropdown closes on listbox blur');
				assert.isTrue(onBlur.calledOnce, 'onBlur callback should only be called once for last blur event');
			},

			'close on trigger blur'() {
				const onBlur = sinon.stub();
				widget.setProperties({
					options: testOptions,
					onBlur
				});

				widget.sendEvent('click', { key: 'trigger' });
				widget.sendEvent('blur', { key: 'trigger' }); // fake trigger blur after opening dropdown
				assert.isTrue(isOpen(widget), 'Dropdown opens with click on button');

				widget.sendEvent('blur', { key: 'trigger' });
				assert.isFalse(isOpen(widget), 'Dropdown closes on trigger blur');
				assert.isTrue(onBlur.calledOnce, 'onBlur callback should only be called once for last blur event');
			},

			'events called with widget key'() {
				const onBlur = sinon.stub();
				widget.setProperties({ key: 'foo', onBlur });

				widget.sendEvent('blur', { key: 'trigger' });
				assert.isTrue(onBlur.calledWith('foo'), 'Trigger blur event called with foo key');

				widget.sendEvent('blur', { key: 'trigger' }); // first second blur to reset _ignoreBlur
				widget.sendEvent('focusout', { selector: `.${css.dropdown}` });
				assert.isTrue(onBlur.getCall(1).calledWith('foo'), 'Dropdown blur event called with foo key');
			}
		},

		label: {
			'default properties'() {
				widget.setProperties({
					label: 'foo'
				});
				const selectVdom = expectedSingle(widget);
				widget.expectRender(expected(widget, selectVdom, true), 'renders label with basic properties');
			},

			'state classes and form id'() {
				widget.setProperties({
					...testProperties,
					label: 'foo'
				});
				const expectedVdom = expected(widget, expectedSingle(widget, true), true);
				assignProperties(expectedVdom, {
					extraClasses: { root: `${css.root} ${css.disabled} ${css.invalid} ${css.readonly} ${css.required}` }
				});
				widget.expectRender(expectedVdom);
			},

			'valid state class'() {
				widget.setProperties({
					...testProperties,
					invalid: false,
					label: 'foo'
				});
				const expectedVdom = expected(widget, expectedSingle(widget, true), true);
				assignChildProperties(expectedVdom, '0,0', { 'aria-invalid': null });
				assignProperties(expectedVdom, {
					extraClasses: { root: `${css.root} ${css.disabled} ${css.valid} ${css.readonly} ${css.required}` }
				});
				widget.expectRender(expectedVdom);
			}
		}
	}
});
