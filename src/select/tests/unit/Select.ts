import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as sinon from 'sinon';

import harness, { Harness } from '@dojo/test-extras/harness';
import { assignProperties, assignChildProperties, compareProperty, replaceChild, findIndex } from '@dojo/test-extras/support/d';
import { v, w } from '@dojo/widget-core/d';
import { Keys } from '../../../common/util';

import Select, { SelectProperties } from '../../Select';
import SelectOption, { OptionData } from '../../SelectOption';
import Label from '../../../label/Label';
import WidgetRegistry from '@dojo/widget-core/WidgetRegistry';
import * as css from '../../styles/select.m.css';
import * as iconCss from '../../../common/styles/icons.m.css';

let widget: Harness<SelectProperties, typeof Select>;

const compareId = compareProperty((value: any) => {
	return typeof value === 'string';
});

const compareRegistry = compareProperty((value: any) => {
	return value instanceof WidgetRegistry;
});

interface TestEventInit extends EventInit {
	which: number;
}

const testOptions: OptionData[] = [
	{
		label: 'One',
		value: 'one',
		id: 'first'
	},
	{
		label: 'Two',
		value: 'two',
		selected: true
	},
	{
		label: 'Three',
		value: 'three',
		disabled: true
	}
];

const expectedNative = function(widget: any, multiple = false) {
	return v('div', { classes: widget.classes(css.inputWrapper) }, [
		v('select', {
			classes: widget.classes(css.input),
			'aria-describedby': undefined,
			disabled: undefined,
			'aria-invalid': null,
			multiple: multiple ? true : null,
			name: undefined,
			readOnly: undefined,
			'aria-readonly': null,
			required: undefined,
			value: undefined,
			onblur: widget.listener,
			onchange: widget.listener,
			onclick: widget.listener,
			onfocus: widget.listener,
			onkeydown: widget.listener
		}, [
			v('option', {
				value: 'one',
				innerHTML: 'One',
				disabled: undefined,
				selected: null
			}),
			v('option', {
				value: 'two',
				innerHTML: 'Two',
				disabled: undefined,
				selected: multiple ? true : null
			}),
			v('option', {
				value: 'three',
				innerHTML: 'Three',
				disabled: true,
				selected: null
			})
		]),
		multiple ? null : v('span', { classes: widget.classes(css.arrow) }, [
			v('i', { classes: widget.classes(iconCss.icon, iconCss.downIcon),
				role: 'presentation', 'aria-hidden': 'true'
			})
		])
	]);
};

const expectedOptions = function(widget: any, multiple = false) {
	return [
		w<SelectOption>('select-option', {
			focused: true,
			index: 0,
			key: '0',
			optionData: {
				id: 'first',
				value: 'one',
				label: 'One',
				selected: multiple ? undefined : false
			},
			onMouseDown: widget.listener,
			onClick: widget.listener,
			theme: undefined
		}),
		w<SelectOption>('select-option', {
			focused: false,
			index: 1,
			key: '1',
			optionData: {
				id: <any> compareId,
				value: 'two',
				label: 'Two',
				selected: multiple ? true : false
			},
			onMouseDown: widget.listener,
			onClick: widget.listener,
			theme: undefined
		}),
		w<SelectOption>('select-option', {
			focused: false,
			index: 2,
			key: '2',
			optionData: {
				id: <any> compareId,
				value: 'three',
				label: 'Three',
				selected: multiple ? undefined : false,
				disabled: true
			},
			onMouseDown: widget.listener,
			onClick: widget.listener,
			theme: undefined
		})
	];
};

const expectedSingle = function(widget: any) {
	return v('div', {
		classes: widget.classes(css.inputWrapper)
	}, [
		v('button', {
			classes: widget.classes(css.trigger),
			disabled: undefined,
			'aria-controls': compareId,
			'aria-owns': compareId,
			'aria-expanded': 'false',
			'aria-haspopup': 'listbox',
			'aria-activedescendant': 'first',
			value: undefined,
			onblur: widget.listener,
			onclick: widget.listener,
			onfocus: widget.listener,
			onkeydown: widget.listener
		}, [ 'One' ]),
		v('span', { classes: widget.classes(css.arrow) }, [
			v('i', {
				classes: widget.classes(iconCss.icon, iconCss.downIcon),
				role: 'presentation',
				'aria-hidden': 'true'
			})
		]),
		v('div', {
			role: 'listbox',
			id: <any> compareId,
			classes: widget.classes(css.dropdown),
			'aria-describedby': undefined,
			'aria-invalid': null,
			'aria-readonly': null,
			'aria-required': null
		}, expectedOptions(widget))
	]);
};

const expectedMultiple = function(widget: any) {
	return v('div', { classes: widget.classes(css.inputWrapper) }, [
		v('div', {
			role: 'listbox',
			classes: widget.classes(css.input),
			disabled: undefined,
			'aria-describedby': undefined,
			'aria-invalid': null,
			'aria-multiselectable': 'true',
			'aria-activedescendant': 'first',
			'aria-readonly': null,
			'aria-required': null,
			tabIndex: 0,
			onblur: widget.listener,
			onfocus: widget.listener,
			onkeydown: widget.listener
		}, expectedOptions(widget, true))
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
			label: 'foo',
			registry: <any> compareRegistry,
			theme: undefined
		}, [ selectVdom ]);
	}
	else {
		return v('div', {
			classes: widget.classes(css.root)
		}, [ selectVdom ]);
	}
};

registerSuite({
	name: 'Select',

	beforeEach() {
		widget = harness(Select);
	},

	afterEach() {
		widget.destroy();
	},

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
				describedBy: 'id1',
				disabled: true,
				invalid: true,
				name: 'bar',
				options: testOptions,
				readOnly: true,
				required: true,
				useNativeElement: true,
				value: 'one'
			});

			const selectVdom = expectedNative(widget);
			assignChildProperties(selectVdom, '0', {
				'aria-describedby': 'id1',
				disabled: true,
				'aria-invalid': 'true',
				name: 'bar',
				readOnly: true,
				'aria-readonly': 'true',
				required: true,
				value: 'one'
			});

			const expectedVdom = expected(widget, selectVdom);
			assignProperties(expectedVdom, {
				classes: widget.classes(css.root, css.disabled, css.invalid, css.readonly, css.required)
			});

			widget.expectRender(expectedVdom);
		},

		'basic events'() {
			const onBlur = sinon.stub();
			const onClick = sinon.stub();
			const onFocus = sinon.stub();
			const onKeyDown = sinon.stub();

			widget.setProperties({
				useNativeElement: true,
				onBlur,
				onClick,
				onFocus,
				onKeyDown
			});

			widget.sendEvent('blur', { selector: 'select' });
			assert.isTrue(onBlur.called, 'onBlur called');
			widget.sendEvent('click', { selector: 'select' });
			assert.isTrue(onClick.called, 'onClick called');
			widget.sendEvent('focus', { selector: 'select' });
			assert.isTrue(onFocus.called, 'onFocus called');
			widget.sendEvent('keydown', { selector: 'select' });
			assert.isTrue(onKeyDown.called, 'onKeyDown called');
		},

		'onChange called with correct option'() {
			const onChange = sinon.stub();
			widget.setProperties({
				options: testOptions,
				useNativeElement: true,
				onChange
			});

			widget.sendEvent('change', {
				target: widget.getDom().querySelector('option')!
			});

			assert.isTrue(onChange.calledWith(testOptions[0]), 'onChange should be called with the first entry in the testOptions array');
		}
	},

	'Native Multi-select'() {
		widget.setProperties({
			multiple: true,
			options: testOptions,
			useNativeElement: true
		});

		const selectVdom = expectedNative(widget, true);
		const expectedVdom = expected(widget, selectVdom);
		assignProperties(expectedVdom, {
			classes: widget.classes(css.root, css.multiselect)
		});
		widget.expectRender(expectedVdom);
	},

	'Custom option factory'() {
		class CustomOption extends SelectOption {
			renderLabel() {
				return 'foo';
			}
		}
		widget.setProperties({
			customOption: CustomOption,
			options: testOptions
		});

		let selectVdom = expectedSingle(widget);
		widget.expectRender(expected(widget, selectVdom));

		widget.setProperties({
			customOption: undefined,
			options: testOptions
		});

		selectVdom = expectedSingle(widget);
		widget.expectRender(expected(widget, selectVdom));
	},

	'Custom Single-select': {
		'default properties'() {
			widget.setProperties({
				options: testOptions
			});

			let selectVdom = expectedSingle(widget);
			widget.expectRender(expected(widget, selectVdom), 'renders with options');

			widget.setProperties({
				options: undefined
			});
			selectVdom = expectedSingle(widget);
			replaceChild(selectVdom, '2', v('div', {
				role: 'listbox',
				id: <any> compareId,
				classes: widget.classes(css.dropdown),
				'aria-describedby': undefined,
				'aria-invalid': null,
				'aria-readonly': null,
				'aria-required': null
			}, []));
			replaceChild(selectVdom, '0,0', '');
			assignChildProperties(selectVdom, '0', {
				'aria-activedescendant': null
			});
			widget.expectRender(expected(widget, selectVdom), 'renders with no options');
		},

		'custom properties'() {
			widget.setProperties({
				describedBy: 'id1',
				disabled: true,
				invalid: true,
				options: testOptions,
				readOnly: true,
				required: true,
				value: 'two'
			});
			const selectVdom = expectedSingle(widget);

			assignChildProperties(selectVdom, '0', {
				disabled: true,
				value: 'two'
			});
			assignChildProperties(selectVdom, '2', {
				'aria-describedby': 'id1',
				'aria-invalid': 'true',
				'aria-readonly': 'true',
				'aria-required': 'true'
			});
			assignChildProperties(selectVdom, '2,1', {
				optionData: {
					id: <any> compareId,
					value: 'two',
					label: 'Two',
					selected: true
				}
			});
			replaceChild(selectVdom, '0,0', 'Two');

			const expectedVdom = expected(widget, selectVdom);
			assignProperties(expectedVdom, {
				classes: widget.classes(css.root, css.disabled, css.invalid, css.readonly, css.required)
			});

			widget.expectRender(expectedVdom);
		},

		'Open/close on trigger click'() {
			const onClick = sinon.stub();

			widget.setProperties({
				options: testOptions,
				onClick
			});
			let selectVdom = expectedSingle(widget);
			widget.expectRender(expected(widget, selectVdom));

			widget.sendEvent('click', { selector: 'button' });

			// need to call this here so the class is present in all widget.classes() calls
			widget.classes(css.open);
			selectVdom = expectedSingle(widget);
			assignProperties(selectVdom, {
				classes: widget.classes(css.inputWrapper, css.open)
			});
			assignChildProperties(selectVdom, '0', {
				'aria-expanded': 'true'
			});

			widget.expectRender(expected(widget, selectVdom), 'Open on first click');

			widget.sendEvent('click', { selector: 'button' });
			selectVdom = expectedSingle(widget);
			widget.expectRender(expected(widget, selectVdom), 'Close on second click');
			assert.isTrue(onClick.calledTwice, 'onClick handler called two times');
		},

		'Click options'() {
			const onClick = sinon.stub();
			const onChange = sinon.stub();
			const preventDefault = sinon.stub();

			widget.setProperties({
				options: testOptions,
				onChange,
				onClick
			});

			widget.sendEvent('click', { selector: 'button' });
			assert.isTrue(isOpen(widget), 'Widget opens on button click');

			widget.callListener('onClick', {
				args: [ { preventDefault }, 1 ],
				key: '1'
			});
			assert.isTrue(onChange.calledOnce, 'onChange called when clicking second option');
			assert.strictEqual(onChange.getCall(0).args[0].value, 'two', 'Clicking second option calls onChange with correct data');
			assert.isTrue(onClick.calledTwice, 'onClick handler calls twice for button click and option click');
			assert.isFalse(isOpen(widget), 'Clicking option closes menu');

			widget.sendEvent('click', { selector: 'button' });
			widget.callListener('onClick', {
				args: [ { preventDefault }, 2 ],
				key: '2'
			});
			assert.isTrue(onChange.calledOnce, 'onChange not called when clicking disabled option');
			assert.isTrue(preventDefault.calledOnce, 'event.preventDefault called when clicking disabled option');
			assert.isTrue(isOpen(widget), 'Clicking disabled option doesn\'t close menu');
		},

		'Open/close with keyboard and blur'() {
			const onBlur = sinon.stub();
			const onKeyDown = sinon.stub();

			widget.setProperties({
				options: testOptions,
				onBlur,
				onKeyDown
			});
			let selectVdom = expectedSingle(widget);
			widget.expectRender(expected(widget, selectVdom));

			widget.sendEvent<TestEventInit>('keydown', {
				eventInit: {
					which: Keys.Down
				},
				selector: 'button'
			});

			// need to call this here so the class is present in all widget.classes() calls
			widget.classes(css.open);
			selectVdom = expectedSingle(widget);
			assignProperties(selectVdom, {
				classes: widget.classes(css.inputWrapper, css.open)
			});
			assignChildProperties(selectVdom, '0', {
				'aria-expanded': 'true'
			});

			widget.expectRender(expected(widget, selectVdom), 'Opens with down arrow');

			widget.callListener('onMouseDown', { key: '1' });
			widget.sendEvent('blur', { selector: 'button' });
			assert.isTrue(isOpen(widget), 'Widget doesn\'t close after mousedown then blur');

			widget.sendEvent<TestEventInit>('keydown', {
				eventInit: {
					which: Keys.Escape
				},
				selector: 'button'
			});
			selectVdom = expectedSingle(widget);
			widget.expectRender(expected(widget, selectVdom), 'Close on escape key');
			assert.isTrue(onKeyDown.calledTwice, 'onKeyDown event handler called twice');

			widget.sendEvent('click', { selector: 'button' });
			assignProperties(selectVdom, {
				classes: widget.classes(css.inputWrapper, css.open)
			});
			assignChildProperties(selectVdom, '0', {
				'aria-expanded': 'true'
			});
			widget.expectRender(expected(widget, selectVdom), 'Opens on button click');

			widget.sendEvent('blur', { selector: 'button' });
			selectVdom = expectedSingle(widget);
			widget.expectRender(expected(widget, selectVdom), 'Closes after blur event');
			assert.isTrue(onBlur.called, 'onBlur event handler called');
		},

		'Navigate options with keyboard'() {
			const onChange = sinon.stub();

			widget.setProperties({
				options: testOptions,
				onChange
			});

			widget.sendEvent('click', { selector: 'button' });
			widget.sendEvent<TestEventInit>('keydown', {
				eventInit: {
					which: Keys.Down
				},
				selector: 'button'
			});
			widget.sendEvent<TestEventInit>('keydown', {
				eventInit: {
					which: Keys.Enter
				},
				selector: 'button'
			});
			assert.isTrue(onChange.calledOnce, 'onChange handler called');
			assert.strictEqual(onChange.getCall(0).args[0].value, 'two', 'Down arrow + enter selects the second option');

			widget.sendEvent<TestEventInit>('keydown', {
				eventInit: {
					which: Keys.End
				},
				selector: 'button'
			});
			widget.sendEvent<TestEventInit>('keydown', {
				eventInit: {
					which: Keys.Enter
				},
				selector: 'button'
			});
			assert.isTrue(onChange.calledOnce, 'End + enter doesn\'t select disabled option');

			widget.sendEvent<TestEventInit>('keydown', {
				eventInit: {
					which: Keys.Down
				},
				selector: 'button'
			});
			widget.sendEvent<TestEventInit>('keydown', {
				eventInit: {
					which: Keys.Space
				},
				selector: 'button'
			});
			assert.strictEqual(onChange.getCall(1).args[0].value, 'one', 'Down arrow wraps around to first option');

			widget.sendEvent<TestEventInit>('keydown', {
				eventInit: {
					which: Keys.Up
				},
				selector: 'button'
			});
			widget.sendEvent<TestEventInit>('keydown', {
				eventInit: {
					which: Keys.Space
				},
				selector: 'button'
			});
			assert.isTrue(onChange.calledTwice, 'Up arrow wraps to last [disabled] option');

			widget.sendEvent<TestEventInit>('keydown', {
				eventInit: {
					which: Keys.Home
				},
				selector: 'button'
			});
			widget.sendEvent<TestEventInit>('keydown', {
				eventInit: {
					which: Keys.Space
				},
				selector: 'button'
			});
			assert.strictEqual(onChange.getCall(2).args[0].value, 'one', 'Home goes to first option');
		}
	},

	'Custom multi-select': {
		'default properties'() {
			widget.setProperties({
				multiple: true,
				options: testOptions
			});
			let selectVdom = expectedMultiple(widget);
			let expectedVdom = expected(widget, selectVdom);
			assignProperties(expectedVdom, {
				classes: widget.classes(css.root, css.multiselect)
			});
			widget.expectRender(expectedVdom, 'renders with custom options');

			widget.setProperties({
				multiple: true,
				options: undefined
			});
			selectVdom = expectedMultiple(widget);
			replaceChild(selectVdom, '0', v('div', {
				role: 'listbox',
				classes: widget.classes(css.input),
				disabled: undefined,
				'aria-describedby': undefined,
				'aria-invalid': null,
				'aria-multiselectable': 'true',
				'aria-activedescendant': null,
				'aria-readonly': null,
				'aria-required': null,
				tabIndex: 0,
				onblur: widget.listener,
				onfocus: widget.listener,
				onkeydown: widget.listener
			}, []));
			expectedVdom = expected(widget, selectVdom);
			assignProperties(expectedVdom, {
				classes: widget.classes(css.root, css.multiselect)
			});
			widget.expectRender(expectedVdom, 'renders with no options');
		},

		'custom properties'() {
			widget.setProperties({
				describedBy: 'id1',
				disabled: true,
				invalid: true,
				multiple: true,
				options: testOptions,
				readOnly: true,
				required: true,
				value: 'two'
			});

			let selectVdom = expectedMultiple(widget);
			assignChildProperties(selectVdom, '0', {
				disabled: true,
				'aria-describedby': 'id1',
				'aria-invalid': 'true',
				'aria-readonly': 'true',
				'aria-required': 'true'
			});
			let expectedVdom = expected(widget, selectVdom);
			assignProperties(expectedVdom, {
				classes: widget.classes(css.root, css.disabled, css.invalid, css.multiselect, css.readonly, css.required)
			});
			widget.expectRender(expectedVdom, 'renders with custom properties and state classes');

			widget.setProperties({
				invalid: false,
				multiple: true,
				options: testOptions
			});
			selectVdom = expectedMultiple(widget);
			expectedVdom = expected(widget, selectVdom);
			assignProperties(expectedVdom, {
				classes: widget.classes(css.root, css.valid, css.multiselect)
			});
			widget.expectRender(expectedVdom, 'renders with valid state class');
		},

		'events'() {
			const onBlur = sinon.stub();
			const onFocus = sinon.stub();
			const onKeyDown = sinon.stub();

			widget.setProperties({
				multiple: true,
				onBlur,
				onFocus,
				onKeyDown
			});

			widget.sendEvent('blur', { selector: `.${css.input}` });
			assert.isTrue(onBlur.called, 'onBlur handler called');
			widget.sendEvent('focus', { selector: `.${css.input}` });
			assert.isTrue(onFocus.called, 'onFocus handler called');
			widget.sendEvent('keydown', { selector: `.${css.input}` });
			assert.isTrue(onKeyDown.called, 'onKeyDown handler called');
		}
	},

	label: {
		'default properties'() {
			widget.setProperties({
				label: 'foo',
				options: testOptions
			});
			const selectVdom = expectedSingle(widget);
			widget.expectRender(expected(widget, selectVdom, true), 'renders label with basic properties');
		},

		'state classes and form id'() {
			widget.setProperties({
				disabled: true,
				invalid: true,
				label: 'foo',
				options: testOptions,
				readOnly: true,
				required: true
			});
			const selectVdom = expectedSingle(widget);
			assignChildProperties(selectVdom, '0', {
				disabled: true
			});
			assignChildProperties(selectVdom, '2', {
				'aria-invalid': 'true',
				'aria-readonly': 'true',
				'aria-required': 'true'
			});
			const expectedVdom = expected(widget, selectVdom, true);
			assignProperties(expectedVdom, {
				extraClasses: { root: `${css.root} ${css.disabled} ${css.invalid} ${css.readonly} ${css.required}` }
			});
			widget.expectRender(expectedVdom);
		}
	}
});
