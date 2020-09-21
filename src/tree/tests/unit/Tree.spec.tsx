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
	checkedNodes: [],
	value: undefined,
	disabledNodes: [],
	expandedNodes: [],
	parentSelection: false,
	onActive: noop,
	onValue: noop,
	onCheck: noop,
	onExpand: noop
};
const baseAssertion = assertion(() => (
	<WrappedRoot
		classes={[css.root, css.nodeParent, undefined]}
		focus={noop as any}
		onkeydown={noop}
		tabIndex={0}
	/>
));

const simpleTreeAssertion = baseAssertion.replaceChildren(WrappedRoot, () => [
	<WrappedListItem1 classes={[css.node, css.leaf, false, false]}>
		<WrappedNode1 {...defaultNodeProps} node={simpleTree[0]}>
			{noop as any}
		</WrappedNode1>
	</WrappedListItem1>,
	<WrappedListItem2 classes={[css.node, false, false, false]}>
		<WrappedNode2 {...defaultNodeProps} node={simpleTree[2]}>
			{noop as any}
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
				disabledNodes={disabledNodes}
			/>
		));

		r.expect(
			simpleTreeAssertion
				.setProperty(WrappedNode1, 'disabledNodes', disabledNodes)
				.setProperty(WrappedNode2, 'disabledNodes', disabledNodes)
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

		r.expect(simpleTreeAssertion);

		r.property(WrappedNode1, 'onActive', simpleTree[0].id);
		r.expect(
			simpleTreeAssertion
				.setProperty(WrappedNode1, 'activeNode', simpleTree[0].id)
				.setProperty(WrappedNode2, 'activeNode', simpleTree[0].id)
		);

		// navigate down to node 2
		r.property(WrappedRoot, 'onkeydown', { ...stubEvent, which: Keys.Down });
		r.expect(
			simpleTreeAssertion
				.setProperty(WrappedNode1, 'activeNode', simpleTree[2].id)
				.setProperty(WrappedNode2, 'activeNode', simpleTree[2].id)
		);

		// navigate back up to node 1
		r.property(WrappedRoot, 'onkeydown', { ...stubEvent, which: Keys.Up });
		r.expect(
			simpleTreeAssertion
				.setProperty(WrappedNode1, 'activeNode', simpleTree[0].id)
				.setProperty(WrappedNode2, 'activeNode', simpleTree[0].id)
		);

		// back down to node 2
		r.property(WrappedRoot, 'onkeydown', { ...stubEvent, which: Keys.Up });
		r.expect(
			simpleTreeAssertion
				.setProperty(WrappedNode1, 'activeNode', simpleTree[2].id)
				.setProperty(WrappedNode2, 'activeNode', simpleTree[2].id)
		);
	});

	describe('ExpandedNodes', () => {
		const expandedNodes = [simpleTree[0].id];
		const expandedAssertion = simpleTreeAssertion
			.setProperty(WrappedNode1, 'expandedNodes', expandedNodes)
			.setProperty(WrappedNode2, 'expandedNodes', expandedNodes)
			.insertAfter(
				WrappedNode1,
				() =>
					(
						<ol
							classes={[null, css.nodeParent, null]}
							focus={() => false}
							onkeydown={noop}
							tabIndex={0}
						>
							<li classes={[css.node, false, false, false]}>
								<WrappedNode3
									{...defaultNodeProps}
									expandedNodes={expandedNodes}
									node={simpleTree[1]}
								>
									{noop as any}
								</WrappedNode3>
							</li>
						</ol>
					) as any
			);

		it('renders with expanded nodes', () => {
			const expandedNodes = [simpleTree[0].id];
			const nodeProps = {
				...defaultNodeProps,
				expandedNodes
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
					expanded={expandedNodes}
				/>
			));
			r.expect(
				simpleTreeAssertion
					.setProperty(WrappedNode1, 'expandedNodes', expandedNodes)
					.setProperty(WrappedNode2, 'expandedNodes', expandedNodes)
					.insertAfter(
						WrappedNode1,
						() =>
							(
								<ol
									classes={[null, css.nodeParent, null]}
									focus={() => false}
									onkeydown={noop}
									tabIndex={0}
								>
									<li classes={[css.node, false, false, false]}>
										<TreeNode {...nodeProps} node={simpleTree[1]}>
											{noop as any}
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
				expandedNodes
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
			r.expect(
				simpleTreeAssertion
					.setProperty(WrappedNode1, 'expandedNodes', expandedNodes)
					.setProperty(WrappedNode2, 'expandedNodes', expandedNodes)
					.insertAfter(
						WrappedNode1,
						() =>
							(
								<ol
									classes={[null, css.nodeParent, null]}
									focus={() => false}
									onkeydown={noop}
									tabIndex={0}
								>
									<li classes={[css.node, false, false, false]}>
										<TreeNode {...nodeProps} node={simpleTree[1]}>
											{noop as any}
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
			r.expect(simpleTreeAssertion);

			// simulate expand event
			console.log('>');
			r.property(WrappedNode1, 'onExpand', simpleTree[0].id, true);
			console.log('>>');
			r.expect(expandedAssertion);
			console.log('>>>', onExpand.firstCall.args);
			assert(onExpand.calledWith([simpleTree[0].id]));

			// simulate collapse event
			onExpand.resetHistory();
			console.log('>>>>');
			r.property(WrappedNode1, 'onExpand', simpleTree[0].id, false);
			console.log('>>>>>');
			r.expect(
				simpleTreeAssertion
					.setProperty(WrappedNode1, 'expandedNodes', [])
					.setProperty(WrappedNode2, 'expandedNodes', [])
			);
			console.log('>>>>>>');
			console.log('>>>', onExpand.firstCall.args);
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
			r.expect(simpleTreeAssertion);

			const nodeId = simpleTree[0].id;
			const activeAssertion = simpleTreeAssertion
				.setProperty(WrappedNode1, 'activeNode', nodeId)
				.setProperty(WrappedNode2, 'activeNode', nodeId);

			// activate our node
			r.property(WrappedNode1, 'onActive', nodeId);
			r.expect(activeAssertion);

			// // with our node active, we can expand it via the "right" key
			r.property(WrappedRoot, 'onkeydown', { ...stubEvent, which: Keys.Right });
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
					expanded={['parent-1']}
				/>
			));
			const nodeId = simpleTree[0].id;

			const activeExpandedAssertion = expandedAssertion
				.setProperty(WrappedNode1, 'activeNode', nodeId)
				.setProperty(WrappedNode2, 'activeNode', nodeId)
				.setProperty(WrappedNode3, 'activeNode', nodeId);

			r.expect(expandedAssertion);

			r.property(WrappedNode1, 'onActive', nodeId);
			r.expect(activeExpandedAssertion);

			r.property(WrappedRoot, 'onkeydown', { ...stubEvent, which: Keys.Left });

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
					checked={checkedNodes}
				/>
			));

			r.expect(
				checkableAssertion
					.setProperty(WrappedNode1, 'checkedNodes', checkedNodes)
					.setProperty(WrappedNode2, 'checkedNodes', checkedNodes)
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

			r.expect(
				checkableAssertion
					.setProperty(WrappedNode1, 'checkedNodes', checkedNodes)
					.setProperty(WrappedNode2, 'checkedNodes', checkedNodes)
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
			r.expect(checkableAssertion);

			// simulate check event
			r.property(WrappedNode1, 'onCheck', simpleTree[0].id, true);
			r.expect(
				checkableAssertion
					.setProperty(WrappedNode1, 'checkedNodes', [simpleTree[0].id])
					.setProperty(WrappedNode2, 'checkedNodes', [simpleTree[0].id])
			);
			assert(onCheck.calledWith([simpleTree[0].id]));

			// simulate uncheck event
			onCheck.resetHistory();
			r.property(WrappedNode1, 'onCheck', simpleTree[0].id, false);
			r.expect(
				checkableAssertion
					.setProperty(WrappedNode1, 'checkedNodes', [])
					.setProperty(WrappedNode2, 'checkedNodes', [])
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

			r.expect(selectableAssertion);

			// simulate select event
			const selectedNode = simpleTree[0].id;
			r.property(WrappedNode1, 'onValue', selectedNode);

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
			r.expect(selectableAssertion);

			// activate our node
			const nodeId = simpleTree[2].id;
			r.property(WrappedNode1, 'onActive', nodeId);
			r.expect(
				selectableAssertion
					.setProperty(WrappedNode1, 'activeNode', nodeId)
					.setProperty(WrappedNode2, 'activeNode', nodeId)
			);

			// use keyboard to select our node
			r.property(WrappedRoot, 'onkeydown', { ...stubEvent, which: Keys.Enter });
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
					.setProperty(WrappedNode1, 'activeNode', nodeId)
					.setProperty(WrappedNode2, 'activeNode', nodeId)
			);
		});
	});

	describe('Loading tree state', () => {
		const loadingAssertion = assertion(() => <LoadingIndicator />);
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

			r.expect(loadingAssertion);
			resolvePromise(simpleTree);
		});
	});
});
