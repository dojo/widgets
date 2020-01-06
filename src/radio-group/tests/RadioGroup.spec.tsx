const { describe, it } = intern.getInterface('bdd');
import * as css from '../../theme/radio-group.m.css';
import Radio from '../../radio/index';
import RadioGroup from '../index';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import harness from '@dojo/framework/testing/harness';
import { tsx } from '@dojo/framework/core/vdom';

function noop() {}

describe('RadioGroup', () => {
	const template = assertionTemplate(() => (
		<fieldset key="root" classes={css.root} name="test" />
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
			<Radio name="test" value="cat" label="cat" checked={undefined} onValue={noop} />,
			<Radio name="test" value="fish" label="fish" checked={undefined} onValue={noop} />,
			<Radio name="test" value="dog" label="dog" checked={undefined} onValue={noop} />
		]);
		h.expect(optionTemplate);
	});

	it('renders with a label', () => {
		const h = harness(() => (
			<RadioGroup
				label="test label"
				name="test"
				onValue={noop}
				options={[{ value: 'cat' }]}
			/>
		));
		const labelTemplate = template.setChildren('@root', () => [
			<legend classes={css.legend}>test label</legend>,
			<Radio name="test" value="cat" label="cat" checked={undefined} onValue={noop} />
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
			<Radio name="test" value="cat" label="cat" checked={undefined} onValue={noop} />,
			<Radio name="test" value="fish" label="fish" checked={true} onValue={noop} />,
			<Radio name="test" value="dog" label="dog" checked={undefined} onValue={noop} />
		]);
		h.expect(optionTemplate);
	});

	it('renders with custom renderer', () => {
		const h = harness(() => (
			<RadioGroup
				label="custom render label"
				name="test"
				onValue={noop}
				options={[{ value: 'cat' }]}
				renderer={() => {
					return [
						<span>custom label</span>,
						<Radio
							name="test"
							value="cat"
							label="cat"
							checked={false}
							onValue={noop}
						/>,
						<hr />
					];
				}}
			/>
		));
		const customTemplate = template.setChildren('@root', () => [
			<legend classes={css.legend}>custom render label</legend>,
			<span>custom label</span>,
			<Radio name="test" value="cat" label="cat" checked={false} onValue={noop} />,
			<hr />
		]);
		h.expect(customTemplate);
	});
});
