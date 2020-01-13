const { describe, it, afterEach } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

import * as sinon from 'sinon';

import { tsx, create } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import { harness } from '@dojo/framework/testing/harness';
import select from '@dojo/framework/testing/support/selector';
import focus from '@dojo/framework/core/middleware/focus';

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

function createFocusMock({
	shouldFocus = false,
	focused = false,
	isFocused = false,
	focus = () => {}
} = {}) {
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
			<div classes={css.root}>
				<input type="hidden" name="dateInput" value={formatDateISO(date || today)} />
				<TriggerPopup key="popup">
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
				type="text"
				onBlur={noop}
				onValue={noop}
				trailing={() => undefined}
				value={formatDate(today)}
				helperText=""
				onKeyDown={noop}
			/>
		</div>
	);
});

const calendarTemplate = assertionTemplate(() => {
	return (
		<div classes={css.popup} focus={() => false}>
			<Calendar
				key="calendar"
				maxDate={undefined}
				minDate={undefined}
				month={today.getMonth()}
				onDateSelect={noop}
				onMonthChange={noop}
				onYearChange={noop}
				selectedDate={today}
				year={today.getFullYear()}
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
			select('@input', triggerResult)[0].properties.trailing()
		);
		dateIcon.properties.onclick();
		h.expect(baseTemplate());

		// If `toggleOpen` is called, the popup content (i.e., the calendar) is shown
		sinon.assert.calledOnce(toggleOpen);
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
		calendar.properties.onDateSelect(expected);

		// Find the input; it should contain the new value
		h.expect(baseTemplate(expected));
		const [input] = select(
			'@input',
			h.trigger('@popup', (node) => (node.children as any)[0].trigger)
		);
		assert(input.properties.value, formatDate(expected));

		// If `onValue` is called, the input was accepted & validated
		sinon.assert.calledWith(onValue, formatDateISO(expected));

		// The calendar popup should be closed after a selection
		sinon.assert.calledOnce(onClose);
	});

	it('validates date input', () => {
		const h = harness(() => <DateInput name="dateInput" onValue={onValue} />);

		const triggerResult = h.trigger(
			'@popup',
			(node) => (node.children as any)[0].trigger,
			noop
		);

		// Find the input widget and give it a bad value
		let [input] = select('@input', triggerResult);
		onValue.resetHistory();
		input.properties.onValue('foobar');
		input.properties.onBlur();
		h.expect(baseTemplate());

		// With invalid input, `onValue` should not have been called & message should be displayed
		sinon.assert.notCalled(onValue);
		[input] = select(
			'@input',
			h.trigger('@popup', (node) => (node.children as any)[0].trigger, noop)
		);
		assert.equal(input.properties.helperText, messages.invalidDate);
	});

	it('validates manual date entry range', () => {
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
			/>
		));

		const triggerResult = h.trigger(
			'@popup',
			(node) => (node.children as any)[0].trigger,
			noop
		);

		// Find the input widget and give it a value before the min date
		let [input] = select('@input', triggerResult);
		onValue.resetHistory();
		input.properties.onValue(formatDate(tooEarly));
		input.properties.onBlur();
		h.expect(baseTemplate(initialValue));

		// With invalud input, `onValue` should not have been called & message should be displayed
		sinon.assert.notCalled(onValue);
		[input] = select(
			'@input',
			h.trigger('@popup', (node) => (node.children as any)[0].trigger, noop)
		);
		assert.equal(input.properties.helperText, messages.tooEarly);

		// Set value after the max date
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
	});

	it('validates range inputs', () => {
		const max = new Date(2019, 11, 1); // Dec 1, 2019
		const min = new Date(2019, 11, 31); // Dec 31, 2019; notice min is AFTER max
		const h = harness(() => (
			<DateInput
				name="dateInput"
				onValue={onValue}
				max={formatDateISO(max)}
				min={formatDateISO(min)}
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
	});
});
