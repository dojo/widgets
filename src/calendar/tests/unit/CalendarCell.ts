import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import harness, { Harness } from '@dojo/test-extras/harness';
import { v } from '@dojo/widget-core/d';

import CalendarCell, { CalendarCellProperties } from '../../CalendarCell';
import * as css from '../../styles/calendar.m.css';

let widget: Harness<CalendarCellProperties, typeof CalendarCell>;

registerSuite({
	name: 'CalendarCell',

	beforeEach() {
		widget = harness(CalendarCell);
	},

	afterEach() {
		widget.destroy();
	},

	'Calendar cell with default properties'() {
		widget.setProperties({
			date: 1
		});

		widget.expectRender(v('td', {
			key: 'root',
			role: 'gridcell',
			'aria-selected': 'false',
			tabIndex: -1,
			classes: widget.classes(css.date),
			onclick: widget.listener,
			onkeydown: widget.listener
		}, [
			v('span', {}, [ '1' ])
		]));
	},

	'Calendar cell with custom properties'() {
		widget.setProperties({
			date: 2,
			disabled: true,
			focusable: true,
			selected: true,
			today: true
		});

		widget.expectRender(v('td', {
			key: 'root',
			role: 'gridcell',
			'aria-selected': 'true',
			tabIndex: 0,
			classes: widget.classes(css.date, css.inactiveDate, css.selectedDate, css.todayDate),
			onclick: widget.listener,
			onkeydown: widget.listener
		}, [
			v('span', {}, [ '2' ])
		]));
	},

	'Click handler called with correct arguments'() {
		let clickedDate = 0, clickedDisabled = false;
		widget.setProperties({
			date: 1,
			disabled: true,
			onClick: (date: number, disabled: boolean) => {
				clickedDate = date;
				clickedDisabled = disabled;
			}
		});
		widget.sendEvent('click');
		assert.strictEqual(clickedDate, 1);
		assert.isTrue(clickedDisabled);

		widget.setProperties({
			date: 2,
			onClick: (date: number, disabled: boolean) => {
				clickedDate = date;
				clickedDisabled = disabled;
			}
		});
		widget.getRender();
		widget.sendEvent('click');
		assert.strictEqual(clickedDate, 2);
		assert.isFalse(clickedDisabled, 'disabled defaults to false');
	},

	'Keydown handler called'() {
		let called = false;
		widget.setProperties({
			date: 1,
			onKeyDown: () => {
				called = true;
			}
		});
		widget.sendEvent('keydown');

		assert.isTrue(called);
	},

	'Focus is set with callback'() {
		let callFocus = true;
		widget.setProperties({
			callFocus,
			date: 1,
			onFocusCalled: () => {
				callFocus = false;
			}
		});
		widget.getRender();

		assert.isFalse(callFocus, 'Focus callback should set callFocus to false in onElementCreated');

		callFocus = true;
		widget.setProperties({
			callFocus,
			date: 2,
			onFocusCalled: () => {
				callFocus = false;
			}
		});
		widget.getRender();

		assert.isFalse(callFocus, 'Focus callback should set callFocus to false in onElementUpdated');
	}
});
