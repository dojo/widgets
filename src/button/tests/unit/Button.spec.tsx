const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import focus from '@dojo/framework/core/middleware/focus';
import { create, tsx } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import harness from '@dojo/framework/testing/harness/harness';

import { compareId, noop, stubEvent } from '../../../common/tests/support/test-helpers';
import * as css from '../../../theme/default/button.m.css';
import Button from '../../index';
import Icon from '../../../icon/index';

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
		assertion-key="button"
		classes={[undefined, css.root, null, null, css.contained, null, null]}
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

		outlined() {
			const h = harness(() => <Button kind="outlined" />, [compareId]);
			h.expect(
				template.setProperty('@button', 'classes', [
					undefined,
					css.root,
					null,
					null,
					null,
					css.outlined,
					null
				])
			);
		},

		text() {
			const h = harness(() => <Button kind="text" />, [compareId]);
			h.expect(
				template.setProperty('@button', 'classes', [
					undefined,
					css.root,
					null,
					css.text,
					null,
					null,
					null
				])
			);
		},

		contained() {
			const h = harness(() => <Button kind="contained" />, [compareId]);
			h.expect(
				template.setProperty('@button', 'classes', [
					undefined,
					css.root,
					null,
					null,
					css.contained,
					null,
					null
				])
			);
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
		},

		'renders labels'() {
			const h = harness(() => <Button>{{ label: 'Text' }}</Button>, [compareId]);
			h.expect(
				template.replaceChildren('button', () => [<span classes={css.label}>Text</span>])
			);
		},

		'renders icons before labels'() {
			const h = harness(
				() => (
					<Button>
						{{
							label: 'Text',
							icon: <Icon type="starIcon" size="small" />
						}}
					</Button>
				),
				[compareId]
			);
			h.expect(
				template.replaceChildren('button', () => [
					<span classes={css.icon}>
						<Icon type="starIcon" size="small" />
					</span>,
					<span classes={css.label}>Text</span>
				])
			);
		},

		'renders icons after labels'() {
			const h = harness(
				() => (
					<Button iconPosition="after">
						{{
							label: 'Text',
							icon: <Icon type="starIcon" size="small" />
						}}
					</Button>
				),
				[compareId]
			);
			h.expect(
				template.replaceChildren('button', () => [
					<span classes={css.label}>Text</span>,
					<span classes={css.icon}>
						<Icon type="starIcon" size="small" />
					</span>
				])
			);
		},

		'renders icon only buttons'() {
			const h = harness(
				() => (
					<Button>
						{{
							icon: <Icon type="starIcon" size="small" />
						}}
					</Button>
				),
				[compareId]
			);
			h.expect(
				template
					.setProperty('button', 'classes', [
						undefined,
						css.root,
						null,
						null,
						css.contained,
						null,
						css.iconOnly
					])
					.replaceChildren('button', () => [
						<span classes={css.icon}>
							<Icon type="starIcon" size="small" />
						</span>
					])
			);
		}
	}
});
