import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as keys from 'leadfoot/keys';
import * as css from '../../styles/calendar.m.css';

const DELAY = 500;

const today = new Date();
const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

function openMonthPicker(remote: any) {
	return remote
		.get('http://localhost:9000/_build/common/example/?module=calendar')
		.setFindTimeout(5000)
		.findByCssSelector(`.${css.monthTrigger}`)
			.click()
			.sleep(DELAY)
			.end();
}

function clickDate(remote: any) {
	return remote
		.get('http://localhost:9000/_build/common/example/?module=calendar')
		.setFindTimeout(5000)
		.findByCssSelector(`tbody > tr:first-child > td:nth-child(${firstDay + 1})`)
			.click()
			.sleep(DELAY)
			.end();
}

registerSuite({
	name: 'Calendar',

	'Open month picker'() {
		return openMonthPicker((<any> this).remote)
			.findByCssSelector(`.${css.monthPopup}`)
				.getAttribute('aria-hidden')
				.then((hidden: string) => {
					assert.strictEqual(hidden, 'false', 'The month dialog should open on first click');
				})
				.end()
			.getActiveElement()
				.getAttribute('role')
				.then((role: string) => {
					assert.strictEqual(role, 'spinbutton', 'focus moved inside popup');
				});
	},

	'Close month picker'() {
		return openMonthPicker((<any> this).remote)
			.findByCssSelector(`.${css.monthTrigger}`)
				.click()
				.sleep(DELAY)
				.end()
			.findByCssSelector(`.${css.monthPopup}`)
				.getAttribute('aria-hidden')
				.then((hidden: string) => {
					assert.strictEqual(hidden, 'true', 'The month dialog should close on second click');
				})
				.end()
			.getActiveElement()
				.getAttribute('class')
				.then((className: string) => {
					assert.include(className, css.monthTrigger, 'focus moved to button');
				});
	},

	'Clicking month radio selects month and closes popup'() {
		return openMonthPicker((<any> this).remote)
			.findByCssSelector('input[type=radio]')
				.then((el: HTMLElement) => {
					return (<any> this).remote.moveMouseTo(el);
				})
				.pressMouseButton()
				.sleep(100)
				.releaseMouseButton()
				.sleep(DELAY)
				.end()
			.findByCssSelector(`.${css.currentMonthLabel}`)
				.getVisibleText()
				.then((label: string) => {
					assert.include(label, 'January', 'Clicking first month radio changes label text to January');
				})
				.end()
			.findByCssSelector(`.${css.monthPopup}`)
				.getAttribute('aria-hidden')
				.then((hidden: string) => {
					assert.strictEqual(hidden, 'true', 'Clicking month radio closes popup');
				});
	},

	'Correct dates are disabled'() {
		const disabledDateSelector = firstDay === 0 ? 'tbody tr:last-child td:last-child' : `tbody tr:first-child td:nth-child(${firstDay})`;
		return clickDate((<any> this).remote)
			.findByCssSelector(`tbody tr:first-child td:nth-child(${firstDay + 1})`)
				.getVisibleText()
				.then((text: string) => {
					assert.strictEqual(text, '1', 'Month starts on correct day');
				})
				.end()
			.findByCssSelector(disabledDateSelector)
				.getAttribute('class')
				.then((className: string) => {
					assert.include(className, css.inactiveDate, 'Disabled date has correct css class');
				});
	},

	'Arrow keys move date focus'(this: any) {
		const { supportsKeysCommand } = this.remote.environmentType;
		if (!supportsKeysCommand) {
			this.skip();
		}

		return clickDate((<any> this).remote)
			.findByCssSelector(`tbody tr:first-child td:nth-child(${firstDay + 1})`)
				.pressKeys(keys.ARROW_RIGHT)
				.end()
			.sleep(DELAY)
			.getActiveElement()
				.getVisibleText()
				.then((text: string) => {
					assert.strictEqual(text, '2', 'Right arrow moves active element to second day');
				})
				.end()
			.findByCssSelector(`tbody tr:first-child td:nth-child(${firstDay + 1})`)
				.pressKeys(keys.ARROW_DOWN)
				.end()
			.sleep(DELAY)
			.getActiveElement()
				.getVisibleText()
				.then((text: string) => {
					assert.strictEqual(text, '9', 'Down arrow moves active element to next week');
				})
				.end()
			.findByCssSelector(`tbody tr:first-child td:nth-child(${firstDay + 1})`)
				.pressKeys(keys.ARROW_LEFT)
				.end()
			.sleep(DELAY)
			.getActiveElement()
				.getVisibleText()
				.then((text: string) => {
					assert.strictEqual(text, '8', 'Left arrow moves active element to previous day');
				})
				.end()
			.findByCssSelector(`tbody tr:first-child td:nth-child(${firstDay + 1})`)
				.pressKeys(keys.ARROW_UP)
				.end()
			.sleep(DELAY)
			.getActiveElement()
				.getVisibleText()
				.then((text: string) => {
					assert.strictEqual(text, '1', 'Up arrow moves active element to previous week');
				})
				.end()
			.findByCssSelector(`tbody tr:first-child td:nth-child(${firstDay + 1})`)
				.pressKeys(keys.PAGE_DOWN)
				.end()
			.sleep(DELAY)
			.getActiveElement()
				.getVisibleText()
				.then((text: string) => {
					const today = new Date();
					const monthLengh = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
					assert.strictEqual(text, String(monthLengh), 'Page down moves to last day');
				})
				.end()
			.findByCssSelector(`tbody tr:first-child td:nth-child(${firstDay + 1})`)
				.pressKeys(keys.PAGE_UP)
				.end()
			.sleep(DELAY)
			.getActiveElement()
				.getVisibleText()
				.then((text: string) => {
					assert.strictEqual(text, '1', 'Page up moves to first day');
				})
				.end();
	},

	'Clicking disabled date moves focus'() {
		let clickedDate = '';
		return clickDate((<any> this).remote)
			.findByCssSelector(`.${css.inactiveDate}`)
				.getVisibleText()
				.then((text: string) => {
					clickedDate = text;
				})
				.click()
				.end()
			.sleep(DELAY)
			.getActiveElement()
				.getVisibleText()
				.then((text: string) => {
					assert.strictEqual(text, clickedDate, 'Clicked date has focus');
				})
				.getAttribute('class')
				.then((className: string) => {
					assert.include(className, css.selectedDate, 'Clicked date has selected class');
				});
	}
});
