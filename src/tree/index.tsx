import { create, tsx, diffProperty } from '@dojo/framework/core/vdom';
import { RenderResult } from '@dojo/framework/core/interfaces';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { createResourceMiddleware } from '@dojo/framework/core/middleware/resources';
import theme from '../middleware/theme';
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
	checkedIds?: string[];
	expandedIds?: string[];
	initialChecked?: string[];
	initialExpanded?: string[];
	value?: string;
	disabledIds?: string[];
	parentSelection?: boolean;
	onValue?(id: string): void;
	onCheck?(id: string[]): void;
	onExpand?(id: string[]): void;
}

export interface TreeChildren {
	(node: TreeNodeOption): RenderResult;
}

interface TreeCache {
	activeNode?: string;
	value?: string;
	checkedIds: string[];
	expandedIds: string[];
}

const resource = createResourceMiddleware<TreeNodeOption>();
const icache = createICacheMiddleware<TreeCache>();
const factory = create({ theme, icache, diffProperty, focus, resource })
	.properties<TreeProperties>()
	.children<TreeChildren | undefined>();

export default factory(function Tree({
	middleware: { theme, icache, diffProperty, resource },
	properties,
	children
}) {
	diffProperty('value', properties, ({ value: current }, { value: next }) => {
		if ((current || next) && current !== next) {
			icache.set('value', next);
		}
	});
	diffProperty(
		'initialChecked',
		properties,
		({ initialChecked: current }, { initialChecked: next }) => {
			if ((current || next) && current !== next) {
				icache.set('checkedIds', next || []);
			}
		}
	);
	diffProperty(
		'initialExpanded',
		properties,
		({ initialExpanded: current }, { initialExpanded: next }) => {
			if ((current || next) && current !== next) {
				icache.set('expandedIds', next || []);
			}
		}
	);

	const { getOrRead, createOptions, isLoading, meta } = resource;
	const {
		checkable = false,
		selectable = false,
		checkedIds,
		expandedIds,
		onValue,
		onCheck,
		onExpand,
		disabledIds,
		resource: { template },
		parentSelection = false,
		theme: themeProp,
		classes,
		variant
	} = properties();
	const themedCss = theme.classes(css);
	const defaultRenderer = (n: TreeNodeOption) => n.value;
	const [itemRenderer] = children();

	const activeNode = icache.get('activeNode');
	const selectedNode = icache.get('value');

	if (checkedIds) {
		icache.set('checkedIds', checkedIds);
	}

	if (expandedIds) {
		icache.set('expandedIds', expandedIds);
	}

	const expandedNodes = icache.getOrSet('expandedIds', []);
	const checkedNodes = icache.getOrSet('checkedIds', []);

	function activateNode(id: string) {
		icache.set('activeNode', id);
	}

	function selectNode(id: string) {
		icache.set('value', id);
		onValue && onValue(id);
	}

	function checkNode(id: string, checked: boolean) {
		if (checked) {
			icache.set('checkedIds', (currentChecked = []) => [...currentChecked, id]);
		} else {
			icache.set('checkedIds', (currentChecked = []) =>
				currentChecked ? currentChecked.filter((n) => n !== id) : []
			);
		}
		onCheck && onCheck(icache.get('checkedIds') || []);
	}

	function expandNode(id: string) {
		icache.set('expandedIds', (currentExpanded = []) => [...currentExpanded, id]);
		onExpand && onExpand(icache.get('expandedIds') || []);
	}

	function collapseNode(id: string) {
		icache.set('expandedIds', (currentExpanded = []) =>
			currentExpanded ? currentExpanded.filter((n) => n !== id) : []
		);
		onExpand && onExpand(icache.get('expandedIds') || []);
	}

	function createNodeFlatMap(nodeId: string = 'root'): TreeNodeOption[] {
		let nodes: TreeNodeOption[] = [];
		const options = createOptions(nodeId);
		const info = meta(template, options({ query: { parent: nodeId } }), true);

		const results = getOrRead(
			template,
			options({ query: { parent: nodeId }, size: info && info.total })
		);
		const queriedNodes = flat(results);

		queriedNodes.forEach((node) => {
			nodes.push(node);
			if (expandedNodes.indexOf(node.id) !== -1) {
				nodes = [...nodes, ...createNodeFlatMap(node.id)];
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
				if (activeNode && selectedNode !== activeNode && !nodes[activeIndex].hasChildren) {
					selectable && selectNode(activeNode);
					checkable && checkNode(activeNode, !checkedNodes.includes(activeNode));
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

		if (info === undefined || isLoading(template, options())) {
			return <LoadingIndicator theme={themeProp} classes={classes} variant={variant} />;
		}

		const results = getOrRead(
			template,
			options({ query: { parent: nodeId }, size: info.total })
		);

		const nodes = flat(results);

		return (
			<ol
				classes={[
					nodeId === 'root' ? themedCss.root : null,
					themedCss.nodeParent,
					theme.variant()
				]}
				onkeydown={onKeyDown}
				tabIndex={0}
				role={nodeId === 'root' ? 'tree' : 'group'}
			>
				{nodes.map((node) => {
					const isExpanded = expandedNodes.includes(node.id);
					return (
						<li
							classes={[
								themedCss.node,
								node.hasChildren && themedCss.leaf,
								selectable && themedCss.selectable,
								node.id === selectedNode && themedCss.selected
							]}
							role={'treeitem'}
						>
							<TreeNode
								classes={classes}
								theme={themeProp}
								variant={variant}
								activeNode={activeNode}
								checkable={checkable}
								selectable={selectable}
								selected={node.id === selectedNode}
								checked={checkedNodes.includes(node.id)}
								value={selectedNode}
								disabled={(disabledIds || []).includes(node.id)}
								expanded={isExpanded}
								parentSelection={parentSelection}
								node={node}
								onActive={() => activateNode(node.id)}
								onValue={() => selectNode(node.id)}
								onCheck={(checked: boolean) => checkNode(node.id, checked)}
								onExpand={(expanded) => {
									if (expanded) {
										expandNode(node.id);
									} else {
										collapseNode(node.id);
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
	checked?: boolean;
	selectable?: boolean;
	disabled?: boolean;
	activeNode?: string;
	value?: string;
	expanded: boolean;
	selected: boolean;
	parentSelection?: boolean;
	node: TreeNodeOption;
	onActive(): void;
	onValue(): void;
	onCheck(checked: boolean): void;
	onExpand(expanded: boolean): void;
}

interface TreeNodeChildren {
	(node: TreeNodeOption): RenderResult;
}

const treeNodeFactory = create({ theme })
	.properties<TreeNodeProperties>()
	.children<TreeNodeChildren>();

export const TreeNode = treeNodeFactory(function TreeNode({
	middleware: { theme },
	properties,
	children
}) {
	const {
		node,
		checkable,
		selectable,
		activeNode,
		checked,
		disabled,
		expanded,
		selected,
		onActive,
		onValue,
		onCheck,
		onExpand,
		parentSelection,
		theme: themeProp,
		classes,
		variant
	} = properties();
	const [itemRenderer] = children();
	const themedCss = theme.classes(css);
	const isActive = node.id === activeNode;
	const isExpandable = node.hasChildren;

	return (
		<ListItem
			active={isActive}
			selected={selected}
			onRequestActive={() => {
				onActive();
			}}
			onSelect={() => {
				isExpandable && onExpand(!expanded);
				if (parentSelection || !isExpandable) {
					selectable && onValue();
					checkable && onCheck(!checked);
				}
			}}
			disabled={disabled}
			widgetId={node.id}
			classes={classes}
			theme={themeProp}
			variant={variant}
		>
			<div classes={themedCss.contentWrapper}>
				<div classes={themedCss.content}>
					{isExpandable && (
						<div classes={themedCss.expander}>
							<Icon
								type={expanded ? 'downIcon' : 'rightIcon'}
								theme={themeProp}
								classes={classes}
								variant={variant}
							/>
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
								checked={!!checked}
								onValue={(value) => {
									onCheck(value);
								}}
								disabled={disabled}
								classes={classes}
								theme={themeProp}
								variant={variant}
							/>
						</div>
					)}
					<div classes={themedCss.title}>{itemRenderer(node)}</div>
				</div>
			</div>
		</ListItem>
	);
});
