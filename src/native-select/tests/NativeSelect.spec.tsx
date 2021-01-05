const { describe, it } = intern.getInterface('bdd');
import { tsx } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import {
	compareId,
	compareTheme,
	createHarness,
	noop,
	compareForId,
	stubEvent
} from '../../common/tests/support/test-helpers';
import HelperText from '../../helper-text';
import * as css from '../../theme/default/native-select.m.css';
import { NativeSelect } from '../index';
import { stub } from 'sinon';
import Icon from '../../icon';
import Label from '../../label';
const { assert } = intern.getPlugin('chai');

const options = [{ value: 'dog' }, { value: 'cat' }, { value: 'fish' }];

const harness = createHarness([compareTheme]);

const baseTemplate = assertionTemplate(() => (
	<div classes={[undefined, css.root, undefined, undefined, undefined]} key="root">
		<div classes={css.inputWrapper}>
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
				classes={css.select}
			>
				<option key="blank-option" value="" />
				{options.map(({ value }, index) => {
					return (
						<option
							key={`option-${index}`}
							value={value}
							disabled={false}
							selected={false}
						>
							{value}
						</option>
					);
				})}
			</select>
			<span classes={css.arrow}>
				<Icon type="downIcon" theme={{}} classes={undefined} variant={undefined} />
			</span>
		</div>
		<HelperText
			variant={undefined}
			classes={undefined}
			theme={undefined}
			key="helperText"
			text={undefined}
		/>
	</div>
));

describe('Native Select', () => {
	it('renders', () => {
		const h = harness(() => <NativeSelect onValue={() => {}} options={options} />, [
			compareForId,
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
					required={true}
					name="Pet select"
					size={3}
				>
					Pets
				</NativeSelect>
			),
			[compareForId, compareId]
		);

		const optionalPropertyTemplate = baseTemplate
			.setProperty('@native-select', 'disabled', true)
			.setProperty('@native-select', 'required', true)
			.setProperty('@native-select', 'name', 'Pet select')
			.setProperty('@native-select', 'size', 3)
			.setProperty('@helperText', 'text', 'Pick a pet type')
			.setProperty('@option-1', 'selected', true)
			.setProperty('@root', 'classes', [
				undefined,
				css.root,
				css.disabled,
				css.required,
				undefined
			])
			.prepend('@root', () => [
				<Label
					assertion-key="label"
					theme={{}}
					classes={undefined}
					variant={undefined}
					disabled={true}
					forId={'something'}
					required={true}
					active={true}
					focused={false}
				>
					Pets
				</Label>
			])
			.remove('@blank-option');

		h.expect(optionalPropertyTemplate);
	});

	it('takes a named label child', () => {
		const h = harness(
			() => (
				<NativeSelect
					onValue={() => {}}
					options={options}
					initialValue="cat"
					disabled={true}
					helperText="Pick a pet type"
					required={true}
					name="Pet select"
					size={3}
				>
					{{ label: 'Pets' }}
				</NativeSelect>
			),
			[compareForId, compareId]
		);

		const optionalPropertyTemplate = baseTemplate
			.setProperty('@native-select', 'disabled', true)
			.setProperty('@native-select', 'required', true)
			.setProperty('@native-select', 'name', 'Pet select')
			.setProperty('@native-select', 'size', 3)
			.setProperty('@helperText', 'text', 'Pick a pet type')
			.setProperty('@option-1', 'selected', true)
			.setProperty('@root', 'classes', [
				undefined,
				css.root,
				css.disabled,
				css.required,
				undefined
			])
			.prepend('@root', () => [
				<Label
					assertion-key="label"
					theme={{}}
					classes={undefined}
					variant={undefined}
					disabled={true}
					forId={'something'}
					required={true}
					active={true}
					focused={false}
				>
					Pets
				</Label>
			])
			.remove('@blank-option');

		h.expect(optionalPropertyTemplate);
	});

	it('controlled value', () => {
		const h = harness(
			() => (
				<NativeSelect
					onValue={() => {}}
					options={options}
					disabled={true}
					helperText="Pick a pet type"
					required={true}
					name="Pet select"
					size={3}
					value="dog"
				>
					Pets
				</NativeSelect>
			),
			[compareForId, compareId]
		);

		const controlledTemplate = baseTemplate
			.setProperty('@native-select', 'disabled', true)
			.setProperty('@native-select', 'required', true)
			.setProperty('@native-select', 'name', 'Pet select')
			.setProperty('@native-select', 'size', 3)
			.setProperty('@helperText', 'text', 'Pick a pet type')
			.setProperty('@option-0', 'selected', true)
			.setProperty('@root', 'classes', [
				undefined,
				css.root,
				css.disabled,
				css.required,
				undefined
			])
			.prepend('@root', () => [
				<Label
					assertion-key="label"
					theme={{}}
					classes={undefined}
					variant={undefined}
					disabled={true}
					forId={'something'}
					required={true}
					active={true}
					focused={false}
				>
					Pets
				</Label>
			])
			.remove('@blank-option');

		h.expect(controlledTemplate);
	});

	it('calls onValue when a select item is selected', () => {
		const changeEvent = {
			target: {
				value: 'cat'
			}
		};

		const onValueStub = stub();

		const h = harness(() => <NativeSelect onValue={onValueStub} options={options} />, [
			compareForId,
			compareId
		]);

		h.trigger('@native-select', 'onchange', changeEvent);

		assert.isTrue(onValueStub.calledOnceWith('cat'));
	});

	it('calls onBlur when select loses focus', () => {
		const onBlurStub = stub();

		const h = harness(() => <NativeSelect onBlur={onBlurStub} options={options} />, [
			compareForId,
			compareId
		]);

		h.trigger('@native-select', 'onblur', stubEvent);

		assert.isTrue(onBlurStub.calledOnce);
	});

	it('calls onFocus when select gains focus', () => {
		const onFocusStub = stub();

		const h = harness(() => <NativeSelect onFocus={onFocusStub} options={options} />, [
			compareForId,
			compareId
		]);

		h.trigger('@native-select', 'onfocus', stubEvent);

		assert.isTrue(onFocusStub.calledOnce);
	});
});
