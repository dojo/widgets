import { sandbox } from 'sinon';
import { tsx } from '@dojo/framework/core/vdom';
import { createHarness, compareTheme } from '../../common/tests/support/test-helpers';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import { stub } from 'sinon';
import List from '../../list';
import ContextMenu, { defaultTransform } from '../';
import ContextPopup from '../../context-popup';
import { createMemoryTemplate } from '../../examples/src/widgets/list/memoryTemplate';
import { createResource } from '@dojo/framework/core/resource';
const { describe, it, after, afterEach } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

const noop: any = () => {};
const harness = createHarness([compareTheme]);

describe('ContextMenu', () => {
	const sb = sandbox.create();
	const children = <div>Children</div>;
	const options = [{ value: 'foo', label: 'Foo' }];
	const memoryTemplate = createMemoryTemplate();

	const template = assertionTemplate(() => (
		<ContextPopup>
			{{
				trigger: () => null as any,
				content: null as any
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
			<ContextMenu
				resource={{
					resource: () => createResource(memoryTemplate),
					data: options
				}}
				transform={defaultTransform}
				onSelect={noop}
			>
				{children}
			</ContextMenu>
		));

		h.expect(template);
	});

	it('passes a function that returns children as `trigger`', () => {
		const h = harness(() => (
			<ContextMenu
				resource={{
					resource: () => createResource(memoryTemplate),
					data: options
				}}
				transform={defaultTransform}
				onSelect={noop}
			>
				{children}
			</ContextMenu>
		));

		h.expect(template);
		h.expect(
			() => [children],
			() => h.trigger(':root', (node: any) => node.children[0].trigger)
		);
	});

	it('passes a function that renders a menu as `content`', () => {
		const close = stub();
		const onSelect = stub();
		const shouldFocus = stub();
		const h = harness(() => (
			<ContextMenu
				resource={{
					resource: () => createResource(memoryTemplate),
					data: options
				}}
				transform={defaultTransform}
				onSelect={onSelect}
			>
				{children}
			</ContextMenu>
		));

		h.expect(template);
		h.expect(
			() => (
				<List
					key="menu"
					menu
					focus={() => null as any}
					theme={{}}
					resource={{
						resource: () => createResource(memoryTemplate),
						data: options
					}}
					transform={defaultTransform}
					onBlur={() => {}}
					onRequestClose={() => {}}
					onValue={() => {}}
				/>
			),
			() =>
				h.trigger(':root', (node: any) => node.children[0].content, { close, shouldFocus })
		);

		h.trigger(
			':root',
			(node: any) => node.children[0].content({ close, shouldFocus }).properties.onBlur
		);
		assert.isTrue(close.calledOnce);
		close.resetHistory();

		h.trigger(
			':root',
			(node: any) =>
				node.children[0].content({ close, shouldFocus }).properties.onRequestClose
		);
		assert.isTrue(close.calledOnce);
		close.resetHistory();

		h.trigger(
			':root',
			(node: any) => node.children[0].content({ close, shouldFocus }).properties.onValue,
			'value'
		);
		assert.isTrue(close.calledOnce);
		assert.isTrue(onSelect.calledOnceWith('value'));
		close.resetHistory();

		h.trigger(
			':root',
			(node: any) => node.children[0].content({ close, shouldFocus }).properties.focus
		);
		assert.isTrue(shouldFocus.calledOnce);
	});
});
