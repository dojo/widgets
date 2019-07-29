const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import * as sinon from 'sinon';

import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import { w, tsx } from '@dojo/framework/core/vdom';
import Focus from '@dojo/framework/core/meta/Focus';
import { Keys } from '../../../common/util';

import Icon from '../../../icon/index';
import Select, { SelectProperties } from '../../index';
import Listbox from '../../../listbox/index';
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
		<div assertion-key="wrapper" classes={css.inputWrapper}>
			{nativeSelect()}
		</div>
		<HelperText assertion-key="helperText" theme={undefined} text={undefined} valid={true} />
	</div>
));

const nativeSelect = (extraSelectProperties: { 'aria-describedby'?: string } = {}) => {
	return [
		<select
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
			{...extraSelectProperties}
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
		</select>,
		<span classes={css.arrow}>
			<Icon type="downIcon" theme={undefined} classes={undefined} />
		</span>
	];
};

const baseCustomAssertion = assertionTemplate(() => (
	<div key="root" classes={[css.root, null, null, null, null, null, null]}>
		<div key="wrapper" classes={[css.inputWrapper, null]}>
			{customSelect({ 'aria-describedby': 'foo' })}
		</div>
		<HelperText assertion-key="helperText" theme={undefined} text={undefined} valid={true} />
	</div>
));

const emptyCustomAssertion = baseCustomAssertion
	.setChildren('@wrapper', () => customSelect())
	.setProperty('@listbox', 'optionData', [])
	.setProperty('@listbox', 'activeIndex', 0)
	.setProperty('@listbox', 'getOptionDisabled', undefined)
	.setProperty('@listbox', 'getOptionId', undefined)
	.setProperty('@listbox', 'getOptionLabel', undefined)
	.setProperty('@trigger', 'value', undefined)
	.setProperty('@trigger', 'classes', [css.trigger, css.placeholder])
	.setChildren('@trigger', () => []);

const customSelect = (extraButtonProperties: { 'aria-describedby'?: string } = {}) => {
	return [
		<button
			aria-controls=""
			aria-expanded="false"
			aria-haspopup="listbox"
			aria-invalid={null}
			aria-required={null}
			classes={[css.trigger, null]}
			disabled={undefined}
			focus={noop}
			key="trigger"
			type="button"
			value="two"
			onblur={noop}
			onclick={noop}
			onfocus={noop}
			onkeydown={noop}
			onmousedown={noop}
			{...extraButtonProperties}
		>
			Two
		</button>,
		<span classes={css.arrow}>
			<Icon type="downIcon" theme={undefined} classes={undefined} />
		</span>,
		<div classes={css.dropdown} onfocusout={noop} onkeydown={noop}>
			<Listbox
				activeIndex={1}
				focus={noop}
				widgetId=""
				key="listbox"
				optionData={testOptions}
				tabIndex={-1}
				getOptionDisabled={noop}
				getOptionId={noop}
				getOptionLabel={noop}
				onKeyDown={noop}
				getOptionSelected={noop}
				theme={undefined}
				classes={undefined}
				onActiveIndexChange={noop}
				onOptionSelect={noop}
			/>
		</div>
	];
};

const baseCustomOpenAssertion = baseCustomAssertion
	.setProperty('@wrapper', 'classes', [css.inputWrapper, css.open])
	.setProperty('@trigger', 'aria-expanded', 'true')
	.setProperty('@listbox', 'tabIndex', 0);

registerSuite('Select', {
	tests: {
		'Native Single Select': {
			'default properties'() {
				const h = harness(() =>
					w(Select, {
						useNativeElement: true
					})
				);
				h.expect(baseNativeAssertion.setChildren('select', () => []));
			},

			helperText() {
				const h = harness(() =>
					w(Select, {
						useNativeElement: true,
						helperText: 'foo'
					})
				);
				h.expect(
					baseNativeAssertion
						.setChildren('select', () => [])
						.setProperty('~helperText', 'text', 'foo')
				);
			},

			'custom properties'() {
				const h = harness(() =>
					w(Select, {
						...testStateProperties,
						useNativeElement: true
					})
				);
				h.expect(
					baseNativeAssertion
						.setChildren('~wrapper', () => nativeSelect({ 'aria-describedby': 'foo' }))
						.setChildren('select', () => [
							<option
								value={testOptions[0].value}
								id="one"
								disabled={false}
								selected={false}
							>
								{testOptions[0].label}
							</option>,
							<option
								value={testOptions[1].value}
								id="two"
								disabled={false}
								selected={true}
							>
								{testOptions[1].label}
							</option>,
							<option
								value={testOptions[2].value}
								id="three"
								disabled={false}
								selected={false}
							>
								{testOptions[2].label}
							</option>,
							<option
								value={testOptions[3].value}
								id="four"
								disabled={true}
								selected={false}
							>
								{testOptions[3].label}
							</option>
						])
						.setProperty('select', 'aria-invalid', 'true')
						.setProperty('select', 'aria-readonly', 'true')
						.setProperty('select', 'disabled', true)
						.setProperty('select', 'readOnly', true)
						.setProperty('select', 'required', true)
						.setProperty('select', 'value', 'two')
						.setProperty('select', 'name', 'foo')
						.setProperty('~helperText', 'valid', false)
						.setProperty(':root', 'classes', [
							css.root,
							css.disabled,
							null,
							css.invalid,
							null,
							css.readonly,
							css.required
						])
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
						options: [],
						useNativeElement: true
					})
				);
				h.expect(
					baseNativeAssertion
						.setProperty(':root', 'classes', [
							css.root,
							null,
							css.focused,
							null,
							null,
							null,
							null
						])
						.setChildren('select', () => [])
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
				h.expect(baseNativeAssertion.setProperty('select', 'value', 'one'));
				assert.isTrue(
					onValidate.firstCall.calledWith(true),
					'onValidate should be called with true'
				);
				h.trigger('select', 'onchange', { ...stubEvent, target: { value: '' } });
				value = '';
				h.expect(baseNativeAssertion.setProperty('select', 'value', ''));
				assert.equal(
					onValidate.callCount,
					1,
					'onValidate should not have been called a second time'
				);
			},

			'onValidate called with correct value on required select'() {
				const onValidate = sinon.stub();
				let value: string | undefined = undefined;
				let invalid = false;
				const h = harness(() => (
					<Select
						getOptionValue={testProperties.getOptionValue}
						getOptionLabel={testProperties.getOptionLabel}
						options={testOptions}
						useNativeElement={true}
						onValidate={onValidate}
						value={value}
						required
						invalid={invalid}
					/>
				));
				let assertion = baseNativeAssertion
					.setProperty('select', 'required', true)
					.setProperty(':root', 'classes', [
						css.root,
						null,
						null,
						null,
						css.valid,
						null,
						css.required
					]);
				h.expect(assertion);
				h.trigger('select', 'onchange', { ...stubEvent, target: { value: 'one' } });
				value = 'one';
				h.expect(assertion.setProperty('select', 'value', 'one'));
				assert.isTrue(
					onValidate.firstCall.calledWith(true),
					'onValidate should be called with true'
				);
				h.trigger('select', 'onchange', { ...stubEvent, target: { value: '' } });
				value = '';
				invalid = true;
				h.expect(
					assertion
						.setProperty('select', 'value', '')
						.setProperty(':root', 'classes', [
							css.root,
							null,
							null,
							css.invalid,
							null,
							null,
							css.required
						])
						.setProperty('select', 'aria-invalid', 'true')
						.setProperty('~helperText', 'valid', false)
				);
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
				let invalid = false;
				const h = harness(() => (
					<Select
						getOptionValue={testProperties.getOptionValue}
						getOptionLabel={testProperties.getOptionLabel}
						options={testOptions}
						useNativeElement={true}
						onValidate={onValidate}
						value={value}
						required={required}
						invalid={invalid}
					/>
				));
				let assertion = baseNativeAssertion
					.setProperty(':root', 'classes', [
						css.root,
						null,
						null,
						null,
						css.valid,
						null,
						null
					])
					.setProperty('select', 'required', false);
				h.expect(assertion);
				h.trigger('select', 'onchange', { ...stubEvent, target: { value: 'one' } });
				value = 'one';
				h.expect(assertion.setProperty('select', 'value', 'one'));
				assert.isTrue(
					onValidate.firstCall.calledWith(true),
					'onValidate should be called with true'
				);
				h.trigger('select', 'onchange', { ...stubEvent, target: { value: '' } });
				value = '';
				assertion = assertion.setProperty('select', 'value', '');
				h.expect(assertion);
				assert.equal(
					onValidate.callCount,
					1,
					'onValidate should not have been called a second time'
				);

				required = true;
				h.expect(
					assertion
						.setProperty('select', 'required', true)
						.setProperty(':root', 'classes', [
							css.root,
							null,
							null,
							null,
							css.valid,
							null,
							css.required
						])
				);
				assert.isTrue(
					onValidate.secondCall.calledWith(false),
					'onValidate should be called with false'
				);

				invalid = true;
				h.expect(
					assertion
						.setProperty('select', 'required', true)
						.setProperty(':root', 'classes', [
							css.root,
							null,
							null,
							css.invalid,
							null,
							null,
							css.required
						])
						.setProperty('select', 'aria-invalid', 'true')
						.setProperty('~helperText', 'valid', false)
				);

				required = false;
				h.expect(
					assertion
						.setProperty(':root', 'classes', [
							css.root,
							null,
							null,
							css.invalid,
							null,
							null,
							null
						])
						.setProperty('select', 'aria-invalid', 'true')
						.setProperty('~helperText', 'valid', false)
				);
				assert.isTrue(
					onValidate.thirdCall.calledWith(true),
					'onValidate should be called with true'
				);

				invalid = false;
				h.expect(assertion);
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
				h.expect(emptyCustomAssertion);
			},

			helperText() {
				const h = harness(() => w(Select, { helperText: 'foo' }));
				h.expect(emptyCustomAssertion.setProperty('~helperText', 'text', 'foo'));
			},

			'custom properties'() {
				const h = harness(() => w(Select, testStateProperties));
				h.expect(
					baseCustomAssertion
						.setProperty(':root', 'classes', [
							css.root,
							css.disabled,
							null,
							css.invalid,
							null,
							css.readonly,
							css.required
						])
						.setProperty('~helperText', 'valid', false)
						.setProperty('@trigger', 'disabled', true)
						.setProperty('@trigger', 'aria-invalid', 'true')
						.setProperty('@trigger', 'aria-required', 'true')
				);
			},

			placeholder() {
				let properties = {
					...testProperties,
					placeholder: 'foo'
				};
				const h = harness(() => w(Select, properties));
				h.expect(baseCustomAssertion);
				properties = {
					...testProperties,
					getOptionSelected: () => false,
					placeholder: 'bar'
				};
				h.expect(
					baseCustomAssertion
						.setProperty('@trigger', 'classes', [css.trigger, css.placeholder])
						.setChildren('@trigger', () => ['bar'])
				);
			},

			'open/close on trigger click'() {
				const h = harness(() => w(Select, testProperties));
				h.expect(baseCustomAssertion.setProperty('~helperText', 'valid', true));
				h.trigger('@trigger', 'onclick', stubEvent);
				h.expect(baseCustomOpenAssertion);
				h.trigger('@trigger', 'onclick', stubEvent);
				h.expect(baseCustomAssertion);
			},

			'focus listbox on open'() {
				const h = harness(() => w(Select, testProperties), [compareListboxFocused]);
				h.trigger('@trigger', 'onclick', stubEvent);
				h.expect(baseCustomOpenAssertion);
			},

			'focus trigger on escape to close'() {
				const h = harness(() => w(Select, testProperties), [compareTriggerFocused]);
				h.trigger('@trigger', 'onclick', stubEvent);
				h.trigger(`.${css.dropdown}`, 'onkeydown', {
					which: Keys.Escape,
					...stubEvent
				});
				h.expect(baseCustomAssertion);
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
				h.expect(baseCustomAssertion);
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
				h.expect(baseCustomOpenAssertion);
				h.trigger('@listbox', 'onOptionSelect', testOptions[2]);
				h.expect(baseCustomAssertion);
				assert.isTrue(onChange.calledOnce, 'onChange handler called when option selected');

				// open widget a second time
				h.trigger('@trigger', 'onclick', stubEvent);
				h.expect(baseCustomOpenAssertion);
				h.trigger('@trigger', 'onmousedown');
				h.trigger(`.${css.dropdown}`, 'onfocusout');
				h.trigger('@trigger', 'onclick', stubEvent);
				h.expect(baseCustomAssertion);
			},

			'default for getOptionSelected'() {
				let properties: SelectProperties = {
					...testProperties,
					getOptionSelected: undefined
				};
				const h = harness(() => w(Select, properties));
				h.expect(baseCustomAssertion);

				const simpleOptions = ['one', 'two', 'three'];
				properties = {
					options: simpleOptions,
					value: 'two'
				};
				h.expect(
					baseCustomAssertion
						.setChildren('@wrapper', () => customSelect())
						.setProperty('@listbox', 'optionData', simpleOptions)
						.setProperty('@listbox', 'getOptionDisabled', undefined)
						.setProperty('@listbox', 'getOptionId', undefined)
						.setProperty('@listbox', 'getOptionLabel', undefined)
						.setChildren('@trigger', () => ['two'])
				);
			},

			'change active option'() {
				const h = harness(() => w(Select, testProperties));
				h.expect(baseCustomAssertion);
				h.trigger('@listbox', 'onActiveIndexChange', 2);
				h.expect(baseCustomAssertion.setProperty('@listbox', 'activeIndex', 2));
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

				h.expect(baseCustomOpenAssertion);

				h.trigger(`.${css.dropdown}`, 'onkeydown', {
					which: Keys.Down,
					...stubEvent
				});

				h.expect(baseCustomOpenAssertion);

				h.trigger(`.${css.dropdown}`, 'onkeydown', {
					which: Keys.Escape,
					...stubEvent
				});

				h.expect(baseCustomAssertion);

				h.trigger(`.${css.dropdown}`, 'onkeydown', {
					which: Keys.Down,
					...stubEvent
				});

				h.expect(baseCustomAssertion);
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
				h.expect(baseCustomOpenAssertion);

				h.trigger(`.${css.dropdown}`, 'onfocusout');
				h.expect(baseCustomAssertion);
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
				h.expect(baseCustomOpenAssertion);

				h.trigger('@trigger', 'onblur');
				h.expect(baseCustomAssertion);
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

				h.expect(baseCustomAssertion.setProperty('@listbox', 'activeIndex', 0));
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

				h.expect(baseCustomOpenAssertion.setProperty('@listbox', 'activeIndex', 0));
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

				h.expect(baseCustomOpenAssertion.setProperty('@listbox', 'activeIndex', 2));
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

				h.expect(baseCustomAssertion.setProperty('@listbox', 'activeIndex', 1));
			}
		}
	}
});
