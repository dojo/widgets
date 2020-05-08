const { describe, it } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import * as sinon from 'sinon';
import { tsx } from '@dojo/framework/core/vdom';
import { RenderResult } from '@dojo/framework/core/interfaces';
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import select from '@dojo/framework/testing/harness/support/selector';
import { createHarness, compareTheme } from '../../common/tests/support/test-helpers';

import Button from '../../button';
import { PopupPosition } from '../../popup';
import TriggerPopup from '../../trigger-popup';
import PopupConfirmation from '../';

import bundle from '../nls/PopupConfirmation';
import * as css from '../../theme/default/popup-confirmation.m.css';

const { messages } = bundle;
const noop = () => {};
const harness = createHarness([compareTheme]);

describe('PopupConfirmation', () => {
	const baseTemplate = assertionTemplate(() => (
		<div classes={[css.root, undefined]}>
			<TriggerPopup key="trigger-popup">
				{{
					trigger: noop as any,
					content: noop as any
				}}
			</TriggerPopup>
		</div>
	));

	const popupTemplate = (
		content: RenderResult,
		cancelText = messages.no,
		confirmText = messages.yes,
		position: PopupPosition = 'below'
	) =>
		assertionTemplate(() => (
			<div classes={[css.popupContainer, css[position]]}>
				<div classes={css.popup}>
					<div classes={css.popupContent}>{content}</div>
					<div classes={css.popupControls}>
						<Button key="cancel-button" type="button" theme={{}} onClick={noop}>
							{cancelText}
						</Button>
						<Button key="confirm-button" type="button" theme={{}} onClick={noop}>
							{confirmText}
						</Button>
					</div>
				</div>
			</div>
		));

	it('Renders', () => {
		const h = harness(() => (
			<PopupConfirmation>
				{{
					trigger: () => <button>Delete</button>,
					content: () => 'Sure?'
				}}
			</PopupConfirmation>
		));

		h.expect(baseTemplate);
	});

	it('Renders with custom trigger', () => {
		const expected = <Button>Do it!</Button>;
		const h = harness(() => (
			<PopupConfirmation>
				{{
					trigger: () => expected,
					content: () => 'Sure?'
				}}
			</PopupConfirmation>
		));

		const actual = h.trigger('@trigger-popup', (node: any) => node.children[0].trigger, noop);
		h.expect(() => expected, () => actual);
	});

	it('Renders content with default controls', () => {
		const content = <div>Confirm dat action</div>;
		const h = harness(() => (
			<PopupConfirmation>
				{{
					trigger: () => 'Delete',
					content: () => content
				}}
			</PopupConfirmation>
		));

		const actual = h.trigger('@trigger-popup', (node: any) => node.children[0].content, noop);
		h.expect(popupTemplate(content), () => actual);
	});

	it('Renders content with custom control labels', () => {
		const content = <div>Confirm dat action</div>;
		const h = harness(() => (
			<PopupConfirmation cancelText="No Go" confirmText="Go Go">
				{{
					trigger: () => 'Delete',
					content: () => content
				}}
			</PopupConfirmation>
		));

		const actual = h.trigger('@trigger-popup', (node: any) => node.children[0].content, noop);
		h.expect(popupTemplate(content, 'No Go', 'Go Go'), () => actual);
	});

	it('Raises event/closes content on cancel', () => {
		const onCancel = sinon.stub();
		const onConfirm = sinon.stub();
		const h = harness(() => (
			<PopupConfirmation onCancel={onCancel} onConfirm={onConfirm}>
				{{
					trigger: () => 'Delete',
					content: () => 'Sure?'
				}}
			</PopupConfirmation>
		));

		const onClose = sinon.stub();
		const cancelButton = select(
			'@cancel-button',
			h.trigger('@trigger-popup', (node: any) => node.children[0].content, onClose)
		)[0];
		cancelButton.properties.onClick();

		assert.isTrue(onCancel.called);
		assert.isTrue(onConfirm.notCalled);
		assert.isTrue(onClose.called);
	});

	it('Raises event/closes content on confirm', () => {
		const onCancel = sinon.stub();
		const onConfirm = sinon.stub();
		const h = harness(() => (
			<PopupConfirmation onCancel={onCancel} onConfirm={onConfirm}>
				{{
					trigger: () => 'Delete',
					content: () => 'Sure?'
				}}
			</PopupConfirmation>
		));

		const onClose = sinon.stub();
		const cancelButton = select(
			'@confirm-button',
			h.trigger('@trigger-popup', (node: any) => node.children[0].content, onClose)
		)[0];
		cancelButton.properties.onClick();

		assert.isTrue(onConfirm.called);
		assert.isTrue(onCancel.notCalled);
		assert.isTrue(onClose.called);
	});
});
