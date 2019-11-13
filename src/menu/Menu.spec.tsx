const { describe, it, before, after } = intern.getInterface('bdd');
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import harness from '@dojo/framework/testing/harness';
import { tsx } from '@dojo/framework/core/vdom';
import Menu, { MenuOption } from './Menu';
import MenuItem from './MenuItem';
import * as css from '../theme/menu.m.css';
import { sandbox } from 'sinon';
import global from '@dojo/framework/shim/global';
import { Keys } from '../common/util';
const { assert } = intern.getPlugin('chai');

const noop: any = () => {};

describe('Menu', () => {
	const animalOptions: MenuOption[] = [
		{ value: 'dog' },
		{ value: 'cat', label: 'Cat' },
		{ value: 'fish', disabled: true }
	];

	const template = assertionTemplate(() => (
		<div
			key="root"
			classes={css.root}
			tabIndex={0}
			onkeydown={noop}
			focus={noop}
			onfocus={undefined}
			onblur={undefined}
			styles={{}}
		/>
	));

	const getAnimalTemplate = () =>
		template.setChildren('@root', () =>
			animalOptions.map(({ value, label, disabled = false }, index) => (
				<MenuItem
					key={`item-${index}`}
					selected={false}
					onSelect={noop}
					active={index === 0}
					onRequestActive={noop}
					onActive={noop}
					scrollIntoView={false}
					disabled={disabled}
				>
					{label || value}
				</MenuItem>
			))
		);

	const sb = sandbox.create();

	before(() => {
		sb.stub(global.window.HTMLDivElement.prototype, 'getBoundingClientRect').callsFake(() => ({
			height: 45
		}));
	});

	after(() => {
		sb.restore();
	});

	it('renders options', () => {
		const h = harness(() => <Menu onValue={noop} options={animalOptions} />);
		h.expect(getAnimalTemplate());
	});

	it('takes a custom renderer', () => {
		const h = harness(() => (
			<Menu
				onValue={noop}
				options={animalOptions}
				itemRenderer={({ label, value }) => <span>label is {label || value}</span>}
			/>
		));
		const itemRendererTemplate = template.setChildren('@root', () =>
			animalOptions.map(({ value, label, disabled = false }, index) => {
				return (
					<MenuItem
						key={`item-${index}`}
						selected={false}
						onSelect={noop}
						active={index === 0}
						onRequestActive={noop}
						onActive={noop}
						scrollIntoView={false}
						disabled={disabled}
					>
						<span>label is {label || value}</span>
					</MenuItem>
				);
			})
		);
		h.expect(itemRendererTemplate);
	});

	it('takes a number in view property', () => {
		const h = harness(() => <Menu onValue={noop} options={animalOptions} numberInView={2} />);
		const numberInViewTemplate = getAnimalTemplate().setProperty('@root', 'styles', {
			maxHeight: '90px'
		});
		h.expect(numberInViewTemplate);
	});

	it('changes active item on arrow key down', () => {
		const h = harness(() => <Menu onValue={noop} options={animalOptions} />);
		const mockArrowDownEvent = {
			stopPropagation: sb.stub(),
			preventDefault: sb.stub(),
			which: Keys.Down
		};

		h.trigger('@root', 'onkeydown', mockArrowDownEvent);
		const arrowKeyDownTemplate = getAnimalTemplate()
			.setProperty('@item-0', 'active', false)
			.setProperty('@item-1', 'active', true);
		h.expect(arrowKeyDownTemplate);
	});

	it('changes active item on arrow key up and loops to last item', () => {
		const h = harness(() => <Menu onValue={noop} options={animalOptions} />);
		const mockArrowUpEvent = {
			stopPropagation: sb.stub(),
			preventDefault: sb.stub(),
			which: Keys.Up
		};

		h.trigger('@root', 'onkeydown', mockArrowUpEvent);
		const arrowKeyUpTemplate = getAnimalTemplate()
			.setProperty('@item-0', 'active', false)
			.setProperty('@item-2', 'active', true);
		h.expect(arrowKeyUpTemplate);
	});

	it('calls onActiveIndexChange callback if passed and does not manage active index itself', () => {
		const onActiveIndexChange = sb.stub();
		const h = harness(() => (
			<Menu
				onValue={noop}
				options={animalOptions}
				onActiveIndexChange={onActiveIndexChange}
			/>
		));
		const mockArrowDownEvent = {
			stopPropagation: sb.stub(),
			preventDefault: sb.stub(),
			which: Keys.Down
		};

		h.trigger('@root', 'onkeydown', mockArrowDownEvent);
		h.expect(getAnimalTemplate());
		assert.isTrue(onActiveIndexChange.calledOnceWith(1));
	});

	it('sets active item to be the one starting with letter key pressed', () => {
		const h = harness(() => <Menu onValue={noop} options={animalOptions} />);
		const mockCPressEvent = {
			stopPropagation: sb.stub(),
			preventDefault: sb.stub(),
			key: 'c'
		};

		h.trigger('@root', 'onkeydown', mockCPressEvent);
		const cPressTemplate = getAnimalTemplate()
			.setProperty('@item-0', 'active', false)
			.setProperty('@item-1', 'active', true);
		h.expect(cPressTemplate);
	});

	it('selects item on key press', () => {
		const onValue = sb.stub();
		const h = harness(() => <Menu onValue={onValue} options={animalOptions} />);

		const mockArrowDownEvent = {
			stopPropagation: sb.stub(),
			preventDefault: sb.stub(),
			which: Keys.Down
		};

		h.trigger('@root', 'onkeydown', mockArrowDownEvent);

		const mockSpacePressEvent = {
			stopPropagation: sb.stub(),
			preventDefault: sb.stub(),
			which: Keys.Space
		};

		h.trigger('@root', 'onkeydown', mockSpacePressEvent);

		const spacePressTemplate = getAnimalTemplate()
			.setProperty('@item-0', 'active', false)
			.setProperty('@item-1', 'active', true)
			.setProperty('@item-1', 'selected', true);
		h.expect(spacePressTemplate);
		assert.isTrue(onValue.calledOnceWith('cat'));
	});
});
