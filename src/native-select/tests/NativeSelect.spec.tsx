const { describe, it } = intern.getInterface('bdd');
import { tsx } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import {
	compareId,
	compareTheme,
	compareFor,
	createHarness,
	noop
} from '../../common/tests/support/test-helpers';
import HelperText from '../../helper-text';
import * as css from '../../theme/default/native-select.m.css';
import { NativeSelect } from '../index';
import { stub } from 'sinon';
const { assert } = intern.getPlugin('chai');

const options = [{ value: 'dog' }, { value: 'cat' }, { value: 'fish' }];

const harness = createHarness([compareTheme]);

const baseTemplate = assertionTemplate(() => (
	<div classes={[css.root, undefined, undefined]} key="root">
		<label assertion-key="label" type="select" for="something" />
		<select
			key="native-select"
			onchange={noop}
			disabled={undefined}
			name={undefined}
			required={undefined}
			id="something"
			size={undefined}
			onfocus={noop}
			onblur={noop}
			class={css.select}
		>
			{options.map(({ value }, index) => {
				return (
					<option key={`option-${index}`} value={value} disabled={false} selected={false}>
						{value}
					</option>
				);
			})}
		</select>
		<HelperText key="helperText" text={undefined} />
	</div>
));

describe('Native Select', () => {
	it('renders', () => {
		const h = harness(() => <NativeSelect onValue={() => {}} options={options} />, [
			compareFor,
			compareId
		]);
		h.expect(baseTemplate);
	});

	it('takes optional properties', () => {
		const h = harness(
			() => (
				<NativeSelect
					onValue={() => {}}
					options={options}
					initialValue="cat"
					disabled={true}
					helperText="Pick a pet type"
					label="Pets"
					required={true}
					name="Pet select"
					size={3}
				/>
			),
			[compareFor, compareId]
		);

		const optionalPropertyTemplate = baseTemplate
			.setProperty('@native-select', 'disabled', true)
			.setProperty('@native-select', 'required', true)
			.setProperty('@native-select', 'name', 'Pet select')
			.setProperty('@native-select', 'size', 3)
			.setProperty('@helperText', 'text', 'Pick a pet type')
			.setProperty('@option-1', 'selected', true)
			.setProperty('@root', 'classes', [css.root, css.disabled, css.required])
			.replaceChildren('~label', () => {
				return ['Pets'];
			});

		h.expect(optionalPropertyTemplate);
	});

	it('calls onValue when a select item is selected', () => {
		const changeEvent = {
			target: {
				value: 'cat'
			}
		};

		const onValueStub = stub();

		const h = harness(() => <NativeSelect onValue={onValueStub} options={options} />, [
			compareFor,
			compareId
		]);

		h.trigger('@native-select', 'onchange', changeEvent);

		assert.isTrue(onValueStub.calledOnceWith('cat'));
	});
});
