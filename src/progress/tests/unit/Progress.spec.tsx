const { describe, it } = intern.getInterface('bdd');
import { v, w } from '@dojo/framework/core/vdom';
import harness from '@dojo/framework/testing/harness';
import Progress from '../../index';
import * as css from '../../../theme/default/progress.m.css';

const expectedVDom = function(args: any) {
	const { width, output, value, showOutput = true, max = 100, min = 0, id, describedBy } = args;

	return v('div', { classes: css.root }, [
		v(
			'div',
			{
				classes: css.bar,
				'aria-valuemax': `${max}`,
				'aria-valuemin': `${min}`,
				'aria-valuenow': `${value}`,
				'aria-valuetext': `${output}`,
				role: 'progressbar',
				id,
				...(describedBy ? { 'aria-describedby': describedBy } : {})
			},
			[
				v('div', {
					classes: css.progress,
					styles: {
						width: `${width}%`
					}
				})
			]
		),
		showOutput ? v('span', { classes: css.output }, [output]) : null
	]);
};

describe('Progress', () => {
	it('defaults max width to 100', () => {
		const h = harness(() =>
			w(Progress, {
				value: 50
			})
		);
		h.expect(() => expectedVDom({ width: 50, output: '50%', value: 50 }));
	});

	it('accepts a max to calculate width', () => {
		const h = harness(() =>
			w(Progress, {
				max: 200,
				value: 50
			})
		);

		h.expect(() => expectedVDom({ width: 25, output: '25%', value: 50, max: 200 }));
	});

	it('accepts decimal values', () => {
		const h = harness(() =>
			w(Progress, {
				max: 1,
				value: 0.2
			})
		);

		h.expect(() => expectedVDom({ width: 20, output: '20%', value: 0.2, max: 1 }));
	});

	it('accepts a min and max to calculate width', () => {
		const h = harness(() =>
			w(Progress, {
				min: 100,
				max: 200,
				value: 150
			})
		);

		h.expect(() => expectedVDom({ width: 50, output: '50%', value: 150, min: 100, max: 200 }));
	});

	it('accepts an output function', () => {
		const h = harness(() =>
			w(Progress, {
				value: 50,
				output: (value: any, percent: any) => `${value}, ${percent}`
			})
		);

		h.expect(() => expectedVDom({ width: 50, output: '50, 50', value: 50 }));
	});

	it('can hide output', () => {
		const h = harness(() =>
			w(Progress, {
				value: 50,
				showOutput: false
			})
		);

		h.expect(() => expectedVDom({ width: 50, value: 50, output: '50%', showOutput: false }));
	});

	it('can accept an id', () => {
		const h = harness(() =>
			w(Progress, {
				value: 50,
				widgetId: 'my-id'
			})
		);

		h.expect(() => expectedVDom({ width: 50, output: '50%', value: 50, id: 'my-id' }));
	});

	it('accepts aria properties', () => {
		const h = harness(() =>
			w(Progress, {
				value: 50,
				aria: {
					describedBy: 'foo',
					valueNow: 'overridden'
				}
			})
		);

		h.expect(() => expectedVDom({ width: 50, output: '50%', value: 50, describedBy: 'foo' }));
	});
});
