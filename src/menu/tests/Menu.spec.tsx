import { sandbox } from 'sinon';
import { tsx } from '@dojo/framework/core/vdom';
import global from '@dojo/framework/shim/global';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import Menu, { MenuOption } from '../';
import { compareId, createHarness, compareTheme } from '../../common/tests/support/test-helpers';
import { Keys } from '../../common/util';
import * as css from '../../theme/default/menu.m.css';
import * as fixedCss from '../menu.m.css';
import MenuItem from '../MenuItem';
import ListBoxItem from '../ListBoxItem';
const { assert } = intern.getPlugin('chai');
const { describe, it, before, after } = intern.getInterface('bdd');

const noop: any = () => {};

const compareAriaActiveDescendant = {
	selector: '*',
	property: 'aria-activedescendant',
	comparator: (property: any) => typeof property === 'string'
};

const harness = createHarness([compareTheme, compareId, compareAriaActiveDescendant]);

describe('Menu - Menu', () => {
	const animalOptions: MenuOption[] = [
		{ value: 'dog' },
		{ value: 'cat', label: 'Cat' },
		{ value: 'fish', disabled: true }
	];

	const template = assertionTemplate(() => (
		<div
			key="root"
			classes={[css.root, fixedCss.root]}
			tabIndex={0}
			onkeydown={noop}
			focus={noop}
			onfocus={undefined}
			onblur={undefined}
			styles={{ maxHeight: '450px' }}
			id="test"
			role="menu"
			aria-activedescendant="test"
			aria-orientation="vertical"
			scrollTop={0}
			onscroll={() => {}}
		>
			<div
				classes={fixedCss.wrapper}
				styles={{
					height: `135px`
				}}
				key="wrapper"
			>
				<div
					classes={fixedCss.transformer}
					styles={{
						transform: `translateY(0px)`
					}}
					key="transformer"
				>
					{animalOptions.map(({ value, label, disabled = false }, index) => (
						<MenuItem
							key={`item-${index}`}
							onSelect={noop}
							active={index === 0}
							onRequestActive={noop}
							disabled={disabled}
							theme={{}}
							widgetId={`menu-test-item-${index}`}
						>
							{label || value}
						</MenuItem>
					))}
				</div>
			</div>
		</div>
	));

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
		const h = harness(() => (
			<Menu onValue={noop} options={animalOptions} total={animalOptions.length} />
		));
		h.expect(template);
	});

	it('takes a custom renderer', () => {
		const h = harness(() => (
			<Menu
				onValue={noop}
				options={animalOptions}
				itemRenderer={({ label, value }) => <span>label is {label || value}</span>}
				total={animalOptions.length}
			/>
		));
		const itemRendererTemplate = template.setChildren('@transformer', () =>
			animalOptions.map(({ value, label, disabled = false }, index) => {
				return (
					<MenuItem
						key={`item-${index}`}
						onSelect={noop}
						active={index === 0}
						onRequestActive={noop}
						disabled={disabled}
						theme={{}}
						widgetId={`menu-test-item-${index}`}
					>
						<span>label is {label || value}</span>
					</MenuItem>
				);
			})
		);
		h.expect(itemRendererTemplate);
	});

	it('takes a number in view property', () => {
		const h = harness(() => (
			<Menu
				onValue={noop}
				options={animalOptions}
				itemsInView={2}
				total={animalOptions.length}
			/>
		));
		const numberInViewTemplate = template.setProperty('@root', 'styles', {
			maxHeight: '90px'
		});
		h.expect(numberInViewTemplate);
	});

	it('changes active item on arrow key down', () => {
		const h = harness(() => (
			<Menu onValue={noop} options={animalOptions} total={animalOptions.length} />
		));
		const mockArrowDownEvent = {
			stopPropagation: sb.stub(),
			preventDefault: sb.stub(),
			which: Keys.Down
		};

		h.trigger('@root', 'onkeydown', mockArrowDownEvent);
		const arrowKeyDownTemplate = template
			.setProperty('@item-0', 'active', false)
			.setProperty('@item-1', 'active', true);
		h.expect(arrowKeyDownTemplate);
	});

	it('changes active item on arrow key up and loops to last item', () => {
		const h = harness(() => (
			<Menu onValue={noop} options={animalOptions} total={animalOptions.length} />
		));
		const mockArrowUpEvent = {
			stopPropagation: sb.stub(),
			preventDefault: sb.stub(),
			which: Keys.Up
		};

		h.trigger('@root', 'onkeydown', mockArrowUpEvent);
		const arrowKeyUpTemplate = template
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
				total={animalOptions.length}
			/>
		));
		const mockArrowDownEvent = {
			stopPropagation: sb.stub(),
			preventDefault: sb.stub(),
			which: Keys.Down
		};

		h.trigger('@root', 'onkeydown', mockArrowDownEvent);
		h.expect(template);
		assert.isTrue(onActiveIndexChange.calledOnceWith(1));
	});

	it('sets active item to be the one starting with letter key pressed', () => {
		const h = harness(() => (
			<Menu onValue={noop} options={animalOptions} total={animalOptions.length} />
		));
		const mockCPressEvent = {
			stopPropagation: sb.stub(),
			preventDefault: sb.stub(),
			key: 'c'
		};

		h.trigger('@root', 'onkeydown', mockCPressEvent);
		const cPressTemplate = template
			.setProperty('@item-0', 'active', false)
			.setProperty('@item-1', 'active', true);
		h.expect(cPressTemplate);
	});
});

describe('Menu - ListBox', () => {
	const animalOptions: MenuOption[] = [
		{ value: 'dog' },
		{ value: 'cat', label: 'Cat' },
		{ value: 'fish', disabled: true }
	];

	const template = assertionTemplate(() => (
		<div
			key="root"
			classes={[css.root, fixedCss.root]}
			tabIndex={0}
			onkeydown={noop}
			focus={noop}
			onfocus={undefined}
			onblur={undefined}
			styles={{ maxHeight: '450px' }}
			id="test"
			role="listbox"
			aria-activedescendant="test"
			aria-orientation="vertical"
			scrollTop={0}
			onscroll={() => {}}
		>
			<div
				classes={fixedCss.wrapper}
				styles={{
					height: `135px`
				}}
				key="wrapper"
			>
				<div
					classes={fixedCss.transformer}
					styles={{
						transform: `translateY(0px)`
					}}
					key="transformer"
				>
					{animalOptions.map(({ value, label, disabled = false }, index) => (
						<ListBoxItem
							key={`item-${index}`}
							onSelect={noop}
							active={index === 0}
							onRequestActive={noop}
							disabled={disabled}
							selected={false}
							theme={{}}
							widgetId={`menu-test-item-${index}`}
						>
							{label || value}
						</ListBoxItem>
					))}
				</div>
			</div>
		</div>
	));

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
		const h = harness(() => (
			<Menu onValue={noop} listBox options={animalOptions} total={animalOptions.length} />
		));
		h.expect(template);
	});

	it('renders options with dividers', () => {
		const h = harness(() => (
			<Menu
				onValue={noop}
				listBox
				total={animalOptions.length}
				options={[{ ...animalOptions[0], divider: true }, ...animalOptions.slice(1)]}
			/>
		));
		h.expect(template.insertAfter('@item-0', () => [<hr classes={css.divider} />]));
	});

	it('takes a custom renderer', () => {
		const h = harness(() => (
			<Menu
				onValue={noop}
				options={animalOptions}
				total={animalOptions.length}
				listBox
				itemRenderer={({ label, value }) => <span>label is {label || value}</span>}
			/>
		));
		const itemRendererTemplate = template.setChildren('@transformer', () =>
			animalOptions.map(({ value, label, disabled = false }, index) => {
				return (
					<ListBoxItem
						key={`item-${index}`}
						onSelect={noop}
						active={index === 0}
						onRequestActive={noop}
						disabled={disabled}
						selected={false}
						theme={{}}
						widgetId={`menu-test-item-${index}`}
					>
						<span>label is {label || value}</span>
					</ListBoxItem>
				);
			})
		);
		h.expect(itemRendererTemplate);
	});

	it('selects item on key press', () => {
		const onValue = sb.stub();
		const h = harness(() => (
			<Menu listBox onValue={onValue} options={animalOptions} total={animalOptions.length} />
		));

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

		const spacePressTemplate = template
			.setProperty('@item-0', 'active', false)
			.setProperty('@item-1', 'active', true)
			.setProperty('@item-1', 'selected', true);
		h.expect(spacePressTemplate);
		assert.isTrue(onValue.calledOnceWith('cat'));
	});
});
