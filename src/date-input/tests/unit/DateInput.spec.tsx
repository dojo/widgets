import { RenderResult, WNode, DefaultMiddlewareResult } from '@dojo/framework/core/interfaces';

const { describe, it, afterEach } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

import * as sinon from 'sinon';

import { tsx, create } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import select from '@dojo/framework/testing/harness/support/selector';
import focus from '@dojo/framework/core/middleware/focus';

import { compareTheme, createHarness, stubEvent } from '../../../common/tests/support/test-helpers';
import { Keys } from '../../../common/util';
import Calendar from '../../../calendar';
import TriggerPopup from '../../../trigger-popup';
import TextInput from '../../../text-input';

import DateInput from '../../index';
import { formatDate, formatDateISO } from '../../date-utils';
import bundle from '../../nls/DateInput';
import * as css from '../../../theme/default/date-input.m.css';

const { messages } = bundle;
const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const noop = () => {};
const harness = createHarness([compareTheme]);

function createFocusMock({
	shouldFocus = false,
	focused = false,
	isFocused = false,
	focus = () => {}
} = {}): () => DefaultMiddlewareResult {
	const factory = create();
	return () =>
		factory(() => ({
			shouldFocus: () => shouldFocus,
			focused: () => focused,
			isFocused: () => isFocused,
			focus
		}))();
}

const baseTemplate = (date?: Date) =>
	assertionTemplate(() => {
		return (
			<div classes={[undefined, css.root]}>
				<input
					assertion-key="input"
					type="hidden"
					name="dateInput"
					value={formatDateISO(date || today)}
					aria-hidden="true"
				/>
				<TriggerPopup variant={undefined} classes={undefined} theme={undefined} key="popup">
					{{
						trigger: () => <button />,
						content: () => <div />
					}}
				</TriggerPopup>
			</div>
		);
	});

const buttonTemplate = assertionTemplate(() => {
	return (
		<div classes={css.input}>
			<TextInput
				key="input"
				focus={() => false}
				theme={{}}
				type="text"
				onBlur={noop}
				onValue={noop}
				initialValue={formatDate(today)}
				helperText=""
				onKeyDown={noop}
				variant={undefined}
				classes={undefined}
			>
				{{ trailing: undefined }}
			</TextInput>
		</div>
	);
});

const calendarTemplate = assertionTemplate(() => {
	return (
		<div classes={css.popup}>
			<Calendar
				key="calendar"
				focus={() => false}
				maxDate={undefined}
				minDate={undefined}
				onValue={noop}
				initialValue={today}
				theme={undefined}
				variant={undefined}
				classes={undefined}
			/>
		</div>
	);
});

describe('DateInput', () => {
	const onValue = sinon.stub();

	afterEach(() => {
		onValue.resetHistory();
	});

	it('renders with default date', () => {
		const h = harness(() => <DateInput name="dateInput" onValue={onValue} />);
		h.expect(baseTemplate());
		sinon.assert.calledWith(onValue, formatDateISO(today));
	});

	it('renders with default date when provided an invalid initial date', () => {
		const h = harness(() => (
			<DateInput name="dateInput" initialValue="not a date" onValue={onValue} />
		));
		h.expect(baseTemplate());
	});

	it('does not render a default date when value is provided and invalid', () => {
		const h = harness(() => (
			<DateInput name="dateInput" value="not a date" onValue={onValue} />
		));
		h.expect(baseTemplate().setProperty('@input', 'value', ''));
		sinon.assert.calledWith(onValue, formatDateISO(today));
	});

	it('renders with initial value', () => {
		const initialValue = new Date(2019, 11, 4);
		const h = harness(() => (
			<DateInput
				name="dateInput"
				onValue={onValue}
				initialValue={formatDateISO(initialValue)}
			/>
		));
		h.expect(baseTemplate(initialValue));
	});

	it('shows calendar when triggered via icon', () => {
		const h = harness(() => <DateInput name="dateInput" />);

		// Execute render-prop to show "trigger" content
		const toggleOpen = sinon.stub();
		const triggerResult = h.trigger(
			'@popup',
			(node) => (node.children as any)[0].trigger,
			toggleOpen
		);
		h.expect(buttonTemplate, () => triggerResult);

		// Find the date icon & `click` it
		const [dateIcon] = select(
			'@dateIcon',
			(select('@input', triggerResult)[0].children![0] as any).trailing
		);
		dateIcon.properties.onclick(stubEvent);
		h.expect(baseTemplate());

		// If `toggleOpen` is called, the popup content (i.e., the calendar) is shown
		sinon.assert.calledOnce(toggleOpen);
	});

	it('renders with a label as the only child', () => {
		const h = harness(() => <DateInput name="dateInput">Label</DateInput>);

		// Execute render-prop to show "trigger" content
		const triggerResult = h.trigger(
			'@popup',
			(node) => (node.children as any)[0].trigger,
			() => {}
		);
		h.expect(buttonTemplate, () => triggerResult);
		assert.equal(
			h.trigger('@popup', (node) => () =>
				(node.children as any)[0].trigger().children[0].children[0].label
			),
			'Label'
		);
	});

	it('renders with a named label child', () => {
		const h = harness(() => <DateInput name="dateInput">{{ label: 'Label' }}</DateInput>);

		// Execute render-prop to show "trigger" content
		const triggerResult = h.trigger(
			'@popup',
			(node) => (node.children as any)[0].trigger,
			() => {}
		);
		h.expect(buttonTemplate, () => triggerResult);
		assert.equal(
			h.trigger('@popup', (node) => () =>
				(node.children as any)[0].trigger().children[0].children[0].label
			),
			'Label'
		);
	});

	it('label interface edge case', () => {
		type WeirdNode = WNode & { label: RenderResult };

		function makeWeirdNode(): WeirdNode {
			const node = <div>The label</div>;
			(node as WeirdNode).label = 'Not the label';

			return node as WeirdNode;
		}
		const myWeirdNode: WeirdNode = makeWeirdNode();
		const h = harness(() => <DateInput name="dateInput">{myWeirdNode}</DateInput>);

		// Execute render-prop to show "trigger" content
		const triggerResult = h.trigger(
			'@popup',
			(node) => (node.children as any)[0].trigger,
			() => {}
		);
		h.expect(buttonTemplate, () => triggerResult);
		assert.equal(
			h.trigger('@popup', (node) => () =>
				(node.children as any)[0].trigger().children[0].children[0].label.children[0]
			),
			'The label'
		);
	});

	it('shows calendar when triggered via keyboard', () => {
		const h = harness(() => <DateInput name="dateInput" />);

		// Execute render-prop to show "trigger" content
		const toggleOpen = sinon.stub();
		const triggerResult = h.trigger(
			'@popup',
			(node) => (node.children as any)[0].trigger,
			toggleOpen
		);
		h.expect(buttonTemplate, () => triggerResult);

		// Find the input and simulate "enter"
		const [input] = select('@input', triggerResult);
		input.properties.onKeyDown(Keys.Enter);

		// If `toggleOpen` is called, the popup content (i.e., the calendar) is shown
		sinon.assert.calledOnce(toggleOpen);
	});

	it('focus popup content on trigger', () => {
		const focusStub = sinon.stub();
		const focusMock = createFocusMock({
			focus: focusStub
		});
		const h = harness(() => <DateInput name="dateInput" />, {
			middleware: [[focus, focusMock]]
		});
		h.expect(baseTemplate());

		// Trigger popup content
		const triggerResult = h.trigger(
			'@popup',
			(node) => (node.children as any)[0].trigger,
			noop
		);
		select('@input', triggerResult)[0].properties.onKeyDown(Keys.Enter);

		sinon.assert.calledOnce(focusStub);
	});

	it('allows manual date entry', () => {
		const expected = new Date(2019, 11, 19); // Dec 19, 2019
		const h = harness(() => <DateInput name="dateInput" onValue={onValue} />);

		const toggleOpen = sinon.stub();
		const triggerResult = h.trigger(
			'@popup',
			(node) => (node.children as any)[0].trigger,
			toggleOpen
		);
		h.expect(buttonTemplate, () => triggerResult);

		// Find the input widget and trigger it's value changed
		const [input] = select('@input', triggerResult);
		onValue.resetHistory();
		input.properties.onValue(formatDate(expected));

		h.expect(baseTemplate());
		sinon.assert.notCalled(onValue); // onValue not called until validated; validation delayed for manual input until blur

		// If `onValue` is called, the input was accepted & validated
		input.properties.onBlur();
		h.expect(baseTemplate(expected));
		sinon.assert.calledWith(onValue, formatDateISO(expected));

		// The icon wasn't clicked; the calendar should NOT have been shown
		sinon.assert.notCalled(toggleOpen);
	});

	it('allows date picker entry', () => {
		const expected = new Date(2019, 11, 19); // Dec 19, 2019
		const h = harness(() => <DateInput name="dateInput" onValue={onValue} />);
		h.expect(baseTemplate());

		const onClose = sinon.stub();
		const contentResult = h.trigger(
			'@popup',
			(node) => (node.children as any)[0].content,
			onClose
		);
		h.expect(calendarTemplate, () => contentResult);

		// Find the calendar widget and trigger a date selected
		const [calendar] = select('@calendar', contentResult);
		onValue.resetHistory();
		calendar.properties.onValue(expected);

		// Find the input; it should contain the new value
		h.expect(baseTemplate(expected));
		const [input] = select(
			'@input',
			h.trigger('@popup', (node) => (node.children as any)[0].trigger)
		);
		assert(input.properties.initialValue, formatDate(expected));

		// If `onValue` is called, the input was accepted & validated
		sinon.assert.calledWith(onValue, formatDateISO(expected));

		// The calendar popup should be closed after a selection
		sinon.assert.calledOnce(onClose);
	});

	it('ignores internal value changes when controlled', () => {
		const expected = new Date(2019, 11, 19); // Dec 19, 2019
		const newDate = new Date(2018, 11, 19);
		const h = harness(() => (
			<DateInput value={formatDateISO(expected)} name="dateInput" onValue={onValue} />
		));
		h.expect(baseTemplate(expected));

		const onClose = sinon.stub();
		const contentResult = h.trigger(
			'@popup',
			(node) => (node.children as any)[0].content,
			onClose
		);
		h.expect(
			calendarTemplate.setProperty('@calendar', 'initialValue', expected),
			() => contentResult
		);

		// Find the calendar widget and trigger a date selected
		const [calendar] = select('@calendar', contentResult);
		onValue.resetHistory();
		calendar.properties.onValue(newDate);

		// Find the input; it should contain the old value
		h.expect(baseTemplate(expected));
		const [input] = select(
			'@input',
			h.trigger('@popup', (node) => (node.children as any)[0].trigger)
		);
		assert(input.properties.initialValue, formatDate(expected));

		// If `onValue` is called, the input was accepted & validated
		sinon.assert.calledWith(onValue, formatDateISO(newDate));

		// The calendar popup should be closed after a selection
		sinon.assert.calledOnce(onClose);
	});

	it('validates date input', () => {
		const onValidate = sinon.stub();
		const h = harness(() => (
			<DateInput name="dateInput" onValue={onValue} onValidate={onValidate} />
		));

		const triggerResult = h.trigger(
			'@popup',
			(node) => (node.children as any)[0].trigger,
			noop
		);
		sinon.assert.calledWith(onValidate, true, '');

		// Find the input widget and give it a bad value
		let [input] = select('@input', triggerResult);
		onValidate.resetHistory();
		onValue.resetHistory();
		input.properties.onValue('foobar');
		input.properties.onBlur();
		h.expect(baseTemplate());

		// With invalid input, `onValue` should not have been called & message should be displayed
		sinon.assert.notCalled(onValue);
		sinon.assert.calledWith(onValidate, false, messages.invalidDate);
		[input] = select(
			'@input',
			h.trigger('@popup', (node) => (node.children as any)[0].trigger, noop)
		);
		assert.equal(input.properties.helperText, messages.invalidDate);
	});

	it('validates manual date entry range', () => {
		const onValidate = sinon.stub();
		const tooEarly = new Date(2019, 10, 11); // Nov 11, 2019
		const tooLate = new Date(2020, 0, 22); // Jan 22, 2020
		const initialValue = new Date(2019, 11, 15); // Dec 15, 2019
		const max = new Date(2019, 11, 31); // Dec 31, 2019
		const min = new Date(2019, 11, 1); // Dec 1, 2019
		const h = harness(() => (
			<DateInput
				name="dateInput"
				onValue={onValue}
				max={formatDateISO(max)}
				min={formatDateISO(min)}
				initialValue={formatDateISO(initialValue)}
				onValidate={onValidate}
			/>
		));

		const triggerResult = h.trigger(
			'@popup',
			(node) => (node.children as any)[0].trigger,
			noop
		);
		sinon.assert.calledWith(onValidate, true, '');

		// Find the input widget and give it a value before the min date
		onValidate.resetHistory();
		let [input] = select('@input', triggerResult);
		onValue.resetHistory();
		input.properties.onValue(formatDate(tooEarly));
		input.properties.onBlur();
		h.expect(baseTemplate(initialValue));

		// With invalud input, `onValue` should not have been called & message should be displayed
		sinon.assert.calledWith(onValidate, false, messages.tooEarly);
		sinon.assert.notCalled(onValue);
		[input] = select(
			'@input',
			h.trigger('@popup', (node) => (node.children as any)[0].trigger, noop)
		);
		assert.equal(input.properties.helperText, messages.tooEarly);

		// Set value after the max date
		onValidate.resetHistory();
		onValue.resetHistory();
		input.properties.onValue(formatDate(tooLate));
		input.properties.onBlur();
		h.expect(baseTemplate(initialValue));

		// With invalud input, `onValue` should not have been called & message should be displayed
		[input] = select(
			'@input',
			h.trigger('@popup', (node) => (node.children as any)[0].trigger, noop)
		);
		assert.equal(input.properties.helperText, messages.tooLate);
		sinon.assert.calledWith(onValidate, false, messages.tooLate);
	});

	it('validates range inputs', () => {
		const onValidate = sinon.stub();
		const max = new Date(2019, 11, 1); // Dec 1, 2019
		const min = new Date(2019, 11, 31); // Dec 31, 2019; notice min is AFTER max
		const h = harness(() => (
			<DateInput
				name="dateInput"
				onValue={onValue}
				max={formatDateISO(max)}
				min={formatDateISO(min)}
				onValidate={onValidate}
			/>
		));

		const triggerResult = h.trigger(
			'@popup',
			(node) => (node.children as any)[0].trigger,
			noop
		);
		h.expect(
			buttonTemplate.setProperty('@input', 'helperText', messages.invalidProps),
			() => triggerResult
		);
		sinon.assert.calledWith(onValidate, false, messages.invalidProps);
	});
});
