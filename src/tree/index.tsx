import { create, tsx, diffProperty } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import theme from '@dojo/framework/core/middleware/theme';

import Icon from '../icon';
import Checkbox from '../checkbox';

import * as css from '../theme/default/tree.m.css';

/*******************
 * Tree
 *******************/

export interface TreeNode {
	id: string;
	parent?: string;
	value: string;
}

export interface TreeProperties {
	nodes: TreeNode[];
	checkable?: boolean;
	selectable?: boolean;
	checkedNodes?: string[];
	expandedNodes?: string[];
	selectedNodes?: string[];
	disabledNodes?: string[];
	onSelect?(node: string): void;
	onCheck?(node: string, checked: boolean): void;
	onExpand?(node: string, expanded: boolean): void;
}

interface TreeCache {
	selectedNode?: string;
}

interface LinkedTreeNode {
	id: string;
	node: TreeNode;
	children: LinkedTreeNode[];
}

const icache = createICacheMiddleware<TreeCache>();
const factory = create({ theme, icache }).properties<TreeProperties>();

export default factory(function({ middleware: { theme, icache }, properties }) {
	const {
		nodes,
		checkable = false,
		selectable = false,
		onSelect,
		onCheck,
		onExpand,
		checkedNodes,
		selectedNodes,
		disabledNodes,
		expandedNodes
	} = properties();
	const classes = theme.classes(css);

	// convert TreeNode to LinkedTreeNodes
	const nodeMap = new Map<string, LinkedTreeNode>();
	for (let node of nodes) {
		nodeMap.set(node.id, {
			id: node.id,
			node,
			children: []
		});
	}
	const rootNodes: LinkedTreeNode[] = [];
	for (let linked of nodeMap.values()) {
		if (linked.node.parent) {
			const parent = nodeMap.get(linked.node.parent);
			if (parent) {
				parent.children.push(linked);
			}
		} else {
			rootNodes.push(linked);
		}
	}

	return (
		<ol classes={[classes.root, theme.variant()]}>
			{rootNodes.map((node) => (
				<li classes={classes.child}>
					<Node
						level={0}
						checkable={checkable}
						selectable={selectable}
						checkedNodes={checkedNodes || []}
						selectedNodes={selectedNodes || []}
						disabledNodes={disabledNodes || []}
						expandedNodes={expandedNodes || []}
						node={node}
						onSelect={(n) => {
							icache.set('selectedNode', n);
							onSelect && onSelect(n);
						}}
						onCheck={(n, c) => {
							onCheck && onCheck(n, c);
						}}
						onExpand={(n, e) => {
							onExpand && onExpand(n, e);
						}}
					/>
				</li>
			))}
		</ol>
	);
});

/*******************
 * TreeNode
 *******************/

interface TreeNodeProperties {
	checkable: boolean;
	level: number;
	selectable: boolean;
	checkedNodes: string[];
	selectedNodes: string[];
	disabledNodes: string[];
	expandedNodes: string[];
	node: LinkedTreeNode;
	onSelect(node: string): void;
	onCheck(node: string, checked: boolean): void;
	onExpand(node: string, expanded: boolean): void;
}

interface TreeNodeCache {
	node: TreeNode;
	expanded: boolean;
	checked: boolean;
	selected: boolean;
}

const treeNodeCache = createICacheMiddleware<TreeNodeCache>();
const treeNodeFactory = create({ theme, icache: treeNodeCache, diffProperty }).properties<
	TreeNodeProperties
>();
const Node = treeNodeFactory(function({ middleware: { theme, icache, diffProperty }, properties }) {
	const {
		node,
		checkable,
		level,
		selectable,
		checkedNodes,
		selectedNodes,
		disabledNodes,
		expandedNodes,
		onSelect,
		onCheck,
		onExpand
	} = properties();

	// Merge controlled properties with our internally-tracked ones
	diffProperty(
		'expandedNodes',
		(
			{ expandedNodes: current }: TreeNodeProperties,
			{ expandedNodes: next }: TreeNodeProperties
		) => {
			if ((current && current.includes(node.id)) || (next && next.includes(node.id))) {
				icache.set('expanded', next.includes(node.id));
			}
		}
	);
	diffProperty(
		'checkedNodes',
		(
			{ checkedNodes: current }: TreeNodeProperties,
			{ checkedNodes: next }: TreeNodeProperties
		) => {
			if ((current && current.includes(node.id)) || (next && next.includes(node.id))) {
				icache.set('checked', next.includes(node.id));
			}
		}
	);
	diffProperty(
		'selectedNodes',
		(
			{ selectedNodes: current }: TreeNodeProperties,
			{ selectedNodes: next }: TreeNodeProperties
		) => {
			if ((current && current.includes(node.id)) || (next && next.includes(node.id))) {
				icache.set('selected', next.includes(node.id));
			}
		}
	);

	const classes = theme.classes(css);
	const expanded = icache.getOrSet('expanded', false);
	const checked = icache.getOrSet('checked', false);
	const isSelected = icache.getOrSet('selected', false);
	const isDisabled = disabledNodes && disabledNodes.includes(node.id);
	const isLeaf = !node.children || node.children.length === 0;
	const spacers = new Array(level).fill(<div classes={classes.spacer} />);

	return (
		<div
			classes={[
				classes.nodeRoot,
				isLeaf && classes.leaf,
				selectable && classes.selectable,
				isSelected && classes.selected
			]}
		>
			<div classes={classes.contentWrapper}>
				{...spacers}
				<div
					classes={classes.content}
					onclick={() => {
						icache.set('expanded', !expanded);
						selectable && isDisabled !== true && onSelect(node.id);
						onExpand(node.id, !expanded);
					}}
				>
					{!isLeaf && (
						<div classes={classes.expander}>
							<Icon type={expanded ? 'downIcon' : 'rightIcon'} />
						</div>
					)}
					{checkable && (
						<div
							onclick={(event: Event) => {
								// don't allow the check's activity to effect our expand/collapse
								event.stopPropagation();
							}}
						>
							<Checkbox
								checked={checked}
								onValue={(value) => {
									icache.set('checked', value);
									onCheck(node.id, value);
								}}
								disabled={isDisabled}
							/>
						</div>
					)}
					<div classes={classes.title}>{node.node.value}</div>
				</div>
			</div>
			{node.children && expanded && (
				<div classes={classes.childrenWrapper}>
					<ol classes={classes.children}>
						{node.children.map((child) => (
							<li classes={classes.child}>
								<Node
									checkable={checkable}
									level={level + 1}
									selectable={selectable}
									checkedNodes={checkedNodes}
									selectedNodes={selectedNodes}
									disabledNodes={disabledNodes}
									expandedNodes={expandedNodes}
									node={child}
									onSelect={onSelect}
									onCheck={onCheck}
									onExpand={onExpand}
								/>
							</li>
						))}
					</ol>
				</div>
			)}
		</div>
	);
});
