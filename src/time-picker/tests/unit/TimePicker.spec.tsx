import { Menu, MenuOption } from '../../../menu';
import * as sinon from 'sinon';

import { create, tsx } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import { harness } from '@dojo/framework/testing/harness';
import TriggerPopup from '../../../trigger-popup';
import TextInput from '../../../text-input';

import TimePicker, { format24HourTime } from '../../index';
import bundle from '../../nls/TimePicker';
import * as css from '../../../theme/default/time-picker.m.css';
import { padStart } from '@dojo/framework/shim/string';
import select from '@dojo/framework/testing/support/selector';
import { stubEvent } from '../../../common/tests/support/test-helpers';
import { Keys } from '../../../common/util';
import focus from '@dojo/framework/core/middleware/focus';

const { describe, it, afterEach } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

const { messages } = bundle;
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
				<input
					type="hidden"
					name="timeInput"
					value={date ? format24HourTime(date) : ''}
					aria-hidden="true"
				/>
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
				disabled={undefined}
				key="input"
				focus={() => false}
				classes={{
					'@dojo/widgets/text-input': {
						trailing: [css.inputTrailing]
					}
				}}
				onBlur={noop}
				onValue={noop}
				trailing={() => undefined}
				initialValue={''}
				onValidate={noop}
				required={undefined}
				valid={true}
				helperText=""
				onKeyDown={noop}
				type="text"
			/>
		</div>
	);
});

function generateOptions(step: number, dateOptions: Intl.DateTimeFormatOptions = {}) {
	const options: MenuOption[] = [];

	const dt = new Date(1970, 0, 1, 0, 0, 0, 0);
	while (dt.getDate() === 1) {
		const value = `${padStart(String(dt.getHours()), 2, '0')}:${padStart(
			String(dt.getMinutes()),
			2,
			'0'
		)}:${padStart(String(dt.getSeconds()), 2, '0')}`;

		options.push({
			label: dt.toLocaleTimeString(undefined, dateOptions),
			value,
			disabled: false
		});

		dt.setSeconds(dt.getSeconds() + step);
	}

	return options;
}

const options30Minutes = generateOptions(1800, {
	hour12: false,
	hour: 'numeric',
	minute: 'numeric'
});

const menuTemplate = assertionTemplate(() => {
	return (
		<div key="menu-wrapper" classes={css.menuWrapper}>
			<Menu
				key="menu"
				focus={() => false}
				options={options30Minutes}
				total={options30Minutes.length}
				onValue={noop}
				onRequestClose={noop}
				onBlur={noop}
				initialValue={''}
				listBox
			/>
		</div>
	);
});

describe('TimePicker', () => {
	const onValue = sinon.stub();

	afterEach(() => {
		onValue.resetHistory();
	});

	it('renders with default time', () => {
		const h = harness(() => <TimePicker name="timeInput" onValue={onValue} />);
		h.expect(baseTemplate());
	});

	it('renders with initial value', () => {
		const initialValue = new Date(1970, 0, 1, 4, 30, 0);
		const h = harness(() => (
			<TimePicker
				name="timeInput"
				onValue={onValue}
				initialValue={format24HourTime(initialValue)}
			/>
		));
		h.expect(baseTemplate(initialValue));
	});

	it('shows menu when triggered via icon', () => {
		const h = harness(() => <TimePicker name="timeInput" />);

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
			'@clockIcon',
			select('@input', triggerResult)[0].properties.trailing()
		);
		dateIcon.properties.onclick(stubEvent);
		h.expect(baseTemplate());

		// If `toggleOpen` is called, the popup content is shown
		sinon.assert.calledOnce(toggleOpen);
	});

	it('shows calendar when triggered via keyboard', () => {
		const h = harness(() => <TimePicker name="timeInput" />);

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
		const h = harness(() => <TimePicker name="timeInput" />, {
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
		const expected = new Date(1970, 0, 1, 13, 25, 11); // Dec 19, 2019
		const h = harness(() => <TimePicker name="timeInput" onValue={onValue} />);

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
		input.properties.onValue(format24HourTime(expected));

		h.expect(baseTemplate());
		sinon.assert.notCalled(onValue); // onValue not called until validated; validation delayed for manual input until blur

		// If `onValue` is called, the input was accepted & validated
		input.properties.onBlur();
		h.expect(baseTemplate(expected));
		sinon.assert.calledWith(onValue, format24HourTime(expected));

		// The icon wasn't clicked; the calendar should NOT have been shown
		sinon.assert.notCalled(toggleOpen);
	});

	it('allows time picker selection', () => {
		const expected = new Date(2019, 11, 19); // Dec 19, 2019
		const h = harness(() => <TimePicker name="timeInput" onValue={onValue} />);
		h.expect(baseTemplate());

		const onClose = sinon.stub();
		const contentResult = h.trigger(
			'@popup',
			(node) => (node.children as any)[0].content,
			onClose
		);
		h.expect(menuTemplate, () => contentResult);

		// Find the calendar widget and trigger a date selected
		const [menu] = select('@menu', contentResult);
		onValue.resetHistory();
		menu.properties.onValue(format24HourTime(expected));

		// Find the input; it should contain the new value
		h.expect(baseTemplate(expected));
		const [input] = select(
			'@input',
			h.trigger('@popup', (node) => (node.children as any)[0].trigger)
		);
		assert(input.properties.initialValue, format24HourTime(expected));

		// If `onValue` is called, the input was accepted & validated
		sinon.assert.calledWith(onValue, format24HourTime(expected));

		// The calendar popup should be closed after a selection
		sinon.assert.calledOnce(onClose);
	});

	it('validates time input', () => {
		const onValidate = sinon.stub();
		const h = harness(() => (
			<TimePicker name="timeInput" onValue={onValue} onValidate={onValidate} />
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
		sinon.assert.calledWith(onValidate, false, messages.invalidTime);
		[input] = select(
			'@input',
			h.trigger('@popup', (node) => (node.children as any)[0].trigger, noop)
		);
		assert.equal(input.properties.helperText, messages.invalidTime);
	});

	it('validates manual date entry range', () => {
		const onValidate = sinon.stub();
		const h = harness(() => (
			<TimePicker
				name="timeInput"
				onValue={onValue}
				max={'13:30:00'}
				min={'12:30:00'}
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
		input.properties.onValue('12:29:59');
		input.properties.onBlur();
		h.expect(baseTemplate());

		// With invalid input, `onValue` should not have been called & message should be displayed
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
		input.properties.onValue('13:30:01');
		input.properties.onBlur();
		h.expect(baseTemplate());

		// With invalid input, `onValue` should not have been called & message should be displayed
		[input] = select(
			'@input',
			h.trigger('@popup', (node) => (node.children as any)[0].trigger, noop)
		);
		assert.equal(input.properties.helperText, messages.tooLate);
		sinon.assert.calledWith(onValidate, false, messages.tooLate);
	});

	it('generates options based on step', () => {
		const h = harness(() => <TimePicker name="timeInput" onValue={onValue} step={60 * 30} />);

		const contentResult = h.trigger(
			'@popup',
			(node) => (node.children as any)[0].content,
			() => undefined
		);

		h.expect(
			menuTemplate.setProperty(
				'@menu',
				'options',
				generateOptions(60 * 30, { hour12: false, hour: 'numeric', minute: 'numeric' })
			),
			() => contentResult
		);
	});
});
