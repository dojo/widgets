const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import Command from '@theintern/leadfoot/Command';
import Element from '@theintern/leadfoot/Element';
import Test from 'intern/lib/Test';
import * as css from '../../../theme/split-pane.m.css';

const DELAY = 300;
const ERROR_MARGIN = 5;

function getPage(test: Test): Command<void> {
	const { browserName = '' } = test.remote.environmentType!;
	if (browserName === 'safari' || browserName === 'firefox' || browserName.toLowerCase() === 'microsoftedge') {
		test.skip('Tests do not run in these browsers.');
	}
	return test.remote
		.get('http://localhost:9000/_build/common/example/?module=split-pane')
		.setFindTimeout(5000);
}

interface Coord {
	x: number;
	y: number;
}

interface CoordTest {
	x: number | ((x: number) => boolean);
	y: number | ((y: number) => boolean);
}

function resize(command: Command<Element | void>, x: number, y: number): Command<void> {
	return command
			.findByCssSelector(`.${css.divider}`)
				.moveMouseTo()
				.pressMouseButton(0)
				.moveMouseTo(x, y)
				.releaseMouseButton(0)
				.sleep(DELAY)
			.end();
}

function testResizes(command: Command<Element | void>, resizes: Coord[], expected: CoordTest[]) {
	assert.strictEqual(resizes.length, expected.length, 'Resizes array should match expected array.');

	let currentX: number;
	let currentY: number;
	command = command
		.findByCssSelector(`.${css.divider}`)
			.getPosition()
			.then(({ x, y }) => {
				currentX = x;
				currentY = y;
			})
		.end();

	for (let i = 0; i < resizes.length; i++) {
		const move = resizes[i];
		const delta = expected[i];
		command = resize(command, move.x, move.y)
			.findByCssSelector(`.${css.divider}`)
				.getPosition()
				.then(({ x, y }) => {
					if (typeof delta.x === 'function') {
						assert.isTrue(delta.x(x), `Resize ${i} should pass x test.`);
					}
					else {
						assert.closeTo(x, currentX + delta.x, ERROR_MARGIN, `Resize ${i} should move x by ${move.x}.`);
					}
					if (typeof delta.y === 'function') {
						assert.isTrue(delta.y(y), `Resize ${i} should pass y test.`);
					}
					else {
						assert.closeTo(y, currentY + delta.y, ERROR_MARGIN, `Resize ${i} should move y by ${move.y}.`);
					}
					currentX = x;
					currentY = y;
				})
			.end();
	}

	return command;
}

registerSuite('SplitPane', {
	'can slide horizontally'() {
		return testResizes(
			getPage(this).findByCssSelector(`#example-column .${css.root}`),
			[ { x: -10, y: 0 }, { x: 20, y: 0 } ],
			[ { x: -10, y: 0 }, { x: 20, y: 0 } ]
		);
	},
	'can slide vertically'() {
		return testResizes(
			getPage(this).findByCssSelector(`#example-row .${css.root}`),
			[ { x: 0, y: -10 }, { x: 0, y: 20 } ],
			[ { x: 0, y: -10 }, { x: 0, y: 20 } ]
		);
	},
	'can slide when nested'() {
		let command: Command<Element | void> = getPage(this).findByCssSelector(`#example-nested .${css.root}`);
		command = testResizes(
			command,
			[ { x: -10, y: 0 }, { x: 20, y: 0 } ],
			[ { x: -10, y: 0 }, { x: 20, y: 0 } ]
		);
		command = command.findByCssSelector(`.${css.trailing}`);
			command = testResizes(
				command,
				[ { x: 0, y: -10 }, { x: 0, y: 20 } ],
				[ { x: 0, y: -10 }, { x: 0, y: 20 } ]
			);
		command = command.end();
		return command;
	},
	'there are limits with multiple vertical nested'() {
		let command: Command<Element | void> = getPage(this).findByCssSelector(`#example-vertical-nested .${css.root}`);
		command = testResizes(
			command,
			[ { x: -10, y: 0 }, { x: 20, y: 0 } ],
			[ { x: -10, y: 0 }, { x: 20, y: 0 } ]
		);
		let minX: number;
		command = command
			.findByCssSelector(`.${css.divider}`)
				.getPosition()
				.then(({ x }) => {
					minX = x;
				})
			.end();
		command = command.findByCssSelector(`.${css.trailing}`);
		command = testResizes(
			command,
			[ { x: -9999, y: 0 }, { x: 10, y: 0 } ],
			[ { x: (x) => { return x > minX; }, y: 0 }, { x: 10, y: 0 } ]
		);
		command = command.end();
		return command;
	},
	'there are limits with multiple horizontal nested'() {
		let command: Command<Element | void> = getPage(this).findByCssSelector(`#example-horizontal-nested .${css.root}`);
		command = testResizes(
			command,
			[ { x: 0, y: -10 }, { x: 0, y: 20 } ],
			[ { x: 0, y: -10 }, { x: 0, y: 20 } ]
		);
		let minY: number;
		command = command
			.findByCssSelector(`.${css.divider}`)
				.getPosition()
				.then(({ y }) => {
					minY = y;
				})
			.end();
		command = command.findByCssSelector(`.${css.trailing}`);
		command = testResizes(
			command,
			[ { x: 0, y: -9999 }, { x: 0, y: 10 } ],
			[ { x: 0 , y: (y) => { return y > minY; } }, { x: 0, y: 10 } ]
		);
		command = command.end();
		return command;
	},
	'a maximum size should not be exceeded'() {
		let command: Command<Element | void> = getPage(this).findByCssSelector(`#example-max .${css.root}`);
		let containerWidth = 0;
		command = command
			.getSize()
			.then(({ width }) => {
				containerWidth = width;
			});
		command = testResizes(
			command,
			[ { x: 9999, y: 0 }, { x: -10, y: 0 } ],
			[ { x: (x) => { return x < (containerWidth - 10); } , y: 0 }, { x: -10, y: 0 } ]
		);
		return command;
	},
	'a minimum size should not be exceeded'() {
		let command: Command<Element | void> = getPage(this).findByCssSelector(`#example-max .${css.root}`);
		let containerWidth = 0;
		command = command
		.getSize()
		.then(({ width }) => {
			containerWidth = width;
		});
		command = testResizes(
			command,
			[ { x: 10, y: 0 }, { x: -9999, y: 0 }, { x: 10, y: 0 } ],
			[ { x: 10, y: 0 }, { x: (x) => { return x > 10; } , y: 0 }, { x: 10, y: 0 } ]
		);
		return command;
	}
});
