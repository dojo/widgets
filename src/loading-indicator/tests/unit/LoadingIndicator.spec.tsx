const { describe, it } = intern.getInterface('bdd');
import * as classes from '../../../theme/default/loading-indicator.m.css';
import LoadingIndicator from '../..';
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import harness from '@dojo/framework/testing/harness/harness';
import { tsx } from '@dojo/framework/core/vdom';

const baseTemplate = assertionTemplate(() => (
	<virtual>
		<div
			assertion-key="root"
			classes={[undefined, classes.root, false, classes.linear]}
			role="progressbar"
		>
			<div classes={classes.buffer} />
			<div assertion-key="bar" classes={[classes.bar, classes.primary]}>
				<span classes={classes.inner} />
			</div>
		</div>
	</virtual>
));

const circularTemplate = assertionTemplate(() => (
	<virtual>
		<div
			assertion-key="root"
			classes={[undefined, classes.root, false, classes.circular, classes.small]}
			role="progressbar"
		>
			<div classes={classes.circularContainer}>
				<div classes={classes.spinnerLayer}>
					<div classes={[classes.circleClipper, classes.circleLeft]}>
						<svg
							classes={classes.circleGraphic}
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<circle
								cx="12"
								cy="12"
								r="8.75"
								stroke-dasharray="54.978"
								stroke-dashoffset="27.489"
								stroke-width="2.5"
							/>
						</svg>
					</div>
					<div classes={classes.gapPatch}>
						<svg
							classes={classes.circleGraphic}
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<circle
								cx="12"
								cy="12"
								r="8.75"
								stroke-dasharray="54.978"
								stroke-dashoffset="27.489"
								stroke-width="2"
							/>
						</svg>
					</div>
					<div classes={[classes.circleClipper, classes.circleRight]}>
						<svg
							classes={classes.circleGraphic}
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<circle
								cx="12"
								cy="12"
								r="8.75"
								stroke-dasharray="54.978"
								stroke-dashoffset="27.489"
								stroke-width="2.5"
							/>
						</svg>
					</div>
				</div>
			</div>
		</div>
	</virtual>
));

describe('LoadingIndicator', () => {
	it('Renders default state', () => {
		const h = harness(() => <LoadingIndicator />);
		h.expect(baseTemplate);
	});

	it('renders circular loader', () => {
		const h = harness(() => <LoadingIndicator type={'circular'} />);
		h.expect(circularTemplate);
	});

	it('does not render the bar when inactive', () => {
		const h = harness(() => <LoadingIndicator active={false} />);
		h.expect(
			baseTemplate
				.remove('~bar')
				.setProperty('~root', 'classes', [
					undefined,
					classes.root,
					classes.inactive,
					classes.linear
				])
		);
	});

	it('renders large circular loader', () => {
		const h = harness(() => <LoadingIndicator type={'circular'} size={'large'} />);
		h.expect(
			circularTemplate.setProperty('~root', 'classes', [
				undefined,
				classes.root,
				false,
				classes.circular,
				classes.large
			])
		);
	});
});
