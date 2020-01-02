import { sandbox } from 'sinon';
import { tsx } from '@dojo/framework/core/vdom';
import { createHarness, compareTheme } from '../../common/tests/support/test-helpers';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import { stub } from 'sinon';
import Menu from '../../menu';
import ContextMenu from '../';
import ContextPopup from '../../context-popup';
const { describe, it, after, afterEach } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

const noop: any = () => {};
const harness = createHarness([compareTheme]);

describe('ContextMenu', () => {
	const sb = sandbox.create();
	const children = <div>Children</div>;
	const options = [{ value: 'foo', label: 'Foo' }];
	const template = assertionTemplate(() => (
		<ContextPopup>
			{{
				contentWithContext: () => null as any,
				popupContent: null as any
			}}
		</ContextPopup>
	));

	after(() => {
		sb.restore();
	});

	afterEach(() => {
		sb.resetHistory();
	});

	it('renders', () => {
		const h = harness(() => (
			<ContextMenu options={options} onSelect={noop}>
				{children}
			</ContextMenu>
		));

		h.expect(template);
	});

	it('passes a function that returns children as `contentWithContext`', () => {
		const h = harness(() => (
			<ContextMenu options={options} onSelect={noop}>
				{children}
			</ContextMenu>
		));

		h.expect(template);
		h.expect(
			() => [children],
			() => h.trigger(':root', (node: any) => node.children[0].contentWithContext)
		);
	});

	it('passes a function that renders a menu as `popupContent`', () => {
		const onClose = stub();
		const onSelect = stub();
		const shouldFocus = stub();
		const h = harness(() => (
			<ContextMenu options={options} onSelect={onSelect}>
				{children}
			</ContextMenu>
		));

		h.expect(template);
		h.expect(
			() => (
				<Menu
					key="menu"
					focus={() => null as any}
					theme={{}}
					options={options}
					onBlur={() => {}}
					onRequestClose={() => {}}
					onValue={() => {}}
				/>
			),
			() =>
				h.trigger(
					':root',
					(node: any) => node.children[0].popupContent,
					onClose,
					shouldFocus
				)
		);

		h.trigger(
			':root',
			(node: any) => node.children[0].popupContent(onClose, shouldFocus).properties.onBlur
		);
		assert.isTrue(onClose.calledOnce);
		onClose.resetHistory();

		h.trigger(
			':root',
			(node: any) =>
				node.children[0].popupContent(onClose, shouldFocus).properties.onRequestClose
		);
		assert.isTrue(onClose.calledOnce);
		onClose.resetHistory();

		h.trigger(
			':root',
			(node: any) => node.children[0].popupContent(onClose, shouldFocus).properties.onValue,
			'value'
		);
		assert.isTrue(onClose.calledOnce);
		assert.isTrue(onSelect.calledOnceWith('value'));
		onClose.resetHistory();

		h.trigger(
			':root',
			(node: any) => node.children[0].popupContent(onClose, shouldFocus).properties.focus
		);
		assert.isTrue(shouldFocus.calledOnce);
	});
});
