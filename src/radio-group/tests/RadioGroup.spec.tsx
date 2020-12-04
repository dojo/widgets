const { describe, it } = intern.getInterface('bdd');
import * as css from '../../theme/default/radio-group.m.css';
import Radio from '../../radio/index';
import RadioGroup from '../index';
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import harness from '@dojo/framework/testing/harness/harness';
import { tsx } from '@dojo/framework/core/vdom';

function noop() {}

describe('RadioGroup', () => {
	const template = assertionTemplate(() => (
		<fieldset key="root" classes={[undefined, css.root]} name="test" />
	));

	it('renders with options', () => {
		const h = harness(() => (
			<RadioGroup
				name="test"
				onValue={noop}
				options={[{ value: 'cat' }, { value: 'fish' }, { value: 'dog' }]}
			/>
		));
		const optionTemplate = template.setChildren('@root', () => [
			<Radio
				name="test"
				value="cat"
				checked={false}
				onValue={noop}
				theme={undefined}
				variant={undefined}
				classes={undefined}
			>
				cat
			</Radio>,
			<Radio
				name="test"
				value="fish"
				checked={false}
				onValue={noop}
				theme={undefined}
				variant={undefined}
				classes={undefined}
			>
				fish
			</Radio>,
			<Radio
				name="test"
				value="dog"
				checked={false}
				onValue={noop}
				theme={undefined}
				variant={undefined}
				classes={undefined}
			>
				dog
			</Radio>
		]);
		h.expect(optionTemplate);
	});

	it('renders with a label', () => {
		const h = harness(() => (
			<RadioGroup name="test" onValue={noop} options={[{ value: 'cat' }]}>
				{{
					label: 'test label'
				}}
			</RadioGroup>
		));
		const labelTemplate = template.setChildren('@root', () => [
			<legend classes={css.legend}>test label</legend>,
			<Radio
				name="test"
				value="cat"
				checked={false}
				onValue={noop}
				theme={undefined}
				variant={undefined}
				classes={undefined}
			>
				cat
			</Radio>
		]);
		h.expect(labelTemplate);
	});

	it('renders with initial value', () => {
		const h = harness(() => (
			<RadioGroup
				initialValue="fish"
				name="test"
				onValue={noop}
				options={[{ value: 'cat' }, { value: 'fish' }, { value: 'dog' }]}
			/>
		));
		const optionTemplate = template.setChildren('@root', () => [
			<Radio
				name="test"
				value="cat"
				checked={false}
				onValue={noop}
				theme={undefined}
				variant={undefined}
				classes={undefined}
			>
				cat
			</Radio>,
			<Radio
				name="test"
				value="fish"
				checked={true}
				onValue={noop}
				theme={undefined}
				variant={undefined}
				classes={undefined}
			>
				fish
			</Radio>,
			<Radio
				name="test"
				value="dog"
				checked={false}
				onValue={noop}
				theme={undefined}
				variant={undefined}
				classes={undefined}
			>
				dog
			</Radio>
		]);
		h.expect(optionTemplate);
		h.trigger('[value="cat"]', 'onValue', true);
	});

	it('renders with a value', () => {
		const h = harness(() => (
			<RadioGroup
				value="fish"
				name="test"
				onValue={noop}
				options={[{ value: 'cat' }, { value: 'fish' }, { value: 'dog' }]}
			/>
		));
		const optionTemplate = template.setChildren('@root', () => [
			<Radio
				name="test"
				value="cat"
				checked={false}
				onValue={noop}
				theme={undefined}
				variant={undefined}
				classes={undefined}
			>
				cat
			</Radio>,
			<Radio
				name="test"
				value="fish"
				checked={true}
				onValue={noop}
				theme={undefined}
				variant={undefined}
				classes={undefined}
			>
				fish
			</Radio>,
			<Radio
				name="test"
				value="dog"
				checked={false}
				onValue={noop}
				theme={undefined}
				variant={undefined}
				classes={undefined}
			>
				dog
			</Radio>
		]);
		h.expect(optionTemplate);
		h.trigger('[value="cat"]', 'onValue', true);
		h.expect(optionTemplate);
	});

	it('renders with custom renderer', () => {
		const h = harness(() => (
			<RadioGroup name="test" onValue={noop} options={[{ value: 'cat' }]}>
				{{
					label: 'custom render label',
					radios: () => {
						return [
							<span>custom label</span>,
							<Radio
								name="test"
								value="cat"
								checked={false}
								onValue={noop}
								theme={undefined}
								variant={undefined}
								classes={undefined}
							>
								cat
							</Radio>,
							<hr />
						];
					}
				}}
			</RadioGroup>
		));
		const customTemplate = template.setChildren('@root', () => [
			<legend classes={css.legend}>custom render label</legend>,
			<span>custom label</span>,
			<Radio
				name="test"
				value="cat"
				checked={false}
				onValue={noop}
				theme={undefined}
				variant={undefined}
				classes={undefined}
			>
				cat
			</Radio>,
			<hr />
		]);
		h.expect(customTemplate);
	});
});
