const { it, describe } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

import harness from '@dojo/framework/testing/harness/harness';
import * as css from '../../../theme/default/speed-dial.m.css';
import { tsx } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import * as sinon from 'sinon';

import SpeedDial, { SpeedDialIcon } from '../../index';
import FloatingActionButton from '../../../floating-action-button';
import * as fabCss from '../../../theme/default/floating-action-button.m.css';
import { compareTheme, noop } from '../../../common/tests/support/test-helpers';

const actions = () => [<div>Child-1</div>, <div>Child-2</div>];
const baseTemplate = assertionTemplate(() => (
	<div
		key="root"
		classes={[undefined, css.root, false, css.right, false, false]}
		onpointerleave={noop}
	>
		<FloatingActionButton
			key="trigger"
			theme={{
				'@dojo/widgets/floating-action-button': fabCss
			}}
			onOver={noop}
			onClick={noop}
		>
			<SpeedDialIcon assertion-key="speedDialIcon" open={undefined} />
		</FloatingActionButton>
		<div key="actions" classes={[css.actions, css.actionsClosed]}>
			<div key="action-0" classes={[css.action, false, css.closed, undefined]}>
				<div>Child-1</div>
			</div>
			<div key="action-1" classes={[css.action, false, css.closed, undefined]}>
				<div>Child-2</div>
			</div>
		</div>
	</div>
));

describe('SpeedDial', () => {
	it('renders', () => {
		const h = harness(() => <SpeedDial>{{ actions }}</SpeedDial>, [compareTheme]);
		h.expect(baseTemplate);
	});

	it('renders initially open', () => {
		const h = harness(() => <SpeedDial initialOpen={true}>{{ actions }}</SpeedDial>, [
			compareTheme
		]);
		h.expect(
			baseTemplate
				.setProperty('@speedDialIcon', 'open', true)
				.setProperty('@actions', 'classes', [css.actions, false])
				.setProperty('@action-0', 'classes', [css.action, false, false, undefined])
				.setProperty('@action-1', 'classes', [css.action, false, false, undefined])
		);
	});

	it('renders with other directions', () => {
		let h = harness(() => <SpeedDial direction="left">{{ actions }}</SpeedDial>, [
			compareTheme
		]);
		h.expect(
			baseTemplate.setProperty(':root', 'classes', [
				undefined,
				css.root,
				css.left,
				false,
				false,
				false
			])
		);

		h = harness(() => <SpeedDial direction="down">{{ actions }}</SpeedDial>, [compareTheme]);
		h.expect(
			baseTemplate.setProperty(':root', 'classes', [
				undefined,
				css.root,
				false,
				false,
				css.down,
				false
			])
		);

		h = harness(() => <SpeedDial direction="up">{{ actions }}</SpeedDial>, [compareTheme]);
		h.expect(
			baseTemplate.setProperty(':root', 'classes', [
				undefined,
				css.root,
				false,
				false,
				false,
				css.up
			])
		);
	});

	it('renders open', () => {
		const h = harness(() => <SpeedDial open={true}>{{ actions }}</SpeedDial>, [compareTheme]);
		h.expect(
			baseTemplate
				.setProperty('@speedDialIcon', 'open', true)
				.setProperty('@actions', 'classes', [css.actions, false])
				.setProperty('@action-0', 'classes', [css.action, false, false, undefined])
				.setProperty('@action-1', 'classes', [css.action, false, false, undefined])
		);
	});

	it('shows animations when transitioning', () => {
		const h = harness(() => <SpeedDial>{{ actions }}</SpeedDial>, [compareTheme]);
		h.expect(baseTemplate);

		h.trigger('@trigger', 'onOver');
		h.expect(
			baseTemplate
				.setProperty('@speedDialIcon', 'open', true)
				.setProperty('@actions', 'classes', [css.actions, false])
				.setProperty('@action-0', 'classes', [
					css.action,
					css.actionTransition,
					false,
					undefined
				])
				.setProperty('@action-1', 'classes', [
					css.action,
					css.actionTransition,
					false,
					css.action4
				])
		);
		h.trigger('@root', 'onpointerleave');

		h.expect(
			baseTemplate
				.setProperty('@speedDialIcon', 'open', false)
				.setProperty('@action-0', 'classes', [
					css.action,
					css.actionTransition,
					css.closed,
					css.action4
				])
				.setProperty('@action-1', 'classes', [
					css.action,
					css.actionTransition,
					css.closed,
					undefined
				])
		);
	});

	it('opens when clicked', () => {
		const h = harness(() => <SpeedDial>{{ actions }}</SpeedDial>, [compareTheme]);
		h.expect(baseTemplate);

		// Opens on click
		h.trigger('@trigger', 'onClick');
		h.expect(
			baseTemplate
				.setProperty('@speedDialIcon', 'open', true)
				.setProperty('@actions', 'classes', [css.actions, false])
				.setProperty('@action-0', 'classes', [
					css.action,
					css.actionTransition,
					false,
					undefined
				])
				.setProperty('@action-1', 'classes', [
					css.action,
					css.actionTransition,
					false,
					css.action4
				])
		);
		// Closes on second click (pointer leave after onOver)
		h.trigger('@trigger', 'onOver');
		h.trigger('@root', 'onpointerleave');
		h.expect(
			baseTemplate
				.setProperty('@speedDialIcon', 'open', false)
				.setProperty('@action-0', 'classes', [
					css.action,
					css.actionTransition,
					css.closed,
					css.action4
				])
				.setProperty('@action-1', 'classes', [
					css.action,
					css.actionTransition,
					css.closed,
					undefined
				])
		);
		// Same click event, doesn't open
		h.trigger('@trigger', 'onClick');
		h.expect(
			baseTemplate
				.setProperty('@speedDialIcon', 'open', false)
				.setProperty('@action-0', 'classes', [
					css.action,
					css.actionTransition,
					css.closed,
					css.action4
				])
				.setProperty('@action-1', 'classes', [
					css.action,
					css.actionTransition,
					css.closed,
					undefined
				])
		);
		// New click event, opens
		h.trigger('@trigger', 'onClick');
		h.expect(
			baseTemplate
				.setProperty('@speedDialIcon', 'open', true)
				.setProperty('@actions', 'classes', [css.actions, false])
				.setProperty('@action-0', 'classes', [
					css.action,
					css.actionTransition,
					false,
					undefined
				])
				.setProperty('@action-1', 'classes', [
					css.action,
					css.actionTransition,
					false,
					css.action4
				])
		);
	});

	it('calls callbacks when transitioning', () => {
		const onOpen = sinon.spy();
		const onClose = sinon.spy();
		const h = harness(
			() => (
				<SpeedDial onOpen={onOpen} onClose={onClose}>
					{{ actions }}
				</SpeedDial>
			),
			[compareTheme]
		);
		h.expect(baseTemplate);

		h.trigger('@trigger', 'onOver');
		assert.isTrue(onOpen.calledOnce);
		h.trigger('@root', 'onpointerleave');
		assert.isTrue(onClose.calledOnce);
	});

	it('passes close callback and direction to renderer', () => {
		const onClose = sinon.spy();
		const h = harness(
			() => (
				<SpeedDial onClose={onClose}>
					{{
						actions(onClose, direction) {
							onClose();
							return [direction];
						}
					}}
				</SpeedDial>
			),
			[compareTheme]
		);
		h.expect(
			baseTemplate.setChildren('@actions', () => [
				<div key="action-0" classes={[css.action, false, css.closed, undefined]}>
					right
				</div>
			])
		);
		assert.isTrue(onClose.calledOnce);
	});
});
