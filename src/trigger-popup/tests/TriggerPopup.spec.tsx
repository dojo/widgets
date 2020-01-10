const { describe, it, before } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import { tsx, node } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import createNodeMock from '@dojo/framework/testing/mocks/middleware/node';
import harness from '@dojo/framework/testing/harness';
import TriggerPopup from '../index';
import Popup from '../../popup';
import * as fixedCss from '../trigger-popup.m.css';
import { stub } from 'sinon';

const baseTemplate = assertionTemplate(() => (
	<virtual>
		<span key="trigger" classes={fixedCss.trigger} />
		<Popup key="popup" x={0} yTop={0} yBottom={0} onClose={() => {}} open={undefined}>
			{{ content: () => undefined }}
		</Popup>
	</virtual>
));

describe('TriggerPopup', () => {
	before(() => {
		Object.defineProperty(document.documentElement, 'scrollTop', {
			value: 0,
			configurable: true
		});
		Object.defineProperty(document.documentElement, 'clientHeight', {
			value: 1000,
			configurable: true
		});
	});

	it('Renders with trigger renderer', () => {
		const h = harness(() => (
			<TriggerPopup>
				{{
					trigger: (onToggleOpen) => <button onclick={onToggleOpen} />,
					content: () => 'hello world'
				}}
			</TriggerPopup>
		));
		const triggerTemplate = baseTemplate.setChildren('@trigger', () => [
			<button onclick={() => {}} />
		]);
		h.expect(triggerTemplate);
	});

	it('calls onOpen and onClose when opened and closed', () => {
		const onClose = stub();
		const onOpen = stub();
		const h = harness(() => (
			<TriggerPopup onOpen={onOpen} onClose={onClose}>
				{{
					trigger: (onToggleOpen) => <button onclick={onToggleOpen} />,
					content: () => 'hello world'
				}}
			</TriggerPopup>
		));

		const triggerTemplate = baseTemplate.setChildren('@trigger', () => [
			<button onclick={() => {}} />
		]);
		h.trigger('@trigger button', 'onclick');
		assert.isTrue(onOpen.calledOnce);
		h.expect(triggerTemplate.setProperty('@popup', 'open', true));
		h.trigger('@popup', 'onClose');
		assert.isTrue(onClose.calledOnce);
		h.expect(triggerTemplate.setProperty('@popup', 'open', false));
	});

	it('renders with matched size with dimensions', () => {
		const mockNode = createNodeMock();

		const trigger = {
			getBoundingClientRect() {
				return {
					bottom: 0,
					left: 50,
					top: 50,
					right: 0,
					width: 150,
					height: 50
				};
			}
		};

		mockNode('trigger', trigger);

		const h = harness(
			() => (
				<TriggerPopup>
					{{
						trigger: () => undefined,
						content: () => 'hello world'
					}}
				</TriggerPopup>
			),
			{ middleware: [[node, mockNode]] }
		);
		const contentTemplate = baseTemplate
			.setProperty('@popup', 'x', 50)
			.setProperty('@popup', 'yTop', 100)
			.setProperty('@popup', 'yBottom', 50);

		h.expect(contentTemplate);

		h.expect(
			() => (
				<div key="trigger-wrapper" styles={{ width: '150px' }}>
					hello world
				</div>
			),
			() => h.trigger('@popup', (node: any) => node.children[0].content)
		);
	});
	it('renders with unmatched size', () => {
		const h = harness(() => (
			<TriggerPopup matchWidth={false}>
				{{
					trigger: () => undefined,
					content: () => 'hello world'
				}}
			</TriggerPopup>
		));

		h.expect(baseTemplate);

		h.expect(
			() => (
				<div key="trigger-wrapper" styles={{ width: 'auto' }}>
					hello world
				</div>
			),
			() => h.trigger('@popup', (node: any) => node.children[0].content)
		);
	});

	it('passes properties through', () => {
		const h = harness(() => (
			<TriggerPopup underlayVisible>
				{{
					trigger: () => undefined,
					content: () => 'hello world'
				}}
			</TriggerPopup>
		));

		h.expect(baseTemplate.setProperty('@popup', 'underlayVisible', true));
	});
});
