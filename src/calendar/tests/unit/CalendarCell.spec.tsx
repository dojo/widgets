const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import harness from '@dojo/framework/testing/harness/harness';
import { tsx } from '@dojo/framework/core/vdom';

import { CalendarCell } from '../../index';
import * as css from '../../../theme/default/calendar.m.css';
import { noop, stubEvent } from '../../../common/tests/support/test-helpers';

registerSuite('CalendarCell', {
	tests: {
		'Calendar cell with default properties'() {
			const h = harness(() => <CalendarCell date={1} />);

			h.expect(() => (
				<td
					key="root"
					focus={undefined}
					role="gridcell"
					aria-selected="false"
					tabIndex={-1}
					classes={[css.date, null, null, null, null]}
					onclick={noop}
					onkeydown={noop}
				>
					<span>1</span>
				</td>
			));
		},

		'Calendar cell with custom properties'() {
			const h = harness(() => (
				<CalendarCell
					date={2}
					outOfRange={true}
					focusable={true}
					selected={true}
					today={true}
				/>
			));

			h.expect(() => (
				<td
					key="root"
					focus={undefined}
					role="gridcell"
					aria-selected="true"
					tabIndex={0}
					classes={[
						css.date,
						css.inactiveDate,
						css.outOfRange,
						css.selectedDate,
						css.todayDate
					]}
					onclick={noop}
					onkeydown={noop}
				>
					<span>2</span>
				</td>
			));
		},

		'Calendar cells for other months display as inactive'() {
			const h = harness(() => <CalendarCell date={30} disabled={true} />);

			h.expect(() => (
				<td
					key="root"
					focus={undefined}
					role="gridcell"
					aria-selected="false"
					tabIndex={-1}
					classes={[css.date, css.inactiveDate, null, null, null]}
					onclick={noop}
					onkeydown={noop}
				>
					<span>30</span>
				</td>
			));
		},

		'Calendar cells for out of range dates display as inactive'() {
			const h = harness(() => <CalendarCell date={30} outOfRange={true} />);

			h.expect(() => (
				<td
					key="root"
					focus={undefined}
					role="gridcell"
					aria-selected="false"
					tabIndex={-1}
					classes={[css.date, css.inactiveDate, css.outOfRange, null, null]}
					onclick={noop}
					onkeydown={noop}
				>
					<span>30</span>
				</td>
			));
		},

		'Click handler called with correct arguments'() {
			let clickedDate = 0;
			let clickedCurrentMonth = false;
			let date = 1;
			let disabled = true;
			const h = harness(() => (
				<CalendarCell
					date={date}
					disabled={disabled}
					onClick={(callbackDate: number, callbackCurrentMonth: boolean) => {
						clickedDate = callbackDate;
						clickedCurrentMonth = callbackCurrentMonth;
					}}
				/>
			));

			h.trigger('td', 'onclick', stubEvent);
			assert.strictEqual(clickedDate, 1);
			assert.isTrue(clickedCurrentMonth);

			disabled = false;
			date = 2;
			h.trigger('td', 'onclick', stubEvent);
			assert.strictEqual(clickedDate, 2);
			assert.isFalse(clickedCurrentMonth);
		},

		'Keydown handler called'() {
			let called = false;
			let preventDefaultCalled = false;
			let callback: () => any = () => {};
			const localStubEvent = {
				...stubEvent,
				preventDefault() {
					preventDefaultCalled = true;
				}
			};
			const h = harness(() => (
				<CalendarCell
					date={1}
					onKeyDown={(_, localCallback) => {
						called = true;
						callback = localCallback;
					}}
				/>
			));
			h.trigger('td', 'onkeydown', localStubEvent);
			assert.isTrue(called);
			assert.isFalse(preventDefaultCalled);
			typeof callback && callback();
			assert.isTrue(preventDefaultCalled);
		},

		'Focus is set with callback'() {
			let callFocus = false;
			let date = 1;
			const h = harness(() => (
				<CalendarCell
					callFocus={callFocus}
					date={date}
					onFocusCalled={() => {
						callFocus = false;
					}}
				/>
			));

			h.expect(() => (
				<td
					key="root"
					focus={false}
					role="gridcell"
					aria-selected="false"
					tabIndex={-1}
					classes={[css.date, null, null, null, null]}
					onclick={noop}
					onkeydown={noop}
				>
					<span>1</span>
				</td>
			));

			assert.isFalse(callFocus, 'Focus callback should set callFocus to false');

			callFocus = true;
			date = 2;
			h.expect(() => (
				<td
					key="root"
					focus={true}
					role="gridcell"
					aria-selected="false"
					tabIndex={-1}
					classes={[css.date, null, null, null, null]}
					onclick={noop}
					onkeydown={noop}
				>
					<span>2</span>
				</td>
			));

			assert.isFalse(callFocus, 'Focus callback should set callFocus to false');
		}
	}
});
