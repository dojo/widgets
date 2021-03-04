const { describe, it } = intern.getInterface('bdd');
import * as classes from '../../../theme/default/loading-indicator.m.css';
import LoadingIndicator from '../..';
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import harness from '@dojo/framework/testing/harness/harness';
import { tsx } from '@dojo/framework/core/vdom';

const baseTemplate = assertionTemplate(() => (
	<div assertion-key="root" classes={[undefined, classes.root, false]} role="progressbar">
		<div classes={classes.buffer} />
		<div assertion-key="bar" classes={[classes.bar, classes.primary]}>
			<span classes={classes.inner} />
		</div>
	</div>
));

describe('LoadingIndicator', () => {
	it('Renders default state', () => {
		const h = harness(() => <LoadingIndicator />);
		h.expect(baseTemplate);
	});

	it('does not render the bar when inactive', () => {
		const h = harness(() => <LoadingIndicator active={false} />);
		h.expect(
			baseTemplate
				.remove('~bar')
				.setProperty('~root', 'classes', [undefined, classes.root, classes.inactive])
		);
	});
});
