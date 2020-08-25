const { describe, it } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import * as sinon from 'sinon';
import { tsx, create } from '@dojo/framework/core/vdom';
import renderer, { assertion, wrap } from '@dojo/framework/testing/renderer';

import Button from '../../button';
import TriggerPopup from '../../trigger-popup';
import PopupConfirmation from '../';

import bundle from '../nls/PopupConfirmation';
import * as buttonCss from '../../theme/default/button.m.css';
import * as css from '../../theme/default/popup-confirmation.m.css';
import i18n from '@dojo/framework/core/middleware/i18n';

const { ' _key': key, ...buttonTheme } = buttonCss as any;
const { messages } = bundle;
const noop = () => {};

describe('PopupConfirmation', () => {
	const TriggerPopupWrap = wrap(TriggerPopup);
	const ContentWrap = wrap('div');
	const CancelButtonWrap = wrap(Button);
	const ConfirmButtonWrap = wrap(Button);
	const baseAssertion = assertion(() => (
		<div classes={[css.root, undefined]}>
			<TriggerPopupWrap key="trigger-popup">
				{{
					trigger: () => <button>Delete</button>,
					content: () => (
						<div classes={[css.popupContainer, css['below']]}>
							<div classes={css.popup}>
								<ContentWrap classes={css.popupContent}>Sure?</ContentWrap>
								<div classes={css.popupControls}>
									<CancelButtonWrap
										key="cancel-button"
										type="button"
										theme={{
											'@dojo/widgets/button': buttonTheme
										}}
										onClick={noop}
									>
										{messages.no}
									</CancelButtonWrap>
									<ConfirmButtonWrap
										key="confirm-button"
										type="button"
										theme={{
											'@dojo/widgets/button': buttonTheme
										}}
										onClick={noop}
									>
										{messages.yes}
									</ConfirmButtonWrap>
								</div>
							</div>
						</div>
					)
				}}
			</TriggerPopupWrap>
		</div>
	));

	it('Renders', () => {
		const r = renderer(() => (
			<PopupConfirmation onConfirm={noop} onCancel={noop}>
				{{
					trigger: () => <button>Delete</button>,
					content: 'Sure?'
				}}
			</PopupConfirmation>
		));

		r.child(TriggerPopupWrap, {
			trigger: [noop],
			content: [noop, 'below']
		});

		r.expect(baseAssertion);
	});

	it('Raises event/closes content on confirm', () => {
		const onCancel = sinon.stub();
		const onConfirm = sinon.stub();
		const r = renderer(() => (
			<PopupConfirmation onCancel={onCancel} onConfirm={onConfirm}>
				{{
					trigger: () => <button>Delete</button>,
					content: 'Sure?'
				}}
			</PopupConfirmation>
		));

		const onClose = sinon.stub();
		r.child(TriggerPopupWrap, {
			trigger: [noop],
			content: [onClose, 'below']
		});
		r.expect(baseAssertion);

		r.property(ConfirmButtonWrap, 'onClick');
		r.expect(baseAssertion);

		assert.isTrue(onCancel.notCalled);
		assert.isTrue(onConfirm.called);
		assert.isTrue(onClose.called);
	});

	it('Raises event/closes content on cancel', () => {
		const onCancel = sinon.stub();
		const onConfirm = sinon.stub();
		const r = renderer(() => (
			<PopupConfirmation onCancel={onCancel} onConfirm={onConfirm}>
				{{
					trigger: () => <button>Delete</button>,
					content: 'Sure?'
				}}
			</PopupConfirmation>
		));

		const onClose = sinon.stub();
		r.child(TriggerPopupWrap, {
			trigger: [noop],
			content: [onClose, 'below']
		});
		r.expect(baseAssertion);

		r.property(CancelButtonWrap, 'onClick');
		r.expect(baseAssertion);

		assert.isTrue(onCancel.called);
		assert.isTrue(onConfirm.notCalled);
		assert.isTrue(onClose.called);
	});
});
