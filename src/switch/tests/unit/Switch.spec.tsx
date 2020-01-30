const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import { compareId, compareForId } from '../../../common/tests/support/test-helpers';

import { tsx, create } from '@dojo/framework/core/vdom';
import * as sinon from 'sinon';
import harness from '@dojo/framework/testing/harness';

import Label from '../../../label/index';
import Switch from '../../index';
import * as css from '../../../theme/default/switch.m.css';
import { noop, stubEvent } from '../../../common/tests/support/test-helpers';
import focus from '@dojo/framework/core/middleware/focus';

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

const expected = ({
	label = false,
	checked = false,
	disabled = undefined,
	focused = false,
	valid = undefined,
	readOnly = undefined,
	required = undefined,
	offLabel = undefined,
	onLabel = undefined
}: { [key: string]: boolean | undefined } = {}) =>
	assertionTemplate(() => (
		<div
			key="root"
			classes={[
				css.root,
				checked ? css.checked : null,
				disabled ? css.disabled : null,
				focused ? css.focused : null,
				valid === false ? css.invalid : null,
				valid === true ? css.valid : null,
				readOnly ? css.readonly : null,
				required ? css.required : null
			]}
		>
			{offLabel ? (
				<div key="offlabel" classes={css.offLabel} aria-hidden={checked ? null : 'true'}>
					{['off']}
				</div>
			) : null}
			<div classes={css.inputWrapper}>
				<div classes={css.track} />
				<div classes={css.underlay}>
					<div classes={css.thumb}>
						<input
							assertion-key="input"
							id=""
							classes={css.nativeControl}
							checked={checked}
							disabled={disabled}
							focus={focused}
							aria-invalid={valid === false ? 'true' : null}
							name={undefined}
							readonly={readOnly}
							aria-readonly={readOnly === true ? 'true' : null}
							required={required}
							type="checkbox"
							value={undefined}
							role="switch"
							aria-checked={checked}
							onblur={noop}
							onchange={noop}
							onfocus={noop}
							onpointerenter={noop}
							onpointerleave={noop}
						/>
					</div>
				</div>
			</div>
			{onLabel ? (
				<div key="onLabel" classes={css.onLabel} aria-hidden={checked ? null : 'true'}>
					{['on']}
				</div>
			) : null}
			{label ? (
				<Label
					key="label"
					theme={undefined}
					classes={undefined}
					disabled={disabled}
					focused={false}
					hidden={undefined}
					valid={valid}
					readOnly={readOnly}
					required={required}
					forId=""
					secondary={true}
				>
					foo
				</Label>
			) : null}
		</div>
	));

registerSuite('Switch', {
	tests: {
		'default properties'() {
			const h = harness(() => <Switch />, [compareId]);
			h.expect(expected());
		},

		'custom properties'() {
			const h = harness(
				() => (
					<Switch
						aria={{ describedBy: 'foo' }}
						checked={true}
						widgetId="foo"
						name="bar"
						onLabel={'on'}
						offLabel={'off'}
					/>
				),
				[compareId]
			);

			h.expect(
				expected({ checked: true, onLabel: true, offLabel: true })
					.setProperty('~input', 'aria-describedby', 'foo')
					.setProperty('~input', 'name', 'bar')
					.setProperty('@offlabel', 'aria-hidden', 'true')
					.setProperty('@onLabel', 'aria-hidden', null)
			);
		},

		label() {
			const h = harness(() => <Switch label="foo" />, [compareId, compareForId]);

			h.expect(expected({ label: true }));
		},

		'state classes'() {
			let valid = false;
			let disabled = true;
			let readOnly = true;
			let required = true;
			const h = harness(
				() => (
					<Switch
						valid={valid}
						disabled={disabled}
						readOnly={readOnly}
						required={required}
					/>
				),
				[compareForId, compareId]
			);

			h.expect(expected({ valid, disabled, readOnly, required }));

			valid = true;
			disabled = false;
			readOnly = false;
			required = false;

			h.expect(expected({ valid, disabled, readOnly, required }));
		},

		'state properties on label'() {
			const h = harness(
				() => (
					<Switch
						label="foo"
						valid={false}
						disabled={true}
						readOnly={true}
						required={true}
					/>
				),
				[compareId, compareForId]
			);

			h.expect(
				expected({
					label: true,
					disabled: true,
					readOnly: true,
					required: true,
					valid: false
				})
			);
		},

		'focused class'() {
			const focusMock = createMockFocusMiddleware({
				shouldFocus: true,
				focused: true,
				isFocused: true
			});
			const h = harness(() => <Switch />, {
				middleware: [[focus, focusMock]],
				customComparator: [compareId]
			});
			h.expect(expected({ focused: true }));
		},

		events() {
			const onBlur = sinon.stub();
			const onValue = sinon.stub();
			const onFocus = sinon.stub();

			const h = harness(() => <Switch onBlur={onBlur} onValue={onValue} onFocus={onFocus} />);

			h.trigger('input', 'onblur', stubEvent);
			assert.isTrue(onBlur.called, 'onBlur called');
			h.trigger('input', 'onchange', stubEvent);
			assert.isTrue(onValue.called, 'onChange called');
			h.trigger('input', 'onfocus', stubEvent);
			assert.isTrue(onFocus.called, 'onFocus called');
		}
	}
});
