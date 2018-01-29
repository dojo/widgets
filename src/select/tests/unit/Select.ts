const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import * as sinon from 'sinon';

import harness, { Harness } from '@dojo/test-extras/harness';
import { assignProperties, assignChildProperties, compareProperty, findKey, replaceChild } from '@dojo/test-extras/support/d';
import { v, w } from '@dojo/widget-core/d';
import { Keys } from '../../../common/util';

import Select, { SelectProperties } from '../../Select';
import Listbox from '../../../listbox/Listbox';
import Label from '../../../label/Label';
import * as css from '../../../theme/select/select.m.css';
import * as iconCss from '../../../theme/common/icons.m.css';

let widget: Harness<Select>;

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
	aria: { describedBy: 'foo' },
	getOptionDisabled: (option: any, index: number) => !!option.disabled,
	getOptionId: (option: any, index: number) => option.value,
	getOptionLabel: (option: any) => option.label,
	getOptionSelected: (option: any, index: number) => option.value === 'two',
	getOptionValue: (option: any, index: number) => option.value,
	id: 'foo',
	name: 'foo',
	options: testOptions,
	value: 'two'
};

const testStateProperties: Partial<SelectProperties> = {
	...testProperties,
	disabled: true,
	invalid: true,
	readOnly: true,
	required: true
};

const expectedNative = function(widget: Harness<Select>, useTestProperties = false) {
	const vdom = v('div', { classes: css.inputWrapper }, [
		v('select', {
			classes: css.input,
			disabled: useTestProperties ? true : undefined,
			'aria-invalid': useTestProperties ? 'true' : null,
			id: useTestProperties ? 'foo' : compareId as any,
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
			}, [ useTestProperties ? 'One' : `${testOptions[0]}` ]),
			v('option', {
				value: useTestProperties ? 'two' : '',
				id: useTestProperties ? 'two' : undefined,
				disabled: useTestProperties ? false : undefined,
				selected: useTestProperties ? true : undefined
			}, [ useTestProperties ? 'Two' : `${testOptions[1]}` ]),
			v('option', {
				value: useTestProperties ? 'three' : '',
				id: useTestProperties ? 'three' : undefined,
				disabled: useTestProperties ? true : undefined,
				selected: useTestProperties ? false : undefined
			}, [ useTestProperties ? 'Three' : `${testOptions[2]}` ])
		]),
		v('span', { classes: css.arrow }, [
			v('i', { classes: [ iconCss.icon, iconCss.downIcon ],
				role: 'presentation', 'aria-hidden': 'true'
			})
		])
	]);

	if (useTestProperties) {
		assignChildProperties(vdom, '0', {'aria-describedby': 'foo'});
	}

	return vdom;
};

const expectedSingle = function(widget: Harness<Select>, useTestProperties = false, open = false, focus = false) {
	const vdom = v('div', {
		classes: [ css.inputWrapper, open ? css.open : null ],
		key: 'wrapper'
	}, [
		v('button', {
			'aria-controls': <any> compareId,
			'aria-expanded': open ? 'true' : 'false',
			'aria-haspopup': 'listbox',
			'aria-invalid': null,
			'aria-readonly': null,
			'aria-required': null,
			classes: [ css.trigger, useTestProperties ? null : css.placeholder ],
			disabled: undefined,
			key: 'trigger',
			value: useTestProperties ? 'two' : undefined,
			onblur: widget.listener,
			onclick: widget.listener,
			onfocus: widget.listener,
			onkeydown: widget.listener,
			onmousedown: widget.listener
		}, [ useTestProperties ? 'Two' : '' ]),
		v('span', { classes: css.arrow }, [
			v('i', {
				classes: [ iconCss.icon, iconCss.downIcon ],
				role: 'presentation',
				'aria-hidden': 'true'
			})
		]),
		v('div', {
			classes: css.dropdown,
			onfocusout: widget.listener,
			onkeydown: widget.listener
		}, [
			w(Listbox, {
				activeIndex: 0,
				focus,
				id: useTestProperties ? 'foo' : compareId as any,
				key: 'listbox',
				optionData: useTestProperties ? testOptions : [],
				tabIndex: open ? 0 : -1,
				getOptionDisabled: useTestProperties ? widget.listener : undefined,
				getOptionId: useTestProperties ? (widget.listener as any) : undefined,
				getOptionLabel: useTestProperties ? (widget.listener as any) : undefined,
				getOptionSelected: widget.listener,
				theme: undefined,
				onActiveIndexChange: widget.listener,
				onOptionSelect: widget.listener
			})
		])
	]);

	if (useTestProperties) {
		assignProperties(findKey(vdom, 'trigger')!, {'aria-describedby': 'foo'});
	}

	return vdom;
};

function isOpen(widget: any): boolean {
	const vdom = widget.getRender();
	const button = findKey(vdom, 'trigger');
	return (<any> button)!.properties!['aria-expanded'] === 'true';
}

const expected = function(widget: Harness<Select>, selectVdom: any, label = false) {
	return v('div', {
		key: 'root',
		classes: [ css.root, null, null, null, null, null ]
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
		selectVdom
	]);
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
					...testStateProperties,
					useNativeElement: true
				});

				const selectVdom = expectedNative(widget, true);
				const expectedVdom = expected(widget, selectVdom);
				assignProperties(expectedVdom, {
					classes: [ css.root, css.disabled, css.invalid, null, css.readonly, css.required ]
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
				widget.setProperties(testStateProperties);

				const selectVdom = expectedSingle(widget, true);
				assignProperties(findKey(selectVdom, 'trigger')!, {
					'aria-invalid': 'true',
					'aria-readonly': 'true',
					'aria-required': 'true',
					disabled: true
				});
				const expectedVdom = expected(widget, selectVdom);
				assignProperties(expectedVdom, {
					classes: [ css.root, css.disabled, css.invalid, null, css.readonly, css.required ]
				});
				widget.expectRender(expectedVdom);
			},

			'placeholder'() {
				widget.setProperties({
					...testProperties,
					placeholder: 'foo'
				});

				let expectedVdom = expected(widget, expectedSingle(widget, true));

				widget.expectRender(expectedVdom, 'placeholder not shown if selected option is present');

				widget.setProperties({
					...testProperties,
					getOptionSelected: () => false,
					placeholder: 'bar'
				});

				assignProperties(findKey(expectedVdom, 'trigger')!, {
					classes: [ css.trigger, css.placeholder ]
				});
				expectedVdom = expected(widget, expectedSingle(widget, true));
				assignProperties(findKey(expectedVdom, 'trigger')!, {
					classes: [ css.trigger, css.placeholder ]
				});
				replaceChild(expectedVdom, '1,0,0', 'bar');

				widget.expectRender(expectedVdom, 'placeholder is shown if no selected option');
			},

			'open/close on trigger click'() {
				widget.setProperties(testProperties);
				let selectVdom = expected(widget, expectedSingle(widget, true));
				widget.expectRender(selectVdom, 'Dropdown is closed before click');

				widget.sendEvent('click', { selector: 'button' });

				selectVdom = expected(widget, expectedSingle(widget, true, true, true));
				widget.expectRender(selectVdom, 'Open on first click');

				widget.sendEvent('click', { selector: 'button' });
				selectVdom = expected(widget, expectedSingle(widget, true));
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

			'default for getOptionSelected'() {
				const modifiedTestProperties = { ...testProperties, getOptionSelected: undefined };
				widget.setProperties(modifiedTestProperties);

				const expectedVdom = expected(widget, expectedSingle(widget, true));
				widget.expectRender(expectedVdom, 'defaults to checking against getOptionValue');

				const simpleOptions = ['one', 'two', 'three'];
				widget.setProperties({
					options: simpleOptions,
					value: 'two'
				});
				widget.expectRender(v('div', {
					key: 'root',
					classes: [ css.root, null, null, null, null, null ]
				}, [
					null,
					v('div', {
						classes: [ css.inputWrapper, null ],
						key: 'wrapper'
					}, [
						v('button', {
							'aria-controls': <any> compareId,
							'aria-expanded': 'false',
							'aria-haspopup': 'listbox',
							'aria-invalid': null,
							'aria-readonly': null,
							'aria-required': null,
							classes: [ css.trigger, null ],
							disabled: undefined,
							key: 'trigger',
							value: 'two',
							onblur: widget.listener,
							onclick: widget.listener,
							onfocus: widget.listener,
							onkeydown: widget.listener,
							onmousedown: widget.listener
						}, [ 'two' ]),
						v('span', { classes: css.arrow }, [
							v('i', {
								classes: [ iconCss.icon, iconCss.downIcon ],
								role: 'presentation',
								'aria-hidden': 'true'
							})
						]),
						v('div', {
							classes: css.dropdown,
							onfocusout: widget.listener,
							onkeydown: widget.listener
						}, [
							w(Listbox, {
								activeIndex: 0,
								focus: false,
								id: <any> compareId,
								key: 'listbox',
								optionData: simpleOptions,
								tabIndex: -1,
								getOptionDisabled: undefined,
								getOptionId: undefined,
								getOptionLabel: undefined,
								getOptionSelected: widget.listener,
								theme: undefined,
								onActiveIndexChange: widget.listener,
								onOptionSelect: widget.listener
							})
						])
					])
				]), 'defaults to checking option === value');
			},

			'change active option'() {
				widget.setProperties(testProperties);
				let selectVdom = expected(widget, expectedSingle(widget, true));
				widget.callListener('onActiveIndexChange', { args: [ 1 ], key: 'listbox' });

				selectVdom = expected(widget, expectedSingle(widget, true));
				assignProperties(findKey(selectVdom, 'listbox')!, { activeIndex: 1 });

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
		}
	}
});
