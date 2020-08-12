import { create, tsx, diffProperty } from '@dojo/framework/core/vdom';
import { RenderResult } from '@dojo/framework/core/interfaces';
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

/*******************
 * Tree
 *******************/

export interface TreeNodeOption {
	id: string;
	parent?: string;
	value: string;
	hasChildren?: string;
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
	(node: TreeNodeOption): RenderResult;
}

interface TreeCache {
	activeNode?: string;
	selectedNode?: string;
	expandedNodes: string[];
	checkedNodes: string[];
}

export interface LinkedTreeNode {
	id: string;
	node: TreeNodeOption;
	depth: number;
	children: LinkedTreeNode[];
}

const resource = createResourceMiddleware<TreeNodeOption>();
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

	const { getOrRead, createOptions, isLoading, meta } = resource;
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
	const defaultRenderer = (n: TreeNodeOption) => n.value;
	const [itemRenderer] = children();

	const activeNode = icache.get('activeNode');
	const selectedNode = icache.get('selectedNode');
	const expandedNodes = icache.getOrSet('expandedNodes', []);
	const checkedNodes = icache.getOrSet('checkedNodes', []);
	const shouldFocus = focus.shouldFocus();
	console.log('activeNode', activeNode);
	console.log('expandedNode', expandedNodes.slice(-1)[0]);
	const info = meta(template, options({ query: { id: expandedNodes.slice(-1)[0] } }), true);

	const isCurrentlyLoading = isLoading(
		template,
		options({ query: { id: expandedNodes.slice(-1)[0] } })
	);

	// build visible list of nodes for rendering
	const nodes: LinkedTreeNode[] = [];
	let queue: LinkedTreeNode[] = [];
	let activeIndex: number | undefined = undefined;

	if (!isCurrentlyLoading && info) {
		console.log('info', info);
		const rootNodes = flat(
			getOrRead(
				template,
				options({ query: { id: expandedNodes.slice(-1)[0] }, size: info.total })
			)
		);
		console.log('rootNodes', rootNodes);
		queue = [...createLinkedNodes(rootNodes)];

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
	}

	function activateNode(id: string) {
		icache.set('activeNode', id);
	}

	function selectNode(id: string) {
		icache.set('selectedNode', id);
		onSelect && onSelect(id);
	}

	function expandNode(id: string) {
		expandedNodes.push(id);
		icache.set('expandedNodes', expandedNodes);
		// options({ query: { id } });
		onExpand && onExpand(id, true);
	}

	function collapseNode(id: string) {
		expandedNodes.splice(expandedNodes.indexOf(id), 1);
		icache.set('expandedNodes', expandedNodes);
		onExpand && onExpand(id, false);
	}

	function onKeyDown(event: KeyboardEvent) {
		event.stopPropagation();

		switch (event.which) {
			// select
			case Keys.Enter:
			case Keys.Space:
				event.preventDefault();
				if (activeNode && selectedNode !== activeNode) {
					selectNode(activeNode);
				}
				break;

			// next
			case Keys.Down:
				event.preventDefault();
				if (activeIndex !== undefined && activeIndex < nodes.length - 1) {
					activateNode(nodes[activeIndex + 1].id);
				}
				break;

			// previous
			case Keys.Up:
				event.preventDefault();
				if (activeIndex !== undefined && activeIndex > 0) {
					activateNode(nodes[activeIndex - 1].id);
				}
				break;

			// expand
			case Keys.Right:
				event.preventDefault();
				if (activeNode && !expandedNodes.includes(activeNode)) {
					expandNode(activeNode);
				}
				break;

			// collapse
			case Keys.Left:
				event.preventDefault();
				if (activeNode && expandedNodes.includes(activeNode)) {
					collapseNode(activeNode);
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
				<TreeNode
					depth={node.depth}
					activeNode={activeNode}
					checkable={checkable}
					selectable={selectable}
					checkedNodes={checkedNodes}
					selectedNode={selectedNode}
					disabledNodes={disabledNodes || []}
					expandedNodes={expandedNodes}
					node={node}
					onActive={activateNode}
					onSelect={selectNode}
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
							expandNode(n);
						} else {
							collapseNode(n);
						}
					}}
				>
					{itemRenderer || defaultRenderer}
				</TreeNode>
			))}
		</ol>
	);
});

function createLinkedNodes(nodes: TreeNodeOption[]): LinkedTreeNode[] {
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
	(node: TreeNodeOption): RenderResult;
}

const treeNodeFactory = create({ theme })
	.properties<TreeNodeProperties>()
	.children<TreeNodeChildren>();

export const TreeNode = treeNodeFactory(function({ middleware: { theme }, properties, children }) {
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
