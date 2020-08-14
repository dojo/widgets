import { create, tsx, diffProperty } from '@dojo/framework/core/vdom';
import { RenderResult } from '@dojo/framework/core/interfaces';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { createResourceMiddleware } from '@dojo/framework/core/middleware/resources';
import theme from '@dojo/framework/core/middleware/theme';
import focus from '@dojo/framework/core/middleware/focus';
import { fill, flat } from '@dojo/framework/shim/array';

// import { Keys } from '../common/util';
import Icon from '../icon';
import Checkbox from '../checkbox';
import { ListItem } from '../list';

import * as css from '../theme/default/tree.m.css';

/*******************
 * Tree
 *******************/

export interface TreeNodeOption {
	id: string;
	parent: string;
	value: string;
	hasChildren: boolean;
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
		resource: { template }
	} = properties();
	const classes = theme.classes(css);
	const defaultRenderer = (n: TreeNodeOption) => n.value;
	const [itemRenderer] = children();

	const activeNode = icache.get('activeNode');
	const selectedNode = icache.get('selectedNode');
	const expandedNodes = icache.getOrSet('expandedNodes', []);
	const checkedNodes = icache.getOrSet('checkedNodes', []);
	const shouldFocus = focus.shouldFocus();
	// let activeIndex: number | undefined = undefined;

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
		onExpand && onExpand(id, true);
	}

	function collapseNode(id: string) {
		expandedNodes.splice(expandedNodes.indexOf(id), 1);
		icache.set('expandedNodes', expandedNodes);
		onExpand && onExpand(id, false);
	}

	// function nextNode(node: TreeNodeOption) {
	// 	if (node.hasChildren) {
	// 		const options = createOptions(nodeId || id);
	// 		const info = meta(template, options({ query: {parent: nodeId }}), true);

	// 		if (info === undefined) {
	// 			return <h1>Loading</h1>
	// 		}

	// 		const results = getOrRead(template, options({query: {parent: nodeId}, size: info.total}));
	// 	}

	// 	return nodes[activeIndex + 1].id
	// }

	// async function onKeyDown(event: KeyboardEvent) {
	// 	event.stopPropagation();

	// 	switch (event.which) {
	// 		// select
	// 		case Keys.Enter:
	// 		case Keys.Space:
	// 			event.preventDefault();
	// 			if (activeNode && selectedNode !== activeNode) {
	// 				selectNode(activeNode);
	// 			}
	// 			break;

	// 		// next
	// 		case Keys.Down:
	// 			event.preventDefault();
	// 			if (activeIndex !== undefined && activeIndex < nodes.length - 1) {
	// 				activateNode(nodes[activeIndex + 1].id);
	// 			}
	// 			break;

	// 		// previous
	// 		case Keys.Up:
	// 			event.preventDefault();
	// 			if (activeIndex !== undefined && activeIndex > 0) {
	// 				activateNode(nodes[activeIndex - 1].id);
	// 			}
	// 			break;

	// 		// expand
	// 		case Keys.Right:
	// 			event.preventDefault();
	// 			if (activeNode && !expandedNodes.includes(activeNode)) {
	// 				expandNode(activeNode);
	// 			}
	// 			break;

	// 		// collapse
	// 		case Keys.Left:
	// 			event.preventDefault();
	// 			if (activeNode && expandedNodes.includes(activeNode)) {
	// 				collapseNode(activeNode);
	// 			}
	// 			break;
	// 	}
	// }

	function createNodeTreeLevel(nodeId: string = 'root', depth: number = 0) {
		const options = createOptions(nodeId);
		const info = meta(template, options({ query: { parent: nodeId } }), true);

		if (info === undefined) {
			return <h1>Loading</h1>;
		}

		const results = getOrRead(
			template,
			options({ query: { parent: nodeId }, size: info.total })
		);

		const loading = isLoading(template, options());
		if (loading) {
			return <h1>Loading</h1>;
		}

		const nodes = flat(results);

		return (
			<ol
				classes={[classes.root, theme.variant()]}
				focus={() => shouldFocus}
				// onkeydown={onKeyDown}
				tabIndex={0}
			>
				{nodes.map((node) => {
					const isExpanded = expandedNodes.indexOf(node.id) !== -1;
					console.log('isExpanded', isExpanded);
					console.log('expandedNodes', expandedNodes);
					console.log('node', node);
					return (
						<li
							classes={[
								classes.node,
								node.hasChildren && classes.leaf,
								selectable && classes.selectable,
								node.id === selectedNode && classes.selected
							]}
						>
							<TreeNode
								depth={depth}
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
							{isExpanded && createNodeTreeLevel(node.id, depth + 1)}
						</li>
					);
				})}
			</ol>
		);
	}
	return createNodeTreeLevel();
});

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
	node: TreeNodeOption;
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
	const isExpandable = node.hasChildren;
	const spacers = new Array(depth);
	fill(spacers, <div classes={classes.spacer} />);

	return (
		<ListItem
			active={isActive}
			selected={isSelected}
			onRequestActive={() => {
				onActive(node.id);
			}}
			onSelect={() => {
				isExpandable && onExpand(node.id, !expanded);
				selectable && onSelect(node.id);
			}}
			disabled={isDisabled}
			widgetId={node.id}
		>
			<div classes={classes.contentWrapper}>
				{...spacers}
				<div classes={classes.content}>
					{isExpandable && (
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
					<div classes={classes.title}>{itemRenderer(node)}</div>
				</div>
			</div>
		</ListItem>
	);
});
