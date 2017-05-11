import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';

const DELAY = 500;

function openMonthPicker(remote) {
	return remote
		.get('http://localhost:9000/_build/common/example/?module=calendar')
		.setFindTimeout(5000)
		.findByTagName('button')
			.click()
			.end();
}

function clickDate(remote) {
	const today = new Date();
	const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
	return remote
		.get('http://localhost:9000/_build/common/example/?module=calendar')
		.setFindTimeout(5000)
		.findByCssSelector(`tbody > tr:first-child > td:nth-child(${firstDay + 1})`)
			.click()
			.getVisibleText()
			.then((text: string) => { console.log('clicked date', text); })
			.end();
}

registerSuite({
	name: 'Calendar',

	'Open month picker'() {
		return openMonthPicker((<any> this).remote)
			.findByCssSelector('[role=dialog]')
				.getAttribute('aria-hidden')
				.then((hidden: string) => {
					assert.strictEqual(hidden, 'false', 'The month dialog should open on first click');
				})
				.end()
			.sleep(DELAY)
			.getActiveElement()
				.getAttribute('role')
				.then((role: string) => {
					assert.strictEqual(role, 'spinbutton', 'focus moved inside popup');
				});
	},

	'Close month picker'() {
		return openMonthPicker((<any> this).remote)
			.sleep(DELAY)
			.findByTagName('button')
				.click()
				.end()
			.findByCssSelector('[role=dialog]')
				.getAttribute('aria-hidden')
				.then((hidden: string) => {
					assert.strictEqual(hidden, 'true', 'The month dialog should close on second click');
				});
	},

	'Clicking month radio selects month and closes popup'() {
		return openMonthPicker((<any> this).remote)
			.findByCssSelector('input[type=radio]')
				.click()
				.end()
			.findByTagName('label')
				.getVisibleText()
				.then((label: string) => {
					assert.include(label, 'January', 'Clicking first month radio changes label text to January');
				})
				.end()
			.findByCssSelector('[role=dialog]')
				.getAttribute('aria-hidden')
				.then((hidden: string) => {
					assert.strictEqual(hidden, 'true', 'Clicking month radio closes popup');
				});
	},

	'Correct dates are disabled'() {
		const today = new Date();
		const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
		const disabledDateSelector = firstDay === 0 ? 'tbody tr:last-child td:last-child' : `tbody tr:first-child td:nth-child(${firstDay})`;
		return clickDate((<any> this).remote)
			.findByCssSelector(`tbody tr:first-child td:nth-child(${firstDay + 1})`)
				.getVisibleText()
				.then((text: string) => {
					assert.strictEqual(text, '1', 'Month starts on correct day');
				})
				.end()
			.findByCssSelector(disabledDateSelector)
				.getComputedStyle('background-color')
				.then((color: string) => {
					assert.strictEqual(color, 'rgba(187, 187, 187, 1)', 'Disabled date has correct background color');
				});
	},

	'Arrow keys move date focus'() {
		return clickDate((<any> this).remote)
			.sleep(DELAY)
			.pressKeys('ARROW_RIGHT')
			.sleep(DELAY)
			.getActiveElement()
				.getVisibleText()
				.then((text: string) => {
					assert.strictEqual(text, '2', 'Right arrow moves active element to second day');
				})
				.end()
			.pressKeys('ARROW_DOWN')
			.sleep(DELAY)
			.getActiveElement()
				.getVisibleText()
				.then((text: string) => {
					assert.strictEqual(text, '9', 'Down arrow moves active element to next week');
				})
				.end();
	}
});
