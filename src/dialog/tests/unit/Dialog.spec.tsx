import { Keys } from '../../../common/util';

const { describe, it } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import { tsx } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import Icon from '../../../icon';
import {
	compareAriaLabelledBy,
	compareId,
	createHarness,
	stubEvent
} from '../../../common/tests/support/test-helpers';
import * as themeCss from '../../../theme/default/dialog.m.css';
import * as fixedCss from '../../styles/dialog.m.css';
import * as sinon from 'sinon';

import Dialog, { DialogProperties } from '../../index';
import GlobalEvent from '../../../global-event';

const harness = createHarness([compareId, compareAriaLabelledBy]);

describe('Dialog', () => {
	const closedAssertion = assertionTemplate(() => (
		<body>
			<div key="dialog" classes={[undefined, themeCss.root, null]} />
		</body>
	));
	const openAssertion = assertionTemplate(() => (
		<body>
			<div key="dialog" classes={[undefined, themeCss.root, themeCss.open]}>
				<virtual>
					<GlobalEvent key="global" document={{ keyup: () => {} }} />
					<div
						classes={[null, fixedCss.underlay]}
						enterAnimation={themeCss.underlayEnter}
						exitAnimation={themeCss.underlayExit}
						key="underlay"
						onclick={() => {}}
					/>
					<div
						aria-describedby={undefined}
						aria-labelledby="uuid"
						aria-modal="false"
						classes={[themeCss.main, fixedCss.main]}
						enterAnimation={themeCss.enter}
						exitAnimation={themeCss.exit}
						focus={false}
						key="main"
						role="dialog"
						tabIndex={-1}
					>
						<div classes={themeCss.title} id="uuid" key="title">
							<div>foo</div>
							<button classes={themeCss.close} onclick={() => {}} type="button">
								{'close foo'}
								<span classes={themeCss.closeIcon}>
									<Icon
										type="closeIcon"
										theme={undefined}
										variant={undefined}
										classes={undefined}
									/>
								</span>
							</button>
						</div>
						<div classes={themeCss.content} key="content" id="uuid" />
					</div>
				</virtual>
			</div>
		</body>
	));
	const focusedAssertion = openAssertion.setProperty('@main', 'focus', true);

	it('renders closed', () => {
		const h = harness(() => (
			<Dialog open={false} onRequestClose={() => {}}>
				{{}}
			</Dialog>
		));
		h.expect(closedAssertion);
	});

	it('renders open', () => {
		const h = harness(() => (
			<Dialog open onRequestClose={() => {}}>
				{{ title: 'foo' }}
			</Dialog>
		));
		h.expect(focusedAssertion);
	});

	it('renders with custom properties', () => {
		let properties: DialogProperties = {
			open: true,
			onRequestClose: () => {}
		};
		const h = harness(() => <Dialog {...properties}>{{ title: 'foo' }}</Dialog>);

		// set tested properties
		properties = {
			aria: { describedBy: 'foo' },
			closeText: 'foo',
			open: true,
			role: 'alertdialog',
			underlay: true,
			onRequestClose: () => {}
		};

		h.expect(
			openAssertion
				.replaceChildren('@title', () => [
					<div>foo</div>,
					<button classes={themeCss.close} onclick={() => {}} type="button">
						{'foo'}
						<span classes={themeCss.closeIcon}>
							<Icon
								type="closeIcon"
								theme={undefined}
								variant={undefined}
								classes={undefined}
							/>
						</span>
					</button>
				])
				.setProperty('@underlay', 'classes', [themeCss.underlayVisible, fixedCss.underlay])
				.setProperty('@main', 'aria-describedby', 'foo')
				.setProperty('@main', 'focus', true)
				.setProperty('@main', 'role', 'alertdialog')
				.setProperty('@main', 'aria-modal', 'true')
		);
	});

	it('renders children', () => {
		const h = harness(() => (
			<Dialog closeable open onRequestClose={() => {}}>
				{{ title: 'foo', content: 'test' }}
			</Dialog>
		));

		h.expect(
			openAssertion
				.setProperty('@main', 'focus', true)
				.setChildren('@content', () => ['test'])
		);
	});

	it('calls onRequestClose', () => {
		const onRequestClose = sinon.stub();
		const h = harness(() => (
			<Dialog closeable open onRequestClose={onRequestClose}>
				{{}}
			</Dialog>
		));
		h.trigger(`.${themeCss.close}`, 'onclick', stubEvent);
		assert.isTrue(
			onRequestClose.calledOnce,
			'onRequestClose handler called when close button is clicked'
		);
	});

	it('calls onOpen', () => {
		const onOpen = sinon.stub();
		let properties: any = {
			open: true,
			onOpen,
			onRequestClose: () => {}
		};
		const h = harness(() => <Dialog {...properties}>{{ title: 'foo' }}</Dialog>);
		h.expect(openAssertion.setProperty('@main', 'focus', true));

		assert.isTrue(
			onOpen.calledOnce,
			'onOpen handler called when open is initially set to true'
		);

		properties = {
			closeable: true,
			open: true,
			onOpen,
			onRequestClose: () => {}
		};
		h.expect(openAssertion);
		assert.isTrue(onOpen.calledOnce, 'onOpen handler not called if dialog was previously open');
	});

	it('uses modal property', () => {
		const onRequestClose = sinon.stub();
		let properties: any = {
			open: true,
			modal: true,
			onRequestClose
		};
		const h = harness(() => <Dialog {...properties}>{{}}</Dialog>);
		h.trigger(`.${fixedCss.underlay}`, 'onclick', stubEvent);

		assert.isFalse(
			onRequestClose.called,
			'onRequestClose should not be called when the underlay is clicked and modal is true'
		);

		properties = {
			open: true,
			modal: false,
			onRequestClose
		};

		h.trigger(`.${fixedCss.underlay}`, 'onclick', stubEvent);
		assert.isTrue(
			onRequestClose.called,
			'onRequestClose is called when the underlay is clicked and modal is false'
		);
	});

	it('closes the modal on escape', () => {
		const onRequestClose = sinon.stub();
		const h = harness(() => (
			<Dialog open onRequestClose={onRequestClose}>
				{{}}
			</Dialog>
		));
		h.trigger(
			'@global',
			(node: any) => {
				if (node.properties.document !== undefined) {
					return node.properties.document.keyup;
				}
			},
			{ which: Keys.Down, ...stubEvent }
		);
		assert.isTrue(onRequestClose.notCalled);
		h.trigger(
			'@global',
			(node: any) => {
				if (node.properties.document !== undefined) {
					return node.properties.document.keyup;
				}
			},
			{ which: Keys.Escape, ...stubEvent }
		);
		assert.isTrue(onRequestClose.calledOnce);
	});

	it('renders actions', () => {
		const h = harness(() => (
			<Dialog open onRequestClose={() => {}}>
				{{
					title: 'foo',
					content: 'bar',
					actions: 'action'
				}}
			</Dialog>
		));

		h.expect(
			focusedAssertion
				.setChildren('@content', () => ['bar'])
				.insertAfter('@content', () => [
					<div classes={themeCss.actions} key="actions">
						action
					</div>
				])
		);
	});
});
