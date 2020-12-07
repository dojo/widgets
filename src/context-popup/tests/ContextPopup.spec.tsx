const { describe, it, before } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import { tsx } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import harness from '@dojo/framework/testing/harness/harness';
import ContextPopup from '../index';
import Popup from '../../popup';
import * as css from '../../theme/default/context-popup.m.css';
import { stub } from 'sinon';

const baseTemplate = assertionTemplate(() => (
	<virtual>
		<div classes={css.trigger} key="trigger" oncontextmenu={() => {}} />
		<Popup
			theme={undefined}
			variant={undefined}
			classes={undefined}
			key="popup"
			yTop={0}
			yBottom={1100}
			xLeft={0}
			xRight={0}
			onClose={() => {}}
			position="below"
			open={undefined}
		/>
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

	it('Renders with trigger renderer', () => {
		const h = harness(() => (
			<ContextPopup>
				{{
					trigger: <div>Some text with a context menu</div>,
					content: () => 'hello world'
				}}
			</ContextPopup>
		));
		const contextContentTemplate = baseTemplate
			.setChildren('@trigger', () => [<div>Some text with a context menu</div>])
			.setChildren('@popup', () => [<div>hello world</div>]);
		h.expect(contextContentTemplate);
	});

	it('Provides content with close and focus callbacks', () => {
		const onClose = stub();
		const h = harness(() => (
			<ContextPopup onClose={onClose}>
				{{
					trigger: undefined,
					content: ({ close, shouldFocus }) => (
						<div key="content" tabIndex={0} onblur={close} focus={shouldFocus}>
							hello world
						</div>
					)
				}}
			</ContextPopup>
		));
		h.expect(
			baseTemplate.setChildren('@popup', () => [
				<div>
					<div key="content" tabIndex={0} onblur={() => {}} focus={onClose}>
						hello world
					</div>
				</div>
			])
		);
		assert.isFalse(
			h.trigger('@popup', (node: any) => node.children[0].children[0].properties.focus)
		);
		h.trigger('@popup', (node: any) => node.children[0].children[0].properties.onblur);
		assert.isTrue(onClose.calledOnce);
	});

	it('calls onOpen and onClose when opened and closed and sets position when opened', () => {
		const onClose = stub();
		const onOpen = stub();
		const h = harness(() => (
			<ContextPopup onOpen={onOpen} onClose={onClose}>
				{{
					trigger: undefined,
					content: () => 'hello world'
				}}
			</ContextPopup>
		));
		const event = {
			preventDefault: stub(),
			pageX: 100,
			pageY: 100
		};

		h.trigger('@trigger', 'oncontextmenu', event);
		assert.isTrue(onOpen.calledOnce);
		assert.isTrue(event.preventDefault.calledOnce);
		h.expect(
			baseTemplate
				.setProperty('@popup', 'xLeft', 98)
				.setProperty('@popup', 'xRight', 98)
				.setProperty('@popup', 'yTop', 96)
				.setProperty('@popup', 'open', true)
				.setChildren('@popup', () => [<div>hello world</div>])
		);
		h.trigger('@popup', 'onClose');
		assert.isTrue(onClose.calledOnce);
		h.expect(
			baseTemplate
				.setProperty('@popup', 'xLeft', 98)
				.setProperty('@popup', 'xRight', 98)
				.setProperty('@popup', 'yTop', 96)
				.setProperty('@popup', 'open', false)
				.setChildren('@popup', () => [<div>hello world</div>])
		);
	});
});
