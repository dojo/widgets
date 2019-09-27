const { describe, it } = intern.getInterface('bdd');
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import harness from '@dojo/framework/testing/harness';
import { tsx } from '@dojo/framework/core/vdom';
import CheckboxGroup from '../index';

function noop() {}

describe('CheckboxGroup', () => {
	const template = assertionTemplate(() => <div key="root" classes={css.root} />);

	it('renders', () => {
		const h = harness(() => <CheckboxGroup onValue={noop} name="test" options={} />);
		h.expect(template);
	});
});
