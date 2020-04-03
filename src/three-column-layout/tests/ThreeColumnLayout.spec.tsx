const { describe, it } = intern.getInterface('bdd');
import harness from '@dojo/framework/testing/harness';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import { tsx } from '@dojo/framework/core/vdom';
import fixedCss from '../styles/three-column-layout.m.css';
import baseCss from '../../common/styles/base.m.css';
import css from '../../theme/default/three-column-layout.m.css';

import ThreeColumnLayout from '../index';

describe('ThreeColumnLayout', () => {
	const leading = <div>Leading</div>;
	const center = <div>Center</div>;
	const trailing = <div>Trailing</div>;
	const baseAssertion = assertionTemplate(() => (
		<div classes={[undefined, fixedCss.root, css.root]}>
			<div key="leading" classes={[css.leading, false]}>
				{leading}
			</div>
			<div key="center" classes={[fixedCss.center, css.center]}>
				{center}
			</div>
			<div key="trailing" classes={[css.trailing, false]}>
				{trailing}
			</div>
		</div>
	));

	it('renders', () => {
		const h = harness(() => (
			<ThreeColumnLayout>
				{{
					leading,
					center,
					trailing
				}}
			</ThreeColumnLayout>
		));

		h.expect(baseAssertion);
	});
});
