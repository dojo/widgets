const { beforeEach, afterEach, describe, it} = intern.getInterface('bdd');
import { v } from '@dojo/widget-core/d';
import harness, { Harness } from '@dojo/test-extras/harness';
import Progress from '../../Progress';
import * as css from '../../styles/progress.m.css';

const expectedVDom = function(width: number, output: string, showOutput = true) {
	return v('div', { classes: css.root }, [
		v('div', { classes: css.bar }, [
			v('div', {
				classes: css.progress,
				styles: {
					width: `${width}%`
				}
			})
		]),
		showOutput ? v('output', [ output ]) : null
	]);
};

let widget: Harness<Progress>;

describe('Progress', () => {

	beforeEach(() => {
		widget = harness(Progress);
	});

	afterEach(() => {
		widget.destroy();
	});

	it('defaults max width to 100', () => {
		widget.setProperties({
			value: 50
		});

		widget.expectRender(expectedVDom(50, '50%'));
	});

	it('accepts a max to calculate width', () => {
		widget.setProperties({
			max: 200,
			value: 50
		});

		widget.expectRender(expectedVDom(25, '25%'));
	});

	it('accepts decimal values', () => {
		widget.setProperties({
			max: 1,
			value: 0.2
		});

		widget.expectRender(expectedVDom(20, '20%'));
	});

	it('accepts an output function', () => {
		widget.setProperties({
			value: 50,
			output: (value, percent) => `${value}, ${percent}`
		});

		widget.expectRender(expectedVDom(50, '50, 50'));
	});

	it('can hide output', () => {
		widget.setProperties({
			value: 50,
			showOutput: false
		});

		widget.expectRender(expectedVDom(50, '', false));
	});
});
