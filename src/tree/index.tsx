import { create, tsx, diffProperty } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import theme from '@dojo/framework/core/middleware/theme';
import { RenderResult } from '@dojo/framework/core/interfaces';
import Icon, { IconType } from '../icon';

import * as css from '../theme/default/tree.m.css';
import Checkbox from '../checkbox';

export interface TreeNode {
	content: string | RenderResult;
	icon?: IconType;
	children?: TreeNode[];
	expanded?: boolean;
}

export interface TreeProperties {
	nodes: TreeNode[];
	checkable?: boolean;
	selectable?: boolean;
	selectedNode?: TreeNode;
	onSelect?(node: TreeNode): void;
}

/*******************
 * Tree
 *******************/

interface TreeCache {
	selectedNode?: TreeNode;
}

const icache = createICacheMiddleware<TreeCache>();
const factory = create({ theme, icache, diffProperty }).properties<TreeProperties>();

export default factory(function({ middleware: { theme, icache, diffProperty }, properties }) {
	diffProperty('selectedNode', (current: TreeProperties, next: TreeProperties) => {
		if (current.selectedNode !== next.selectedNode) {
			icache.set('selectedNode', next.selectedNode);
		}
	});

	const { nodes, checkable = false, selectable = false, onSelect } = properties();
	const classes = theme.classes(css);
	const selectedNode = icache.get('selectedNode');

	return (
		<ol classes={[classes.root, theme.variant()]}>
			{nodes.map((node) => (
				<li classes={classes.child}>
					<Node
						level={0}
						checkable={checkable}
						selectable={selectable}
						selectedNode={selectedNode}
						node={node}
						onSelect={(n) => {
							icache.set('selectedNode', n);
							onSelect && onSelect(n);
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
	selectedNode?: TreeNode;
	node: TreeNode;
	onSelect(node: TreeNode): void;
}

interface TreeNodeCache {
	expanded: boolean;
	checked: boolean;
}

const treeNodeCache = createICacheMiddleware<TreeNodeCache>();
const treeNodeFactory = create({ theme, icache: treeNodeCache }).properties<TreeNodeProperties>();
const Node = treeNodeFactory(function({ middleware: { theme, icache }, properties }) {
	const { node, checkable, level, selectable, selectedNode, onSelect } = properties();
	const classes = theme.classes(css);
	const expanded = icache.getOrSet('expanded', node.expanded || false);
	const checked = icache.getOrSet('checked', false);
	const isLeaf = !node.children || node.children.length === 0;
	const isSelected = selectedNode && selectedNode === node;
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
						onSelect(node);
					}}
				>
					{!isLeaf && (
						<div classes={classes.expander}>
							<Icon type={expanded ? 'downIcon' : 'rightIcon'} />
						</div>
					)}
					{checkable && (
						<div>
							<Checkbox
								checked={checked}
								onValue={(value) => icache.set('checked', value)}
							/>
						</div>
					)}
					{node.icon && (
						<div classes={classes.icon}>
							<Icon type={node.icon} />
						</div>
					)}
					<div classes={classes.title}>{node.content}</div>
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
									selectedNode={selectedNode}
									node={child}
									onSelect={onSelect}
								/>
							</li>
						))}
					</ol>
				</div>
			)}
		</div>
	);
});
