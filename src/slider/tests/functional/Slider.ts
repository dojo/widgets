const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import keys from '@theintern/leadfoot/keys';
import * as css from '../../styles/slider.m.css';

function getPage(test: any) {
	const { browserName } = test.remote.environmentType;
	if (browserName.toLowerCase() === 'microsoftedge') {
		test.skip('example page currently doesn\'t work in edge.');
	}
	return test.remote
		.get('http://localhost:9000/_build/common/example/?module=slider')
		.setFindTimeout(5000);
}

function checkValue(command: any, values?: number[]) {
	const notIE = command.session.capabilities.browserName.toLowerCase() !== 'internet explorer';
	let currentValue: number;
	return command
		.findByCssSelector(`.${css.inputWrapper}`)
			.findByCssSelector(`.${css.input}`)
				.getProperty('value')
				.then((value: string) => {
					currentValue = parseInt(value, 10);
				})
			.end()
			.findByCssSelector(`.${css.fill}`)
				.getAttribute('style')
				.then((style: string) => {
					const absWidthRegex = /width:\s*(\d+)\.?\d*%/;
					let result = style.match(absWidthRegex);
					let width = result && result.length > 0 ? parseInt(result[1], 10) : -1;
					assert.lengthOf(result, 2);
					notIE && assert.closeTo(width, currentValue, 1);
				})
			.end()
			.findByCssSelector(`.${css.thumb}`)
				.getAttribute('style')
				.then((style: string) => {
					const absWidthRegex = /left:\s*(\d+)\.?\d*%/;
					let result = style.match(absWidthRegex);
					let width = result && result.length > 0 ? parseInt(result[1], 10) : -1;
					assert.lengthOf(result, 2);
					notIE && assert.closeTo(width, currentValue, 1);
					values && values.push(width);
				})
			.end()
		.end();
}

function slide(command: any, x: number, y: number) {
	return command.session.capabilities.brokenMouseEvents ?
		command
			.findByCssSelector(`.${css.thumb}`)
				.moveMouseTo(x, y)
				.pressMouseButton()
			.end()
		:
		command
			.findByCssSelector(`.${css.thumb}`)
				.moveMouseTo()
				.pressMouseButton()
				.moveMouseTo(x, y)
				.releaseMouseButton()
			.end();
}

registerSuite('Slider', {
	'horizontal slider': {
		'each component of a slider should be visible'(this: any) {
			return getPage(this)
				.findByCssSelector(`#example-s1 .${css.root}`)
					.isDisplayed()
					.findByCssSelector(`.${css.input}`)
					.isDisplayed()
				.end()
				.findByCssSelector(`.${css.track}`)
					.isDisplayed()
				.end()
				.findByCssSelector(`.${css.output}`)
					.isDisplayed()
				.end()
				.getSize()
				.then(({ height, width }: { height: number; width: number; }) => {
					assert.isAbove(height, 0, 'The height of the slider should be greater than zero.');
					assert.isAbove(width, 0, 'The width of the slider should be greater than zero.');
				})
				.end();
		},
		'label should be as defined'(this: any) {
			return getPage(this)
				.findByCssSelector(`#example-s1 .${css.root}`)
					.getVisibleText()
					.then((text: string) => {
						assert.include(text, 'How much do you like tribbles?');
					})
				.end();
		},
		'slider value should be consistent in different part of the UI'(this: any) {
			const command = getPage(this).findByCssSelector(`#example-s1 .${css.root}`);
			return checkValue(command).end();
		},
		'slider should be slidable with mouse'(this: any) {
			const { browserName, mouseEnabled } = this.remote.environmentType;
			if (!mouseEnabled) {
				this.skip('Test requires mouse interactions.');
			}
			if (browserName.toLowerCase() === 'internet explorer') {
				this.skip('mouse movements doesn\'t work in IE.');
			}

			let sliderValues: number[] = [];
			let command = getPage(this).findByCssSelector(`#example-s1 .${css.root}`);
			command = checkValue(command, sliderValues);

			command = slide(command, -30, 0);
			command = checkValue(command, sliderValues);

			command = slide(command, 100, 0);
			command = checkValue(command, sliderValues);

			return command
				.then(() => {
					assert.lengthOf(sliderValues, 3);
					assert.isTrue(sliderValues[0] > sliderValues[1] && sliderValues[2] > sliderValues[0]);
				})
				.end();
		},
		'slider should be slidable with left and right arrow keys'(this: any) {
			const { browserName, supportsKeysCommand } = this.remote.environmentType;
			if (!supportsKeysCommand) {
				this.skip('Arrow keys required for tests.');
			}
			if (browserName.toLowerCase() === 'safari' || browserName.toLowerCase() === 'internet explorer') {
				this.skip('pressKeys with arrow keys doesn\'t work in iphone and IE.');
			}

			let sliderValues: number[] = [];
			let command = getPage(this)
				.findByCssSelector(`#example-s1 .${css.root}`);
			command = checkValue(command, sliderValues)
				.click()
				.pressKeys(keys.ARROW_LEFT);

			command = checkValue(command, sliderValues)
				.click()
				.pressKeys([keys.ARROW_RIGHT, keys.ARROW_RIGHT]);

			return checkValue(command, sliderValues)
				.then(() => {
					assert.lengthOf(sliderValues, 3);
					assert.isTrue(sliderValues[0] > sliderValues[1] && sliderValues[2] > sliderValues[0]);
				})
				.end();
		}
	},
	'vertical slider': {
		'each component of a slider should be visible'(this: any) {
			return getPage(this)
				.findByCssSelector(`#example-s2 .${css.root}`)
				.isDisplayed()
				.findByCssSelector(`.${css.input}`)
				.isDisplayed()
				.end()
				.findByCssSelector(`.${css.track}`)
				.isDisplayed()
				.end()
				.findByCssSelector(`.${css.output}`)
				.isDisplayed()
				.end()

				.getSize()
				.then(({ height, width }: { height: number; width: number; }) => {
					assert.isAbove(height, 0, 'The height of the slider should be greater than zero.');
					assert.isAbove(width, 0, 'The width of the slider should be greater than zero.');
				})

				.end();
		},
		'label should be as defined'(this: any) {
			return getPage(this)
				.findByCssSelector(`#example-s3 .${css.root}`)
				.getVisibleText()
				.then((text: string) => {
					assert.include(text, 'Vertical Slider with default properties.');
				})
				.end();
		},
		'slider value should be consistent in different part of the UI'(this: any) {
			let command = getPage(this)
				.findByCssSelector(`#example-s2 .${css.root}`);
			return checkValue(command)
				.end();
		},
		'slider should be functional with mouse'(this: any) {
			const { browserName, mouseEnabled } = this.remote.environmentType;
			if (!mouseEnabled) {
				this.skip('Test requires mouse interactions.');
			}
			if (browserName.toLowerCase() === 'internet explorer') {
				this.skip('mouse movements doesn\'t work in IE.');
			}

			let sliderValues: number[] = [];
			let command = getPage(this)
				.findByCssSelector(`#example-s3 .${css.root}`);
			command = checkValue(command, sliderValues);

			command = slide(command, 1, -30);
			command = checkValue(command, sliderValues);

			command = slide(command, 1, -40);
			command = checkValue(command, sliderValues);

			return command
				.then(() => {
					assert.lengthOf(sliderValues, 3);
					assert.isTrue(sliderValues[1] > sliderValues[0] && sliderValues[2] > sliderValues[1]);
				})
				.end();
		},
		'slider should be functional with up and down arrow keys'(this: any) {
			const { browserName, supportsKeysCommand } = this.remote.environmentType;
			if (!supportsKeysCommand) {
				this.skip('Arrow keys required for tests.');
			}
			if (browserName.toLowerCase() === 'safari' || browserName.toLowerCase() === 'internet explorer') {
				this.skip('pressKeys with arrow keys doesn\'t work in iphone and IE.');
			}

			let sliderValues: number[] = [];
			let command = getPage(this)
				.findByCssSelector(`#example-s3 .${css.root}`);
			command = checkValue(command, sliderValues)
				.click()
				.pressKeys([keys.ARROW_UP, keys.ARROW_UP]);

			command = checkValue(command, sliderValues)
				.pressKeys(keys.ARROW_DOWN);

			return checkValue(command, sliderValues)
				.then(() => {
					assert.lengthOf(sliderValues, 3);
					assert.isTrue(sliderValues[1] > sliderValues[2] && sliderValues[2] > sliderValues[0]);
				})
				.end();
		}
	}
});
