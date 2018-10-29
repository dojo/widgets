const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import keys from '@theintern/leadfoot/keys';
import { services } from '@theintern/a11y';
import { Remote } from 'intern/lib/executors/Node';
import Test from 'intern/lib/Test';
import * as css from '../../../theme/range-slider.m.css';
import { uuid } from '@dojo/framework/core/util';

const axe = services.axe;

function getPage(test: Test) {
	const { browserName = '' } = test.remote.environmentType!;
	if (browserName.toLowerCase() === 'microsoftedge') {
		test.skip('example page currently doesn\'t work in edge.');
	}
	const remote: Remote = test.remote;
	return remote
		.get(`http://localhost:9000/_build/common/example/?id=${uuid()}#range-slider`)
		.setFindTimeout(5000);
}

function checkValue(command: any, values?: number[][]) {
	let minValue: number;
	let maxValue: number;
	return command
		.findByCssSelector(`.${css.inputWrapper}`)
		.findByCssSelector(`.${css.input}:nth-child(1)`)
		.getProperty('value')
		.then((value: string) => {
			minValue = parseInt(value, 10);
		})
		.end()
		.findByCssSelector(`.${css.input}:nth-child(2)`)
		.getProperty('value')
		.then((value: string) => {
			maxValue = parseInt(value, 10);

			values && values.push([minValue, maxValue]);
		})
		.end()
		.end();
}

function slideMin(command: any, x: number, y: number) {
	return command.session.capabilities.brokenMouseEvents ?
		command
			.findByCssSelector(`.${css.leftThumb}`)
			.moveMouseTo(x, y)
			.pressMouseButton()
			.end()
		:
		command
			.findByCssSelector(`.${css.leftThumb}`)
			.moveMouseTo()
			.pressMouseButton()
			.moveMouseTo(x, y)
			.releaseMouseButton()
			.end();
}

function slideMax(command: any, x: number, y: number) {
	return command.session.capabilities.brokenMouseEvents ?
		command
			.findByCssSelector(`.${css.rightThumb}`)
			.moveMouseTo(x, y)
			.pressMouseButton()
			.end()
		:
		command
			.findByCssSelector(`.${css.rightThumb}`)
			.moveMouseTo()
			.pressMouseButton()
			.moveMouseTo(x, y)
			.releaseMouseButton()
			.end();
}

registerSuite('Range Slider', {
	'each component of a range slider should be visible'(this: any) {
		return getPage(this)
			.findByCssSelector(`#example-rs1 .${css.root}`)
			.isDisplayed()
			.findAllByCssSelector(`.${css.input}`)
			.isDisplayed()
			.end()
			.findByCssSelector(`.${css.filled}`)
			.isDisplayed()
			.end()
			.findByCssSelector(`.${css.output}`)
			.isDisplayed()
			.end();
	},

	'label should be as defined'(this: any) {
		return getPage(this)
			.findByCssSelector(`#example-rs1 .${css.root}`)
			.getVisibleText()
			.then(text => {
				assert.include(text, 'min = 0, max = 100, step = 1');
			})
			.end();
	},

	'sliders should be slideable with the mouse'(this: any) {
		const { browserName, mouseEnabled } = this.remote.environmentType;
		if (!mouseEnabled) {
			this.skip('Test requires mouse interactions.');
		}
		if (browserName.toLowerCase() === 'internet explorer') {
			this.skip('mouse movements doesn\'t work in IE.');
		}
		if (browserName === 'firefox') {
			this.skip('Fails in Firefox.');
		}
		if (browserName === 'safari') {
			this.skip('Fails in Firefox.');
		}

		let sliderValues: number[][] = [];
		let command = getPage(this).findByCssSelector(`#example-rs1 .${css.root}`);
		command = checkValue(command, sliderValues);
		command = slideMin(command, -100, 0);
		command = checkValue(command, sliderValues);
		command = slideMin(command, 100, 0);
		command = checkValue(command, sliderValues);

		command = slideMax(command, -100, 0);
		command = checkValue(command, sliderValues);
		command = slideMax(command, 100, 0);
		command = checkValue(command, sliderValues);

		return command.then(() => {
			assert.lengthOf(sliderValues, 5);

			assert.isBelow(sliderValues[1][0], sliderValues[0][0]);
			assert.isAbove(sliderValues[2][0], sliderValues[1][0]);

			assert.isBelow(sliderValues[3][1], sliderValues[2][1]);
			assert.isAbove(sliderValues[4][1], sliderValues[3][1]);
		});
	},

	'min slider should be slideable with arrow keys'(this: any) {
		const { browserName, supportsKeysCommand } = this.remote.environmentType;
		if (!supportsKeysCommand) {
			this.skip('Arrow keys required for tests.');
		}
		if (browserName.toLowerCase() === 'safari' || browserName.toLowerCase() === 'internet explorer') {
			this.skip('pressKeys with arrow keys doesn\'t work in iphone and IE.');
		}

		let sliderValues: number[][] = [];
		let command: any = getPage(this).findByCssSelector(`#example-rs1 .${css.root}`);
		command = checkValue(command, sliderValues);
		command = command.findByCssSelector(`.${css.leftThumb}`)
			.moveMouseTo()
			.pressMouseButton()
			.pressKeys([keys.ARROW_LEFT, keys.ARROW_LEFT])
			.end();
		command = checkValue(command, sliderValues);
		command = command.findByCssSelector(`.${css.leftThumb}`)
			.moveMouseTo()
			.pressMouseButton()
			.pressKeys([keys.ARROW_RIGHT, keys.ARROW_RIGHT])
			.end();
		command = checkValue(command, sliderValues);

		command = command.then(() => {
			assert.lengthOf(sliderValues, 3);
			assert.isBelow(sliderValues[1][0], sliderValues[0][0]);
			assert.isAbove(sliderValues[2][0], sliderValues[1][0]);
		});

		return command;
	},

	'max slider should be slideable with arrow keys'(this: any) {
		const { browserName, supportsKeysCommand } = this.remote.environmentType;
		if (!supportsKeysCommand) {
			this.skip('Arrow keys required for tests.');
		}
		if (browserName.toLowerCase() === 'safari' || browserName.toLowerCase() === 'internet explorer') {
			this.skip('pressKeys with arrow keys doesn\'t work in iphone and IE.');
		}

		let sliderValues: number[][] = [];
		let command: any = getPage(this).findByCssSelector(`#example-rs1 .${css.root}`);
		command = checkValue(command, sliderValues);
		command = command.findByCssSelector(`.${css.rightThumb}`)
			.moveMouseTo()
			.pressMouseButton()
			.pressKeys([keys.ARROW_LEFT])
			.end();
		command = checkValue(command, sliderValues);
		command = command.findByCssSelector(`.${css.rightThumb}`)
			.moveMouseTo()
			.pressMouseButton()
			.pressKeys([keys.ARROW_RIGHT])
			.end();
		command = checkValue(command, sliderValues);

		command = command.then(() => {
			assert.lengthOf(sliderValues, 3);
			assert.isBelow(sliderValues[1][1], sliderValues[0][1]);
			assert.isAbove(sliderValues[2][1], sliderValues[1][1]);
		});

		return command;
	},

	'check accessibility'() {
		return getPage(this).then(axe.createChecker());
	}
});
