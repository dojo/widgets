import { create, tsx, diffProperty } from '@dojo/framework/core/vdom';
import { RenderResult } from '@dojo/framework/core/interfaces';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { createResourceMiddleware } from '@dojo/framework/core/middleware/resources';
import theme from '@dojo/framework/core/middleware/theme';
import focus from '@dojo/framework/core/middleware/focus';
import { flat } from '@dojo/framework/shim/array';

import { Keys } from '../common/util';
import Icon from '../icon';
import Checkbox from '../checkbox';
import { ListItem } from '../list';

import * as css from '../theme/default/tree.m.css';
import LoadingIndicator from '../loading-indicator';

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
	initialChecked?: string[];
	initialExpanded?: string[];
	selectedNode?: string;
	disabledNodes?: string[];
	parentSelection?: boolean;
	onSelect?(id: string): void;
	onCheck?(id: string, checked: boolean): void;
	onExpand?(id: string, expanded: boolean): void;
}

export interface TreeChildren {
	(node: TreeNodeOption): RenderResult;
}

interface TreeCache {
	activeNode?: string;
	selectedNode?: string;
	controlledExpandedNodes: string[];
	controlledCheckedNodes: string[];
	checkedNodes: string[];
	expandedNodes: string[];
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
				icache.set('controlledExpandedNodes', next || []);
			}
		}
	);
	diffProperty(
		'checkedNodes',
		properties,
		({ checkedNodes: current }, { checkedNodes: next }) => {
			if ((current || next) && current !== next) {
				icache.set('controlledCheckedNodes', next || []);
			}
		}
	);
	diffProperty(
		'initialChecked',
		properties,
		({ initialChecked: current }, { initialChecked: next }) => {
			if ((current || next) && current !== next) {
				icache.set('checkedNodes', next || []);
			}
		}
	);
	diffProperty(
		'initialExpanded',
		properties,
		({ initialExpanded: current }, { initialExpanded: next }) => {
			if ((current || next) && current !== next) {
				icache.set('expandedNodes', next || []);
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
		resource: { template },
		parentSelection = false
	} = properties();
	const classes = theme.classes(css);
	const defaultRenderer = (n: TreeNodeOption) => n.value;
	const [itemRenderer] = children();

	const activeNode = icache.get('activeNode');
	const selectedNode = icache.get('selectedNode');
	const controlledExpandedNodes = icache.get('controlledExpandedNodes');
	const controlledCheckedNodes = icache.get('controlledCheckedNodes');
	const expandedNodes = icache.getOrSet('expandedNodes', []);
	const checkedNodes = icache.getOrSet('checkedNodes', []);
	const shouldFocus = focus.shouldFocus();

	function activateNode(id: string) {
		icache.set('activeNode', id);
	}

	function selectNode(id: string) {
		icache.set('selectedNode', id);
		onSelect && onSelect(id);
	}

	function checkNode(id: string, checked: boolean) {
		if (!controlledCheckedNodes) {
			if (checked) {
				icache.set('checkedNodes', (currentChecked) => [...currentChecked, id]);
			} else {
				icache.set('checkedNodes', (currentChecked) =>
					currentChecked ? currentChecked.filter((n) => n !== id) : []
				);
			}
		}
		onCheck && onCheck(id, checked);
	}

	function expandNode(id: string) {
		if (!controlledExpandedNodes) {
			icache.set('expandedNodes', (currentExpanded) => [...currentExpanded, id]);
		}
		onExpand && onExpand(id, true);
	}

	function collapseNode(id: string) {
		if (!controlledExpandedNodes) {
			icache.set('expandedNodes', (currentExpanded) =>
				currentExpanded ? currentExpanded.filter((n) => n !== id) : []
			);
		}
		onExpand && onExpand(id, false);
	}

	function createNodeFlatMap(nodeId: string = 'root'): TreeNodeOption[] {
		let nodes: TreeNodeOption[] = [];
		const options = createOptions(nodeId);
		const info = meta(template, options({ query: { parent: nodeId } }), true);

		if (info === undefined) {
			return [];
		}

		const results = getOrRead(
			template,
			options({ query: { parent: nodeId }, size: info.total })
		);
		const queriedNodes = flat(results);

		queriedNodes.forEach((node) => {
			nodes.push(node);
			if (!controlledExpandedNodes) {
				if (expandedNodes.indexOf(node.id) !== -1) {
					nodes = [...nodes, ...createNodeFlatMap(node.id)];
				}
			} else {
				if (controlledExpandedNodes.indexOf(node.id) !== -1) {
					nodes = [...nodes, ...createNodeFlatMap(node.id)];
				}
			}
		});
		return nodes;
	}

	function onKeyDown(event: KeyboardEvent) {
		event.stopPropagation();
		const nodes = createNodeFlatMap();
		const activeIndex = nodes.findIndex((node) => node.id === activeNode);

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
				activateNode(nodes[(activeIndex + 1) % nodes.length].id);
				break;

			// previous
			case Keys.Up:
				event.preventDefault();
				if (activeIndex - 1 < 0) {
					activateNode(nodes[nodes.length - 1].id);
				} else {
					activateNode(nodes[activeIndex - 1].id);
				}
				break;

			// expand
			case Keys.Right:
				event.preventDefault();
				if (
					activeNode &&
					!expandedNodes.includes(activeNode) &&
					nodes[activeIndex].hasChildren
				) {
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

	function mapNodeTree(nodeId: string = 'root') {
		const options = createOptions(nodeId);
		const info = meta(template, options({ query: { parent: nodeId } }), true);

		if (info === undefined) {
			return <LoadingIndicator />;
		}

		const results = getOrRead(
			template,
			options({ query: { parent: nodeId }, size: info.total })
		);

		const loading = isLoading(template, options());
		if (loading) {
			return <LoadingIndicator />;
		}

		const nodes = flat(results);

		return (
			<ol
				classes={[
					nodeId === 'root' ? classes.root : null,
					classes.nodeParent,
					theme.variant()
				]}
				focus={() => shouldFocus}
				onkeydown={onKeyDown}
				tabIndex={0}
			>
				{nodes.map((node) => {
					const isExpanded = controlledExpandedNodes
						? controlledExpandedNodes.indexOf(node.id) !== -1
						: expandedNodes.indexOf(node.id) !== -1;
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
								activeNode={activeNode}
								checkable={checkable}
								selectable={selectable}
								checkedNodes={controlledCheckedNodes || checkedNodes}
								selectedNode={selectedNode}
								disabledNodes={disabledNodes || []}
								expandedNodes={controlledExpandedNodes || expandedNodes}
								parentSelection={parentSelection}
								node={node}
								onActive={activateNode}
								onSelect={selectNode}
								onCheck={checkNode}
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
							{isExpanded && mapNodeTree(node.id)}
						</li>
					);
				})}
			</ol>
		);
	}
	return mapNodeTree();
});

interface TreeNodeProperties {
	checkable: boolean;
	selectable: boolean;
	activeNode?: string;
	selectedNode?: string;
	checkedNodes: string[];
	disabledNodes: string[];
	expandedNodes: string[];
	parentSelection?: boolean;
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
		selectable,
		activeNode,
		selectedNode,
		checkedNodes,
		disabledNodes,
		expandedNodes,
		onActive,
		onSelect,
		onCheck,
		onExpand,
		parentSelection
	} = properties();
	const [itemRenderer] = children();
	const classes = theme.classes(css);
	const isActive = node.id === activeNode;
	const isSelected = node.id === selectedNode;
	const expanded = expandedNodes.includes(node.id);
	const checked = checkedNodes.includes(node.id);
	const isDisabled = disabledNodes && disabledNodes.includes(node.id);
	const isExpandable = node.hasChildren;

	return (
		<ListItem
			active={isActive}
			selected={isSelected}
			onRequestActive={() => {
				onActive(node.id);
			}}
			onSelect={() => {
				isExpandable && onExpand(node.id, !expanded);
				if (parentSelection || !isExpandable) {
					selectable && onSelect(node.id);
					checkable && onCheck(node.id, !checked);
				}
			}}
			disabled={isDisabled}
			widgetId={node.id}
		>
			<div classes={classes.contentWrapper}>
				<div classes={classes.content}>
					{isExpandable && (
						<div classes={classes.expander}>
							<Icon type={expanded ? 'downIcon' : 'rightIcon'} />
						</div>
					)}
					{checkable && (parentSelection || !isExpandable) && (
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
