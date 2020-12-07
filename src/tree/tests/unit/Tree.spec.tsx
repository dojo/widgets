const { describe, it, beforeEach } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import * as sinon from 'sinon';

import { tsx } from '@dojo/framework/core/vdom';
import { renderer, assertion, wrap } from '@dojo/framework/testing/renderer';
import {
	createMemoryResourceTemplate,
	createResourceTemplate,
	defaultFind
} from '@dojo/framework/core/middleware/resources';

import { Keys } from '../../../common/util';
import { stubEvent, noop } from '../../../common/tests/support/test-helpers';
import Tree, { TreeNode, TreeNodeOption } from '../../index';
import * as css from '../../../theme/default/tree.m.css';

import { simpleTree } from './TreeData.mock';
import LoadingIndicator from '../../../loading-indicator';

const WrappedRoot = wrap('ol');
const WrappedListItem1 = wrap('li');
const WrappedListItem2 = wrap('li');
const WrappedNode1 = wrap(TreeNode);
const WrappedNode2 = wrap(TreeNode);
const WrappedNode3 = wrap(TreeNode);

const defaultNodeProps = {
	activeNode: undefined,
	checkable: false,
	selectable: false,
	checked: false,
	disabled: false,
	expanded: false,
	selected: false,
	value: undefined,
	parentSelection: false,
	onActive: noop,
	onValue: noop,
	onCheck: noop,
	onExpand: noop
};
const baseAssertion = assertion(() => (
	<WrappedRoot
		role={'tree'}
		classes={[css.root, css.nodeParent, undefined]}
		onkeydown={noop}
		tabIndex={0}
	/>
));

const simpleTreeAssertion = baseAssertion.replaceChildren(WrappedRoot, () => [
	<WrappedListItem1 role={'treeitem'} classes={[css.node, css.leaf, false, false]}>
		<WrappedNode1
			{...defaultNodeProps}
			node={simpleTree[0]}
			theme={undefined}
			classes={undefined}
			variant={undefined}
		>
			{() => 'node-1'}
		</WrappedNode1>
	</WrappedListItem1>,
	<WrappedListItem2 role={'treeitem'} classes={[css.node, false, false, false]}>
		<WrappedNode2
			{...defaultNodeProps}
			node={simpleTree[2]}
			theme={undefined}
			classes={undefined}
			variant={undefined}
		>
			{() => 'node-2'}
		</WrappedNode2>
	</WrappedListItem2>
]);

describe('Tree', () => {
	let template = createMemoryResourceTemplate<TreeNodeOption>();

	const emptyDataProps = {
		resource: {
			template: { template, id: 'test', initOptions: { data: [], id: 'test' } }
		}
	};

	beforeEach(() => {
		template = createMemoryResourceTemplate<TreeNodeOption>();
	});

	it('renders with no data', () => {
		const r = renderer(() => <Tree {...emptyDataProps} />);

		r.expect(baseAssertion);
	});

	it('renders data', () => {
		const r = renderer(() => (
			<Tree
				resource={{
					template: {
						template,
						id: 'test',
						initOptions: { data: simpleTree, id: 'test' } as any
					}
				}}
			/>
		));
		r.child(WrappedNode1, { value: 'node-1' });
		r.child(WrappedNode2, { value: 'node-2' });

		r.expect(simpleTreeAssertion);
	});

	it('renders disabled nodes', () => {
		const disabledNodes = [simpleTree[0].id];
		const r = renderer(() => (
			<Tree
				resource={{
					template: {
						template,
						id: 'test',
						initOptions: { data: simpleTree, id: 'test' } as any
					}
				}}
				disabledIds={disabledNodes}
			/>
		));

		r.child(WrappedNode1, { value: 'node-1' });
		r.child(WrappedNode2, { value: 'node-2' });
		r.expect(
			simpleTreeAssertion
				.setProperty(WrappedNode1, 'disabled', true)
				.setProperty(WrappedNode2, 'disabled', false)
		);
	});

	it('can navigate active node with keyboard', () => {
		const r = renderer(() => (
			<Tree
				resource={{
					template: {
						template,
						id: 'test',
						initOptions: { data: [...simpleTree], id: 'test' } as any
					}
				}}
			/>
		));

		r.child(WrappedNode1, { value: 'node-1' });
		r.child(WrappedNode2, { value: 'node-2' });
		r.expect(simpleTreeAssertion);

		r.property(WrappedNode1, 'onActive');
		r.child(WrappedNode1, { value: 'node-1' });
		r.child(WrappedNode2, { value: 'node-2' });
		r.expect(
			simpleTreeAssertion
				.setProperty(WrappedNode1, 'activeNode', simpleTree[0].id)
				.setProperty(WrappedNode2, 'activeNode', simpleTree[0].id)
		);

		// navigate down to node 2
		r.property(WrappedRoot, 'onkeydown', { ...stubEvent, which: Keys.Down });
		r.child(WrappedNode1, { value: 'node-1' });
		r.child(WrappedNode2, { value: 'node-2' });
		r.expect(
			simpleTreeAssertion
				.setProperty(WrappedNode1, 'activeNode', simpleTree[2].id)
				.setProperty(WrappedNode2, 'activeNode', simpleTree[2].id)
		);

		// navigate back up to node 1
		r.property(WrappedRoot, 'onkeydown', { ...stubEvent, which: Keys.Up });
		r.child(WrappedNode1, { value: 'node-1' });
		r.child(WrappedNode2, { value: 'node-2' });
		r.expect(
			simpleTreeAssertion
				.setProperty(WrappedNode1, 'activeNode', simpleTree[0].id)
				.setProperty(WrappedNode2, 'activeNode', simpleTree[0].id)
		);

		// back down to node 2
		r.property(WrappedRoot, 'onkeydown', { ...stubEvent, which: Keys.Up });
		r.child(WrappedNode1, { value: 'node-1' });
		r.child(WrappedNode2, { value: 'node-2' });
		r.expect(
			simpleTreeAssertion
				.setProperty(WrappedNode1, 'activeNode', simpleTree[2].id)
				.setProperty(WrappedNode2, 'activeNode', simpleTree[2].id)
		);
	});

	describe('ExpandedNodes', () => {
		const expandedAssertion = simpleTreeAssertion
			.setProperty(WrappedNode1, 'expanded', true)
			.setProperty(WrappedNode2, 'expanded', false)
			.insertAfter(
				WrappedNode1,
				() =>
					(
						<ol
							role={'group'}
							classes={[null, css.nodeParent, null]}
							onkeydown={noop}
							tabIndex={0}
						>
							<li role={'treeitem'} classes={[css.node, false, false, false]}>
								<WrappedNode3
									{...defaultNodeProps}
									expanded={false}
									node={simpleTree[1]}
									theme={undefined}
									classes={undefined}
									variant={undefined}
								>
									{() => ''}
								</WrappedNode3>
							</li>
						</ol>
					) as any
			);

		it('renders with expanded nodes', () => {
			const expandedNodes = [simpleTree[0].id];
			const nodeProps = {
				...defaultNodeProps,
				expanded: false
			};
			const r = renderer(() => (
				<Tree
					resource={{
						template: {
							template,
							id: 'test',
							initOptions: { data: simpleTree, id: 'test' } as any
						}
					}}
					expandedIds={expandedNodes}
				/>
			));
			r.child(WrappedNode1, { value: 'node-1' });
			r.child(WrappedNode2, { value: 'node-2' });
			r.expect(
				simpleTreeAssertion
					.setProperty(WrappedNode1, 'expanded', true)
					.setProperty(WrappedNode2, 'expanded', false)
					.insertAfter(
						WrappedNode1,
						() =>
							(
								<ol
									classes={[null, css.nodeParent, null]}
									onkeydown={noop}
									tabIndex={0}
									role={'group'}
								>
									<li role={'treeitem'} classes={[css.node, false, false, false]}>
										<TreeNode
											{...nodeProps}
											node={simpleTree[1]}
											theme={undefined}
											classes={undefined}
											variant={undefined}
										>
											{() => ''}
										</TreeNode>
									</li>
								</ol>
							) as any
					)
					.setProperty(WrappedListItem1, 'classes', [css.node, css.leaf, false, false])
			);
		});

		it('renders with nodes initially expanded', () => {
			const expandedNodes = [simpleTree[0].id];
			const nodeProps = {
				...defaultNodeProps,
				expanded: false
			};
			const r = renderer(() => (
				<Tree
					resource={{
						template: {
							template,
							id: 'test',
							initOptions: { data: simpleTree, id: 'test' } as any
						}
					}}
					initialExpanded={expandedNodes}
				/>
			));
			r.child(WrappedNode1, { value: 'node-1' });
			r.child(WrappedNode2, { value: 'node-2' });
			r.expect(
				simpleTreeAssertion
					.setProperty(WrappedNode1, 'expanded', true)
					.setProperty(WrappedNode2, 'expanded', false)
					.insertAfter(
						WrappedNode1,
						() =>
							(
								<ol
									classes={[null, css.nodeParent, null]}
									onkeydown={noop}
									tabIndex={0}
									role={'group'}
								>
									<li role={'treeitem'} classes={[css.node, false, false, false]}>
										<TreeNode
											{...nodeProps}
											node={simpleTree[1]}
											theme={undefined}
											classes={undefined}
											variant={undefined}
										>
											{() => ''}
										</TreeNode>
									</li>
								</ol>
							) as any
					)
					.setProperty(WrappedListItem1, 'classes', [css.node, css.leaf, false, false])
			);
		});

		it('raises events on expand/collapse', () => {
			const onExpand = sinon.spy();
			const r = renderer(() => (
				<Tree
					resource={{
						template: {
							template,
							id: 'test',
							initOptions: { data: simpleTree, id: 'test' } as any
						}
					}}
					onExpand={onExpand}
				/>
			));
			r.child(WrappedNode1, { value: 'node-1' });
			r.child(WrappedNode2, { value: 'node-2' });
			r.expect(simpleTreeAssertion);

			// simulate expand event
			r.property(WrappedNode1, 'onExpand', true);
			r.child(WrappedNode1, { value: 'node-1' });
			r.child(WrappedNode2, { value: 'node-2' });
			r.expect(expandedAssertion);
			assert(onExpand.calledWith([simpleTree[0].id]));

			// simulate collapse event
			onExpand.resetHistory();
			r.property(WrappedNode1, 'onExpand', false);
			r.child(WrappedNode1, { value: 'node-1' });
			r.child(WrappedNode2, { value: 'node-2' });
			r.expect(
				simpleTreeAssertion
					.setProperty(WrappedNode1, 'expanded', false)
					.setProperty(WrappedNode2, 'expanded', false)
			);
			assert(onExpand.calledWith([]));
		});

		it('raises events on expand/collapse on keyboard navigation', () => {
			const onExpand = sinon.stub();
			const r = renderer(() => (
				<Tree
					resource={{
						template: {
							template,
							id: 'test',
							initOptions: { data: simpleTree, id: 'test' } as any
						}
					}}
					onExpand={onExpand}
				/>
			));
			r.child(WrappedNode1, { value: 'node-1' });
			r.child(WrappedNode2, { value: 'node-2' });
			r.expect(simpleTreeAssertion);

			const nodeId = simpleTree[0].id;
			const activeAssertion = simpleTreeAssertion
				.setProperty(WrappedNode1, 'activeNode', nodeId)
				.setProperty(WrappedNode2, 'activeNode', nodeId);

			// activate our node
			r.property(WrappedNode1, 'onActive');
			r.child(WrappedNode1, { value: 'node-1' });
			r.child(WrappedNode2, { value: 'node-2' });
			r.expect(activeAssertion);

			// // with our node active, we can expand it via the "right" key
			r.property(WrappedRoot, 'onkeydown', { ...stubEvent, which: Keys.Right });
			r.child(WrappedNode1, { value: 'node-1' });
			r.child(WrappedNode2, { value: 'node-2' });
			r.expect(
				expandedAssertion
					.setProperty(WrappedNode1, 'activeNode', nodeId)
					.setProperty(WrappedNode2, 'activeNode', nodeId)
					.setProperty(WrappedNode3, 'activeNode', nodeId)
			);
			assert(onExpand.calledWith([nodeId]));

			// we can now collapse it with "left" key
			onExpand.resetHistory();
			r.property(WrappedRoot, 'onkeydown', { ...stubEvent, which: Keys.Left });

			r.child(WrappedNode1, { value: 'node-1' });
			r.child(WrappedNode2, { value: 'node-2' });
			r.expect(activeAssertion);
			assert(onExpand.calledWith([]));
		});

		it('raises events on expand/collapse on keyboard navigation with controlled nodes', () => {
			const onExpand = sinon.stub();
			const r = renderer(() => (
				<Tree
					resource={{
						template: {
							template,
							id: 'test',
							initOptions: { data: simpleTree, id: 'test' } as any
						}
					}}
					onExpand={onExpand}
					expandedIds={['parent-1']}
				/>
			));
			const nodeId = simpleTree[0].id;

			const activeExpandedAssertion = expandedAssertion
				.setProperty(WrappedNode1, 'activeNode', nodeId)
				.setProperty(WrappedNode2, 'activeNode', nodeId)
				.setProperty(WrappedNode3, 'activeNode', nodeId);

			r.child(WrappedNode1, { value: 'node-1' });
			r.child(WrappedNode2, { value: 'node-2' });
			r.expect(expandedAssertion);
			r.child(WrappedNode1, {});
			r.child(WrappedNode2, {});
			r.property(WrappedNode1, 'onActive');
			r.child(WrappedNode1, { value: 'node-1' });
			r.child(WrappedNode2, { value: 'node-2' });
			r.expect(activeExpandedAssertion);

			r.property(WrappedRoot, 'onkeydown', { ...stubEvent, which: Keys.Left });

			r.child(WrappedNode1, { value: 'node-1' });
			r.child(WrappedNode2, { value: 'node-2' });
			r.expect(activeExpandedAssertion);
			assert(onExpand.calledWith([]));
		});
	});

	describe('CheckedNodes', () => {
		const checkableAssertion = simpleTreeAssertion
			.setProperty(WrappedNode1, 'checkable', true)
			.setProperty(WrappedNode2, 'checkable', true);

		it('renders with checkable nodes', () => {
			const r = renderer(() => (
				<Tree
					resource={{
						template: {
							template,
							id: 'test',
							initOptions: { data: simpleTree, id: 'test' } as any
						}
					}}
					checkable={true}
				/>
			));

			r.child(WrappedNode1, { value: 'node-1' });
			r.child(WrappedNode2, { value: 'node-2' });
			r.expect(checkableAssertion);
		});

		it('renders with checked nodes', () => {
			const checkedNodes = [simpleTree[0].id];
			const r = renderer(() => (
				<Tree
					resource={{
						template: {
							template,
							id: 'test',
							initOptions: { data: simpleTree, id: 'test' } as any
						}
					}}
					checkable={true}
					checkedIds={checkedNodes}
				/>
			));

			r.child(WrappedNode1, { value: 'node-1' });
			r.child(WrappedNode2, { value: 'node-2' });
			r.expect(
				checkableAssertion
					.setProperty(WrappedNode1, 'checked', true)
					.setProperty(WrappedNode2, 'checked', false)
			);
		});

		it('renders with nodes initially checked', () => {
			const checkedNodes = [simpleTree[0].id];
			const r = renderer(() => (
				<Tree
					resource={{
						template: {
							template,
							id: 'test',
							initOptions: { data: simpleTree, id: 'test' } as any
						}
					}}
					checkable={true}
					initialChecked={checkedNodes}
				/>
			));

			r.child(WrappedNode1, { value: 'node-1' });
			r.child(WrappedNode2, { value: 'node-2' });
			r.expect(
				checkableAssertion
					.setProperty(WrappedNode1, 'checked', true)
					.setProperty(WrappedNode2, 'checked', false)
			);
		});

		it('raises events on check/uncheck', () => {
			const onCheck = sinon.stub();
			const r = renderer(() => (
				<Tree
					resource={{
						template: {
							template,
							id: 'test',
							initOptions: { data: simpleTree, id: 'test' } as any
						}
					}}
					checkable={true}
					onCheck={onCheck}
				/>
			));
			r.child(WrappedNode1, { value: 'node-1' });
			r.child(WrappedNode2, { value: 'node-2' });
			r.expect(checkableAssertion);

			// simulate check event
			r.property(WrappedNode1, 'onCheck', true);
			r.child(WrappedNode1, { value: 'node-1' });
			r.child(WrappedNode2, { value: 'node-2' });
			r.expect(
				checkableAssertion
					.setProperty(WrappedNode1, 'checked', true)
					.setProperty(WrappedNode2, 'checked', false)
			);
			assert(onCheck.calledWith([simpleTree[0].id]));

			// simulate uncheck event
			onCheck.resetHistory();
			r.property(WrappedNode1, 'onCheck', false);
			r.child(WrappedNode1, { value: 'node-1' });
			r.child(WrappedNode2, { value: 'node-2' });
			r.expect(
				checkableAssertion
					.setProperty(WrappedNode1, 'checked', false)
					.setProperty(WrappedNode2, 'checked', false)
			);
			assert(onCheck.calledWith([]));
		});
	});

	describe('SelectedNode', () => {
		const selectableAssertion = simpleTreeAssertion
			.setProperty(WrappedNode1, 'selectable', true)
			.setProperty(WrappedNode2, 'selectable', true)
			.setProperty(WrappedListItem1, 'classes', [css.node, css.leaf, css.selectable, false])
			.setProperty(WrappedListItem2, 'classes', [css.node, false, css.selectable, false]);

		it('renders with selectable nodes', () => {
			const r = renderer(() => (
				<Tree
					resource={{
						template: {
							template,
							id: 'test',
							initOptions: { data: simpleTree, id: 'test' } as any
						}
					}}
					selectable={true}
				/>
			));

			r.child(WrappedNode1, { value: 'node-1' });
			r.child(WrappedNode2, { value: 'node-2' });
			r.expect(selectableAssertion);
		});

		it('renders with selected node', () => {
			const selectedNode = simpleTree[0].id;
			const r = renderer(() => (
				<Tree
					resource={{
						template: {
							template,
							id: 'test',
							initOptions: { data: simpleTree, id: 'test' } as any
						}
					}}
					selectable={true}
					value={selectedNode}
				/>
			));

			r.child(WrappedNode1, { value: 'node-1' });
			r.child(WrappedNode2, { value: 'node-2' });
			r.expect(
				selectableAssertion
					.setProperty(WrappedListItem1, 'classes', [
						css.node,
						css.leaf,
						css.selectable,
						css.selected
					])
					.setProperty(WrappedNode1, 'value', selectedNode)
					.setProperty(WrappedNode2, 'value', selectedNode)
					.setProperty(WrappedNode1, 'selected', true)
			);
		});

		it('raises events on select', () => {
			const onValue = sinon.stub();
			const r = renderer(() => (
				<Tree
					resource={{
						template: {
							template,
							id: 'test',
							initOptions: { data: simpleTree, id: 'test' } as any
						}
					}}
					selectable={true}
					onValue={onValue}
				/>
			));

			r.child(WrappedNode1, { value: 'node-1' });
			r.child(WrappedNode2, { value: 'node-2' });
			r.expect(selectableAssertion);

			// simulate select event
			const selectedNode = simpleTree[0].id;
			r.property(WrappedNode1, 'onValue');

			r.child(WrappedNode1, { value: 'node-1' });
			r.child(WrappedNode2, { value: 'node-2' });
			r.expect(
				selectableAssertion
					.setProperty(WrappedListItem1, 'classes', [
						css.node,
						css.leaf,
						css.selectable,
						css.selected
					])
					.setProperty(WrappedNode1, 'value', selectedNode)
					.setProperty(WrappedNode2, 'value', selectedNode)
					.setProperty(WrappedNode1, 'selected', true)
			);
		});

		it('can select the active node with keyboard', () => {
			const r = renderer(() => (
				<Tree
					resource={{
						template: {
							template,
							id: 'test',
							initOptions: { data: simpleTree, id: 'test' } as any
						}
					}}
					selectable={true}
				/>
			));
			r.child(WrappedNode1, { value: 'node-1' });
			r.child(WrappedNode2, { value: 'node-2' });
			r.expect(selectableAssertion);

			// activate our node
			const nodeId = simpleTree[2].id;
			r.property(WrappedNode2, 'onActive');
			r.child(WrappedNode1, { value: 'node-1' });
			r.child(WrappedNode2, { value: 'node-2' });
			r.expect(
				selectableAssertion
					.setProperty(WrappedNode1, 'activeNode', nodeId)
					.setProperty(WrappedNode2, 'activeNode', nodeId)
			);

			// use keyboard to select our node
			r.property(WrappedRoot, 'onkeydown', { ...stubEvent, which: Keys.Enter });
			r.child(WrappedNode1, { value: 'node-1' });
			r.child(WrappedNode2, { value: 'node-2' });
			r.expect(
				selectableAssertion
					.setProperty(WrappedListItem2, 'classes', [
						css.node,
						false,
						css.selectable,
						css.selected
					])
					.setProperty(WrappedNode1, 'value', nodeId)
					.setProperty(WrappedNode2, 'value', nodeId)
					.setProperty(WrappedNode2, 'selected', true)
					.setProperty(WrappedNode1, 'activeNode', nodeId)
					.setProperty(WrappedNode2, 'activeNode', nodeId)
			);
		});
	});

	describe('Loading tree state', () => {
		const loadingAssertion = assertion(() => (
			<LoadingIndicator theme={undefined} classes={undefined} variant={undefined} />
		));
		it('should have loading indicator when there is not data', () => {
			let resolvePromise = (value: any) => {};
			const dataPromise: Promise<TreeNodeOption[]> = new Promise((res) => {
				resolvePromise = res;
			});
			const loadingTemplate = createResourceTemplate<TreeNodeOption>({
				find: defaultFind,
				read: async (request, { put, get }) => {
					const data = await dataPromise;
					put({ data, total: simpleTree.length }, request);
				}
			});
			const r = renderer(() => (
				<Tree
					resource={{
						template: {
							template: loadingTemplate,
							id: 'test',
							initOptions: { data: simpleTree, id: 'test' } as any
						}
					}}
				/>
			));

			r.child(WrappedNode1, { value: 'node-1' });
			r.child(WrappedNode2, { value: 'node-2' });
			r.expect(loadingAssertion);
			resolvePromise(simpleTree);
		});
	});
});
