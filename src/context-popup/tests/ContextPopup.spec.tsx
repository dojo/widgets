const { describe, it, before } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import { tsx } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import harness from '@dojo/framework/testing/harness';
import ContextPopup from '../index';
import Popup from '../../popup';
import * as css from '../../theme/default/context-popup.m.css';
import { stub } from 'sinon';

const baseTemplate = assertionTemplate(() => (
	<virtual>
		<div classes={css.contentWithContext} key="contentWithContext" oncontextmenu={() => {}} />
		<Popup
			key="popup"
			x={0}
			yTop={0}
			yBottom={1100}
			onClose={() => {}}
			position="below"
			open={undefined}
		>
			{{ content: () => undefined }}
		</Popup>
	</virtual>
));

describe('ContextPopup', () => {
	before(() => {
		Object.defineProperty(document.documentElement, 'scrollTop', {
			value: 100,
			configurable: true
		});
		Object.defineProperty(document.documentElement, 'clientHeight', {
			value: 1000,
			configurable: true
		});
	});

	it('Renders with contentWithContext renderer', () => {
		const h = harness(() => (
			<ContextPopup>
				{{
					contentWithContext: () => <div>Some text with a context menu</div>,
					popupContent: () => 'hello world'
				}}
			</ContextPopup>
		));
		const contextContentTemplate = baseTemplate.setChildren('@contentWithContext', () => [
			<div>Some text with a context menu</div>
		]);
		h.expect(contextContentTemplate);
	});

	it('Provides content with close and focus callbacks', () => {
		const onClose = stub();
		const h = harness(() => (
			<ContextPopup onClose={onClose}>
				{{
					contentWithContext: () => undefined,
					popupContent: (onClose, shouldFocus) => (
						<div key="content" tabIndex={0} onblur={onClose} focus={shouldFocus}>
							hello world
						</div>
					)
				}}
			</ContextPopup>
		));
		h.expect(baseTemplate);
		assert.isFalse(
			h.trigger(
				'@popup',
				(node: any) => node.children[0].content().children[0].properties.focus
			)
		);
		h.trigger(
			'@popup',
			(node: any) => node.children[0].content().children[0].properties.onblur
		);
		assert.isTrue(onClose.calledOnce);
	});

	it('calls onOpen and onClose when opened and closed and sets position when opened', () => {
		const onClose = stub();
		const onOpen = stub();
		const h = harness(() => (
			<ContextPopup onOpen={onOpen} onClose={onClose}>
				{{
					contentWithContext: () => undefined,
					popupContent: () => 'hello world'
				}}
			</ContextPopup>
		));
		const event = {
			preventDefault: stub(),
			pageX: 100,
			pageY: 100
		};

		h.trigger('@contentWithContext', 'oncontextmenu', event);
		assert.isTrue(onOpen.calledOnce);
		assert.isTrue(event.preventDefault.calledOnce);
		h.expect(
			baseTemplate
				.setProperty('@popup', 'x', 98)
				.setProperty('@popup', 'yTop', 96)
				.setProperty('@popup', 'open', true)
		);
		h.trigger('@popup', 'onClose');
		assert.isTrue(onClose.calledOnce);
		h.expect(
			baseTemplate
				.setProperty('@popup', 'x', 98)
				.setProperty('@popup', 'yTop', 96)
				.setProperty('@popup', 'open', false)
		);
	});
});
