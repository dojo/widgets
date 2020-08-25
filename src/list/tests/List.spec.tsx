const { describe, it, afterEach, beforeEach } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import { sandbox } from 'sinon';
import global from '@dojo/framework/shim/global';
import { tsx } from '@dojo/framework/core/vdom';
import { renderer, assertion, wrap } from '@dojo/framework/testing/renderer';
import {
	createMemoryResourceTemplate,
	createResourceTemplate
} from '@dojo/framework/core/middleware/resources';
import { noop } from '../../common/tests/support/test-helpers';
import { Keys } from '../../common/util';
import List, { ListItem, MenuItem } from '../index';
import LoadingIndicator from '../../loading-indicator';
import * as css from '../../theme/default/list.m.css';
import * as fixedCss from '../list.m.css';
import * as listItemCss from '../../theme/default/list-item.m.css';
import * as menuItemCss from '../../theme/default/menu-item.m.css';

let template = createMemoryResourceTemplate<{ value: string }>();
const data = [
	{
		value: 'dog'
	},
	{
		value: 'cat',
		label: 'Cat'
	},
	{
		value: 'fish',
		disabled: true
	}
];
const sb = sandbox.create();
const onValueStub = sb.stub();

function createMockEvent({
	which,
	key,
	metaKey,
	ctrlKey
}: {
	which: Keys;
	key?: string;
	metaKey?: boolean;
	ctrlKey?: boolean;
}) {
	return {
		stopPropagation: sb.stub(),
		preventDefault: sb.stub(),
		which,
		key,
		metaKey: !!metaKey,
		ctrlKey: !!ctrlKey
	};
}

const WrappedItemContainer = wrap('div');
const WrappedItemWrapper = wrap('div');
const WrappedRoot = wrap('div');

const baseAssertion = assertion(() => (
	<WrappedRoot
		aria-activedescendant={'menu-test-item-0'}
		aria-orientation={'vertical'}
		classes={[null, css.root, fixedCss.root]}
		focus={noop}
		id={'menu-test'}
		key={'root'}
		onblur={undefined}
		onfocus={undefined}
		onkeydown={noop}
		onpointerdown={undefined}
		onscroll={noop}
		role={'listbox'}
		scrollTop={0}
		styles={{
			maxHeight: '450px'
		}}
		tabIndex={0}
	>
		<WrappedItemWrapper
			classes={fixedCss.wrapper}
			key={'wrapper'}
			styles={{
				height: '0px'
			}}
		>
			<WrappedItemContainer
				classes={fixedCss.transformer}
				key={'transformer'}
				styles={{
					transform: 'translateY(0px)'
				}}
			/>
		</WrappedItemWrapper>
	</WrappedRoot>
));

const listWithListItemsAssertion = baseAssertion
	.setProperty(WrappedItemWrapper, 'styles', {
		height: '135px'
	})
	.replaceChildren(WrappedItemContainer, () => [
		<ListItem
			classes={undefined}
			active={true}
			disabled={false}
			key={'item-0'}
			onRequestActive={noop}
			onSelect={noop}
			selected={false}
			theme={{
				'@dojo/widgets/list-item': {
					active: listItemCss.active,
					disabled: listItemCss.disabled,
					root: listItemCss.root,
					s: css.items,
					selected: listItemCss.selected
				}
			}}
			widgetId={'menu-test-item-0'}
		>
			dog
		</ListItem>,
		<ListItem
			classes={undefined}
			active={false}
			disabled={false}
			key={'item-1'}
			onRequestActive={noop}
			onSelect={noop}
			selected={false}
			theme={{
				'@dojo/widgets/list-item': {
					active: listItemCss.active,
					disabled: listItemCss.disabled,
					root: listItemCss.root,
					s: css.items,
					selected: listItemCss.selected
				}
			}}
			widgetId={'menu-test-item-1'}
		>
			Cat
		</ListItem>,
		<ListItem
			classes={undefined}
			active={false}
			disabled={true}
			key={'item-2'}
			onRequestActive={noop}
			onSelect={noop}
			selected={false}
			theme={{
				'@dojo/widgets/list-item': {
					active: listItemCss.active,
					disabled: listItemCss.disabled,
					root: listItemCss.root,
					s: css.items,
					selected: listItemCss.selected
				}
			}}
			widgetId={'menu-test-item-2'}
		>
			fish
		</ListItem>
	]);

const listWithMenuItemsAssertion = baseAssertion
	.setProperty(WrappedItemWrapper, 'styles', {
		height: '135px'
	})
	.setProperty(WrappedRoot, 'role', 'menu')
	.replaceChildren(WrappedItemContainer, () => [
		<MenuItem
			classes={undefined}
			active={true}
			disabled={false}
			key={'item-0'}
			onRequestActive={noop}
			onSelect={noop}
			theme={{
				'@dojo/widgets/menu-item': {
					active: menuItemCss.active,
					disabled: menuItemCss.disabled,
					root: menuItemCss.root,
					s: css.items
				}
			}}
			widgetId={'menu-test-item-0'}
		>
			dog
		</MenuItem>,
		<MenuItem
			classes={undefined}
			active={false}
			disabled={false}
			key={'item-1'}
			onRequestActive={noop}
			onSelect={noop}
			theme={{
				'@dojo/widgets/menu-item': {
					active: menuItemCss.active,
					disabled: menuItemCss.disabled,
					root: menuItemCss.root,
					s: css.items
				}
			}}
			widgetId={'menu-test-item-1'}
		>
			Cat
		</MenuItem>,
		<MenuItem
			classes={undefined}
			active={false}
			disabled={true}
			key={'item-2'}
			onRequestActive={noop}
			onSelect={noop}
			theme={{
				'@dojo/widgets/menu-item': {
					active: menuItemCss.active,
					disabled: menuItemCss.disabled,
					root: menuItemCss.root,
					s: css.items
				}
			}}
			widgetId={'menu-test-item-2'}
		>
			fish
		</MenuItem>
	]);

describe('List', () => {
	beforeEach(() => {
		sb.stub(global.window.HTMLDivElement.prototype, 'getBoundingClientRect').callsFake(() => ({
			height: 45
		}));
		template = createMemoryResourceTemplate<{ value: string }>();
	});

	afterEach(() => {
		sb.restore();
	});

	it('should not render with no data', () => {
		const r = renderer(() => (
			<List
				resource={{
					template: { template, id: 'test', initOptions: { data: [], id: 'test' } }
				}}
				onValue={onValueStub}
			/>
		));
		r.expect(assertion(() => undefined));
	});

	it('should render with list item placeholders', async () => {
		let pageOneResolver: (options: { data: any[]; total: number }) => void;
		const pageOnePromise = new Promise<{ data: any[]; total: number }>((resolve) => {
			pageOneResolver = resolve;
		});
		let pageTwoResolver: (options: { data: any[]; total: number }) => void;
		const pageTwoPromise = new Promise<{ data: any[]; total: number }>((resolve) => {
			pageTwoResolver = resolve;
		});
		const listAssertion = listWithListItemsAssertion
			.setProperty(WrappedItemWrapper, 'styles', {
				height: '270px'
			})
			.setProperty(WrappedRoot, 'styles', {
				maxHeight: '45px'
			});
		const template = createResourceTemplate<{ value: string }>({
			read: (request, { put }) => {
				if (request.offset === 0) {
					return pageOnePromise.then((res) => {
						put(res, request);
					});
				}
				return pageTwoPromise.then((res) => {
					put(res, request);
				});
			},
			find: () => {}
		});

		const r = renderer(() => (
			<List
				itemsInView={1}
				resource={{ template: { template, id: 'test' } }}
				onValue={onValueStub}
			/>
		));
		r.expect(assertion(() => null));
		pageOneResolver!({ data, total: 6 });
		await pageOnePromise;
		r.expect(listAssertion);
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: Keys.End }));
		const endAssertion = listAssertion
			.setProperty(WrappedRoot, 'aria-activedescendant', 'menu-test-item-5')
			.setProperty(WrappedRoot, 'scrollTop', 225)
			.setProperty(WrappedItemContainer, 'styles', { transform: 'translateY(180px)' });
		const placeHolderAssertion = endAssertion.replaceChildren(WrappedItemContainer, () => [
			<ListItem
				classes={undefined}
				active={false}
				disabled={true}
				key={'item-4'}
				onRequestActive={noop}
				onSelect={noop}
				selected={false}
				theme={{
					'@dojo/widgets/list-item': {
						active: listItemCss.active,
						disabled: listItemCss.disabled,
						root: listItemCss.root,
						s: css.items,
						selected: listItemCss.selected
					}
				}}
				widgetId={'menu-test-item-4'}
			>
				<LoadingIndicator />
			</ListItem>,
			<ListItem
				classes={undefined}
				active={false}
				disabled={true}
				key={'item-5'}
				onRequestActive={noop}
				onSelect={noop}
				selected={false}
				theme={{
					'@dojo/widgets/list-item': {
						active: listItemCss.active,
						disabled: listItemCss.disabled,
						root: listItemCss.root,
						s: css.items,
						selected: listItemCss.selected
					}
				}}
				widgetId={'menu-test-item-5'}
			>
				<LoadingIndicator />
			</ListItem>
		]);
		r.expect(placeHolderAssertion);
		pageTwoResolver!({ data, total: 6 });
		await pageTwoPromise;
		const lastPageItemsAssertion = endAssertion.replaceChildren(WrappedItemContainer, () => [
			<ListItem
				classes={undefined}
				active={false}
				disabled={false}
				key={'item-4'}
				onRequestActive={noop}
				onSelect={noop}
				selected={false}
				theme={{
					'@dojo/widgets/list-item': {
						active: listItemCss.active,
						disabled: listItemCss.disabled,
						root: listItemCss.root,
						s: css.items,
						selected: listItemCss.selected
					}
				}}
				widgetId={'menu-test-item-4'}
			>
				Cat
			</ListItem>,
			<ListItem
				classes={undefined}
				active={true}
				disabled={true}
				key={'item-5'}
				onRequestActive={noop}
				onSelect={noop}
				selected={false}
				theme={{
					'@dojo/widgets/list-item': {
						active: listItemCss.active,
						disabled: listItemCss.disabled,
						root: listItemCss.root,
						s: css.items,
						selected: listItemCss.selected
					}
				}}
				widgetId={'menu-test-item-5'}
			>
				fish
			</ListItem>
		]);
		r.expect(lastPageItemsAssertion);
	});

	it('should render list with list items data', () => {
		const r = renderer(() => (
			<List
				resource={{ template: { template, id: 'test', initOptions: { data, id: 'test' } } }}
				onValue={onValueStub}
			/>
		));
		r.expect(listWithListItemsAssertion);
	});

	it('should render list with menu items data', () => {
		const r = renderer(() => (
			<List
				menu
				resource={{ template: { template, id: 'test', initOptions: { data, id: 'test' } } }}
				onValue={onValueStub}
			/>
		));
		r.expect(listWithMenuItemsAssertion);
	});

	it('should render with menu item placeholders', async () => {
		let pageOneResolver: (options: { data: any[]; total: number }) => void;
		const pageOnePromise = new Promise<{ data: any[]; total: number }>((resolve) => {
			pageOneResolver = resolve;
		});
		let pageTwoResolver: (options: { data: any[]; total: number }) => void;
		const pageTwoPromise = new Promise<{ data: any[]; total: number }>((resolve) => {
			pageTwoResolver = resolve;
		});
		const menuAssertion = listWithMenuItemsAssertion
			.setProperty(WrappedItemWrapper, 'styles', {
				height: '270px'
			})
			.setProperty(WrappedRoot, 'styles', {
				maxHeight: '45px'
			});
		const template = createResourceTemplate<{ value: string }>({
			read: (request, { put }) => {
				if (request.offset === 0) {
					return pageOnePromise.then((res) => {
						put(res, request);
					});
				}
				return pageTwoPromise.then((res) => {
					put(res, request);
				});
			},
			find: () => {}
		});

		const r = renderer(() => (
			<List
				menu
				itemsInView={1}
				resource={{ template: { template, id: 'test' } }}
				onValue={onValueStub}
			/>
		));
		r.expect(assertion(() => null));
		pageOneResolver!({ data, total: 6 });
		await pageOnePromise;
		r.expect(menuAssertion);
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: Keys.End }));
		const endAssertion = menuAssertion
			.setProperty(WrappedRoot, 'aria-activedescendant', 'menu-test-item-5')
			.setProperty(WrappedRoot, 'scrollTop', 225)
			.setProperty(WrappedItemContainer, 'styles', { transform: 'translateY(180px)' });
		const placeHolderAssertion = endAssertion.replaceChildren(WrappedItemContainer, () => [
			<MenuItem
				classes={undefined}
				active={false}
				disabled={true}
				key={'item-4'}
				onRequestActive={noop}
				onSelect={noop}
				theme={{
					'@dojo/widgets/menu-item': {
						active: menuItemCss.active,
						disabled: menuItemCss.disabled,
						root: menuItemCss.root,
						s: css.items
					}
				}}
				widgetId={'menu-test-item-4'}
			>
				<LoadingIndicator />
			</MenuItem>,
			<MenuItem
				classes={undefined}
				active={false}
				disabled={true}
				key={'item-5'}
				onRequestActive={noop}
				onSelect={noop}
				theme={{
					'@dojo/widgets/menu-item': {
						active: menuItemCss.active,
						disabled: menuItemCss.disabled,
						root: menuItemCss.root,
						s: css.items
					}
				}}
				widgetId={'menu-test-item-5'}
			>
				<LoadingIndicator />
			</MenuItem>
		]);
		r.expect(placeHolderAssertion);
		pageTwoResolver!({ data, total: 6 });
		await pageTwoPromise;
		const lastPageItemsAssertion = endAssertion.replaceChildren(WrappedItemContainer, () => [
			<MenuItem
				classes={undefined}
				active={false}
				disabled={false}
				key={'item-4'}
				onRequestActive={noop}
				onSelect={noop}
				theme={{
					'@dojo/widgets/menu-item': {
						active: menuItemCss.active,
						disabled: menuItemCss.disabled,
						root: menuItemCss.root,
						s: css.items
					}
				}}
				widgetId={'menu-test-item-4'}
			>
				Cat
			</MenuItem>,
			<MenuItem
				classes={undefined}
				active={true}
				disabled={true}
				key={'item-5'}
				onRequestActive={noop}
				onSelect={noop}
				theme={{
					'@dojo/widgets/menu-item': {
						active: menuItemCss.active,
						disabled: menuItemCss.disabled,
						root: menuItemCss.root,
						s: css.items
					}
				}}
				widgetId={'menu-test-item-5'}
			>
				fish
			</MenuItem>
		]);
		r.expect(lastPageItemsAssertion);
	});

	it('should be able to navigate the list using the keyboard', () => {
		function createListItems(activeIndex = 0, selected?: number) {
			return new Array(6).fill(undefined).map((_, index) => (
				<ListItem
					classes={undefined}
					active={index === activeIndex}
					disabled={testData[index].value === 'fish'}
					key={`item-${index}`}
					onRequestActive={noop}
					onSelect={noop}
					selected={!!selected && index === selected}
					theme={{
						'@dojo/widgets/list-item': {
							active: listItemCss.active,
							disabled: listItemCss.disabled,
							root: listItemCss.root,
							s: css.items,
							selected: listItemCss.selected
						}
					}}
					widgetId={`menu-test-item-${index}`}
				>
					{testData[index].label || testData[index].value}
				</ListItem>
			));
		}
		const onRequestCloseStub = sb.stub();
		const testData = [
			...data,
			...[
				{
					value: 'panda'
				},
				{
					value: 'crow',
					label: 'Crow'
				},
				{
					value: 'fire-bellied toad'
				}
			]
		];
		const r = renderer(() => (
			<List
				resource={{
					template: {
						template,
						id: 'test',
						initOptions: { data: testData, id: 'test' }
					}
				}}
				disabled={(item) => {
					return item.value === 'fish';
				}}
				onValue={onValueStub}
				onRequestClose={onRequestCloseStub}
			/>
		));
		r.expect(
			baseAssertion
				.setProperty(WrappedItemWrapper, 'styles', {
					height: '270px'
				})
				.replaceChildren(WrappedItemContainer, () => {
					return createListItems();
				})
		);
		// navigate to last item from first item
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: Keys.Up }));
		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'aria-activedescendant', 'menu-test-item-5')
				.setProperty(WrappedItemWrapper, 'styles', {
					height: '270px'
				})
				.replaceChildren(WrappedItemContainer, () => {
					return createListItems(5);
				})
		);
		// navigate to first item from last item
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: Keys.Down }));
		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'aria-activedescendant', 'menu-test-item-0')
				.setProperty(WrappedItemWrapper, 'styles', {
					height: '270px'
				})
				.replaceChildren(WrappedItemContainer, () => {
					return createListItems();
				})
		);
		// navigate to last item with cmd/meta down
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: Keys.Down, metaKey: true }));
		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'aria-activedescendant', 'menu-test-item-5')
				.setProperty(WrappedItemWrapper, 'styles', {
					height: '270px'
				})
				.replaceChildren(WrappedItemContainer, () => {
					return createListItems(5);
				})
		);
		// navigate to first item with cmd/meta up
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: Keys.Up, metaKey: true }));
		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'aria-activedescendant', 'menu-test-item-0')
				.setProperty(WrappedItemWrapper, 'styles', {
					height: '270px'
				})
				.replaceChildren(WrappedItemContainer, () => {
					return createListItems();
				})
		);
		// navigate to last item with ctrl down
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: Keys.Down, ctrlKey: true }));
		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'aria-activedescendant', 'menu-test-item-5')
				.setProperty(WrappedItemWrapper, 'styles', {
					height: '270px'
				})
				.replaceChildren(WrappedItemContainer, () => {
					return createListItems(5);
				})
		);
		// navigate to first item with ctrl up
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: Keys.Up, ctrlKey: true }));
		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'aria-activedescendant', 'menu-test-item-0')
				.setProperty(WrappedItemWrapper, 'styles', {
					height: '270px'
				})
				.replaceChildren(WrappedItemContainer, () => {
					return createListItems();
				})
		);
		// navigate to next item with down
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: Keys.Down }));
		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'aria-activedescendant', 'menu-test-item-1')
				.setProperty(WrappedItemWrapper, 'styles', {
					height: '270px'
				})
				.replaceChildren(WrappedItemContainer, () => {
					return createListItems(1);
				})
		);
		// navigate to next item with down
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: Keys.Down }));
		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'aria-activedescendant', 'menu-test-item-2')
				.setProperty(WrappedItemWrapper, 'styles', {
					height: '270px'
				})
				.replaceChildren(WrappedItemContainer, () => {
					return createListItems(2);
				})
		);
		// navigate to previous item with up
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: Keys.Up }));
		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'aria-activedescendant', 'menu-test-item-1')
				.setProperty(WrappedItemWrapper, 'styles', {
					height: '270px'
				})
				.replaceChildren(WrappedItemContainer, () => {
					return createListItems(1);
				})
		);
		// navigate to last item with end
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: Keys.End }));
		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'aria-activedescendant', 'menu-test-item-5')
				.setProperty(WrappedItemWrapper, 'styles', {
					height: '270px'
				})
				.replaceChildren(WrappedItemContainer, () => {
					return createListItems(5);
				})
		);
		// navigate to first item with home
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: Keys.Home }));
		r.expect(
			baseAssertion
				.setProperty(WrappedItemWrapper, 'styles', {
					height: '270px'
				})
				.replaceChildren(WrappedItemContainer, () => {
					return createListItems();
				})
		);
		// navigate to next item with down
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: Keys.Down }));
		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'aria-activedescendant', 'menu-test-item-1')
				.setProperty(WrappedItemWrapper, 'styles', {
					height: '270px'
				})
				.replaceChildren(WrappedItemContainer, () => {
					return createListItems(1);
				})
		);
		assert.strictEqual(onValueStub.callCount, 0);
		// select item with space
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: Keys.Space }));
		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'aria-activedescendant', 'menu-test-item-1')
				.setProperty(WrappedItemWrapper, 'styles', {
					height: '270px'
				})
				.replaceChildren(WrappedItemContainer, () => {
					return createListItems(1, 1);
				})
		);
		assert.strictEqual(onValueStub.callCount, 1);
		// navigate to next item with down
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: Keys.Down }));
		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'aria-activedescendant', 'menu-test-item-2')
				.setProperty(WrappedItemWrapper, 'styles', {
					height: '270px'
				})
				.replaceChildren(WrappedItemContainer, () => {
					return createListItems(2, 1);
				})
		);
		assert.strictEqual(onValueStub.callCount, 1);
		// try to select item with enter
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: Keys.Enter }));
		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'aria-activedescendant', 'menu-test-item-2')
				.setProperty(WrappedItemWrapper, 'styles', {
					height: '270px'
				})
				.replaceChildren(WrappedItemContainer, () => {
					return createListItems(2, 1);
				})
		);
		assert.strictEqual(onValueStub.callCount, 1);
		assert.strictEqual(onRequestCloseStub.callCount, 0);
		// navigate to next item with down
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: Keys.Down }));
		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'aria-activedescendant', 'menu-test-item-3')
				.setProperty(WrappedItemWrapper, 'styles', {
					height: '270px'
				})
				.replaceChildren(WrappedItemContainer, () => {
					return createListItems(3, 1);
				})
		);
		assert.strictEqual(onValueStub.callCount, 1);
		assert.strictEqual(onRequestCloseStub.callCount, 0);
		// select item with enter
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: Keys.Enter }));
		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'aria-activedescendant', 'menu-test-item-3')
				.setProperty(WrappedItemWrapper, 'styles', {
					height: '270px'
				})
				.replaceChildren(WrappedItemContainer, () => {
					return createListItems(3, 3);
				})
		);
		assert.strictEqual(onValueStub.callCount, 2);
		assert.strictEqual(onRequestCloseStub.callCount, 0);
		// call close with escape
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: Keys.Escape }));
		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'aria-activedescendant', 'menu-test-item-3')
				.setProperty(WrappedItemWrapper, 'styles', {
					height: '270px'
				})
				.replaceChildren(WrappedItemContainer, () => {
					return createListItems(3, 3);
				})
		);
		assert.strictEqual(onValueStub.callCount, 2);
		assert.strictEqual(onRequestCloseStub.callCount, 1);
	});

	it('should set active item based on keyboard input', async () => {
		const testData = [
			{
				value: 'Bob'
			},
			{
				value: 'Adam'
			},
			{
				value: 'Ant'
			},
			{
				value: 'Anthony'
			},
			{
				value: 'Bobby'
			}
		];
		const r = renderer(() => (
			<List
				resource={{
					template: {
						template,
						id: 'test',
						initOptions: { data: testData, id: 'test' }
					}
				}}
				onValue={onValueStub}
			/>
		));
		const listAssertion = baseAssertion
			.setProperty(WrappedItemWrapper, 'styles', {
				height: '225px'
			})
			.replaceChildren(WrappedItemContainer, () => [
				<ListItem
					classes={undefined}
					active={true}
					disabled={false}
					key={'item-0'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={{
						'@dojo/widgets/list-item': {
							active: listItemCss.active,
							disabled: listItemCss.disabled,
							root: listItemCss.root,
							s: css.items,
							selected: listItemCss.selected
						}
					}}
					widgetId={'menu-test-item-0'}
				>
					Bob
				</ListItem>,
				<ListItem
					classes={undefined}
					active={false}
					disabled={false}
					key={'item-1'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={{
						'@dojo/widgets/list-item': {
							active: listItemCss.active,
							disabled: listItemCss.disabled,
							root: listItemCss.root,
							s: css.items,
							selected: listItemCss.selected
						}
					}}
					widgetId={'menu-test-item-1'}
				>
					Adam
				</ListItem>,
				<ListItem
					classes={undefined}
					active={false}
					disabled={false}
					key={'item-2'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={{
						'@dojo/widgets/list-item': {
							active: listItemCss.active,
							disabled: listItemCss.disabled,
							root: listItemCss.root,
							s: css.items,
							selected: listItemCss.selected
						}
					}}
					widgetId={'menu-test-item-2'}
				>
					Ant
				</ListItem>,
				<ListItem
					classes={undefined}
					active={false}
					disabled={false}
					key={'item-3'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={{
						'@dojo/widgets/list-item': {
							active: listItemCss.active,
							disabled: listItemCss.disabled,
							root: listItemCss.root,
							s: css.items,
							selected: listItemCss.selected
						}
					}}
					widgetId={'menu-test-item-3'}
				>
					Anthony
				</ListItem>,
				<ListItem
					classes={undefined}
					active={false}
					disabled={false}
					key={'item-4'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={{
						'@dojo/widgets/list-item': {
							active: listItemCss.active,
							disabled: listItemCss.disabled,
							root: listItemCss.root,
							s: css.items,
							selected: listItemCss.selected
						}
					}}
					widgetId={'menu-test-item-4'}
				>
					Bobby
				</ListItem>
			]);
		r.expect(listAssertion);
		r.property(
			WrappedRoot,
			'onkeydown',
			createMockEvent({ which: 0, key: 'b', metaKey: true })
		);
		r.expect(listAssertion);
		r.property(
			WrappedRoot,
			'onkeydown',
			createMockEvent({ which: 0, key: 'b', ctrlKey: true })
		);
		r.expect(listAssertion);
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: 0, key: 'bo' }));
		r.expect(listAssertion);
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: 0, key: 'a' }));
		r.expect(
			listAssertion
				.setProperty(WrappedRoot, 'aria-activedescendant', 'menu-test-item-1')
				.replaceChildren(WrappedItemContainer, () => [
					<ListItem
						classes={undefined}
						active={false}
						disabled={false}
						key={'item-0'}
						onRequestActive={noop}
						onSelect={noop}
						selected={false}
						theme={{
							'@dojo/widgets/list-item': {
								active: listItemCss.active,
								disabled: listItemCss.disabled,
								root: listItemCss.root,
								s: css.items,
								selected: listItemCss.selected
							}
						}}
						widgetId={'menu-test-item-0'}
					>
						Bob
					</ListItem>,
					<ListItem
						classes={undefined}
						active={true}
						disabled={false}
						key={'item-1'}
						onRequestActive={noop}
						onSelect={noop}
						selected={false}
						theme={{
							'@dojo/widgets/list-item': {
								active: listItemCss.active,
								disabled: listItemCss.disabled,
								root: listItemCss.root,
								s: css.items,
								selected: listItemCss.selected
							}
						}}
						widgetId={'menu-test-item-1'}
					>
						Adam
					</ListItem>,
					<ListItem
						classes={undefined}
						active={false}
						disabled={false}
						key={'item-2'}
						onRequestActive={noop}
						onSelect={noop}
						selected={false}
						theme={{
							'@dojo/widgets/list-item': {
								active: listItemCss.active,
								disabled: listItemCss.disabled,
								root: listItemCss.root,
								s: css.items,
								selected: listItemCss.selected
							}
						}}
						widgetId={'menu-test-item-2'}
					>
						Ant
					</ListItem>,
					<ListItem
						classes={undefined}
						active={false}
						disabled={false}
						key={'item-3'}
						onRequestActive={noop}
						onSelect={noop}
						selected={false}
						theme={{
							'@dojo/widgets/list-item': {
								active: listItemCss.active,
								disabled: listItemCss.disabled,
								root: listItemCss.root,
								s: css.items,
								selected: listItemCss.selected
							}
						}}
						widgetId={'menu-test-item-3'}
					>
						Anthony
					</ListItem>,
					<ListItem
						classes={undefined}
						active={false}
						disabled={false}
						key={'item-4'}
						onRequestActive={noop}
						onSelect={noop}
						selected={false}
						theme={{
							'@dojo/widgets/list-item': {
								active: listItemCss.active,
								disabled: listItemCss.disabled,
								root: listItemCss.root,
								s: css.items,
								selected: listItemCss.selected
							}
						}}
						widgetId={'menu-test-item-4'}
					>
						Bobby
					</ListItem>
				])
		);
		await new Promise((resolve) => setTimeout(resolve, 800));
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: 0, key: 'a' }));
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: 0, key: 'n' }));
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: 0, key: 't' }));
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: 0, key: 'h' }));
		r.expect(
			listAssertion
				.setProperty(WrappedRoot, 'aria-activedescendant', 'menu-test-item-3')
				.replaceChildren(WrappedItemContainer, () => [
					<ListItem
						classes={undefined}
						active={false}
						disabled={false}
						key={'item-0'}
						onRequestActive={noop}
						onSelect={noop}
						selected={false}
						theme={{
							'@dojo/widgets/list-item': {
								active: listItemCss.active,
								disabled: listItemCss.disabled,
								root: listItemCss.root,
								s: css.items,
								selected: listItemCss.selected
							}
						}}
						widgetId={'menu-test-item-0'}
					>
						Bob
					</ListItem>,
					<ListItem
						classes={undefined}
						active={false}
						disabled={false}
						key={'item-1'}
						onRequestActive={noop}
						onSelect={noop}
						selected={false}
						theme={{
							'@dojo/widgets/list-item': {
								active: listItemCss.active,
								disabled: listItemCss.disabled,
								root: listItemCss.root,
								s: css.items,
								selected: listItemCss.selected
							}
						}}
						widgetId={'menu-test-item-1'}
					>
						Adam
					</ListItem>,
					<ListItem
						classes={undefined}
						active={false}
						disabled={false}
						key={'item-2'}
						onRequestActive={noop}
						onSelect={noop}
						selected={false}
						theme={{
							'@dojo/widgets/list-item': {
								active: listItemCss.active,
								disabled: listItemCss.disabled,
								root: listItemCss.root,
								s: css.items,
								selected: listItemCss.selected
							}
						}}
						widgetId={'menu-test-item-2'}
					>
						Ant
					</ListItem>,
					<ListItem
						classes={undefined}
						active={true}
						disabled={false}
						key={'item-3'}
						onRequestActive={noop}
						onSelect={noop}
						selected={false}
						theme={{
							'@dojo/widgets/list-item': {
								active: listItemCss.active,
								disabled: listItemCss.disabled,
								root: listItemCss.root,
								s: css.items,
								selected: listItemCss.selected
							}
						}}
						widgetId={'menu-test-item-3'}
					>
						Anthony
					</ListItem>,
					<ListItem
						classes={undefined}
						active={false}
						disabled={false}
						key={'item-4'}
						onRequestActive={noop}
						onSelect={noop}
						selected={false}
						theme={{
							'@dojo/widgets/list-item': {
								active: listItemCss.active,
								disabled: listItemCss.disabled,
								root: listItemCss.root,
								s: css.items,
								selected: listItemCss.selected
							}
						}}
						widgetId={'menu-test-item-4'}
					>
						Bobby
					</ListItem>
				])
		);
		await new Promise((resolve) => setTimeout(resolve, 800));
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: 0, key: 'b' }));
		r.expect(
			listAssertion
				.setProperty(WrappedRoot, 'aria-activedescendant', 'menu-test-item-4')
				.replaceChildren(WrappedItemContainer, () => [
					<ListItem
						classes={undefined}
						active={false}
						disabled={false}
						key={'item-0'}
						onRequestActive={noop}
						onSelect={noop}
						selected={false}
						theme={{
							'@dojo/widgets/list-item': {
								active: listItemCss.active,
								disabled: listItemCss.disabled,
								root: listItemCss.root,
								s: css.items,
								selected: listItemCss.selected
							}
						}}
						widgetId={'menu-test-item-0'}
					>
						Bob
					</ListItem>,
					<ListItem
						classes={undefined}
						active={false}
						disabled={false}
						key={'item-1'}
						onRequestActive={noop}
						onSelect={noop}
						selected={false}
						theme={{
							'@dojo/widgets/list-item': {
								active: listItemCss.active,
								disabled: listItemCss.disabled,
								root: listItemCss.root,
								s: css.items,
								selected: listItemCss.selected
							}
						}}
						widgetId={'menu-test-item-1'}
					>
						Adam
					</ListItem>,
					<ListItem
						classes={undefined}
						active={false}
						disabled={false}
						key={'item-2'}
						onRequestActive={noop}
						onSelect={noop}
						selected={false}
						theme={{
							'@dojo/widgets/list-item': {
								active: listItemCss.active,
								disabled: listItemCss.disabled,
								root: listItemCss.root,
								s: css.items,
								selected: listItemCss.selected
							}
						}}
						widgetId={'menu-test-item-2'}
					>
						Ant
					</ListItem>,
					<ListItem
						classes={undefined}
						active={false}
						disabled={false}
						key={'item-3'}
						onRequestActive={noop}
						onSelect={noop}
						selected={false}
						theme={{
							'@dojo/widgets/list-item': {
								active: listItemCss.active,
								disabled: listItemCss.disabled,
								root: listItemCss.root,
								s: css.items,
								selected: listItemCss.selected
							}
						}}
						widgetId={'menu-test-item-3'}
					>
						Anthony
					</ListItem>,
					<ListItem
						classes={undefined}
						active={true}
						disabled={false}
						key={'item-4'}
						onRequestActive={noop}
						onSelect={noop}
						selected={false}
						theme={{
							'@dojo/widgets/list-item': {
								active: listItemCss.active,
								disabled: listItemCss.disabled,
								root: listItemCss.root,
								s: css.items,
								selected: listItemCss.selected
							}
						}}
						widgetId={'menu-test-item-4'}
					>
						Bobby
					</ListItem>
				])
		);
		await new Promise((resolve) => setTimeout(resolve, 800));
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: 0, key: 'a' }));
		r.expect(
			listAssertion
				.setProperty(WrappedRoot, 'aria-activedescendant', 'menu-test-item-1')
				.replaceChildren(WrappedItemContainer, () => [
					<ListItem
						classes={undefined}
						active={false}
						disabled={false}
						key={'item-0'}
						onRequestActive={noop}
						onSelect={noop}
						selected={false}
						theme={{
							'@dojo/widgets/list-item': {
								active: listItemCss.active,
								disabled: listItemCss.disabled,
								root: listItemCss.root,
								s: css.items,
								selected: listItemCss.selected
							}
						}}
						widgetId={'menu-test-item-0'}
					>
						Bob
					</ListItem>,
					<ListItem
						classes={undefined}
						active={true}
						disabled={false}
						key={'item-1'}
						onRequestActive={noop}
						onSelect={noop}
						selected={false}
						theme={{
							'@dojo/widgets/list-item': {
								active: listItemCss.active,
								disabled: listItemCss.disabled,
								root: listItemCss.root,
								s: css.items,
								selected: listItemCss.selected
							}
						}}
						widgetId={'menu-test-item-1'}
					>
						Adam
					</ListItem>,
					<ListItem
						classes={undefined}
						active={false}
						disabled={false}
						key={'item-2'}
						onRequestActive={noop}
						onSelect={noop}
						selected={false}
						theme={{
							'@dojo/widgets/list-item': {
								active: listItemCss.active,
								disabled: listItemCss.disabled,
								root: listItemCss.root,
								s: css.items,
								selected: listItemCss.selected
							}
						}}
						widgetId={'menu-test-item-2'}
					>
						Ant
					</ListItem>,
					<ListItem
						classes={undefined}
						active={false}
						disabled={false}
						key={'item-3'}
						onRequestActive={noop}
						onSelect={noop}
						selected={false}
						theme={{
							'@dojo/widgets/list-item': {
								active: listItemCss.active,
								disabled: listItemCss.disabled,
								root: listItemCss.root,
								s: css.items,
								selected: listItemCss.selected
							}
						}}
						widgetId={'menu-test-item-3'}
					>
						Anthony
					</ListItem>,
					<ListItem
						classes={undefined}
						active={false}
						disabled={false}
						key={'item-4'}
						onRequestActive={noop}
						onSelect={noop}
						selected={false}
						theme={{
							'@dojo/widgets/list-item': {
								active: listItemCss.active,
								disabled: listItemCss.disabled,
								root: listItemCss.root,
								s: css.items,
								selected: listItemCss.selected
							}
						}}
						widgetId={'menu-test-item-4'}
					>
						Bobby
					</ListItem>
				])
		);
	});

	it('should scroll list', () => {
		const testData = [
			{
				value: 'Bob'
			},
			{
				value: 'Adam'
			},
			{
				value: 'Ant'
			},
			{
				value: 'Anthony'
			},
			{
				value: 'Bobby'
			}
		];
		const r = renderer(() => (
			<List
				resource={{
					template: {
						template,
						id: 'test',
						initOptions: { data: testData, id: 'test' }
					}
				}}
				onValue={onValueStub}
			/>
		));
		const listAssertion = baseAssertion
			.setProperty(WrappedItemWrapper, 'styles', {
				height: '225px'
			})
			.replaceChildren(WrappedItemContainer, () => [
				<ListItem
					classes={undefined}
					active={true}
					disabled={false}
					key={'item-0'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={{
						'@dojo/widgets/list-item': {
							active: listItemCss.active,
							disabled: listItemCss.disabled,
							root: listItemCss.root,
							s: css.items,
							selected: listItemCss.selected
						}
					}}
					widgetId={'menu-test-item-0'}
				>
					Bob
				</ListItem>,
				<ListItem
					classes={undefined}
					active={false}
					disabled={false}
					key={'item-1'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={{
						'@dojo/widgets/list-item': {
							active: listItemCss.active,
							disabled: listItemCss.disabled,
							root: listItemCss.root,
							s: css.items,
							selected: listItemCss.selected
						}
					}}
					widgetId={'menu-test-item-1'}
				>
					Adam
				</ListItem>,
				<ListItem
					classes={undefined}
					active={false}
					disabled={false}
					key={'item-2'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={{
						'@dojo/widgets/list-item': {
							active: listItemCss.active,
							disabled: listItemCss.disabled,
							root: listItemCss.root,
							s: css.items,
							selected: listItemCss.selected
						}
					}}
					widgetId={'menu-test-item-2'}
				>
					Ant
				</ListItem>,
				<ListItem
					classes={undefined}
					active={false}
					disabled={false}
					key={'item-3'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={{
						'@dojo/widgets/list-item': {
							active: listItemCss.active,
							disabled: listItemCss.disabled,
							root: listItemCss.root,
							s: css.items,
							selected: listItemCss.selected
						}
					}}
					widgetId={'menu-test-item-3'}
				>
					Anthony
				</ListItem>,
				<ListItem
					classes={undefined}
					active={false}
					disabled={false}
					key={'item-4'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={{
						'@dojo/widgets/list-item': {
							active: listItemCss.active,
							disabled: listItemCss.disabled,
							root: listItemCss.root,
							s: css.items,
							selected: listItemCss.selected
						}
					}}
					widgetId={'menu-test-item-4'}
				>
					Bobby
				</ListItem>
			]);
		r.expect(listAssertion);
		r.property(WrappedRoot, 'onscroll', {
			target: {
				scrollTop: 100
			}
		});
		r.expect(listAssertion.setProperty(WrappedRoot, 'scrollTop', 100));
	});

	it('should use custom item renderer', () => {
		const listWithListItemsAssertion = baseAssertion
			.setProperty(WrappedItemWrapper, 'styles', {
				height: '135px'
			})
			.replaceChildren(WrappedItemContainer, () => [
				<ListItem
					classes={undefined}
					active={true}
					disabled={false}
					key={'item-0'}
					onRequestActive={noop}
					onSelect={noop}
					widgetId={'menu-test-item-0'}
				>
					dog
				</ListItem>,
				<ListItem
					classes={undefined}
					active={false}
					disabled={false}
					key={'item-1'}
					onRequestActive={noop}
					onSelect={noop}
					widgetId={'menu-test-item-1'}
				>
					Cat
				</ListItem>,
				<ListItem
					classes={undefined}
					active={false}
					disabled={true}
					key={'item-2'}
					onRequestActive={noop}
					onSelect={noop}
					widgetId={'menu-test-item-2'}
				>
					fish
				</ListItem>
			]);
		const r = renderer(() => (
			<List
				resource={{ template: { template, id: 'test', initOptions: { data, id: 'test' } } }}
				onValue={onValueStub}
			>
				{(item, itemProps) => {
					return (
						<ListItem classes={undefined} {...itemProps}>
							{item.label || item.value}
						</ListItem>
					);
				}}
			</List>
		));
		r.expect(listWithListItemsAssertion);
	});

	it('should render with initial value', () => {
		const r = renderer(() => (
			<List
				resource={{ template: { template, id: 'test', initOptions: { data, id: 'test' } } }}
				onValue={onValueStub}
				initialValue="cat"
			/>
		));
		const listAssertion = baseAssertion
			.setProperty(WrappedItemWrapper, 'styles', {
				height: '135px'
			})
			.replaceChildren(WrappedItemContainer, () => [
				<ListItem
					classes={undefined}
					active={true}
					disabled={false}
					key={'item-0'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={{
						'@dojo/widgets/list-item': {
							active: listItemCss.active,
							disabled: listItemCss.disabled,
							root: listItemCss.root,
							s: css.items,
							selected: listItemCss.selected
						}
					}}
					widgetId={'menu-test-item-0'}
				>
					dog
				</ListItem>,
				<ListItem
					classes={undefined}
					active={false}
					disabled={false}
					key={'item-1'}
					onRequestActive={noop}
					onSelect={noop}
					selected={true}
					theme={{
						'@dojo/widgets/list-item': {
							active: listItemCss.active,
							disabled: listItemCss.disabled,
							root: listItemCss.root,
							s: css.items,
							selected: listItemCss.selected
						}
					}}
					widgetId={'menu-test-item-1'}
				>
					Cat
				</ListItem>,
				<ListItem
					classes={undefined}
					active={false}
					disabled={true}
					key={'item-2'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={{
						'@dojo/widgets/list-item': {
							active: listItemCss.active,
							disabled: listItemCss.disabled,
							root: listItemCss.root,
							s: css.items,
							selected: listItemCss.selected
						}
					}}
					widgetId={'menu-test-item-2'}
				>
					fish
				</ListItem>
			]);
		r.expect(listAssertion);
	});

	it('should render with value', () => {
		const props = {
			value: 'cat'
		};
		const r = renderer(() => (
			<List
				resource={{ template: { template, id: 'test', initOptions: { data, id: 'test' } } }}
				onValue={onValueStub}
				value={props.value}
			/>
		));
		let listAssertion = baseAssertion
			.setProperty(WrappedItemWrapper, 'styles', {
				height: '135px'
			})
			.replaceChildren(WrappedItemContainer, () => [
				<ListItem
					classes={undefined}
					active={true}
					disabled={false}
					key={'item-0'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={{
						'@dojo/widgets/list-item': {
							active: listItemCss.active,
							disabled: listItemCss.disabled,
							root: listItemCss.root,
							s: css.items,
							selected: listItemCss.selected
						}
					}}
					widgetId={'menu-test-item-0'}
				>
					dog
				</ListItem>,
				<ListItem
					classes={undefined}
					active={false}
					disabled={false}
					key={'item-1'}
					onRequestActive={noop}
					onSelect={noop}
					selected={true}
					theme={{
						'@dojo/widgets/list-item': {
							active: listItemCss.active,
							disabled: listItemCss.disabled,
							root: listItemCss.root,
							s: css.items,
							selected: listItemCss.selected
						}
					}}
					widgetId={'menu-test-item-1'}
				>
					Cat
				</ListItem>,
				<ListItem
					classes={undefined}
					active={false}
					disabled={true}
					key={'item-2'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={{
						'@dojo/widgets/list-item': {
							active: listItemCss.active,
							disabled: listItemCss.disabled,
							root: listItemCss.root,
							s: css.items,
							selected: listItemCss.selected
						}
					}}
					widgetId={'menu-test-item-2'}
				>
					fish
				</ListItem>
			]);
		r.expect(listAssertion);
		props.value = 'dog';
		listAssertion = baseAssertion
			.setProperty(WrappedItemWrapper, 'styles', {
				height: '135px'
			})
			.replaceChildren(WrappedItemContainer, () => [
				<ListItem
					classes={undefined}
					active={true}
					disabled={false}
					key={'item-0'}
					onRequestActive={noop}
					onSelect={noop}
					selected={true}
					theme={{
						'@dojo/widgets/list-item': {
							active: listItemCss.active,
							disabled: listItemCss.disabled,
							root: listItemCss.root,
							s: css.items,
							selected: listItemCss.selected
						}
					}}
					widgetId={'menu-test-item-0'}
				>
					dog
				</ListItem>,
				<ListItem
					classes={undefined}
					active={false}
					disabled={false}
					key={'item-1'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={{
						'@dojo/widgets/list-item': {
							active: listItemCss.active,
							disabled: listItemCss.disabled,
							root: listItemCss.root,
							s: css.items,
							selected: listItemCss.selected
						}
					}}
					widgetId={'menu-test-item-1'}
				>
					Cat
				</ListItem>,
				<ListItem
					classes={undefined}
					active={false}
					disabled={true}
					key={'item-2'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={{
						'@dojo/widgets/list-item': {
							active: listItemCss.active,
							disabled: listItemCss.disabled,
							root: listItemCss.root,
							s: css.items,
							selected: listItemCss.selected
						}
					}}
					widgetId={'menu-test-item-2'}
				>
					fish
				</ListItem>
			]);
		r.expect(listAssertion);
	});

	it('should render a divider based on the data', () => {
		const testData = [
			{
				value: 'dog',
				divider: true
			},
			{
				value: 'cat',
				label: 'Cat',
				divider: true
			},
			{
				value: 'fish',
				disabled: true
			}
		];
		const r = renderer(() => (
			<List
				resource={{
					template: { template, id: 'test', initOptions: { data: testData, id: 'test' } }
				}}
				onValue={onValueStub}
			/>
		));
		const listAssertion = baseAssertion
			.setProperty(WrappedItemWrapper, 'styles', {
				height: '135px'
			})
			.replaceChildren(WrappedItemContainer, () => [
				<ListItem
					classes={undefined}
					active={true}
					disabled={false}
					key={'item-0'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={{
						'@dojo/widgets/list-item': {
							active: listItemCss.active,
							disabled: listItemCss.disabled,
							root: listItemCss.root,
							s: css.items,
							selected: listItemCss.selected
						}
					}}
					widgetId={'menu-test-item-0'}
				>
					dog
				</ListItem>,
				<hr classes={css.divider} />,
				<ListItem
					classes={undefined}
					active={false}
					disabled={false}
					key={'item-1'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={{
						'@dojo/widgets/list-item': {
							active: listItemCss.active,
							disabled: listItemCss.disabled,
							root: listItemCss.root,
							s: css.items,
							selected: listItemCss.selected
						}
					}}
					widgetId={'menu-test-item-1'}
				>
					Cat
				</ListItem>,
				<hr classes={css.divider} />,
				<ListItem
					classes={undefined}
					active={false}
					disabled={true}
					key={'item-2'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={{
						'@dojo/widgets/list-item': {
							active: listItemCss.active,
							disabled: listItemCss.disabled,
							root: listItemCss.root,
							s: css.items,
							selected: listItemCss.selected
						}
					}}
					widgetId={'menu-test-item-2'}
				>
					fish
				</ListItem>
			]);
		r.expect(listAssertion);
	});
});
