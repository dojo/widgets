import { sandbox } from 'sinon';
import { node, tsx } from '@dojo/framework/core/vdom';
import dojoHarness from '@dojo/framework/testing/harness';
import { createHarness, compareTheme } from '../../common/tests/support/test-helpers';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import * as fixedCss from '../context-menu.m.css';
import * as css from '../../theme/default/context-menu.m.css';
import * as menuCss from '../../theme/default/menu.m.css';
import Menu from '../../menu';
import ContextMenu from '../';
import createNodeMock from '@dojo/framework/testing/mocks/middleware/node';
const { describe, it, beforeEach, after, afterEach } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

const noop: any = () => {};
const harness = createHarness([compareTheme]);

describe('ContextMenu', () => {
	const sb = sandbox.create();
	const children = <div>Children</div>;
	const options = [{ value: 'foo', label: 'Foo' }];
	const event: any = {
		preventDefault: sb.spy(),
		pageX: 20,
		pageY: 20
	};
	const template = assertionTemplate(() => (
		<virtual>
			<div key="content" classes={css.contentWrapper} oncontextmenu={noop}>
				{children}
			</div>
		</virtual>
	));
	const openTemplate = template.append(':root', () => [
		<body>
			<div key="underlay" classes={fixedCss.underlay} onclick={noop} />
			<div
				key="wrapper"
				classes={[fixedCss.root, css.wrapper]}
				styles={{
					top: '16px',
					left: '18px',
					opacity: '0'
				}}
			>
				<Menu
					key="menu"
					focus={() => false}
					theme={{}}
					options={options}
					onBlur={noop}
					onRequestClose={noop}
					onValue={noop}
				/>
			</div>
		</body>
	]);

	beforeEach(() => {
		Object.defineProperty(document.documentElement, 'scrollTop', {
			configurable: true,
			value: 0
		});
		Object.defineProperty(document.documentElement, 'clientHeight', {
			configurable: true,
			value: 1000
		});
	});

	after(() => {
		sb.restore();
	});

	afterEach(() => {
		sb.resetHistory();
	});

	it('renders closed by default', () => {
		const h = harness(() => (
			<ContextMenu options={options} onSelect={noop}>
				{children}
			</ContextMenu>
		));

		h.expect(template);
	});

	it('renders with an open menu with opacity 0 after context menu event is triggered', () => {
		const h = harness(() => (
			<ContextMenu options={options} onSelect={noop}>
				{children}
			</ContextMenu>
		));

		h.expect(template);
		h.trigger('@content', 'oncontextmenu', event);
		assert.isTrue(event.preventDefault.calledOnce);
		h.expect(openTemplate);
	});

	it('renders with opacity 1 and matched size / position with dimensions', () => {
		const mockNode = createNodeMock();

		const wrapper = {
			getBoundingClientRect() {
				return {
					width: 100,
					height: 100
				};
			}
		};

		mockNode('wrapper', wrapper);

		const h = dojoHarness(
			() => (
				<ContextMenu options={options} onSelect={noop}>
					{children}
				</ContextMenu>
			),
			{ middleware: [[node, mockNode]] }
		);
		h.trigger('@content', 'oncontextmenu', event);

		const contentTemplate = openTemplate
			.setProperty('@wrapper', 'styles', {
				top: '16px',
				left: '18px',
				opacity: '1'
			})
			.setProperty('@menu', 'theme', {
				'@dojo/widgets/menu': {
					menu: menuCss.menu
				}
			});

		h.expect(contentTemplate);
	});

	it('adjusts position if it cannot render under the cursor', () => {
		Object.defineProperty(document.documentElement, 'clientHeight', {
			configurable: true,
			value: 5
		});
		const mockNode = createNodeMock();

		const wrapper = {
			getBoundingClientRect() {
				return {
					width: 100,
					height: 6
				};
			}
		};

		mockNode('wrapper', wrapper);

		const h = dojoHarness(
			() => (
				<ContextMenu options={options} onSelect={noop}>
					{children}
				</ContextMenu>
			),
			{ middleware: [[node, mockNode]] }
		);
		h.trigger('@content', 'oncontextmenu', event);

		const contentTemplate = openTemplate
			.setProperty('@wrapper', 'styles', {
				top: '10px',
				left: '18px',
				opacity: '1'
			})
			.setProperty('@menu', 'theme', {
				'@dojo/widgets/menu': {
					menu: menuCss.menu
				}
			});

		h.expect(contentTemplate);
	});

	it('closes when the underlay is clicked', () => {
		const h = harness(() => (
			<ContextMenu options={options} onSelect={noop}>
				{children}
			</ContextMenu>
		));

		h.expect(template);
		h.trigger('@content', 'oncontextmenu', event);
		h.expect(openTemplate);
		h.trigger('@underlay', 'onclick');
		h.expect(template);
	});

	it('closes when the menu is blurred', () => {
		const h = harness(() => (
			<ContextMenu options={options} onSelect={noop}>
				{children}
			</ContextMenu>
		));

		h.expect(template);
		h.trigger('@content', 'oncontextmenu', event);
		h.expect(openTemplate);
		h.trigger('@menu', 'onBlur');
		h.expect(template);
	});

	it('closes when a the menus onRequestClose fires', () => {
		const h = harness(() => (
			<ContextMenu options={options} onSelect={noop}>
				{children}
			</ContextMenu>
		));

		h.expect(template);
		h.trigger('@content', 'oncontextmenu', event);
		h.expect(openTemplate);
		h.trigger('@menu', 'onRequestClose');
		h.expect(template);
	});

	it('calls the provided onSelect callback and closes on the menu onValue callback fires', () => {
		const onSelect = sb.spy();
		const value = 'foo';
		const h = harness(() => (
			<ContextMenu options={options} onSelect={onSelect}>
				{children}
			</ContextMenu>
		));

		h.expect(template);
		h.trigger('@content', 'oncontextmenu', event);
		h.expect(openTemplate);
		h.trigger('@menu', 'onValue', value);
		h.expect(template);

		assert.isTrue(onSelect.calledOnceWith(value));
	});
});
