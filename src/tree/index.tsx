import { create, tsx, diffProperty } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import theme from '@dojo/framework/core/middleware/theme';
import { fill } from '@dojo/framework/shim/array';

import Icon from '../icon';
import Checkbox from '../checkbox';
import { ListItem } from '../list';

import * as css from '../theme/default/tree.m.css';
import { RenderResult } from '@dojo/framework/core/interfaces';

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
	selectedNode?: string;
	disabledNodes?: string[];
	onSelect?(node: string): void;
	onCheck?(node: string, checked: boolean): void;
	onExpand?(node: string, expanded: boolean): void;
}

export interface TreeChildren {
	(node: TreeNode): RenderResult;
}

interface TreeCache {
	activeNode?: string;
	selectedNode?: string;
	expandedNodes: string[];
	checkedNodes: string[];
}

interface LinkedTreeNode {
	id: string;
	node: TreeNode;
	children: LinkedTreeNode[];
}

const icache = createICacheMiddleware<TreeCache>();
const factory = create({ theme, icache, diffProperty })
	.properties<TreeProperties>()
	.children<TreeChildren | undefined>();

export default factory(function({
	middleware: { theme, icache, diffProperty },
	properties,
	children
}) {
	diffProperty(
		'selectedNode',
		properties,
		({ selectedNode: current }, { selectedNode: next }) => {
			if ((current || next) && current !== next) {
				icache.set('selectedNode', next);
			}
		}
	);
	diffProperty(
		'expandedNodes',
		properties,
		({ expandedNodes: current }, { expandedNodes: next }) => {
			if ((current || next) && current !== next) {
				icache.set('expandedNodes', next || []);
			}
		}
	);
	diffProperty(
		'checkedNodes',
		properties,
		({ checkedNodes: current }, { checkedNodes: next }) => {
			if ((current || next) && current !== next) {
				icache.set('checkedNodes', next || []);
			}
		}
	);

	const {
		nodes,
		checkable = false,
		selectable = false,
		onSelect,
		onCheck,
		onExpand,
		disabledNodes
	} = properties();
	const classes = theme.classes(css);
	const defaultRenderer = (n: TreeNode) => n.value;
	const [itemRenderer] = children();
	const expandedNodes = icache.getOrSet('expandedNodes', []);
	const checkedNodes = icache.getOrSet('checkedNodes', []);

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
						activeNode={icache.get('activeNode')}
						checkable={checkable}
						selectable={selectable}
						checkedNodes={checkedNodes}
						selectedNode={icache.get('selectedNode')}
						disabledNodes={disabledNodes || []}
						expandedNodes={expandedNodes}
						node={node}
						onActive={(n) => {
							icache.set('activeNode', n);
						}}
						onSelect={(n) => {
							icache.set('selectedNode', n);
							onSelect && onSelect(n);
						}}
						onCheck={(n, checked) => {
							if (checked) {
								checkedNodes.push(n);
							} else {
								checkedNodes.splice(checkedNodes.indexOf(n), 1);
							}
							icache.set('checkedNodes', checkedNodes);
							onCheck && onCheck(n, checked);
						}}
						onExpand={(n, expanded) => {
							if (expanded) {
								expandedNodes.push(n);
							} else {
								expandedNodes.splice(expandedNodes.indexOf(n), 1);
							}
							icache.set('expandedNodes', expandedNodes);
							onExpand && onExpand(n, expanded);
						}}
					>
						{itemRenderer || defaultRenderer}
					</Node>
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
	activeNode?: string;
	selectedNode?: string;
	checkedNodes: string[];
	disabledNodes: string[];
	expandedNodes: string[];
	node: LinkedTreeNode;
	onActive(node: string): void;
	onSelect(node: string): void;
	onCheck(node: string, checked: boolean): void;
	onExpand(node: string, expanded: boolean): void;
}

interface TreeNodeChildren {
	(node: TreeNode): RenderResult;
}

interface TreeNodeCache {}

const treeNodeCache = createICacheMiddleware<TreeNodeCache>();
const treeNodeFactory = create({ theme, icache: treeNodeCache })
	.properties<TreeNodeProperties>()
	.children<TreeNodeChildren>();

const Node = treeNodeFactory(function({ middleware: { theme, icache }, properties, children }) {
	const {
		node,
		checkable,
		level,
		selectable,
		activeNode,
		selectedNode,
		checkedNodes,
		disabledNodes,
		expandedNodes,
		onActive,
		onSelect,
		onCheck,
		onExpand
	} = properties();
	const [itemRenderer] = children();
	const classes = theme.classes(css);
	const isActive = node.id === activeNode;
	const isSelected = node.id === selectedNode;
	const expanded = expandedNodes.includes(node.id);
	const checked = checkedNodes.includes(node.id);
	const isDisabled = disabledNodes && disabledNodes.includes(node.id);
	const isLeaf = !node.children || node.children.length === 0;
	const spacers = new Array(level);
	fill(spacers, <div classes={classes.spacer} />);

	return (
		<div
			classes={[
				classes.nodeRoot,
				isLeaf && classes.leaf,
				selectable && classes.selectable,
				isSelected && classes.selected
			]}
		>
			<ListItem
				active={isActive}
				selected={isSelected}
				onRequestActive={() => {
					onActive(node.id);
				}}
				onSelect={() => {
					onExpand(node.id, !expanded);
					selectable && onSelect(node.id);
				}}
				disabled={isDisabled}
				widgetId={node.id}
			>
				<div classes={classes.contentWrapper}>
					{...spacers}
					<div classes={classes.content}>
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
										onCheck(node.id, value);
									}}
									disabled={isDisabled}
								/>
							</div>
						)}
						<div classes={classes.title}>{itemRenderer(node.node)}</div>
					</div>
				</div>
			</ListItem>
			{node.children && expanded && (
				<div classes={classes.childrenWrapper}>
					<ol classes={classes.children}>
						{node.children.map((child) => (
							<li classes={classes.child}>
								<Node
									activeNode={activeNode}
									checkable={checkable}
									level={level + 1}
									selectable={selectable}
									checkedNodes={checkedNodes}
									selectedNode={selectedNode}
									disabledNodes={disabledNodes}
									expandedNodes={expandedNodes}
									node={child}
									onActive={onActive}
									onSelect={onSelect}
									onCheck={onCheck}
									onExpand={onExpand}
								>
									{itemRenderer}
								</Node>
							</li>
						))}
					</ol>
				</div>
			)}
		</div>
	);
});
