const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import focus from '@dojo/framework/core/middleware/focus';
import { create, tsx } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import harness from '@dojo/framework/testing/harness/harness';

import { compareId, noop, stubEvent } from '../../../common/tests/support/test-helpers';
import * as css from '../../../theme/default/button.m.css';
import Button from '../../index';

const middlewareFactory = create();
function createMockFocusMiddleware({
	shouldFocus = false,
	focused = false,
	isFocused = false
} = {}) {
	return () =>
		middlewareFactory(() => ({
			shouldFocus: () => shouldFocus,
			focused: () => focused,
			isFocused: () => isFocused
		}))();
}

const template = assertionTemplate(() => (
	<button
		classes={[undefined, css.root, null, null]}
		disabled={undefined}
		id="button-test"
		focus={false}
		name={undefined}
		type="button"
		value={undefined}
		onblur={noop}
		onclick={noop}
		onfocus={noop}
		onpointerenter={noop}
		onpointerleave={noop}
		onpointerdown={noop}
		onpointerup={noop}
		aria-pressed={undefined}
		title={undefined}
	>
		<span classes={css.label} />
	</button>
));

registerSuite('Button', {
	tests: {
		'no content'() {
			const h = harness(() => <Button />, [compareId]);
			h.expect(template);
		},

		'calls focus on button node'() {
			const focusMock = createMockFocusMiddleware({
				shouldFocus: true,
				focused: true,
				isFocused: true
			});
			const h = harness(() => <Button />, {
				middleware: [[focus, focusMock]],
				customComparator: [compareId]
			});
			h.expect(template.setProperty('button', 'focus', true));
		},

		events() {
			let blurred = false;
			let clicked = false;
			let focused = false;

			const h = harness(() => (
				<Button
					onBlur={() => {
						blurred = true;
					}}
					onClick={() => {
						clicked = true;
					}}
					onFocus={() => {
						focused = true;
					}}
				/>
			));

			h.trigger('button', 'onblur');
			h.trigger('button', 'onclick', stubEvent);
			h.trigger('button', 'onfocus');

			assert.isTrue(blurred);
			assert.isTrue(clicked);
			assert.isTrue(focused);
		}
	}
});
