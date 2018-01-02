const { beforeEach, afterEach, describe, it} = intern.getInterface('bdd');
import { v } from '@dojo/widget-core/d';
import harness, { Harness } from '@dojo/test-extras/harness';
import Progress from '../../Progress';
import * as css from '../../../theme/progress/progress.m.css';

const expectedVDom = function(args: any) {
	const {
		width,
		output,
		value,
		showOutput = true,
		max = 100,
		min = 0,
		id
	} = args;

	return v('div', { classes: css.root }, [
		v('div', {
			classes: css.bar,
			'aria-valuemax': `${max}`,
			'aria-valuemin': `${min}`,
			'aria-valuenow': `${value}`,
			'aria-valuetext': `${output}`,
			role: 'progressbar',
			id
		}, [
			v('div', {
				classes: css.progress,
				styles: {
					width: `${width}%`
				}
			})
		]),
		showOutput ? v('span', { classes: css.output }, [ output ]) : null
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

		widget.expectRender(expectedVDom({ width: 50, output: '50%', value: 50 }));
	});

	it('accepts a max to calculate width', () => {
		widget.setProperties({
			max: 200,
			value: 50
		});

		widget.expectRender(expectedVDom({ width: 25, output: '25%', value: 50, max: 200 }));
	});

	it('accepts decimal values', () => {
		widget.setProperties({
			max: 1,
			value: 0.2
		});

		widget.expectRender(expectedVDom({ width: 20, output: '20%', value: 0.2, max: 1 }));
	});

	it('accepts a min and max to calculate width', () => {
		widget.setProperties({
			min: 100,
			max: 200,
			value: 150
		});

		widget.expectRender(expectedVDom({ width: 50, output: '50%', value: 150, min: 100, max: 200 }));
	});

	it('accepts an output function', () => {
		widget.setProperties({
			value: 50,
			output: (value, percent) => `${value}, ${percent}`
		});

		widget.expectRender(expectedVDom({ width: 50, output: '50, 50', value: 50 }));
	});

	it('can hide output', () => {
		widget.setProperties({
			value: 50,
			showOutput: false
		});

		widget.expectRender(expectedVDom({ width: 50, value: 50, output: '50%', showOutput: false }));
	});

	it('can accept an id', () => {
		widget.setProperties({
			value: 50,
			id: 'my-id'
		});

		widget.expectRender(expectedVDom({ width: 50, output: '50%', value: 50, id: 'my-id' }));
	});
});
