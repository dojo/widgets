const { it, describe } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

import harness from '@dojo/framework/testing/harness/harness';
import * as css from '../../../theme/default/speed-dial.m.css';
import * as fixCss from '../../styles/speed-dial.m.css';
import { tsx } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import * as sinon from 'sinon';

import SpeedDial, { Action } from '../../index';
import FloatingActionButton from '../../../floating-action-button';
import * as fabCss from '../../../theme/default/floating-action-button.m.css';
import { compareTheme, noop } from '../../../common/tests/support/test-helpers';
import Icon from '../../../icon';

const baseTemplate = assertionTemplate(() => (
	<div
		key="root"
		classes={[undefined, css.root, fixCss.root, false, css.right, false, false]}
		onmouseleave={noop}
	>
		<FloatingActionButton
			key="trigger"
			theme={{
				'@dojo/widgets/floating-action-button': fabCss
			}}
			onOver={noop}
			onClick={noop}
			variant={undefined}
			classes={undefined}
		>
			<Icon
				size="large"
				theme={undefined}
				type="plusIcon"
				variant={undefined}
				classes={undefined}
			/>
		</FloatingActionButton>
		<div key="actions" classes={[css.actions, undefined]} onpointerdown={noop}>
			<div
				key="action-wrapper-0"
				styles={{ transitionDelay: '30ms' }}
				classes={[css.action, css.actionTransition]}
			>
				<Action key="edit" onClick={noop}>
					<Icon type="editIcon" />
				</Action>
			</div>
			<div
				key="action-wrapper-1"
				styles={{ transitionDelay: '0ms' }}
				classes={[css.action, css.actionTransition]}
			>
				<Action key="star" onClick={noop}>
					<Icon type="starIcon" />
				</Action>
			</div>
		</div>
	</div>
));

describe('SpeedDial', () => {
	it('renders with actions', () => {
		const h = harness(
			() => (
				<SpeedDial>
					<Action key="edit" onClick={noop}>
						<Icon type="editIcon" />
					</Action>
					<Action key="star" onClick={noop}>
						<Icon type="starIcon" />
					</Action>
				</SpeedDial>
			),
			[compareTheme]
		);
		h.expect(baseTemplate);
	});

	it('renders initially open', () => {
		const h = harness(
			() => (
				<SpeedDial initialOpen>
					<Action key="edit" onClick={noop}>
						<Icon type="editIcon" />
					</Action>
					<Action key="star" onClick={noop}>
						<Icon type="starIcon" />
					</Action>
				</SpeedDial>
			),
			[compareTheme]
		);
		h.expect(
			baseTemplate
				.setProperty('@actions', 'classes', [css.actions, css.open])
				.setProperty('@action-wrapper-0', 'styles', { transitionDelay: '0ms' })
				.setProperty('@action-wrapper-1', 'styles', { transitionDelay: '30ms' })
		);
	});

	it('accepts different transition delay', () => {
		const h = harness(
			() => (
				<SpeedDial delay={50}>
					<Action key="edit" onClick={noop}>
						<Icon type="editIcon" />
					</Action>
					<Action key="star" onClick={noop}>
						<Icon type="starIcon" />
					</Action>
				</SpeedDial>
			),
			[compareTheme]
		);
		h.expect(
			baseTemplate
				.setProperty('@action-wrapper-0', 'styles', { transitionDelay: '50ms' })
				.setProperty('@action-wrapper-1', 'styles', { transitionDelay: '0ms' })
		);
	});

	it('direction up', () => {
		const h = harness(
			() => (
				<SpeedDial direction="up">
					<Action key="edit" onClick={noop}>
						<Icon type="editIcon" />
					</Action>
					<Action key="star" onClick={noop}>
						<Icon type="starIcon" />
					</Action>
				</SpeedDial>
			),
			[compareTheme]
		);
		h.expect(
			baseTemplate.setProperty('@root', 'classes', [
				undefined,
				css.root,
				fixCss.root,
				false,
				false,
				false,
				css.up
			])
		);
	});

	it('direction down', () => {
		const h = harness(
			() => (
				<SpeedDial direction="down">
					<Action key="edit" onClick={noop}>
						<Icon type="editIcon" />
					</Action>
					<Action key="star" onClick={noop}>
						<Icon type="starIcon" />
					</Action>
				</SpeedDial>
			),
			[compareTheme]
		);
		h.expect(
			baseTemplate.setProperty('@root', 'classes', [
				undefined,
				css.root,
				fixCss.root,
				false,
				false,
				css.down,
				false
			])
		);
	});

	it('direction left', () => {
		const h = harness(
			() => (
				<SpeedDial direction="left">
					<Action key="edit" onClick={noop}>
						<Icon type="editIcon" />
					</Action>
					<Action key="star" onClick={noop}>
						<Icon type="starIcon" />
					</Action>
				</SpeedDial>
			),
			[compareTheme]
		);
		h.expect(
			baseTemplate.setProperty('@root', 'classes', [
				undefined,
				css.root,
				fixCss.root,
				css.left,
				false,
				false,
				false
			])
		);
	});

	it('renders controlled open', () => {
		const h = harness(
			() => (
				<SpeedDial open>
					<Action key="edit" onClick={noop}>
						<Icon type="editIcon" />
					</Action>
					<Action key="star" onClick={noop}>
						<Icon type="starIcon" />
					</Action>
				</SpeedDial>
			),
			[compareTheme]
		);
		h.expect(
			baseTemplate
				.setProperty('@actions', 'classes', [css.actions, css.open])
				.setProperty('@action-wrapper-0', 'styles', { transitionDelay: '0ms' })
				.setProperty('@action-wrapper-1', 'styles', { transitionDelay: '30ms' })
		);
	});

	it('opens and closes when clicked', () => {
		const onOpenStub = sinon.stub();
		const onCloseStub = sinon.stub();
		const h = harness(
			() => (
				<SpeedDial onOpen={onOpenStub} onClose={onCloseStub}>
					<Action key="edit" onClick={noop}>
						<Icon type="editIcon" />
					</Action>
					<Action key="star" onClick={noop}>
						<Icon type="starIcon" />
					</Action>
				</SpeedDial>
			),
			[compareTheme]
		);
		h.expect(baseTemplate);

		h.trigger('@trigger', 'onClick');
		h.expect(
			baseTemplate
				.setProperty('@actions', 'classes', [css.actions, css.open])
				.setProperty('@action-wrapper-0', 'styles', { transitionDelay: '0ms' })
				.setProperty('@action-wrapper-1', 'styles', { transitionDelay: '30ms' })
		);

		assert.isTrue(onOpenStub.calledOnce);

		h.trigger('@trigger', 'onClick');
		h.expect(baseTemplate);

		assert.isTrue(onCloseStub.calledOnce);
	});

	it('opens and closes on mouse enter / leave', () => {
		const onOpenStub = sinon.stub();
		const onCloseStub = sinon.stub();
		const h = harness(
			() => (
				<SpeedDial onOpen={onOpenStub} onClose={onCloseStub}>
					<Action key="edit" onClick={noop}>
						<Icon type="editIcon" />
					</Action>
					<Action key="star" onClick={noop}>
						<Icon type="starIcon" />
					</Action>
				</SpeedDial>
			),
			[compareTheme]
		);
		h.expect(baseTemplate);

		h.trigger('@trigger', 'onOver');
		h.expect(
			baseTemplate
				.setProperty('@actions', 'classes', [css.actions, css.open])
				.setProperty('@action-wrapper-0', 'styles', { transitionDelay: '0ms' })
				.setProperty('@action-wrapper-1', 'styles', { transitionDelay: '30ms' })
		);

		assert.isTrue(onOpenStub.calledOnce);

		h.trigger('@root', 'onmouseleave');
		h.expect(baseTemplate);

		assert.isTrue(onCloseStub.calledOnce);
	});

	it('does not close on pointer leave after clicked open', () => {
		const onOpenStub = sinon.stub();
		const onCloseStub = sinon.stub();
		const h = harness(
			() => (
				<SpeedDial onOpen={onOpenStub} onClose={onCloseStub}>
					<Action key="edit" onClick={noop}>
						<Icon type="editIcon" />
					</Action>
					<Action key="star" onClick={noop}>
						<Icon type="starIcon" />
					</Action>
				</SpeedDial>
			),
			[compareTheme]
		);
		h.expect(baseTemplate);

		h.trigger('@trigger', 'onClick');
		const openTemplate = baseTemplate
			.setProperty('@actions', 'classes', [css.actions, css.open])
			.setProperty('@action-wrapper-0', 'styles', { transitionDelay: '0ms' })
			.setProperty('@action-wrapper-1', 'styles', { transitionDelay: '30ms' });
		h.expect(openTemplate);

		assert.isTrue(onOpenStub.calledOnce);

		h.trigger('@root', 'onpointerleave');
		h.expect(openTemplate);

		assert.isTrue(onCloseStub.notCalled);
	});

	it('closes when an action is clicked', () => {
		const onOpenStub = sinon.stub();
		const onCloseStub = sinon.stub();
		const h = harness(
			() => (
				<SpeedDial onOpen={onOpenStub} onClose={onCloseStub}>
					<Action key="edit" onClick={noop}>
						<Icon type="editIcon" />
					</Action>
					<Action key="star" onClick={noop}>
						<Icon type="starIcon" />
					</Action>
				</SpeedDial>
			),
			[compareTheme]
		);
		h.expect(baseTemplate);

		h.trigger('@trigger', 'onClick');
		h.expect(
			baseTemplate
				.setProperty('@actions', 'classes', [css.actions, css.open])
				.setProperty('@action-wrapper-0', 'styles', { transitionDelay: '0ms' })
				.setProperty('@action-wrapper-1', 'styles', { transitionDelay: '30ms' })
		);

		assert.isTrue(onOpenStub.calledOnce);

		h.trigger('@actions', 'onpointerdown');
		h.expect(baseTemplate);

		assert.isTrue(onCloseStub.calledOnce);
	});
});
