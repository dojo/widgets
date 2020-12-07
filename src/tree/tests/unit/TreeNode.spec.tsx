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
	checked: false,
	disabled: false,
	expanded: false,
	selected: false,
	value: undefined,
	parentSelection: true,
	onActive: noop,
	onValue: noop,
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
		theme={undefined}
		classes={undefined}
		variant={undefined}
	>
		<WrappedContentWrapper classes={css.contentWrapper}>
			<WrappedContent classes={css.content}>
				<WrappedExpander classes={css.expander}>
					<WrappedExpanderIcon
						type="rightIcon"
						theme={undefined}
						classes={undefined}
						variant={undefined}
					/>
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
			<TreeNode {...defaultProps} disabled={true}>
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

			assert(onActive.calledWith());
		});
	});

	describe('Checkable', () => {
		const onPointerDown = sinon.spy();
		const onCheck = sinon.stub();
		const WrappedCheckbox = wrap(Checkbox);
		const WrappedCheckboxContainer = wrap('div');
		const checkboxAssertion = baseAssertion.insertBefore(
			WrappedTitle,
			() =>
				(
					<WrappedCheckboxContainer onpointerdown={onPointerDown}>
						<WrappedCheckbox
							checked={false}
							onValue={noop}
							disabled={false}
							variant={undefined}
							theme={undefined}
							classes={undefined}
						/>
					</WrappedCheckboxContainer>
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
				<TreeNode {...defaultProps} checkable={true} checked={true}>
					{defaultRenderer}
				</TreeNode>
			));
			r.expect(checkboxAssertion.setProperty(WrappedCheckbox, 'checked', true));
		});

		it('stops event propagation on pointer down', () => {
			const stopPropagationMock = sinon.stub();
			const r = renderer(() => (
				<TreeNode {...defaultProps} checkable={true}>
					{defaultRenderer}
				</TreeNode>
			));
			r.expect(checkboxAssertion);

			r.property(WrappedCheckboxContainer, 'onpointerdown', {
				stopPropagation: stopPropagationMock
			});
			r.expect(checkboxAssertion);

			assert(stopPropagationMock.called);
		});

		it('renders with disabled checkbox', () => {
			const r = renderer(() => (
				<TreeNode {...defaultProps} checkable={true} disabled={true}>
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

			assert(onCheck.calledWith(true));

			// simulate "uncheck" event
			onCheck.resetHistory();
			r.property(WrappedCheckbox, 'onValue', false);
			r.expect(checkboxAssertion);

			assert(onCheck.calledWith(false));
		});
	});

	describe('Selectable', () => {
		it('renders selected', () => {
			const selectedAssertion = baseAssertion.setProperty(WrappedRoot, 'selected', true);

			const r = renderer(() => (
				<TreeNode {...defaultProps} selectable={true} selected={true} value={node.id}>
					{defaultRenderer}
				</TreeNode>
			));
			r.expect(selectedAssertion);
		});

		it('raises onValue event', () => {
			const onValue = sinon.stub();
			const r = renderer(() => (
				<TreeNode {...defaultProps} selectable={true} onValue={onValue} node={node}>
					{defaultRenderer}
				</TreeNode>
			));
			r.expect(baseAssertion);

			// simulate expanded event
			r.property(WrappedRoot, 'onSelect');
			r.expect(baseAssertion);

			assert(onValue.called);
		});

		it('raises onCheck event when selected', () => {
			const onCheck = sinon.stub();
			const onPointerDown = sinon.stub();
			const WrappedCheckbox = wrap(Checkbox);
			const checkboxAssertion = baseAssertion.insertBefore(
				WrappedTitle,
				() =>
					(
						<div onpointerdown={onPointerDown}>
							<WrappedCheckbox
								checked={false}
								onValue={noop}
								disabled={false}
								variant={undefined}
								theme={undefined}
								classes={undefined}
							/>
						</div>
					) as any
			);

			const r = renderer(() => (
				<TreeNode
					{...defaultProps}
					selectable={true}
					checkable={true}
					onCheck={onCheck}
					node={node}
				>
					{defaultRenderer}
				</TreeNode>
			));
			r.expect(checkboxAssertion);

			// simulate expanded event
			r.property(WrappedRoot, 'onSelect');
			r.expect(checkboxAssertion);

			assert(onCheck.calledWith(true));
		});

		it('does not raise onValue when not selectable', () => {
			const onValue = sinon.stub();
			const r = renderer(() => (
				<TreeNode {...defaultProps} onValue={onValue} node={node}>
					{defaultRenderer}
				</TreeNode>
			));
			r.expect(baseAssertion);

			// simulate expanded event
			r.property(WrappedRoot, 'onSelect');
			r.expect(baseAssertion);

			assert(onValue.notCalled);
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
				<TreeNode {...defaultProps} expanded={true} node={node}>
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

			assert(onExpand.calledWith(true));
		});

		it('raises collapsed event', () => {
			const onExpand = sinon.stub();
			const r = renderer(() => (
				<TreeNode {...defaultProps} expanded={true} onExpand={onExpand} node={node}>
					{defaultRenderer}
				</TreeNode>
			));
			r.expect(expandedAssertion);

			// simulate collapsed event
			r.property(WrappedRoot, 'onSelect');
			r.expect(expandedAssertion);

			assert(onExpand.calledWith(false));
		});
	});

	describe('ParentSelection', () => {
		it('should make uncheckable', () => {
			const onCheck = sinon.stub();
			const r = renderer(() => (
				<TreeNode
					{...defaultProps}
					parentSelection={false}
					checkable={true}
					onCheck={onCheck}
				>
					{defaultRenderer}
				</TreeNode>
			));
			r.expect(baseAssertion);
			r.property(WrappedRoot, 'onSelect');

			r.expect(baseAssertion);

			assert.isTrue(onCheck.notCalled);
		});

		it('should make unselectable', () => {
			const onValue = sinon.stub();
			const r = renderer(() => (
				<TreeNode
					{...defaultProps}
					parentSelection={false}
					checkable={true}
					onValue={onValue}
				>
					{defaultRenderer}
				</TreeNode>
			));
			r.expect(baseAssertion);
			r.property(WrappedRoot, 'onSelect');

			r.expect(baseAssertion);

			assert.isTrue(onValue.notCalled);
		});
	});
});
