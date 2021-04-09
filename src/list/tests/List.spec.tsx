const { describe, it, afterEach, beforeEach } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import { sandbox } from 'sinon';
import global from '@dojo/framework/shim/global';
import { tsx, getRegistry, create } from '@dojo/framework/core/vdom';
import { renderer, assertion, wrap } from '@dojo/framework/testing/renderer';
import { noop, createTestTheme } from '../../common/tests/support/test-helpers';
import { Keys } from '../../common/util';
import List, { ListItem, MenuItem } from '../index';
import LoadingIndicator from '../../loading-indicator';
import * as css from '../../theme/default/list.m.css';
import * as fixedCss from '../list.m.css';
import * as listItemCss from '../../theme/default/list-item.m.css';
import * as menuItemCss from '../../theme/default/menu-item.m.css';
import Registry from '@dojo/framework/core/Registry';
import RegistryHandler from '@dojo/framework/core/RegistryHandler';
import { createResourceTemplate } from '@dojo/framework/core/middleware/resources';
import dimensions from '@dojo/framework/core/middleware/dimensions';

const mockGetRegistry = create()(function() {
	const registry = new Registry();
	const handler = new RegistryHandler();
	handler.base = registry;
	return () => handler;
});

const data = [
	{
		value: '1',
		label: 'Dog'
	},
	{
		value: '2',
		label: 'Cat'
	},
	{
		value: '3',
		label: 'Fish',
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

interface ChildOptions {
	activeItem?: 'item-0' | 'item-1' | 'item-2' | 'item-3' | 'item-4';
}

const createChildren = (options?: ChildOptions) => {
	const { activeItem = undefined } = options || {};

	return [
		<ListItem
			classes={undefined}
			variant={undefined}
			active={activeItem === 'item-0'}
			disabled={false}
			key={'item-0'}
			onRequestActive={noop}
			onSelect={noop}
			selected={false}
			theme={listItemTheme}
			widgetId={'menu-test-item-0'}
			collapsed={false}
			draggable={undefined}
			dragged={false}
			movedDown={false}
			movedUp={false}
			onDragEnd={noop}
			onDragOver={noop}
			onDragStart={noop}
			onDrop={noop}
		>
			Bob
		</ListItem>,
		<ListItem
			classes={undefined}
			variant={undefined}
			active={activeItem === 'item-1'}
			disabled={false}
			key={'item-1'}
			onRequestActive={noop}
			onSelect={noop}
			selected={false}
			theme={listItemTheme}
			widgetId={'menu-test-item-1'}
			collapsed={false}
			draggable={undefined}
			dragged={false}
			movedDown={false}
			movedUp={false}
			onDragEnd={noop}
			onDragOver={noop}
			onDragStart={noop}
			onDrop={noop}
		>
			Adam
		</ListItem>,
		<ListItem
			classes={undefined}
			variant={undefined}
			active={activeItem === 'item-2'}
			disabled={false}
			key={'item-2'}
			onRequestActive={noop}
			onSelect={noop}
			selected={false}
			theme={listItemTheme}
			widgetId={'menu-test-item-2'}
			collapsed={false}
			draggable={undefined}
			dragged={false}
			movedDown={false}
			movedUp={false}
			onDragEnd={noop}
			onDragOver={noop}
			onDragStart={noop}
			onDrop={noop}
		>
			Ant
		</ListItem>,
		<ListItem
			classes={undefined}
			variant={undefined}
			active={activeItem === 'item-3'}
			disabled={false}
			key={'item-3'}
			onRequestActive={noop}
			onSelect={noop}
			selected={false}
			theme={listItemTheme}
			widgetId={'menu-test-item-3'}
			collapsed={false}
			draggable={undefined}
			dragged={false}
			movedDown={false}
			movedUp={false}
			onDragEnd={noop}
			onDragOver={noop}
			onDragStart={noop}
			onDrop={noop}
		>
			Anthony
		</ListItem>,
		<ListItem
			classes={undefined}
			variant={undefined}
			active={activeItem === 'item-4'}
			disabled={false}
			key={'item-4'}
			onRequestActive={noop}
			onSelect={noop}
			selected={false}
			theme={listItemTheme}
			widgetId={'menu-test-item-4'}
			collapsed={false}
			draggable={undefined}
			dragged={false}
			movedDown={false}
			movedUp={false}
			onDragEnd={noop}
			onDragOver={noop}
			onDragStart={noop}
			onDrop={noop}
		>
			Bobby
		</ListItem>
	];
};

const listItemTheme = createTestTheme({ ...listItemCss, s: css.items });

const WrappedItemContainer = wrap('div');
const WrappedItemWrapper = wrap('div');
const WrappedRoot = wrap('div');

const baseAssertion = assertion(() => (
	<WrappedRoot
		aria-activedescendant={undefined}
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
			height: '450px'
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
			variant={undefined}
			active={false}
			disabled={false}
			key={'item-0'}
			onRequestActive={noop}
			onSelect={noop}
			selected={false}
			theme={listItemTheme}
			widgetId={'menu-test-item-0'}
			collapsed={false}
			draggable={undefined}
			dragged={false}
			movedDown={false}
			movedUp={false}
			onDragEnd={noop}
			onDragOver={noop}
			onDragStart={noop}
			onDrop={noop}
		>
			Dog
		</ListItem>,
		<ListItem
			classes={undefined}
			variant={undefined}
			active={false}
			disabled={false}
			key={'item-1'}
			onRequestActive={noop}
			onSelect={noop}
			selected={false}
			theme={listItemTheme}
			widgetId={'menu-test-item-1'}
			collapsed={false}
			draggable={undefined}
			dragged={false}
			movedDown={false}
			movedUp={false}
			onDragEnd={noop}
			onDragOver={noop}
			onDragStart={noop}
			onDrop={noop}
		>
			Cat
		</ListItem>,
		<ListItem
			classes={undefined}
			variant={undefined}
			active={false}
			disabled={true}
			key={'item-2'}
			onRequestActive={noop}
			onSelect={noop}
			selected={false}
			theme={listItemTheme}
			widgetId={'menu-test-item-2'}
			collapsed={false}
			draggable={undefined}
			dragged={false}
			movedDown={false}
			movedUp={false}
			onDragEnd={noop}
			onDragOver={noop}
			onDragStart={noop}
			onDrop={noop}
		>
			Fish
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
			variant={undefined}
			active={false}
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
			Dog
		</MenuItem>,
		<MenuItem
			classes={undefined}
			variant={undefined}
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
			variant={undefined}
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
			Fish
		</MenuItem>
	]);

describe('List', () => {
	beforeEach(() => {
		sb.stub(global.window.HTMLDivElement.prototype, 'getBoundingClientRect').callsFake(() => ({
			height: 45
		}));
	});

	afterEach(() => {
		sb.restore();
	});

	it('should render with list item placeholders', async () => {
		const data: any[] = [];
		for (let i = 0; i < 60; i++) {
			data.push({ value: `${i}`, label: `Item ${i}` });
		}
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
				height: '2700px'
			})
			.setProperty(WrappedRoot, 'styles', {
				height: '450px'
			})
			.replaceChildren(WrappedItemContainer, () => {
				const children: any[] = [];
				for (let i = 0; i < 30; i++) {
					children.push(
						<ListItem
							classes={undefined}
							variant={undefined}
							active={false}
							disabled={false}
							key={`item-${i}`}
							onRequestActive={noop}
							onSelect={noop}
							selected={false}
							theme={listItemTheme}
							widgetId={`menu-test-item-${i}`}
							collapsed={false}
							draggable={undefined}
							dragged={false}
							movedDown={false}
							movedUp={false}
							onDragEnd={noop}
							onDragOver={noop}
							onDragStart={noop}
							onDrop={noop}
						>
							{`Item ${i}`}
						</ListItem>
					);
				}
				return children;
			});
		const template = createResourceTemplate<{
			value: string;
			label: string;
			disabled?: boolean;
		}>({
			idKey: 'value',
			read: (request, { put }) => {
				if (request.offset === 0) {
					return pageOnePromise.then((res) => {
						put(res, request);
					});
				}
				return pageTwoPromise.then((res) => {
					put(res, request);
				});
			}
		});

		const r = renderer(() => <List resource={{ template }} onValue={onValueStub} />, {
			middleware: [[getRegistry, mockGetRegistry]]
		});
		r.expect(baseAssertion);
		pageOneResolver!({ data: data.slice(0, 30), total: data.length });
		await pageOnePromise;
		r.expect(listAssertion);
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: Keys.End }));
		const endAssertion = listAssertion
			.setProperty(WrappedRoot, 'aria-activedescendant', 'menu-test-item-59')
			.setProperty(WrappedRoot, 'scrollTop', 2250)
			.setProperty(WrappedItemContainer, 'styles', { transform: 'translateY(1800px)' });
		const placeHolderAssertion = endAssertion.replaceChildren(WrappedItemContainer, () => {
			const children: any[] = [];
			for (let i = 40; i < 60; i++) {
				children.push(
					<div key={`item-${i}`} styles={{ height: '45px' }}>
						<ListItem
							classes={undefined}
							variant={undefined}
							active={false}
							disabled={true}
							key={`item-${i}`}
							onRequestActive={noop}
							onSelect={noop}
							selected={false}
							theme={listItemTheme}
							widgetId={`menu-test-item-${i}`}
							collapsed={false}
							draggable={undefined}
							dragged={false}
							movedDown={false}
							movedUp={false}
							onDragEnd={noop}
							onDragOver={noop}
							onDragStart={noop}
							onDrop={noop}
						>
							<LoadingIndicator />
						</ListItem>
					</div>
				);
			}
			return children;
		});
		r.expect(placeHolderAssertion);
		pageTwoResolver!({ data: data.slice(30), total: data.length });
		await pageTwoPromise;
		const lastPageItemsAssertion = endAssertion.replaceChildren(WrappedItemContainer, () => {
			const children: any[] = [];
			for (let i = 40; i < 60; i++) {
				children.push(
					<ListItem
						classes={undefined}
						variant={undefined}
						active={i === 59}
						disabled={false}
						key={`item-${i}`}
						onRequestActive={noop}
						onSelect={noop}
						selected={false}
						theme={listItemTheme}
						widgetId={`menu-test-item-${i}`}
						collapsed={false}
						draggable={undefined}
						dragged={false}
						movedDown={false}
						movedUp={false}
						onDragEnd={noop}
						onDragOver={noop}
						onDragStart={noop}
						onDrop={noop}
					>
						{`Item ${i}`}
					</ListItem>
				);
			}
			return children;
		});
		r.expect(lastPageItemsAssertion);
	});

	it('should render list with list items data', () => {
		const r = renderer(
			() => <List resource={{ data, id: 'test', idKey: 'value' }} onValue={onValueStub} />,
			{ middleware: [[getRegistry, mockGetRegistry]] }
		);
		r.expect(listWithListItemsAssertion);
	});

	it('should render list with auto height', () => {
		const r = renderer(
			() => (
				<List
					height="auto"
					resource={{ data, id: 'test', idKey: 'value' }}
					onValue={onValueStub}
				/>
			),
			{ middleware: [[getRegistry, mockGetRegistry]] }
		);
		r.expect(
			listWithListItemsAssertion.setProperty(WrappedRoot, 'styles', {
				maxHeight: '450px'
			})
		);
	});

	it('should render list showing the number of items to fit height', () => {
		const data = [
			{
				value: '1',
				label: 'Dog'
			},
			{
				value: '2',
				label: 'Cat'
			},
			{
				value: '3',
				label: 'Fish',
				disabled: true
			},
			{
				value: '4',
				label: 'Dog'
			},
			{
				value: '5',
				label: 'Cat'
			},
			{
				value: '6',
				label: 'Fish',
				disabled: true
			},
			{
				value: '7',
				label: 'Dog'
			},
			{
				value: '8',
				label: 'Cat'
			},
			{
				value: '9',
				label: 'Fish',
				disabled: true
			},
			{
				value: '10',
				label: 'Dog'
			},
			{
				value: '11',
				label: 'Cat'
			},
			{
				value: '12',
				label: 'Fish',
				disabled: true
			}
		];
		const listWithListItemsAssertion = baseAssertion
			.setProperty(WrappedRoot, 'styles', {
				height: '90px'
			})
			.setProperty(WrappedItemWrapper, 'styles', {
				height: '540px'
			})
			.replaceChildren(WrappedItemContainer, () => [
				<ListItem
					classes={undefined}
					variant={undefined}
					active={false}
					disabled={false}
					key={'item-0'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={listItemTheme}
					widgetId={'menu-test-item-0'}
					collapsed={false}
					draggable={undefined}
					dragged={false}
					movedDown={false}
					movedUp={false}
					onDragEnd={noop}
					onDragOver={noop}
					onDragStart={noop}
					onDrop={noop}
				>
					Dog
				</ListItem>,
				<ListItem
					classes={undefined}
					variant={undefined}
					active={false}
					disabled={false}
					key={'item-1'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={listItemTheme}
					widgetId={'menu-test-item-1'}
					collapsed={false}
					draggable={undefined}
					dragged={false}
					movedDown={false}
					movedUp={false}
					onDragEnd={noop}
					onDragOver={noop}
					onDragStart={noop}
					onDrop={noop}
				>
					Cat
				</ListItem>,
				<ListItem
					classes={undefined}
					variant={undefined}
					active={false}
					disabled={true}
					key={'item-2'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={listItemTheme}
					widgetId={'menu-test-item-2'}
					collapsed={false}
					draggable={undefined}
					dragged={false}
					movedDown={false}
					movedUp={false}
					onDragEnd={noop}
					onDragOver={noop}
					onDragStart={noop}
					onDrop={noop}
				>
					Fish
				</ListItem>,
				<ListItem
					classes={undefined}
					variant={undefined}
					active={false}
					disabled={false}
					key={'item-3'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={listItemTheme}
					widgetId={'menu-test-item-3'}
					collapsed={false}
					draggable={undefined}
					dragged={false}
					movedDown={false}
					movedUp={false}
					onDragEnd={noop}
					onDragOver={noop}
					onDragStart={noop}
					onDrop={noop}
				>
					Dog
				</ListItem>,
				<ListItem
					classes={undefined}
					variant={undefined}
					active={false}
					disabled={false}
					key={'item-4'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={listItemTheme}
					widgetId={'menu-test-item-4'}
					collapsed={false}
					draggable={undefined}
					dragged={false}
					movedDown={false}
					movedUp={false}
					onDragEnd={noop}
					onDragOver={noop}
					onDragStart={noop}
					onDrop={noop}
				>
					Cat
				</ListItem>,
				<ListItem
					classes={undefined}
					variant={undefined}
					active={false}
					disabled={true}
					key={'item-5'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={listItemTheme}
					widgetId={'menu-test-item-5'}
					collapsed={false}
					draggable={undefined}
					dragged={false}
					movedDown={false}
					movedUp={false}
					onDragEnd={noop}
					onDragOver={noop}
					onDragStart={noop}
					onDrop={noop}
				>
					Fish
				</ListItem>
			]);

		const factory = create();
		let height = 0;
		let width = 0;
		const mockDimensions = factory(() => {
			return {
				get() {
					return { size: { height, width } };
				}
			};
		});
		const r = renderer(
			() => (
				<List
					itemsInView="fill"
					resource={{ data, id: 'test', idKey: 'value' }}
					onValue={onValueStub}
				/>
			),
			{ middleware: [[getRegistry, mockGetRegistry], [dimensions, mockDimensions]] }
		);
		r.expect(assertion(() => <div key="fill-root" styles={{ height: '100%' }} />));
		height = 90;
		r.expect(listWithListItemsAssertion);
	});

	it('should fall back to default number of items for "fill" when no height can be determined', () => {
		const data = [
			{
				value: '1',
				label: 'Dog'
			},
			{
				value: '2',
				label: 'Cat'
			},
			{
				value: '3',
				label: 'Fish',
				disabled: true
			},
			{
				value: '4',
				label: 'Dog'
			},
			{
				value: '5',
				label: 'Cat'
			},
			{
				value: '6',
				label: 'Fish',
				disabled: true
			},
			{
				value: '7',
				label: 'Dog'
			}
		];
		const listWithListItemsAssertion = baseAssertion
			.setProperty(WrappedRoot, 'styles', {
				height: '450px'
			})
			.setProperty(WrappedItemWrapper, 'styles', {
				height: '315px'
			})
			.replaceChildren(WrappedItemContainer, () => [
				<ListItem
					classes={undefined}
					variant={undefined}
					active={false}
					disabled={false}
					key={'item-0'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={listItemTheme}
					widgetId={'menu-test-item-0'}
					collapsed={false}
					draggable={undefined}
					dragged={false}
					movedDown={false}
					movedUp={false}
					onDragEnd={noop}
					onDragOver={noop}
					onDragStart={noop}
					onDrop={noop}
				>
					Dog
				</ListItem>,
				<ListItem
					classes={undefined}
					variant={undefined}
					active={false}
					disabled={false}
					key={'item-1'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={listItemTheme}
					widgetId={'menu-test-item-1'}
					collapsed={false}
					draggable={undefined}
					dragged={false}
					movedDown={false}
					movedUp={false}
					onDragEnd={noop}
					onDragOver={noop}
					onDragStart={noop}
					onDrop={noop}
				>
					Cat
				</ListItem>,
				<ListItem
					classes={undefined}
					variant={undefined}
					active={false}
					disabled={true}
					key={'item-2'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={listItemTheme}
					widgetId={'menu-test-item-2'}
					collapsed={false}
					draggable={undefined}
					dragged={false}
					movedDown={false}
					movedUp={false}
					onDragEnd={noop}
					onDragOver={noop}
					onDragStart={noop}
					onDrop={noop}
				>
					Fish
				</ListItem>,
				<ListItem
					classes={undefined}
					variant={undefined}
					active={false}
					disabled={false}
					key={'item-3'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={listItemTheme}
					widgetId={'menu-test-item-3'}
					collapsed={false}
					draggable={undefined}
					dragged={false}
					movedDown={false}
					movedUp={false}
					onDragEnd={noop}
					onDragOver={noop}
					onDragStart={noop}
					onDrop={noop}
				>
					Dog
				</ListItem>,
				<ListItem
					classes={undefined}
					variant={undefined}
					active={false}
					disabled={false}
					key={'item-4'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={listItemTheme}
					widgetId={'menu-test-item-4'}
					collapsed={false}
					draggable={undefined}
					dragged={false}
					movedDown={false}
					movedUp={false}
					onDragEnd={noop}
					onDragOver={noop}
					onDragStart={noop}
					onDrop={noop}
				>
					Cat
				</ListItem>,
				<ListItem
					classes={undefined}
					variant={undefined}
					active={false}
					disabled={true}
					key={'item-5'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={listItemTheme}
					widgetId={'menu-test-item-5'}
					collapsed={false}
					draggable={undefined}
					dragged={false}
					movedDown={false}
					movedUp={false}
					onDragEnd={noop}
					onDragOver={noop}
					onDragStart={noop}
					onDrop={noop}
				>
					Fish
				</ListItem>,
				<ListItem
					classes={undefined}
					variant={undefined}
					active={false}
					disabled={false}
					key={'item-6'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={listItemTheme}
					widgetId={'menu-test-item-6'}
					collapsed={false}
					draggable={undefined}
					dragged={false}
					movedDown={false}
					movedUp={false}
					onDragEnd={noop}
					onDragOver={noop}
					onDragStart={noop}
					onDrop={noop}
				>
					Dog
				</ListItem>
			]);

		const factory = create();
		const mockDimensions = factory(() => {
			return {
				get() {
					return { size: { width: 90 } };
				}
			};
		});
		const r = renderer(
			() => (
				<List
					itemsInView="fill"
					resource={{ data, id: 'test', idKey: 'value' }}
					onValue={onValueStub}
				/>
			),
			{ middleware: [[getRegistry, mockGetRegistry], [dimensions, mockDimensions]] }
		);
		r.expect(listWithListItemsAssertion);
	});

	it('should render list with menu items data', () => {
		const r = renderer(
			() => (
				<List menu resource={{ data, id: 'test', idKey: 'value' }} onValue={onValueStub} />
			),
			{ middleware: [[getRegistry, mockGetRegistry]] }
		);
		r.expect(listWithMenuItemsAssertion);
	});

	it('should render with menu item placeholders', async () => {
		const data: any[] = [];
		for (let i = 0; i < 60; i++) {
			data.push({ value: `${i}`, label: `Item ${i}` });
		}
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
				height: '2700px'
			})
			.setProperty(WrappedRoot, 'styles', {
				height: '450px'
			})
			.replaceChildren(WrappedItemContainer, () => {
				const children: any[] = [];
				for (let i = 0; i < 30; i++) {
					children.push(
						<MenuItem
							classes={undefined}
							variant={undefined}
							active={false}
							disabled={false}
							key={`item-${i}`}
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
							widgetId={`menu-test-item-${i}`}
						>
							{`Item ${i}`}
						</MenuItem>
					);
				}
				return children;
			});
		const template = createResourceTemplate<{
			value: string;
			label: string;
			disabled?: boolean;
		}>({
			idKey: 'value',
			read: (request, { put }) => {
				if (request.offset === 0) {
					return pageOnePromise.then((res) => {
						put(res, request);
					});
				}
				return pageTwoPromise.then((res) => {
					put(res, request);
				});
			}
		});

		const r = renderer(() => <List menu resource={{ template }} onValue={onValueStub} />, {
			middleware: [[getRegistry, mockGetRegistry]]
		});
		r.expect(baseAssertion.setProperty(WrappedRoot, 'role', 'menu'));
		pageOneResolver!({ data: data.slice(0, 30), total: data.length });
		await pageOnePromise;
		r.expect(menuAssertion);
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: Keys.End }));
		const endAssertion = menuAssertion
			.setProperty(WrappedRoot, 'aria-activedescendant', 'menu-test-item-59')
			.setProperty(WrappedRoot, 'scrollTop', 2250)
			.setProperty(WrappedItemContainer, 'styles', { transform: 'translateY(1800px)' });
		const placeHolderAssertion = endAssertion.replaceChildren(WrappedItemContainer, () => {
			const children: any[] = [];
			for (let i = 40; i < 60; i++) {
				children.push(
					<div key={`item-${i}`} styles={{ height: '45px' }}>
						<MenuItem
							classes={undefined}
							variant={undefined}
							active={false}
							disabled={true}
							key={`item-${i}`}
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
							widgetId={`menu-test-item-${i}`}
						>
							<LoadingIndicator />
						</MenuItem>
					</div>
				);
			}
			return children;
		});
		r.expect(placeHolderAssertion);
		pageTwoResolver!({ data: data.slice(30), total: data.length });
		await pageTwoPromise;
		const lastPageItemsAssertion = endAssertion.replaceChildren(WrappedItemContainer, () => {
			const children: any[] = [];
			for (let i = 40; i < 60; i++) {
				children.push(
					<MenuItem
						classes={undefined}
						variant={undefined}
						active={59 === i}
						disabled={false}
						key={`item-${i}`}
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
						widgetId={`menu-test-item-${i}`}
					>
						{`Item ${i}`}
					</MenuItem>
				);
			}
			return children;
		});
		r.expect(lastPageItemsAssertion);
	});

	it('should be able to navigate the list using the keyboard', () => {
		function createListItems(activeIndex: number | undefined = undefined, selected?: number) {
			return new Array(6).fill(undefined).map((_, index) => (
				<ListItem
					classes={undefined}
					variant={undefined}
					active={index === activeIndex}
					disabled={testData[index].value === '3'}
					key={`item-${index}`}
					onRequestActive={noop}
					onSelect={noop}
					selected={!!selected && index === selected}
					theme={listItemTheme}
					widgetId={`menu-test-item-${index}`}
					collapsed={false}
					draggable={undefined}
					dragged={false}
					movedDown={false}
					movedUp={false}
					onDragEnd={noop}
					onDragOver={noop}
					onDragStart={noop}
					onDrop={noop}
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
					value: '4',
					label: 'Panda'
				},
				{
					value: '5',
					label: 'Crow'
				},
				{
					value: '6',
					label: 'Fire-Bellied Toad'
				}
			]
		];
		const r = renderer(
			() => (
				<List
					resource={{ data: testData, id: 'test', idKey: 'value' }}
					disabled={(item) => {
						return item.value === '3';
					}}
					onValue={onValueStub}
					onRequestClose={onRequestCloseStub}
				/>
			),
			{ middleware: [[getRegistry, mockGetRegistry]] }
		);
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
					return createListItems(0);
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
					return createListItems(0);
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
					return createListItems(0);
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
				.setProperty(WrappedRoot, 'aria-activedescendant', 'menu-test-item-0')
				.setProperty(WrappedItemWrapper, 'styles', {
					height: '270px'
				})
				.replaceChildren(WrappedItemContainer, () => {
					return createListItems(0);
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

	it('should navigate to the first item when pressing down and no item is active', () => {
		function createListItems(activeIndex: number | undefined = undefined, selected?: number) {
			return new Array(6).fill(undefined).map((_, index) => (
				<ListItem
					classes={undefined}
					variant={undefined}
					active={index === activeIndex}
					disabled={testData[index].value === '3'}
					key={`item-${index}`}
					onRequestActive={noop}
					onSelect={noop}
					selected={!!selected && index === selected}
					theme={listItemTheme}
					widgetId={`menu-test-item-${index}`}
					collapsed={false}
					draggable={undefined}
					dragged={false}
					movedDown={false}
					movedUp={false}
					onDragEnd={noop}
					onDragOver={noop}
					onDragStart={noop}
					onDrop={noop}
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
					value: '4',
					label: 'Panda'
				},
				{
					value: '5',
					label: 'Crow'
				},
				{
					value: '6',
					label: 'Fire-Bellied Toad'
				}
			]
		];
		const r = renderer(
			() => (
				<List
					resource={{ data: testData, id: 'test', idKey: 'value' }}
					disabled={(item) => {
						return item.value === '3';
					}}
					onValue={onValueStub}
					onRequestClose={onRequestCloseStub}
				/>
			),
			{ middleware: [[getRegistry, mockGetRegistry]] }
		);
		r.expect(
			baseAssertion
				.setProperty(WrappedItemWrapper, 'styles', {
					height: '270px'
				})
				.replaceChildren(WrappedItemContainer, () => {
					return createListItems();
				})
		);
		// navigate to first item from nothing
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: Keys.Down }));
		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'aria-activedescendant', 'menu-test-item-0')
				.setProperty(WrappedItemWrapper, 'styles', {
					height: '270px'
				})
				.replaceChildren(WrappedItemContainer, () => {
					return createListItems(0);
				})
		);
	});

	it('should navigate to the last item when pressing up and no item is active', () => {
		function createListItems(activeIndex: number | undefined = undefined, selected?: number) {
			return new Array(6).fill(undefined).map((_, index) => (
				<ListItem
					classes={undefined}
					variant={undefined}
					active={index === activeIndex}
					disabled={testData[index].value === '3'}
					key={`item-${index}`}
					onRequestActive={noop}
					onSelect={noop}
					selected={!!selected && index === selected}
					theme={listItemTheme}
					widgetId={`menu-test-item-${index}`}
					collapsed={false}
					draggable={undefined}
					dragged={false}
					movedDown={false}
					movedUp={false}
					onDragEnd={noop}
					onDragOver={noop}
					onDragStart={noop}
					onDrop={noop}
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
					value: '4',
					label: 'Panda'
				},
				{
					value: '5',
					label: 'Crow'
				},
				{
					value: '6',
					label: 'Fire-Bellied Toad'
				}
			]
		];
		const r = renderer(
			() => (
				<List
					resource={{ data: testData, id: 'test', idKey: 'value' }}
					disabled={(item) => {
						return item.value === '3';
					}}
					onValue={onValueStub}
					onRequestClose={onRequestCloseStub}
				/>
			),
			{ middleware: [[getRegistry, mockGetRegistry]] }
		);
		r.expect(
			baseAssertion
				.setProperty(WrappedItemWrapper, 'styles', {
					height: '270px'
				})
				.replaceChildren(WrappedItemContainer, () => {
					return createListItems();
				})
		);
		// navigate to last item from nothing
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
	});

	it('should set active index when provided', async () => {
		const testData = [
			{
				value: '1',
				label: 'Bob'
			},
			{
				value: '2',
				label: 'Adam'
			},
			{
				value: '3',
				label: 'Ant'
			},
			{
				value: '4',
				label: 'Anthony'
			},
			{
				value: '5',
				label: 'Bobby'
			}
		];
		const r = renderer(
			() => (
				<List
					resource={{ data: testData, id: 'test', idKey: 'value' }}
					onValue={onValueStub}
					activeIndex={2}
				/>
			),
			{ middleware: [[getRegistry, mockGetRegistry]] }
		);
		const listAssertion = baseAssertion
			.setProperty(WrappedItemWrapper, 'styles', {
				height: '225px'
			})
			.setProperty(WrappedRoot, 'aria-activedescendant', 'menu-test-item-2')
			.replaceChildren(WrappedItemContainer, () => createChildren({ activeItem: 'item-2' }));
		r.expect(listAssertion);
	});

	it('handle key down events relative to preset active index', async () => {
		const onActiveIndexChangeStub = sb.stub();
		const testData = [
			{
				value: '1',
				label: 'Bob'
			},
			{
				value: '2',
				label: 'Adam'
			},
			{
				value: '3',
				label: 'Ant'
			},
			{
				value: '4',
				label: 'Anthony'
			},
			{
				value: '5',
				label: 'Bobby'
			}
		];
		const props = {
			activeIndex: 2
		};
		const r = renderer(
			() => (
				<List
					resource={{ data: testData, id: 'test', idKey: 'value' }}
					onValue={onValueStub}
					activeIndex={props.activeIndex}
					onActiveIndexChange={onActiveIndexChangeStub}
				/>
			),
			{ middleware: [[getRegistry, mockGetRegistry]] }
		);
		const listAssertion = baseAssertion
			.setProperty(WrappedItemWrapper, 'styles', {
				height: '225px'
			})
			.setProperty(WrappedRoot, 'aria-activedescendant', 'menu-test-item-2')
			.replaceChildren(WrappedItemContainer, () => createChildren({ activeItem: 'item-2' }));
		r.expect(listAssertion);
		assert.strictEqual(onActiveIndexChangeStub.callCount, 0);

		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: Keys.Down }));
		r.expect(listAssertion);
		assert.strictEqual(onActiveIndexChangeStub.callCount, 1);
		assert.strictEqual(onActiveIndexChangeStub.firstCall.args[0], 3);

		props.activeIndex = 3;
		r.expect(
			listAssertion
				.setProperty(WrappedRoot, 'aria-activedescendant', 'menu-test-item-3')
				.replaceChildren(WrappedItemContainer, () =>
					createChildren({ activeItem: 'item-3' })
				)
		);
	});

	it('should set active item based on keyboard input', async () => {
		const testData = [
			{
				value: '1',
				label: 'Bob'
			},
			{
				value: '2',
				label: 'Adam'
			},
			{
				value: '3',
				label: 'Ant'
			},
			{
				value: '4',
				label: 'Anthony'
			},
			{
				value: '5',
				label: 'Bobby'
			}
		];
		const r = renderer(
			() => (
				<List
					resource={{ data: testData, id: 'test', idKey: 'value' }}
					onValue={onValueStub}
				/>
			),
			{ middleware: [[getRegistry, mockGetRegistry]] }
		);
		const listAssertion = baseAssertion
			.setProperty(WrappedItemWrapper, 'styles', {
				height: '225px'
			})
			.replaceChildren(WrappedItemContainer, () => createChildren());
		r.expect(listAssertion);

		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: 0, key: 'x' }));
		r.expect(listAssertion);
		await new Promise((resolve) => setTimeout(resolve, 800));

		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: 0, key: 'b' }));
		const firstItemSelectedAssertion = listAssertion
			.setProperty(WrappedRoot, 'aria-activedescendant', 'menu-test-item-0')
			.replaceChildren(WrappedItemContainer, () => createChildren({ activeItem: 'item-0' }));
		r.expect(firstItemSelectedAssertion);
		await new Promise((resolve) => setTimeout(resolve, 800));

		r.property(
			WrappedRoot,
			'onkeydown',
			createMockEvent({ which: 0, key: 'b', metaKey: true })
		);
		r.expect(firstItemSelectedAssertion);

		r.property(
			WrappedRoot,
			'onkeydown',
			createMockEvent({ which: 0, key: 'b', ctrlKey: true })
		);
		r.expect(firstItemSelectedAssertion);
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: 0, key: 'bo' }));
		r.expect(firstItemSelectedAssertion);
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: 0, key: 'a' }));
		r.expect(
			listAssertion
				.setProperty(WrappedRoot, 'aria-activedescendant', 'menu-test-item-1')
				.replaceChildren(WrappedItemContainer, () =>
					createChildren({ activeItem: 'item-1' })
				)
		);

		await new Promise((resolve) => setTimeout(resolve, 800));
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: 0, key: 'a' }));
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: 0, key: 'n' }));
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: 0, key: 't' }));
		r.expect(
			listAssertion
				.setProperty(WrappedRoot, 'aria-activedescendant', 'menu-test-item-2')
				.replaceChildren(WrappedItemContainer, () =>
					createChildren({ activeItem: 'item-2' })
				)
		);

		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: 0, key: 'h' }));
		r.expect(
			listAssertion
				.setProperty(WrappedRoot, 'aria-activedescendant', 'menu-test-item-3')
				.replaceChildren(WrappedItemContainer, () =>
					createChildren({ activeItem: 'item-3' })
				)
		);

		await new Promise((resolve) => setTimeout(resolve, 800));
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: 0, key: 'b' }));
		r.expect(
			listAssertion
				.setProperty(WrappedRoot, 'aria-activedescendant', 'menu-test-item-4')
				.replaceChildren(WrappedItemContainer, () =>
					createChildren({ activeItem: 'item-4' })
				)
		);

		await new Promise((resolve) => setTimeout(resolve, 800));
		r.property(WrappedRoot, 'onkeydown', createMockEvent({ which: 0, key: 'a' }));
		r.expect(
			listAssertion
				.setProperty(WrappedRoot, 'aria-activedescendant', 'menu-test-item-1')
				.replaceChildren(WrappedItemContainer, () =>
					createChildren({ activeItem: 'item-1' })
				)
		);
	});

	it('should scroll list', () => {
		const testData = [
			{
				value: 'Bob',
				label: 'Bob'
			},
			{
				value: 'Adam',
				label: 'Adam'
			},
			{
				value: 'Ant',
				label: 'Ant'
			},
			{
				value: 'Anthony',
				label: 'Anthony'
			},
			{
				value: 'Bobby',
				label: 'Bobby'
			}
		];
		const r = renderer(
			() => (
				<List
					resource={{ data: testData, id: 'test', idKey: 'value' }}
					onValue={onValueStub}
				/>
			),
			{ middleware: [[getRegistry, mockGetRegistry]] }
		);
		const listAssertion = baseAssertion
			.setProperty(WrappedItemWrapper, 'styles', {
				height: '225px'
			})
			.replaceChildren(WrappedItemContainer, () => createChildren());
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
					variant={undefined}
					theme={undefined}
					active={false}
					disabled={false}
					key={'item-0'}
					onRequestActive={noop}
					onSelect={noop}
					widgetId={'menu-test-item-0'}
				>
					Dog
				</ListItem>,
				<ListItem
					classes={undefined}
					variant={undefined}
					theme={undefined}
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
					variant={undefined}
					theme={undefined}
					active={false}
					disabled={true}
					key={'item-2'}
					onRequestActive={noop}
					onSelect={noop}
					widgetId={'menu-test-item-2'}
				>
					Fish
				</ListItem>
			]);
		const r = renderer(
			() => (
				<List resource={{ data, id: 'test', idKey: 'value' }} onValue={onValueStub}>
					{(item, itemProps) => {
						return (
							<ListItem classes={undefined} variant={undefined} {...itemProps}>
								{item.label || item.value}
							</ListItem>
						);
					}}
				</List>
			),
			{ middleware: [[getRegistry, mockGetRegistry]] }
		);
		r.expect(listWithListItemsAssertion);
	});

	it('should render with initial value', () => {
		const r = renderer(
			() => (
				<List
					resource={{ data, id: 'test', idKey: 'value' }}
					onValue={onValueStub}
					initialValue="2"
				/>
			),
			{ middleware: [[getRegistry, mockGetRegistry]] }
		);
		const listAssertion = baseAssertion
			.setProperty(WrappedItemWrapper, 'styles', {
				height: '135px'
			})
			.replaceChildren(WrappedItemContainer, () => [
				<ListItem
					classes={undefined}
					variant={undefined}
					active={false}
					disabled={false}
					key={'item-0'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={listItemTheme}
					widgetId={'menu-test-item-0'}
					collapsed={false}
					draggable={undefined}
					dragged={false}
					movedDown={false}
					movedUp={false}
					onDragEnd={noop}
					onDragOver={noop}
					onDragStart={noop}
					onDrop={noop}
				>
					Dog
				</ListItem>,
				<ListItem
					classes={undefined}
					variant={undefined}
					active={false}
					disabled={false}
					key={'item-1'}
					onRequestActive={noop}
					onSelect={noop}
					selected={true}
					theme={listItemTheme}
					widgetId={'menu-test-item-1'}
					collapsed={false}
					draggable={undefined}
					dragged={false}
					movedDown={false}
					movedUp={false}
					onDragEnd={noop}
					onDragOver={noop}
					onDragStart={noop}
					onDrop={noop}
				>
					Cat
				</ListItem>,
				<ListItem
					classes={undefined}
					variant={undefined}
					active={false}
					disabled={true}
					key={'item-2'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={listItemTheme}
					widgetId={'menu-test-item-2'}
					collapsed={false}
					draggable={undefined}
					dragged={false}
					movedDown={false}
					movedUp={false}
					onDragEnd={noop}
					onDragOver={noop}
					onDragStart={noop}
					onDrop={noop}
				>
					Fish
				</ListItem>
			]);
		r.expect(listAssertion);
	});

	it('should render with value', () => {
		const props = {
			value: '2'
		};
		const r = renderer(
			() => (
				<List
					resource={{ data, id: 'test', idKey: 'value' }}
					onValue={onValueStub}
					value={props.value}
				/>
			),
			{ middleware: [[getRegistry, mockGetRegistry]] }
		);
		let listAssertion = baseAssertion
			.setProperty(WrappedItemWrapper, 'styles', {
				height: '135px'
			})
			.replaceChildren(WrappedItemContainer, () => [
				<ListItem
					classes={undefined}
					variant={undefined}
					active={false}
					disabled={false}
					key={'item-0'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={listItemTheme}
					widgetId={'menu-test-item-0'}
					collapsed={false}
					draggable={undefined}
					dragged={false}
					movedDown={false}
					movedUp={false}
					onDragEnd={noop}
					onDragOver={noop}
					onDragStart={noop}
					onDrop={noop}
				>
					Dog
				</ListItem>,
				<ListItem
					classes={undefined}
					variant={undefined}
					active={false}
					disabled={false}
					key={'item-1'}
					onRequestActive={noop}
					onSelect={noop}
					selected={true}
					theme={listItemTheme}
					widgetId={'menu-test-item-1'}
					collapsed={false}
					draggable={undefined}
					dragged={false}
					movedDown={false}
					movedUp={false}
					onDragEnd={noop}
					onDragOver={noop}
					onDragStart={noop}
					onDrop={noop}
				>
					Cat
				</ListItem>,
				<ListItem
					classes={undefined}
					variant={undefined}
					active={false}
					disabled={true}
					key={'item-2'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={listItemTheme}
					widgetId={'menu-test-item-2'}
					collapsed={false}
					draggable={undefined}
					dragged={false}
					movedDown={false}
					movedUp={false}
					onDragEnd={noop}
					onDragOver={noop}
					onDragStart={noop}
					onDrop={noop}
				>
					Fish
				</ListItem>
			]);
		r.expect(listAssertion);
		props.value = '1';
		listAssertion = baseAssertion
			.setProperty(WrappedItemWrapper, 'styles', {
				height: '135px'
			})
			.replaceChildren(WrappedItemContainer, () => [
				<ListItem
					classes={undefined}
					variant={undefined}
					active={false}
					disabled={false}
					key={'item-0'}
					onRequestActive={noop}
					onSelect={noop}
					selected={true}
					theme={listItemTheme}
					widgetId={'menu-test-item-0'}
					collapsed={false}
					draggable={undefined}
					dragged={false}
					movedDown={false}
					movedUp={false}
					onDragEnd={noop}
					onDragOver={noop}
					onDragStart={noop}
					onDrop={noop}
				>
					Dog
				</ListItem>,
				<ListItem
					classes={undefined}
					variant={undefined}
					active={false}
					disabled={false}
					key={'item-1'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={listItemTheme}
					widgetId={'menu-test-item-1'}
					collapsed={false}
					draggable={undefined}
					dragged={false}
					movedDown={false}
					movedUp={false}
					onDragEnd={noop}
					onDragOver={noop}
					onDragStart={noop}
					onDrop={noop}
				>
					Cat
				</ListItem>,
				<ListItem
					classes={undefined}
					variant={undefined}
					active={false}
					disabled={true}
					key={'item-2'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={listItemTheme}
					widgetId={'menu-test-item-2'}
					collapsed={false}
					draggable={undefined}
					dragged={false}
					movedDown={false}
					movedUp={false}
					onDragEnd={noop}
					onDragOver={noop}
					onDragStart={noop}
					onDrop={noop}
				>
					Fish
				</ListItem>
			]);
		r.expect(listAssertion);
	});

	it('should render a divider based on the data', () => {
		const testData = [
			{
				value: '1',
				label: 'Dog',
				divider: true
			},
			{
				value: '2',
				label: 'Cat',
				divider: true
			},
			{
				value: '3',
				label: 'Fish',
				disabled: true
			}
		];
		const r = renderer(
			() => (
				<List
					resource={{ data: testData, id: 'test', idKey: 'value' }}
					onValue={onValueStub}
				/>
			),
			{ middleware: [[getRegistry, mockGetRegistry]] }
		);
		const listAssertion = baseAssertion
			.setProperty(WrappedItemWrapper, 'styles', {
				height: '135px'
			})
			.replaceChildren(WrappedItemContainer, () => [
				<ListItem
					classes={undefined}
					variant={undefined}
					active={false}
					disabled={false}
					key={'item-0'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={listItemTheme}
					widgetId={'menu-test-item-0'}
					collapsed={false}
					draggable={undefined}
					dragged={false}
					movedDown={false}
					movedUp={false}
					onDragEnd={noop}
					onDragOver={noop}
					onDragStart={noop}
					onDrop={noop}
				>
					Dog
				</ListItem>,
				<hr classes={css.divider} />,
				<ListItem
					classes={undefined}
					variant={undefined}
					active={false}
					disabled={false}
					key={'item-1'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={listItemTheme}
					widgetId={'menu-test-item-1'}
					collapsed={false}
					draggable={undefined}
					dragged={false}
					movedDown={false}
					movedUp={false}
					onDragEnd={noop}
					onDragOver={noop}
					onDragStart={noop}
					onDrop={noop}
				>
					Cat
				</ListItem>,
				<hr classes={css.divider} />,
				<ListItem
					classes={undefined}
					variant={undefined}
					active={false}
					disabled={true}
					key={'item-2'}
					onRequestActive={noop}
					onSelect={noop}
					selected={false}
					theme={listItemTheme}
					widgetId={'menu-test-item-2'}
					collapsed={false}
					draggable={undefined}
					dragged={false}
					movedDown={false}
					movedUp={false}
					onDragEnd={noop}
					onDragOver={noop}
					onDragStart={noop}
					onDrop={noop}
				>
					Fish
				</ListItem>
			]);
		r.expect(listAssertion);
	});
});
