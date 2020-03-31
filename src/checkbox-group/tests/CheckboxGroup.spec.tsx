const { describe, it } = intern.getInterface('bdd');
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import harness from '@dojo/framework/testing/harness';
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
			<Checkbox name="test" value="cat" label="cat" checked={undefined} onValue={noop} />,
			<Checkbox name="test" value="fish" label="fish" checked={undefined} onValue={noop} />,
			<Checkbox name="test" value="dog" label="dog" checked={undefined} onValue={noop} />
		]);
		h.expect(optionTemplate);
	});

	it('renders with a label', () => {
		const h = harness(() => (
			<CheckboxGroup
				onValue={noop}
				name="test"
				label="test label"
				options={[{ value: 'cat' }]}
			/>
		));
		const labelTemplate = template.setChildren('@root', () => [
			<legend classes={css.legend}>test label</legend>,
			<Checkbox name="test" value="cat" label="cat" checked={undefined} onValue={noop} />
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
			<Checkbox name="test" value="cat" label="cat" checked={undefined} onValue={noop} />,
			<Checkbox name="test" value="fish" label="fish" checked={true} onValue={noop} />,
			<Checkbox name="test" value="dog" label="dog" checked={undefined} onValue={noop} />
		]);
		h.expect(optionTemplate);
	});

	it('renders with custom renderer', () => {
		const h = harness(() => (
			<CheckboxGroup
				onValue={noop}
				name="test"
				label="custom render label"
				options={[{ value: 'cat' }]}
			>
				{() => {
					return [
						<span>custom label</span>,
						<Checkbox
							name="test"
							value="cat"
							label="cat"
							checked={undefined}
							onValue={noop}
						/>,
						<hr />
					];
				}}
			</CheckboxGroup>
		));
		const customTemplate = template.setChildren('@root', () => [
			<legend classes={css.legend}>custom render label</legend>,
			<span>custom label</span>,
			<Checkbox name="test" value="cat" label="cat" checked={undefined} onValue={noop} />,
			<hr />
		]);
		h.expect(customTemplate);
	});
});
