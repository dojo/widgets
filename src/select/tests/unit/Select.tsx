const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import * as sinon from 'sinon';

import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import { v, w, tsx } from '@dojo/framework/core/vdom';
import Focus from '@dojo/framework/core/meta/Focus';
import { Keys } from '../../../common/util';

import Icon from '../../../icon/index';
import Select, { SelectProperties } from '../../index';
import Listbox from '../../../listbox/index';
import Label from '../../../label/index';
import * as css from '../../../theme/select.m.css';
import {
	createHarness,
	compareId,
	compareWidgetId,
	isFocusedComparator,
	MockMetaMixin,
	noop,
	compareAriaControls,
	stubEvent
} from '../../../common/tests/support/test-helpers';
import HelperText from '../../../helper-text/index';

const harness = createHarness([compareId, compareWidgetId, compareAriaControls]);

const compareListboxFocused = {
	selector: '@listbox',
	property: 'focus',
	comparator: isFocusedComparator
};

const compareTriggerFocused = {
	selector: '@trigger',
	property: 'focus',
	comparator: isFocusedComparator
};

interface States {
	invalid?: boolean;
	disabled?: boolean;
	focused?: boolean;
	readOnly?: boolean;
	required?: boolean;
}

interface ExpectedOptions {
	label?: boolean;
	states?: States;
	classes?: any[];
	overrides?: any;
	focus?: boolean;
	helperText?: string;
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
		value: 'three'
	},
	{
		label: 'Four',
		value: 'four',
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
	getOptionText: (option: any) => option.label,
	widgetId: 'foo',
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

const baseNativeAssertion = assertionTemplate(() => (
	<div key="root" classes={[css.root, null, null, null, null, null, null]}>
		<div classes={css.inputWrapper}>
			<select
				assertion-key="select"
				classes={css.input}
				disabled={undefined}
				focus={noop}
				aria-invalid={null}
				id={compareId as any}
				name={undefined}
				readOnly={undefined}
				aria-readonly={null}
				required={undefined}
				value={undefined}
				onblur={noop}
				onchange={noop}
				onfocus={noop}
			>
				<option
					value={testOptions[0].value}
					id={undefined}
					disabled={undefined}
					selected={undefined}
				>
					{testOptions[0].label}
				</option>
				<option
					value={testOptions[1].value}
					id={undefined}
					disabled={undefined}
					selected={undefined}
				>
					{testOptions[1].label}
				</option>
				<option
					value={testOptions[2].value}
					id={undefined}
					disabled={undefined}
					selected={undefined}
				>
					{testOptions[2].label}
				</option>
				<option
					value={testOptions[3].value}
					id={undefined}
					disabled={undefined}
					selected={undefined}
				>
					{testOptions[3].label}
				</option>
			</select>
			<span classes={css.arrow}>
				<Icon type="downIcon" theme={undefined} classes={undefined} />
			</span>
		</div>
		<HelperText theme={undefined} text={undefined} />
	</div>
));

const expectedNative = function(useTestProperties = false, withStates = false) {
	const describedBy = useTestProperties ? { 'aria-describedby': 'foo' } : {};
	const vdom = v('div', { classes: css.inputWrapper }, [
		v(
			'select',
			{
				classes: css.input,
				disabled: useTestProperties ? true : undefined,
				focus: noop,
				'aria-invalid': useTestProperties ? 'true' : null,
				id: useTestProperties ? 'foo' : (compareId as any),
				name: useTestProperties ? 'foo' : undefined,
				readOnly: useTestProperties ? true : undefined,
				'aria-readonly': useTestProperties ? 'true' : null,
				required: useTestProperties ? true : undefined,
				value: useTestProperties ? 'two' : undefined,
				onblur: noop,
				onchange: noop,
				onfocus: noop,
				...describedBy
			},
			[
				v(
					'option',
					{
						value: useTestProperties ? 'one' : undefined,
						id: useTestProperties ? 'one' : undefined,
						disabled: useTestProperties ? false : undefined,
						selected: useTestProperties ? false : undefined
					},
					[useTestProperties ? 'One' : `${testOptions[0]}`]
				),
				v(
					'option',
					{
						value: useTestProperties ? 'two' : undefined,
						id: useTestProperties ? 'two' : undefined,
						disabled: useTestProperties ? false : undefined,
						selected: useTestProperties ? true : undefined
					},
					[useTestProperties ? 'Two' : `${testOptions[1]}`]
				),
				v(
					'option',
					{
						value: useTestProperties ? 'three' : undefined,
						id: useTestProperties ? 'three' : undefined,
						disabled: useTestProperties ? false : undefined,
						selected: useTestProperties ? false : undefined
					},
					[useTestProperties ? 'Three' : `${testOptions[2]}`]
				),
				v(
					'option',
					{
						value: useTestProperties ? 'four' : undefined,
						id: useTestProperties ? 'four' : undefined,
						disabled: useTestProperties ? true : undefined,
						selected: useTestProperties ? false : undefined
					},
					[useTestProperties ? 'Four' : `${testOptions[3]}`]
				)
			]
		),
		v('span', { classes: css.arrow }, [
			w(Icon, { type: 'downIcon', theme: undefined, classes: undefined })
		])
	]);

	return vdom;
};

const expectedSingle = function(
	useTestProperties = false,
	withStates = false,
	open = false,
	placeholder = '',
	activeIndex = -1
) {
	activeIndex = activeIndex >= 0 ? activeIndex : useTestProperties ? 1 : 0;
	const describedBy = useTestProperties ? { 'aria-describedby': 'foo' } : {};
	const vdom = v(
		'div',
		{
			classes: [css.inputWrapper, open ? css.open : null],
			key: 'wrapper'
		},
		[
			v(
				'button',
				{
					'aria-controls': '',
					'aria-expanded': open ? 'true' : 'false',
					'aria-haspopup': 'listbox',
					'aria-invalid': withStates ? 'true' : null,
					'aria-required': withStates ? 'true' : null,
					classes: [
						css.trigger,
						useTestProperties && !placeholder ? null : css.placeholder
					],
					disabled: withStates ? true : undefined,
					focus: noop,
					key: 'trigger',
					type: 'button',
					value: useTestProperties ? 'two' : undefined,
					onblur: noop,
					onclick: noop,
					onfocus: noop,
					onkeydown: noop,
					onmousedown: noop,
					...describedBy
				},
				[placeholder ? placeholder : useTestProperties ? 'Two' : '']
			),
			v('span', { classes: css.arrow }, [
				w(Icon, { type: 'downIcon', theme: undefined, classes: undefined })
			]),
			v(
				'div',
				{
					classes: css.dropdown,
					onfocusout: noop,
					onkeydown: noop
				},
				[
					w(Listbox, {
						activeIndex,
						focus: noop,
						widgetId: useTestProperties ? 'foo' : '',
						key: 'listbox',
						optionData: useTestProperties ? testOptions : [],
						tabIndex: open ? 0 : -1,
						getOptionDisabled: useTestProperties ? noop : undefined,
						getOptionId: useTestProperties ? noop : undefined,
						getOptionLabel: useTestProperties ? noop : undefined,
						onKeyDown: noop,
						getOptionSelected: noop,
						theme: undefined,
						classes: undefined,
						onActiveIndexChange: noop,
						onOptionSelect: noop
					})
				]
			)
		]
	);

	return vdom;
};

const expected = function(
	selectVdom: any,
	{
		classes = [css.root, null, null, null, null, null, null],
		label = false,
		states,
		focus = false,
		helperText
	}: ExpectedOptions = {}
) {
	return v(
		'div',
		{
			key: 'root',
			classes
		},
		[
			label
				? w(
						Label,
						{
							theme: undefined,
							disabled: undefined,
							focused: focus,
							hidden: undefined,
							invalid: undefined,
							readOnly: undefined,
							required: undefined,
							forId: ''
						},
						['foo']
				  )
				: null,
			selectVdom,
			w(HelperText, { theme: undefined, text: helperText })
		]
	);
};

registerSuite('Select', {
	tests: {
		'Native Single Select': {
			'default properties'() {
				const h = harness(() =>
					w(Select, {
						options: testOptions,
						useNativeElement: true
					})
				);
				h.expect(() => expected(expectedNative()));
			},

			helperText() {
				const h = harness(() =>
					w(Select, {
						options: testOptions,
						useNativeElement: true,
						helperText: 'foo'
					})
				);
				h.expect(() => expected(expectedNative(), { helperText: 'foo' }));
			},

			'custom properties'() {
				const h = harness(() =>
					w(Select, {
						...testStateProperties,
						useNativeElement: true
					})
				);
				h.expect(() =>
					expected(expectedNative(true), {
						classes: [
							css.root,
							css.disabled,
							null,
							css.invalid,
							null,
							css.readonly,
							css.required
						]
					})
				);
			},

			'focused class'() {
				const mockMeta = sinon.stub();
				const mockFocusGet = sinon.stub().returns({
					active: false,
					containsFocus: true
				});
				mockMeta.withArgs(Focus).returns({
					get: mockFocusGet
				});
				const h = harness(() =>
					w(MockMetaMixin(Select, mockMeta), {
						options: testOptions,
						useNativeElement: true
					})
				);
				h.expect(() =>
					expected(expectedNative(), {
						classes: [css.root, null, css.focused, null, null, null, null],
						focus: true
					})
				);
			},

			'basic events'() {
				const onBlur = sinon.stub();
				const onFocus = sinon.stub();

				const h = harness(() =>
					w(Select, {
						useNativeElement: true,
						onBlur,
						onFocus
					})
				);
				h.trigger('select', 'onblur');
				h.trigger('select', 'onfocus');
				assert.isTrue(onBlur.called, 'onBlur called');
				assert.isTrue(onFocus.called, 'onFocus called');
			},

			'onChange called with correct option'() {
				const onChange = sinon.stub();
				const h = harness(() =>
					w(Select, {
						getOptionValue: testProperties.getOptionValue,
						options: testOptions,
						useNativeElement: true,
						onChange
					})
				);
				h.trigger('select', 'onchange', { ...stubEvent, target: { value: 'one' } });
				assert.isTrue(
					onChange.calledWith(testOptions[0]),
					'onChange should be called with the first entry in the testOptions array'
				);
			},

			'onValidate called with correct value'() {
				const onValidate = sinon.stub();
				let value: string | undefined = undefined;
				const h = harness(() => (
					<Select
						getOptionValue={testProperties.getOptionValue}
						getOptionLabel={testProperties.getOptionLabel}
						options={testOptions}
						useNativeElement={true}
						onValidate={onValidate}
						value={value}
					/>
				));
				h.expect(baseNativeAssertion);
				h.trigger('select', 'onchange', { ...stubEvent, target: { value: 'one' } });
				value = 'one';
				h.expect(baseNativeAssertion.setProperty('~select', 'value', 'one'));
				assert.isTrue(
					onValidate.firstCall.calledWith(true),
					'onValidate should be called with true'
				);
				h.trigger('select', 'onchange', { ...stubEvent, target: { value: '' } });
				value = '';
				h.expect(baseNativeAssertion.setProperty('~select', 'value', ''));
				assert.equal(
					onValidate.callCount,
					1,
					'onValidate should not have been called a second time'
				);
			},

			'onValidate called with correct value on required select'() {
				const onValidate = sinon.stub();
				let value: string | undefined = undefined;
				const h = harness(() => (
					<Select
						getOptionValue={testProperties.getOptionValue}
						getOptionLabel={testProperties.getOptionLabel}
						options={testOptions}
						useNativeElement={true}
						onValidate={onValidate}
						value={value}
						required
					/>
				));
				let assertion = baseNativeAssertion
					.setProperty('~select', 'required', true)
					.setProperty(':root', 'classes', [
						css.root,
						null,
						null,
						null,
						null,
						null,
						css.required
					]);
				h.expect(assertion);
				h.trigger('select', 'onchange', { ...stubEvent, target: { value: 'one' } });
				value = 'one';
				h.expect(assertion.setProperty('~select', 'value', 'one'));
				assert.isTrue(
					onValidate.firstCall.calledWith(true),
					'onValidate should be called with true'
				);
				h.trigger('select', 'onchange', { ...stubEvent, target: { value: '' } });
				value = '';
				h.expect(assertion.setProperty('~select', 'value', ''));
				assert.isTrue(
					onValidate.secondCall.calledWith(false),
					'onValidate should be called with false'
				);
				assert.equal(
					onValidate.callCount,
					2,
					'onValidate should have been called two times'
				);
			},

			'onValidate called with correct value when required value changes'() {
				const onValidate = sinon.stub();
				let value: string | undefined = undefined;
				let required = false;
				const h = harness(() => (
					<Select
						getOptionValue={testProperties.getOptionValue}
						getOptionLabel={testProperties.getOptionLabel}
						options={testOptions}
						useNativeElement={true}
						onValidate={onValidate}
						value={value}
						required={required}
					/>
				));
				let assertion = baseNativeAssertion.setProperty('~select', 'required', false);
				h.expect(assertion);
				h.trigger('select', 'onchange', { ...stubEvent, target: { value: 'one' } });
				value = 'one';
				h.expect(assertion.setProperty('~select', 'value', 'one'));
				assert.isTrue(
					onValidate.firstCall.calledWith(true),
					'onValidate should be called with true'
				);
				h.trigger('select', 'onchange', { ...stubEvent, target: { value: '' } });
				value = '';
				assertion = assertion.setProperty('~select', 'value', '');
				h.expect(assertion);
				assert.equal(
					onValidate.callCount,
					1,
					'onValidate should not have been called a second time'
				);
				required = true;
				h.expect(
					assertion
						.setProperty('~select', 'required', true)
						.setProperty(':root', 'classes', [
							css.root,
							null,
							null,
							null,
							null,
							null,
							css.required
						])
				);
				assert.isTrue(
					onValidate.secondCall.calledWith(false),
					'onValidate should be called with false'
				);
				required = false;
				h.expect(assertion);
				assert.isTrue(
					onValidate.thirdCall.calledWith(true),
					'onValidate should be called with true'
				);
			},

			'events called with widget key'() {
				const onBlur = sinon.stub();
				const onFocus = sinon.stub();
				const onChange = sinon.stub();
				const h = harness(() =>
					w(Select, {
						key: 'foo',
						getOptionValue: testProperties.getOptionValue,
						useNativeElement: true,
						options: testOptions,
						onBlur,
						onFocus,
						onChange
					})
				);

				h.trigger('select', 'onblur', { target: { value: 'one' } });
				assert.isTrue(onBlur.calledWith('foo'), 'onBlur called with foo key');
				h.trigger('select', 'onfocus', { target: { value: 'one' } });
				assert.isTrue(onFocus.calledWith('foo'), 'onFocus called with foo key');
				h.trigger('select', 'onchange', { ...stubEvent, target: { value: 'one' } });
				assert.isTrue(
					onChange.calledWith(testOptions[0], 'foo'),
					'onChange called with foo key'
				);
			}
		},

		'Custom Single-select': {
			'default properties'() {
				const h = harness(() => w(Select, {}));
				h.expect(() => expected(expectedSingle()));
			},

			helperText() {
				const h = harness(() => w(Select, { helperText: 'foo' }));
				h.expect(() => expected(expectedSingle(), { helperText: 'foo' }));
			},

			'custom properties'() {
				const h = harness(() => w(Select, testStateProperties));
				h.expect(() =>
					expected(expectedSingle(true, true), {
						classes: [
							css.root,
							css.disabled,
							null,
							css.invalid,
							null,
							css.readonly,
							css.required
						]
					})
				);
			},

			placeholder() {
				let properties = {
					...testProperties,
					placeholder: 'foo'
				};
				const h = harness(() => w(Select, properties));
				h.expect(() => expected(expectedSingle(true)));
				properties = {
					...testProperties,
					getOptionSelected: () => false,
					placeholder: 'bar'
				};
				h.expect(() => expected(expectedSingle(true, false, false, 'bar')));
			},

			'open/close on trigger click'() {
				const h = harness(() => w(Select, testProperties));
				h.expect(() => expected(expectedSingle(true)));
				h.trigger('@trigger', 'onclick', stubEvent);
				h.expect(() => expected(expectedSingle(true, false, true, '')));
				h.trigger('@trigger', 'onclick', stubEvent);
				h.expect(() => expected(expectedSingle(true)));
			},

			'focus listbox on open'() {
				const h = harness(() => w(Select, testProperties), [compareListboxFocused]);
				h.trigger('@trigger', 'onclick', stubEvent);
				h.expect(() => expected(expectedSingle(true, false, true, '')));
			},

			'focus trigger on escape to close'() {
				const h = harness(() => w(Select, testProperties), [compareTriggerFocused]);
				h.trigger('@trigger', 'onclick', stubEvent);
				h.trigger(`.${css.dropdown}`, 'onkeydown', {
					which: Keys.Escape,
					...stubEvent
				});
				h.expect(() => expected(expectedSingle(true)));
			},

			'focus trigger when selecting an option and closing'() {
				const h = harness(
					() =>
						w(Select, {
							...testProperties,
							options: testOptions
						}),
					[compareTriggerFocused]
				);

				h.trigger('@trigger', 'onclick', stubEvent);
				h.trigger('@listbox', 'onOptionSelect', testOptions[1]);
				h.expect(() => expected(expectedSingle(true)));
			},

			'select options'() {
				const onChange = sinon.stub();

				const h = harness(() =>
					w(Select, {
						...testProperties,
						options: testOptions,
						onChange
					})
				);

				h.trigger('@trigger', 'onclick', stubEvent);
				h.expect(() => expected(expectedSingle(true, false, true, '')));
				h.trigger('@listbox', 'onOptionSelect', testOptions[2]);
				h.expect(() => expected(expectedSingle(true)));
				assert.isTrue(onChange.calledOnce, 'onChange handler called when option selected');

				// open widget a second time
				h.trigger('@trigger', 'onclick', stubEvent);
				h.expect(() => expected(expectedSingle(true, false, true, '')));
				h.trigger('@trigger', 'onmousedown');
				h.trigger(`.${css.dropdown}`, 'onfocusout');
				h.trigger('@trigger', 'onclick', stubEvent);
				h.expect(() => expected(expectedSingle(true)));
			},

			'default for getOptionSelected'() {
				let properties: SelectProperties = {
					...testProperties,
					getOptionSelected: undefined
				};
				const h = harness(() => w(Select, properties));
				h.expect(() => expected(expectedSingle(true)));

				const simpleOptions = ['one', 'two', 'three'];
				properties = {
					options: simpleOptions,
					value: 'two'
				};
				h.expect(() =>
					v(
						'div',
						{
							key: 'root',
							classes: [css.root, null, null, null, null, null, null]
						},
						[
							null,
							v(
								'div',
								{
									classes: [css.inputWrapper, null],
									key: 'wrapper'
								},
								[
									v(
										'button',
										{
											'aria-controls': '',
											'aria-expanded': 'false',
											'aria-haspopup': 'listbox',
											'aria-invalid': null,
											'aria-required': null,
											classes: [css.trigger, null],
											disabled: undefined,
											focus: noop,
											key: 'trigger',
											type: 'button',
											value: 'two',
											onblur: noop,
											onclick: noop,
											onfocus: noop,
											onkeydown: noop,
											onmousedown: noop
										},
										['two']
									),
									v('span', { classes: css.arrow }, [
										w(Icon, {
											type: 'downIcon',
											theme: undefined,
											classes: undefined
										})
									]),
									v(
										'div',
										{
											classes: css.dropdown,
											onfocusout: noop,
											onkeydown: noop
										},
										[
											w(Listbox, {
												activeIndex: 1,
												widgetId: '',
												focus: noop,
												key: 'listbox',
												optionData: simpleOptions,
												tabIndex: -1,
												getOptionDisabled: undefined,
												getOptionId: undefined,
												getOptionLabel: undefined,
												getOptionSelected: noop,
												onKeyDown: noop,
												theme: undefined,
												classes: undefined,
												onActiveIndexChange: noop,
												onOptionSelect: noop
											})
										]
									)
								]
							),
							w(HelperText, { theme: undefined, text: undefined })
						]
					)
				);
			},

			'change active option'() {
				const h = harness(() => w(Select, testProperties));
				h.expect(() => expected(expectedSingle(true)));
				h.trigger('@listbox', 'onActiveIndexChange', 2);
				h.expect(() => expected(expectedSingle(true, false, false, '', 2)));
			},

			'open/close with keyboard'() {
				const h = harness(() =>
					w(Select, {
						...testProperties,
						options: testOptions
					})
				);

				h.trigger('@trigger', 'onkeydown', {
					which: Keys.Down,
					...stubEvent
				});

				h.expect(() => expected(expectedSingle(true, false, true, '')));

				h.trigger(`.${css.dropdown}`, 'onkeydown', {
					which: Keys.Down,
					...stubEvent
				});

				h.expect(() => expected(expectedSingle(true, false, true, '')));

				h.trigger(`.${css.dropdown}`, 'onkeydown', {
					which: Keys.Escape,
					...stubEvent
				});

				h.expect(() => expected(expectedSingle(true)));

				h.trigger(`.${css.dropdown}`, 'onkeydown', {
					which: Keys.Down,
					...stubEvent
				});

				h.expect(() => expected(expectedSingle(true)));
			},

			'close on listbox blur'() {
				const onBlur = sinon.stub();
				const h = harness(() =>
					w(Select, {
						...testProperties,
						options: testOptions,
						onBlur
					})
				);
				h.trigger('@trigger', 'onclick', stubEvent);
				h.trigger('@trigger', 'onblur');
				h.expect(() => expected(expectedSingle(true, false, true, '')));

				h.trigger(`.${css.dropdown}`, 'onfocusout');
				h.expect(() => expected(expectedSingle(true)));
				assert.isTrue(
					onBlur.calledOnce,
					'onBlur callback should only be called once for last blur event'
				);
			},

			'close on trigger blur'() {
				const onBlur = sinon.stub();
				const h = harness(() =>
					w(Select, {
						...testProperties,
						options: testOptions,
						onBlur
					})
				);

				h.trigger('@trigger', 'onclick', stubEvent);
				h.trigger('@trigger', 'onblur');
				h.expect(() => expected(expectedSingle(true, false, true, '')));

				h.trigger('@trigger', 'onblur');
				h.expect(() => expected(expectedSingle(true)));
				assert.isTrue(
					onBlur.calledOnce,
					'onBlur callback should only be called once for last blur event'
				);
			},

			'events called with widget key'() {
				const onBlur = sinon.stub();
				const h = harness(() => w(Select, { key: 'foo', onBlur }));

				h.trigger('@trigger', 'onblur');
				assert.isTrue(onBlur.calledWith('foo'), 'Trigger blur event called with foo key');

				h.trigger('@trigger', 'onblur');
				h.trigger(`.${css.dropdown}`, 'onfocusout');
				assert.isTrue(
					onBlur.getCall(1).calledWith('foo'),
					'Dropdown blur event called with foo key'
				);
			},

			'select option with menu closed on input key'() {
				const h = harness(() =>
					w(Select, {
						...testProperties,
						options: testOptions
					})
				);

				h.trigger('@trigger', 'onkeydown', {
					...stubEvent,
					key: 'O'
				});

				h.expect(() => expected(expectedSingle(true, false, false, '', 0)));
			},

			'select option in menu based on input key'() {
				const h = harness(() =>
					w(Select, {
						...testProperties,
						options: testOptions
					})
				);

				h.trigger('@trigger', 'onkeydown', {
					...stubEvent,
					which: Keys.Down
				});

				h.trigger('@listbox', 'onKeyDown', {
					...stubEvent,
					key: 'O'
				});

				h.trigger('@trigger', 'onkeydown', {
					...stubEvent,
					which: Keys.Enter
				});

				h.expect(() => expected(expectedSingle(true, false, true, '', 0)));
			},

			'select option in menu based on multiple input keys'() {
				const h = harness(() =>
					w(Select, {
						...testProperties,
						options: testOptions
					})
				);

				h.trigger('@trigger', 'onkeydown', {
					...stubEvent,
					which: Keys.Down
				});

				h.trigger('@listbox', 'onKeyDown', {
					...stubEvent,
					key: 'T'
				});

				h.trigger('@listbox', 'onKeyDown', {
					...stubEvent,
					key: 'h'
				});

				h.trigger('@trigger', 'onkeydown', {
					...stubEvent,
					which: Keys.Enter
				});

				h.expect(() => expected(expectedSingle(true, false, true, '', 2)));
			},

			'does not select disabled options based on input key'() {
				const h = harness(() =>
					w(Select, {
						...testProperties,
						options: testOptions
					})
				);

				h.trigger('@trigger', 'onkeydown', {
					...stubEvent,
					key: 'f'
				});

				h.trigger('@trigger', 'onkeydown', {
					...stubEvent,
					key: 'o'
				});

				h.expect(() => expected(expectedSingle(true, false, false, '', 1)));
			}
		}
	}
});
