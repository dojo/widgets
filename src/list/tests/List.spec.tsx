import { sandbox } from 'sinon';
import { tsx } from '@dojo/framework/core/vdom';
import global from '@dojo/framework/shim/global';
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import List, { ListOption, defaultTransform, MenuItem, ListItem } from '..';
import { compareId, createHarness, compareTheme } from '../../common/tests/support/test-helpers';
import { Keys } from '../../common/util';
import * as css from '../../theme/default/list.m.css';
import * as fixedCss from '../list.m.css';
import { createResource } from '@dojo/framework/core/resource';
const { assert } = intern.getPlugin('chai');
const { describe, it, before, after } = intern.getInterface('bdd');

const noop: any = () => {};

const compareAriaActiveDescendant = {
	selector: '*',
	property: 'aria-activedescendant',
	comparator: (property: any) => typeof property === 'string'
};

const harness = createHarness([compareTheme, compareId, compareAriaActiveDescendant]);

describe('List', () => {
	const animalOptions: ListOption[] = [
		{ value: 'dog' },
		{ value: 'cat', label: 'Cat' },
		{ value: 'fish', disabled: true }
	];

	const resource = createResource<ListOption>();

	const template = assertionTemplate(() => (
		<div
			key="root"
			classes={[undefined, css.root, fixedCss.root]}
			tabIndex={0}
			onkeydown={noop}
			focus={noop}
			onpointerdown={undefined}
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
						<ListItem
							key={`item-${index}`}
							onSelect={noop}
							active={index === 0}
							onRequestActive={noop}
							disabled={disabled}
							theme={{}}
							selected={false}
							widgetId={`menu-test-item-${index}`}
						>
							{label || value}
						</ListItem>
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
			<List resource={resource(animalOptions)} transform={defaultTransform} onValue={noop} />
		));
		h.expect(template);
	});

	it('renders with an initialValue', () => {
		const h = harness(() => (
			<List
				initialValue="dog"
				onValue={noop}
				resource={resource(animalOptions)}
				transform={defaultTransform}
			/>
		));
		const mockArrowDownEvent = {
			stopPropagation: sb.stub(),
			preventDefault: sb.stub(),
			which: Keys.Down
		};
		const mockSpacePressEvent = {
			stopPropagation: sb.stub(),
			preventDefault: sb.stub(),
			which: Keys.Space
		};
		const selectedTemplate = template.setProperty('@item-0', 'selected', true);

		h.expect(selectedTemplate);
		h.trigger('@root', 'onkeydown', mockArrowDownEvent);
		h.trigger('@root', 'onkeydown', mockSpacePressEvent);

		const spacePressTemplate = selectedTemplate
			.setProperty('@item-0', 'active', false)
			.setProperty('@item-1', 'active', true)
			.setProperty('@item-0', 'selected', false)
			.setProperty('@item-1', 'selected', true);
		h.expect(spacePressTemplate);
	});

	it('takes a custom renderer', () => {
		const h = harness(() => (
			<List onValue={noop} resource={resource(animalOptions)} transform={defaultTransform}>
				{({ label, value }, props) => (
					<ListItem {...props}>
						<span>label is {label || value}</span>
					</ListItem>
				)}
			</List>
		));
		const itemRendererTemplate = template.setChildren('@transformer', () =>
			animalOptions.map(({ value, label, disabled = false }, index) => {
				return (
					<ListItem
						key={`item-${index}`}
						onSelect={noop}
						active={index === 0}
						onRequestActive={noop}
						disabled={disabled}
						widgetId={`menu-test-item-${index}`}
					>
						<span>label is {label || value}</span>
					</ListItem>
				);
			})
		);
		h.expect(itemRendererTemplate);
	});

	it('takes a number in view property', () => {
		const h = harness(() => (
			<List
				onValue={noop}
				resource={resource(animalOptions)}
				transform={defaultTransform}
				itemsInView={2}
			/>
		));
		const numberInViewTemplate = template.setProperty('@root', 'styles', {
			maxHeight: '90px'
		});
		h.expect(numberInViewTemplate);
	});

	it('changes active item on arrow key down', () => {
		const h = harness(() => (
			<List onValue={noop} resource={resource(animalOptions)} transform={defaultTransform} />
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

	it('ignores changes to selected item when controlled', () => {
		let currentActiveValue;
		const h = harness(() => (
			<List
				onValue={(value) => {
					currentActiveValue = value;
				}}
				value="dog"
				resource={resource(animalOptions)}
				transform={defaultTransform}
			/>
		));
		const mockArrowDownEvent = {
			stopPropagation: sb.stub(),
			preventDefault: sb.stub(),
			which: Keys.Down
		};
		const mockSpacePressEvent = {
			stopPropagation: sb.stub(),
			preventDefault: sb.stub(),
			which: Keys.Space
		};
		const selectedTemplate = template.setProperty('@item-0', 'selected', true);

		h.expect(selectedTemplate);
		h.trigger('@root', 'onkeydown', mockArrowDownEvent);
		h.trigger('@root', 'onkeydown', mockSpacePressEvent);

		const spacePressTemplate = selectedTemplate
			.setProperty('@item-0', 'active', false)
			.setProperty('@item-1', 'active', true);
		h.expect(spacePressTemplate);
		// Calls callback to request a value change
		assert.equal(currentActiveValue, 'cat');
	});

	it('changes active item on arrow key up and loops to last item', () => {
		const h = harness(() => (
			<List onValue={noop} resource={resource(animalOptions)} transform={defaultTransform} />
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
			<List
				onValue={noop}
				resource={resource(animalOptions)}
				transform={defaultTransform}
				onActiveIndexChange={onActiveIndexChange}
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
			<List onValue={noop} resource={resource(animalOptions)} transform={defaultTransform} />
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

	it('selects item on key press', () => {
		const onValue = sb.stub();
		const h = harness(() => (
			<List
				onValue={onValue}
				resource={resource(animalOptions)}
				transform={defaultTransform}
			/>
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

	it('disables items with the disabled property', () => {
		const h = harness(() => (
			<List
				onValue={noop}
				resource={resource(animalOptions)}
				transform={defaultTransform}
				disabled={(item) => item.value === 'cat'}
			>
				{}
			</List>
		));
		const itemRendererTemplate = template.setChildren('@transformer', () =>
			animalOptions.map(({ value, label, disabled = false }, index) => {
				return (
					<ListItem
						key={`item-${index}`}
						onSelect={noop}
						active={index === 0}
						onRequestActive={noop}
						disabled={value === 'cat'}
						widgetId={`menu-test-item-${index}`}
						selected={false}
						theme={{}}
					>
						{label || value}
					</ListItem>
				);
			})
		);
		h.expect(itemRendererTemplate);
	});

	it('renders not focusable', () => {
		const h = harness(() => (
			<List
				onValue={noop}
				resource={resource(animalOptions)}
				transform={defaultTransform}
				focusable={false}
			/>
		));
		h.expect(
			template
				.setProperty('@root', 'tabIndex', -1)
				.setProperty('@root', 'onpointerdown', noop)
		);
	});
});

describe('List - Menu', () => {
	const animalOptions: ListOption[] = [
		{ value: 'dog' },
		{ value: 'cat', label: 'Cat' },
		{ value: 'fish', disabled: true }
	];

	const resource = createResource<ListOption>();

	const template = assertionTemplate(() => (
		<div
			key="root"
			classes={[undefined, css.root, fixedCss.root]}
			tabIndex={0}
			onkeydown={noop}
			focus={noop}
			onpointerdown={undefined}
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
			<List
				onValue={noop}
				menu
				resource={resource(animalOptions)}
				transform={defaultTransform}
			/>
		));
		h.expect(template);
	});

	it('renders options with dividers', () => {
		const h = harness(() => (
			<List
				onValue={noop}
				menu
				resource={resource([
					{ ...animalOptions[0], divider: true },
					...animalOptions.slice(1)
				])}
				transform={defaultTransform}
			/>
		));

		h.expect(template.insertAfter('@item-0', () => [<hr classes={css.divider} />]));
	});

	it('takes a custom renderer', () => {
		const h = harness(() => (
			<List
				onValue={noop}
				resource={resource(animalOptions)}
				transform={defaultTransform}
				menu
			>
				{({ label, value }, props) => (
					<MenuItem {...props}>
						<span>label is {label || value}</span>
					</MenuItem>
				)}
			</List>
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
						widgetId={`menu-test-item-${index}`}
					>
						<span>label is {label || value}</span>
					</MenuItem>
				);
			})
		);
		h.expect(itemRendererTemplate);
	});
});
