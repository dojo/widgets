const { describe, it, beforeEach } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import * as sinon from 'sinon';

import { tsx } from '@dojo/framework/core/vdom';
import { renderer, assertion, wrap } from '@dojo/framework/testing/renderer';

import Checkbox from '../../../checkbox';
import Icon from '../../../icon';
import { ListItem } from '../../../list';
import { TreeNode, TreeNodeOption } from '../../index';
import * as css from '../../../theme/default/tree.m.css';
import { simpleTree } from './TreeData.mock';

const noop = () => {};
const node = simpleTree[0];

const defaultProps = {
	activeNode: undefined,
	checkable: false,
	selectable: false,
	checkedNodes: [],
	selectedNode: undefined,
	disabledNodes: [],
	expandedNodes: [],
	onActive: noop,
	onSelect: noop,
	onCheck: noop,
	onExpand: noop,
	node
};
const defaultRenderer = (n: TreeNodeOption) => n.value;

const WrappedRoot = wrap(ListItem);
const WrappedContentWrapper = wrap('div');
const WrappedContent = wrap('div');
const WrappedTitle = wrap('div');
const WrappedExpander = wrap('div');
const WrappedExpanderIcon = wrap(Icon);
const baseAssertion = assertion(() => (
	<WrappedRoot
		active={false}
		selected={false}
		onRequestActive={noop}
		onSelect={noop}
		disabled={false}
		widgetId={node.id}
	>
		<WrappedContentWrapper classes={css.contentWrapper}>
			<WrappedContent classes={css.content}>
				<WrappedExpander classes={css.expander}>
					<WrappedExpanderIcon type="rightIcon" />
				</WrappedExpander>
				<WrappedTitle classes={css.title}>{node.value}</WrappedTitle>
			</WrappedContent>
		</WrappedContentWrapper>
	</WrappedRoot>
));

describe('TreeNode', () => {
	it('renders', () => {
		const r = renderer(() => <TreeNode {...defaultProps}>{defaultRenderer}</TreeNode>);
		r.expect(baseAssertion);
	});

	it('renders disabled', () => {
		const r = renderer(() => (
			<TreeNode {...defaultProps} disabledNodes={[node.id]}>
				{defaultRenderer}
			</TreeNode>
		));
		r.expect(baseAssertion.setProperty(WrappedRoot, 'disabled', true));
	});

	describe('Active', () => {
		it('renders active', () => {
			const r = renderer(() => (
				<TreeNode {...defaultProps} activeNode={node.id}>
					{defaultRenderer}
				</TreeNode>
			));
			r.expect(baseAssertion.setProperty(WrappedRoot, 'active', true));
		});

		it('raises onActive event', () => {
			const onActive = sinon.stub();
			const r = renderer(() => (
				<TreeNode {...defaultProps} onActive={onActive}>
					{defaultRenderer}
				</TreeNode>
			));
			r.expect(baseAssertion);

			// simulate child event
			r.property(WrappedRoot, 'onRequestActive');
			r.expect(baseAssertion);

			assert(onActive.calledWith(node.id));
		});
	});

	describe('Checkable', () => {
		const onPointerDown = sinon.stub();
		const onCheck = sinon.stub();
		const WrappedCheckbox = wrap(Checkbox);
		const checkboxAssertion = baseAssertion.insertBefore(
			WrappedTitle,
			() =>
				(
					<div onpointerdown={onPointerDown}>
						<WrappedCheckbox checked={false} onValue={noop} disabled={false} />
					</div>
				) as any
		);

		beforeEach(() => {
			onPointerDown.resetHistory();
			onCheck.resetHistory();
		});

		it('renders with checkbox', () => {
			const r = renderer(() => (
				<TreeNode {...defaultProps} checkable={true}>
					{defaultRenderer}
				</TreeNode>
			));
			r.expect(checkboxAssertion);
		});

		it('renders checked', () => {
			const r = renderer(() => (
				<TreeNode {...defaultProps} checkable={true} checkedNodes={[node.id]}>
					{defaultRenderer}
				</TreeNode>
			));
			r.expect(checkboxAssertion.setProperty(WrappedCheckbox, 'checked', true));
		});

		it('renders with disabled checkbox', () => {
			const r = renderer(() => (
				<TreeNode {...defaultProps} checkable={true} disabledNodes={[node.id]}>
					{defaultRenderer}
				</TreeNode>
			));
			r.expect(
				checkboxAssertion
					.setProperty(WrappedRoot, 'disabled', true)
					.setProperty(WrappedCheckbox, 'disabled', true)
			);
		});

		it('raises onCheck event', () => {
			const r = renderer(() => (
				<TreeNode {...defaultProps} onCheck={onCheck} checkable={true}>
					{defaultRenderer}
				</TreeNode>
			));
			r.expect(checkboxAssertion);

			// simulate "check" event
			r.property(WrappedCheckbox, 'onValue', true);
			r.expect(checkboxAssertion);

			assert(onCheck.calledWith(node.id, true));

			// simulate "uncheck" event
			onCheck.resetHistory();
			r.property(WrappedCheckbox, 'onValue', false);
			r.expect(checkboxAssertion);

			assert(onCheck.calledWith(node.id, false));
		});
	});

	describe('Selectable', () => {
		it('renders selected', () => {
			const selectedAssertion = baseAssertion.setProperty(WrappedRoot, 'selected', true);

			const r = renderer(() => (
				<TreeNode {...defaultProps} selectable={true} selectedNode={node.id}>
					{defaultRenderer}
				</TreeNode>
			));
			r.expect(selectedAssertion);
		});

		it('raises onSelect event', () => {
			const onSelect = sinon.stub();
			const r = renderer(() => (
				<TreeNode {...defaultProps} selectable={true} onSelect={onSelect} node={node}>
					{defaultRenderer}
				</TreeNode>
			));
			r.expect(baseAssertion);

			// simulate expanded event
			r.property(WrappedRoot, 'onSelect');
			r.expect(baseAssertion);

			assert(onSelect.calledWith(node.id));
		});

		it('does not raise onSelect when not selectable', () => {
			const onSelect = sinon.stub();
			const r = renderer(() => (
				<TreeNode {...defaultProps} onSelect={onSelect} node={node}>
					{defaultRenderer}
				</TreeNode>
			));
			r.expect(baseAssertion);

			// simulate expanded event
			r.property(WrappedRoot, 'onSelect');
			r.expect(baseAssertion);

			assert(onSelect.notCalled);
		});
	});

	describe('Expansion', () => {
		const expandedAssertion = baseAssertion.setProperty(
			WrappedExpanderIcon,
			'type',
			'downIcon'
		);

		it('renders expanded', () => {
			const r = renderer(() => (
				<TreeNode {...defaultProps} expandedNodes={[node.id]} node={node}>
					{defaultRenderer}
				</TreeNode>
			));

			r.expect(expandedAssertion);
		});

		it('raises expanded event', () => {
			const onExpand = sinon.stub();
			const r = renderer(() => (
				<TreeNode {...defaultProps} onExpand={onExpand} node={node}>
					{defaultRenderer}
				</TreeNode>
			));
			r.expect(baseAssertion);

			// simulate expanded event
			r.property(WrappedRoot, 'onSelect');
			r.expect(baseAssertion);

			assert(onExpand.calledWith(node.id, true));
		});

		it('raises collapsed event', () => {
			const onExpand = sinon.stub();
			const r = renderer(() => (
				<TreeNode
					{...defaultProps}
					expandedNodes={[node.id]}
					onExpand={onExpand}
					node={node}
				>
					{defaultRenderer}
				</TreeNode>
			));
			r.expect(expandedAssertion);

			// simulate collapsed event
			r.property(WrappedRoot, 'onSelect');
			r.expect(expandedAssertion);

			assert(onExpand.calledWith(node.id, false));
		});
	});
});
