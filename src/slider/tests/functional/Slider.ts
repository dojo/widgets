import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as css from '../../styles/slider.m.css';

function getPage(remote: any) {
	return remote
		.get('http://localhost:9000/_build/common/example/?module=slider')
		.setFindTimeout(5000);
}

function checkValue(command: any, values?: number[]) {

	let currentValue = -1;
	return command
		.findByCssSelector(`.${css.inputWrapper}`)
			.findByCssSelector(`.${css.input}`)
			.getProperty('value')
			.then((value: number) => {
				currentValue = value;
			})
			.end()
			.findByCssSelector(`.${css.fill}`)
			.getAttribute('style')
			.then((style: string) => {
				const absWidthRegex = /width:\s*(\d+)%/;
				let result = style.match(absWidthRegex);
				assert.lengthOf(result, 2);
				let width = result && result.length > 0 ? result[1] : -1;
				assert.strictEqual(width, currentValue);
				values && values.push(<number> width);
			})
			.end()
			.findByCssSelector(`.${css.thumb}`)
			.getAttribute('style')
			.then((style: string) => {
				const absWidthRegex = /left:\s*(\d+)%/;
				let result = style.match(absWidthRegex);
				assert.lengthOf(result, 2);
				let width = result && result.length > 0 ? result[1] : -1;
				assert.strictEqual(width, currentValue);
			})
			.end()
		.end();
}

function slide(command: any, x: number, y: number) {
	return command
		.findByCssSelector(`.${css.thumb}`)
		.moveMouseTo()
		.pressMouseButton()
		.moveMouseTo(x, y)
		.releaseMouseButton()
		.end();

}
registerSuite({
	name: 'Slider',

	'horizontal slider': {
		'each components of a slider should be visible'(this: any) {
			return getPage(this.remote)
				.findByCssSelector(`#example-1 .${css.root}`)
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
			return getPage(this.remote)
				.findByCssSelector(`#example-1 .${css.root}`)
				.getVisibleText()
				.then((text: string) => {
					assert.include(text, 'How much do you like tribbles?');
				})
				.end();
		},
		'slider value should be consistent in different part of the UI'(this: any) {
			let command = getPage(this.remote)
				.findByCssSelector(`#example-1 .${css.root}`);
			return checkValue(command)
				.end();
		},
		'slider should be slidable with mouse'(this: any) {
			let sliderValues: number[] = [];
			let command = getPage(this.remote)
				.findByCssSelector(`#example-1 .${css.root}`);
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
			let sliderValues: number[] = [];
			let command = getPage(this.remote)
				.findByCssSelector(`#example-1 .${css.root}`);
			command = checkValue(command, sliderValues)
				.click()
				.pressKeys('\uE012'); // left arrow

			command = checkValue(command, sliderValues)
				.pressKeys(['\uE014', '\uE014']); // right arrow

			return checkValue(command, sliderValues)
				.then(() => {
					assert.lengthOf(sliderValues, 3);
					assert.isTrue(sliderValues[0] > sliderValues[1] && sliderValues[2] > sliderValues[0]);
				})
				.end();
		}
	},
	'vertical slider': {
		'each components of a slider should be visible'(this: any) {
			return getPage(this.remote)
				.findByCssSelector(`#example-2 .${css.root}`)
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
			return getPage(this.remote)
				.findByCssSelector(`#example-2 .${css.root}`)
				.getVisibleText()
				.then((text: string) => {
					assert.include(text, 'Vertical Slider with default properties.');
				})
				.end();
		},
		'slider value should be consistent in different part of the UI'(this: any) {
			let command = getPage(this.remote)
				.findByCssSelector(`#example-2 .${css.root}`);
			return checkValue(command)
				.end();
		},
		'slider should be slidable with mouse'(this: any) {
			let sliderValues: number[] = [];
			let command = getPage(this.remote)
				.findByCssSelector(`#example-2 .${css.root}`);
			command = checkValue(command, sliderValues);

			command = slide(command, 0, -30);
			command = checkValue(command, sliderValues);

			command = slide(command, 0, -40);
			command = checkValue(command, sliderValues);

			return command
				.then(() => {
					console.log('mouse values', sliderValues);
					assert.lengthOf(sliderValues, 3);
					assert.isTrue(sliderValues[1] > sliderValues[0] && sliderValues[2] > sliderValues[1]);
				})
				.end();
		},
		'slider should be slidable with up and down arrow keys'(this: any) {
			let sliderValues: number[] = [];
			let command = getPage(this.remote)
				.findByCssSelector(`#example-2 .${css.root}`);
			command = checkValue(command, sliderValues)
				.click()
				.pressKeys(['\uE014', '\uE013']); // up arrow

			command = checkValue(command, sliderValues)
				.pressKeys('\uE015'); // down arrow

			return checkValue(command, sliderValues)
				.then(() => {
					console.log('key values', sliderValues);
					assert.lengthOf(sliderValues, 3);
					assert.isTrue(sliderValues[1] > sliderValues[2] && sliderValues[2] > sliderValues[0]);
				})
				.end();
		}
	}
});
