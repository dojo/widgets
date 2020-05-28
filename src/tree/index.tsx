import { create, tsx, diffProperty } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { createResourceMiddleware } from '@dojo/framework/core/middleware/resources';
import theme from '@dojo/framework/core/middleware/theme';
import focus from '@dojo/framework/core/middleware/focus';
import { fill, flat } from '@dojo/framework/shim/array';

import { Keys } from '../common/util';
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
	depth: number;
	children: LinkedTreeNode[];
}

const resource = createResourceMiddleware<TreeNode>();
const icache = createICacheMiddleware<TreeCache>();
const factory = create({ theme, icache, diffProperty, focus, resource })
	.properties<TreeProperties>()
	.children<TreeChildren | undefined>();

export default factory(function({
	id,
	middleware: { theme, icache, diffProperty, focus, resource },
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

	const { getOrRead, createOptions } = resource;
	const {
		checkable = false,
		selectable = false,
		onSelect,
		onCheck,
		onExpand,
		disabledNodes,
		resource: { template, options = createOptions(id) }
	} = properties();
	const classes = theme.classes(css);
	const defaultRenderer = (n: TreeNode) => n.value;
	const [itemRenderer] = children();

	const rootNodes = createLinkedNodes(flat(getOrRead(template, options())));
	const activeNode = icache.get('activeNode');
	const selectedNode = icache.get('selectedNode');
	const expandedNodes = icache.getOrSet('expandedNodes', []);
	const checkedNodes = icache.getOrSet('checkedNodes', []);
	const shouldFocus = focus.shouldFocus();

	// build visible list of nodes for rendering
	const nodes: LinkedTreeNode[] = [];
	const queue: LinkedTreeNode[] = [...rootNodes];
	let activeIndex: number | undefined = undefined;

	let current = queue.shift();
	while (current) {
		if (current.children.length > 0 && expandedNodes.includes(current.id)) {
			queue.unshift(...current.children);
		}
		if (activeNode && current.id === activeNode) {
			activeIndex = nodes.length;
		}

		nodes.push(current);
		current = queue.shift();
	}

	function onKeyDown(event: KeyboardEvent) {
		event.stopPropagation();

		switch (event.which) {
			// select
			case Keys.Enter:
			case Keys.Space:
				event.preventDefault();
				if (activeNode && selectedNode !== activeNode) {
					icache.set('selectedNode', activeNode);
				}
				break;

			// next
			case Keys.Down:
				event.preventDefault();
				if (activeIndex !== undefined && activeIndex < nodes.length - 1) {
					icache.set('activeNode', nodes[activeIndex + 1].id);
				}
				break;

			// previous
			case Keys.Up:
				event.preventDefault();
				if (activeIndex !== undefined && activeIndex > 0) {
					icache.set('activeNode', nodes[activeIndex - 1].id);
				}
				break;

			// expand
			case Keys.Right:
				event.preventDefault();
				if (activeNode && !expandedNodes.includes(activeNode)) {
					expandedNodes.push(activeNode);
					icache.set('expandedNodes', expandedNodes);
				}
				break;

			// collapse
			case Keys.Left:
				event.preventDefault();
				if (activeNode && expandedNodes.includes(activeNode)) {
					expandedNodes.splice(expandedNodes.indexOf(activeNode), 1);
					icache.set('expandedNodes', expandedNodes);
				}
				break;
		}
	}

	return (
		<ol
			classes={[classes.root, theme.variant()]}
			focus={() => shouldFocus}
			onkeydown={onKeyDown}
			tabIndex={0}
		>
			{nodes.map((node) => (
				<Node
					depth={node.depth}
					activeNode={activeNode}
					checkable={checkable}
					selectable={selectable}
					checkedNodes={checkedNodes}
					selectedNode={selectedNode}
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
			))}
		</ol>
	);
});

function createLinkedNodes(nodes: TreeNode[]): LinkedTreeNode[] {
	// create a map of all nodes
	const nodeMap = new Map<string, LinkedTreeNode>();
	for (let node of nodes) {
		nodeMap.set(node.id, {
			id: node.id,
			node,
			depth: 0,
			children: []
		});
	}

	// organize into a tree such that only root nodes are top-level
	const rootNodes: LinkedTreeNode[] = [];
	for (let current of nodeMap.values()) {
		if (current.node.parent) {
			const parent = nodeMap.get(current.node.parent);
			if (parent) {
				parent.children.push(current);
			} else {
				// a parent that doesn't exist?
				// this node will not be included in the tree
			}
		} else {
			rootNodes.push(current);
		}
	}

	// track node depth
	const queue = [...rootNodes];
	let current = queue.shift();
	while (current) {
		if (current.node.parent) {
			const parent = nodeMap.get(current.node.parent);
			if (parent) {
				current.depth = parent.depth + 1;
			}
		}

		queue.unshift(...current.children);
		current = queue.shift();
	}

	return rootNodes;
}

/*******************
 * TreeNode
 *******************/

interface TreeNodeProperties {
	checkable: boolean;
	depth: number;
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
		depth,
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
	const spacers = new Array(depth);
	fill(spacers, <div classes={classes.spacer} />);

	return (
		<li
			classes={[
				classes.node,
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
								onpointerdown={(event: Event) => {
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
		</li>
	);
});
