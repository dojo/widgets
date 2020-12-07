const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import { compareId, compareForId } from '../../../common/tests/support/test-helpers';

import { tsx, create } from '@dojo/framework/core/vdom';
import * as sinon from 'sinon';
import harness from '@dojo/framework/testing/harness/harness';

import Label from '../../../label/index';
import Radio from '../../index';
import * as css from '../../../theme/default/radio.m.css';
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
	required = undefined
}: { [key: string]: boolean | undefined } = {}) =>
	assertionTemplate(() => (
		<div
			key="root"
			classes={[
				undefined,
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
			<div classes={css.inputWrapper}>
				<input
					assertion-key="input"
					id=""
					classes={css.input}
					checked={checked}
					disabled={disabled}
					focus={focused}
					aria-invalid={valid === false ? 'true' : undefined}
					name={undefined}
					readonly={readOnly}
					aria-readonly={readOnly === true ? 'true' : undefined}
					required={required}
					type="radio"
					value={undefined}
					onblur={noop}
					onchange={noop}
					onfocus={noop}
					onpointerenter={noop}
					onpointerleave={noop}
				/>
				<div classes={css.radioBackground}>
					<div classes={css.radioOuter} />
					<div classes={css.radioInner} />
				</div>
			</div>
			{label ? (
				<Label
					key="label"
					classes={undefined}
					variant={undefined}
					theme={undefined}
					disabled={disabled}
					focused={false}
					forId=""
					valid={valid}
					readOnly={readOnly}
					hidden={undefined}
					required={required}
					secondary={true}
				>
					foo
				</Label>
			) : null}
		</div>
	));

registerSuite('Radio', {
	tests: {
		'default properties'() {
			const h = harness(() => <Radio checked={false} onValue={noop} />, [compareId]);
			h.expect(expected());
		},

		'custom properties'() {
			const h = harness(
				() => (
					<Radio
						aria={{ describedBy: 'foo' }}
						checked={true}
						onValue={noop}
						widgetId="foo"
						name="bar"
					/>
				),
				[compareId]
			);

			h.expect(
				expected({ checked: true })
					.setProperty('~input', 'aria-describedby', 'foo')
					.setProperty('~input', 'name', 'bar')
			);
		},

		label() {
			const h = harness(
				() => (
					<Radio checked={false} onValue={noop}>
						foo
					</Radio>
				),
				[compareId, compareForId]
			);

			h.expect(expected({ label: true }));
		},

		'named child label'() {
			const h = harness(
				() => (
					<Radio checked={false} onValue={noop}>
						{{ label: 'foo' }}
					</Radio>
				),
				[compareId, compareForId]
			);

			h.expect(expected({ label: true }));
		},

		'state classes'() {
			let valid = false;
			let disabled = true;
			let readOnly = true;
			let required = true;
			const h = harness(
				() => (
					<Radio
						checked={false}
						onValue={noop}
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
					<Radio
						checked={false}
						onValue={noop}
						valid={false}
						disabled={true}
						readOnly={true}
						required={true}
					>
						foo
					</Radio>
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
			const h = harness(() => <Radio checked={false} onValue={noop} />, {
				middleware: [[focus, focusMock]],
				customComparator: [compareId]
			});
			h.expect(expected({ focused: true }));
		},

		events() {
			const onBlur = sinon.stub();
			const onValue = sinon.stub();
			const onFocus = sinon.stub();

			const h = harness(() => (
				<Radio checked={false} onBlur={onBlur} onValue={onValue} onFocus={onFocus} />
			));

			h.trigger('input', 'onblur', stubEvent);
			assert.isTrue(onBlur.called, 'onBlur called');
			h.trigger('input', 'onchange', stubEvent);
			assert.isTrue(onValue.called, 'onChange called');
			h.trigger('input', 'onfocus', stubEvent);
			assert.isTrue(onFocus.called, 'onFocus called');
		}
	}
});
