const { describe, it, afterEach } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

import * as sinon from 'sinon';

import { tsx } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import { harness } from '@dojo/framework/testing/harness';
import select from '@dojo/framework/testing/support/selector';

import Calendar from '../../../calendar';
import Popup from '../../../popup';
import TextInput from '../../../text-input';

import DateInput from '../../index';
import bundle from '../../nls/DateInput';
import * as css from '../../../theme/default/date-input.m.css';

const { messages } = bundle;
const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const noop = () => {};

function formatDate(date: Date) {
	return Intl.DateTimeFormat().format(date);
}

const baseTemplate = assertionTemplate(() => {
	return (
		<div classes={css.root}>
			<Popup key="popup">
				{{
					trigger: () => <button />,
					content: () => <div />
				}}
			</Popup>
		</div>
	);
});

const buttonTemplate = assertionTemplate(() => {
	return (
		<div classes={css.input}>
			<TextInput
				key="input"
				type="text"
				onBlur={noop}
				onValue={noop}
				trailing={() => undefined}
				value={formatDate(today)}
				helperText=""
			/>
		</div>
	);
});

const calendarTemplate = assertionTemplate(() => {
	return (
		<div classes={css.popup}>
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
		const h = harness(() => <DateInput onValue={onValue} />);
		h.expect(baseTemplate);
		sinon.assert.calledWith(onValue, today);
	});

	it('shows calendar when triggered via icon', () => {
		const h = harness(() => <DateInput />);

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

		// If `toggleOpen` is called, the popup content (i.e., the calendar) is shown
		sinon.assert.calledOnce(toggleOpen);
	});

	it('allows manual date entry', () => {
		const expected = new Date('12/19/2019');
		const h = harness(() => <DateInput onValue={onValue} />);

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
		sinon.assert.notCalled(onValue); // onValue not called until validated; validation delayed for manual input until blur

		// If `onValue` is called, the input was accepted & validated
		input.properties.onBlur();
		sinon.assert.calledWith(onValue, expected);

		// The icon wasn't clicked; the calendar should NOT have been shown
		sinon.assert.notCalled(toggleOpen);
	});

	it('allows date picker entry', () => {
		const expected = new Date('12/19/2019');
		const h = harness(() => <DateInput onValue={onValue} />);

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

		// If `onValue` is called, the input was accepted & validated
		sinon.assert.calledWith(onValue, expected);

		// The calendar popup should be closed after a selection
		sinon.assert.calledOnce(onClose);
	});

	it('validates date input', () => {
		const h = harness(() => <DateInput onValue={onValue} />);

		const triggerResult = h.trigger(
			'@popup',
			(node) => (node.children as any)[0].trigger,
			noop
		);

		// Find the input widget and give it a bad value
		const [input] = select('@input', triggerResult);
		onValue.resetHistory();
		input.properties.onValue('foobar');

		// With invalid input, `onValue` should not have been called & message should be displayed
		sinon.assert.notCalled(onValue);
		assert.equal(input.properties.helperText, messages.invalidDate);
	});

	it('validates manual date entry range', () => {
		const max = new Date('12/31/2019');
		const min = new Date('12/1/2019');
		const h = harness(() => <DateInput onValue={onValue} max={max} min={min} />);

		const triggerResult = h.trigger(
			'@popup',
			(node) => (node.children as any)[0].trigger,
			noop
		);

		// Find the input widget and give it a value before the min date
		const [input] = select('@input', triggerResult);
		onValue.resetHistory();
		input.properties.onValue('11/11/2019');
		input.properties.onBlur();

		// With invalud input, `onValue` should not have been called & message should be displayed
		sinon.assert.notCalled(onValue);
		assert.equal(input.properties.helperText, messages.tooEarly);

		// Set value after the max date
		onValue.resetHistory();
		input.properties.onValue('1/22/2020');
		input.properties.onBlur();

		// With invalud input, `onValue` should not have been called & message should be displayed
		assert.equal(input.properties.helperText, messages.tooLate);
	});

	it('validates range inputs', () => {
		const max = new Date('12/1/2019');
		const min = new Date('12/31/2019'); // notice min is AFTER max
		const h = harness(() => <DateInput onValue={onValue} max={max} min={min} />);

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
