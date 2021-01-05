const { describe, it } = intern.getInterface('bdd');
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import harness from '@dojo/framework/testing/harness/harness';
import { tsx } from '@dojo/framework/core/vdom';
import CheckboxGroup from '../index';
import * as css from '../../theme/default/checkbox-group.m.css';
import Checkbox from '../../checkbox/index';

function noop() {}

describe('CheckboxGroup', () => {
	const template = assertionTemplate(() => (
		<fieldset key="root" classes={[undefined, css.root]} name="test" />
	));

	it('renders with options', () => {
		const h = harness(() => (
			<CheckboxGroup
				onValue={noop}
				name="test"
				options={[{ value: 'cat' }, { value: 'fish' }, { value: 'dog' }]}
			/>
		));
		const optionTemplate = template.setChildren('@root', () => [
			<Checkbox
				name="test"
				value="cat"
				checked={false}
				onValue={noop}
				theme={undefined}
				classes={undefined}
				variant={undefined}
			>
				cat
			</Checkbox>,
			<Checkbox
				name="test"
				value="fish"
				checked={false}
				onValue={noop}
				theme={undefined}
				classes={undefined}
				variant={undefined}
			>
				fish
			</Checkbox>,
			<Checkbox
				name="test"
				value="dog"
				checked={false}
				onValue={noop}
				theme={undefined}
				classes={undefined}
				variant={undefined}
			>
				dog
			</Checkbox>
		]);
		h.expect(optionTemplate);
	});

	it('renders with a label', () => {
		const h = harness(() => (
			<CheckboxGroup onValue={noop} name="test" options={[{ value: 'cat' }]}>
				{{
					label: 'test label'
				}}
			</CheckboxGroup>
		));
		const labelTemplate = template.setChildren('@root', () => [
			<legend classes={css.legend}>test label</legend>,
			<Checkbox
				name="test"
				value="cat"
				checked={false}
				onValue={noop}
				theme={undefined}
				classes={undefined}
				variant={undefined}
			>
				cat
			</Checkbox>
		]);
		h.expect(labelTemplate);
	});

	it('renders with initial value', () => {
		const h = harness(() => (
			<CheckboxGroup
				onValue={noop}
				name="test"
				options={[{ value: 'cat' }, { value: 'fish' }, { value: 'dog' }]}
				initialValue={['fish']}
			/>
		));
		const optionTemplate = template.setChildren('@root', () => [
			<Checkbox
				name="test"
				value="cat"
				checked={false}
				onValue={noop}
				theme={undefined}
				classes={undefined}
				variant={undefined}
			>
				cat
			</Checkbox>,
			<Checkbox
				name="test"
				value="fish"
				checked={true}
				onValue={noop}
				theme={undefined}
				classes={undefined}
				variant={undefined}
			>
				fish
			</Checkbox>,
			<Checkbox
				name="test"
				value="dog"
				checked={false}
				onValue={noop}
				theme={undefined}
				classes={undefined}
				variant={undefined}
			>
				dog
			</Checkbox>
		]);
		h.expect(optionTemplate);
	});

	it('renders with value', () => {
		const h = harness(() => (
			<CheckboxGroup
				onValue={noop}
				name="test"
				options={[{ value: 'cat' }, { value: 'fish' }, { value: 'dog' }]}
				value={['fish']}
			/>
		));
		const optionTemplate = template.setChildren('@root', () => [
			<Checkbox
				name="test"
				value="cat"
				checked={false}
				onValue={noop}
				theme={undefined}
				classes={undefined}
				variant={undefined}
			>
				cat
			</Checkbox>,
			<Checkbox
				name="test"
				value="fish"
				checked={true}
				onValue={noop}
				theme={undefined}
				classes={undefined}
				variant={undefined}
			>
				fish
			</Checkbox>,
			<Checkbox
				name="test"
				value="dog"
				checked={false}
				onValue={noop}
				theme={undefined}
				classes={undefined}
				variant={undefined}
			>
				dog
			</Checkbox>
		]);
		h.expect(optionTemplate);
	});

	it('renders with custom renderer', () => {
		const h = harness(() => (
			<CheckboxGroup onValue={noop} name="test" options={[{ value: 'cat' }]}>
				{{
					label: 'custom render label',
					checkboxes: () => {
						return [
							<span>custom label</span>,
							<Checkbox
								name="test"
								value="cat"
								checked={false}
								onValue={noop}
								theme={undefined}
								classes={undefined}
								variant={undefined}
							>
								cat
							</Checkbox>,
							<hr />
						];
					}
				}}
			</CheckboxGroup>
		));
		const customTemplate = template.setChildren('@root', () => [
			<legend classes={css.legend}>custom render label</legend>,
			<span>custom label</span>,
			<Checkbox
				name="test"
				value="cat"
				checked={false}
				onValue={noop}
				theme={undefined}
				classes={undefined}
				variant={undefined}
			>
				cat
			</Checkbox>,
			<hr />
		]);
		h.expect(customTemplate);
	});
});
