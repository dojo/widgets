const { describe, it } = intern.getInterface('bdd');
import { tsx } from '@dojo/framework/core/vdom';
import harness from '@dojo/framework/testing/harness';
import Progress from '../../index';
import * as css from '../../../theme/default/progress.m.css';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';

describe('Progress', () => {
	const template = assertionTemplate(() => (
		<div key="root" classes={[undefined, css.root]}>
			<div
				assertion-key="progressbar"
				classes={css.bar}
				role="progressbar"
				aria-valuemin="0"
				aria-valuemax="100"
				aria-valuenow="50"
				aria-valuetext="50%"
				id="progress-test"
			>
				<div assertion-key="progress" classes={css.progress} styles={{ width: `${50}%` }} />
			</div>
			<span assertion-key="output" classes={css.output}>
				50%
			</span>
		</div>
	));

	it('defaults max width to 100', () => {
		const h = harness(() => <Progress value={50} />);
		h.expect(template);
	});

	it('accepts a max to calculate width', () => {
		const h = harness(() => <Progress max={200} value={50} />);

		h.expect(
			template
				.setProperty('~progressbar', 'aria-valuemax', '200')
				.setProperty('~progressbar', 'aria-valuenow', '50')
				.setProperty('~progressbar', 'aria-valuetext', '25%')
				.setProperty('~progress', 'styles', { width: `${25}%` })
				.replace('~output', <span classes={css.output}>25%</span>)
		);
	});

	it('accepts decimal values', () => {
		const h = harness(() => <Progress max={1} value={0.2} />);

		h.expect(
			template
				.setProperty('~progressbar', 'aria-valuemax', '1')
				.setProperty('~progressbar', 'aria-valuenow', '0.2')
				.setProperty('~progressbar', 'aria-valuetext', '20%')
				.setProperty('~progress', 'styles', { width: `${20}%` })
				.replace('~output', <span classes={css.output}>20%</span>)
		);
	});

	it('accepts a min and max to calculate width', () => {
		const h = harness(() => <Progress min={100} max={200} value={150} />);

		h.expect(
			template
				.setProperty('~progressbar', 'aria-valuemax', '200')
				.setProperty('~progressbar', 'aria-valuemin', '100')
				.setProperty('~progressbar', 'aria-valuenow', '150')
		);
	});

	it('accepts children', () => {
		const value = 250;
		const max = 750;
		const h = harness(() => (
			<Progress value={value} max={max}>
				{{
					output: (value, percent) => `${value} of ${max} is ${percent}%`
				}}
			</Progress>
		));

		h.expect(
			template
				.setProperty('~progressbar', 'aria-valuemax', '750')
				.setProperty('~progressbar', 'aria-valuenow', '250')
				.setProperty('~progressbar', 'aria-valuetext', '250 of 750 is 33%')
				.setProperty('~progress', 'styles', { width: `${33}%` })
				.replace('~output', <span classes={css.output}>250 of 750 is 33%</span>)
		);
	});

	it('can hide output', () => {
		const h = harness(() => <Progress value={50} showOutput={false} />);

		h.expect(template.remove('~output'));
	});

	it('can accept an id', () => {
		const h = harness(() => <Progress value={50} widgetId="my-id" />);

		h.expect(template.setProperty('~progressbar', 'id', 'my-id'));
	});

	it('accepts aria properties', () => {
		const h = harness(() => (
			<Progress value={50} aria={{ describedBy: 'foo', valueNow: 'overridden' }} />
		));
		h.expect(template.setProperty('~progressbar', 'aria-describedby', 'foo'));
	});
});
