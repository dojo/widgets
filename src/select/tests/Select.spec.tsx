const { describe, it } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import { stub } from 'sinon';
import { tsx } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import select from '@dojo/framework/testing/harness/support/selector';
import { Keys } from '../../common/util';
import {
	compareAriaControls,
	compareForId,
	compareId,
	compareTheme,
	compareWidgetId,
	createHarness,
	compareResource,
	createTestResource
} from '../../common/tests/support/test-helpers';
import HelperText from '../../helper-text';
import Icon from '../../icon';
import Label from '../../label';
import List from '../../list';
import TriggerPopup from '../../trigger-popup';
import * as css from '../../theme/default/select.m.css';
import Select from '../index';
import bundle from '../nls/Select';
import { createResourceTemplate, defaultFind } from '@dojo/framework/core/middleware/resources';

const options = [{ value: 'dog' }, { value: 'cat' }, { value: 'fish' }];
const { messages } = bundle;

const harness = createHarness([compareTheme, compareResource]);

const baseTemplate = assertionTemplate(() => (
	<div classes={[undefined, css.root, undefined, false, false, false, undefined]} key="root">
		<TriggerPopup
			variant={undefined}
			classes={undefined}
			theme={undefined}
			key="popup"
			onClose={() => {}}
			onOpen={() => {}}
			position={undefined}
		>
			{{ trigger: () => <button />, content: () => <div /> }}
		</TriggerPopup>
		<HelperText
			variant={undefined}
			classes={undefined}
			theme={undefined}
			key="helperText"
			text={undefined}
			valid={undefined}
		/>
	</div>
));

const buttonTemplate = assertionTemplate(() => (
	<button
		focus={() => false}
		aria-controls="anything"
		id="something"
		aria-haspopup="listbox"
		aria-expanded="false"
		key="trigger"
		type="button"
		disabled={undefined}
		classes={css.trigger}
		onclick={() => {}}
		onkeydown={() => {}}
		name={undefined}
		value={undefined}
	>
		<span classes={[css.value, undefined]}>
			<span classes={css.placeholder} />
		</span>
		<span classes={css.arrow}>
			<Icon type="downIcon" theme={{}} classes={undefined} variant={undefined} />
		</span>
	</button>
));

const ignoreMenuTheme = {
	selector: '@menu',
	property: 'theme',
	comparator: () => true
};

const menuTemplate = assertionTemplate(() => (
	<div key="menu-wrapper" classes={css.menuWrapper}>
		<List
			key="menu"
			height="auto"
			focus={() => false}
			resource={createTestResource(options)}
			onValue={() => {}}
			onRequestClose={() => {}}
			onBlur={() => {}}
			initialValue={undefined}
			itemsInView={6}
			theme={{}}
			classes={undefined}
			variant={undefined}
			widgetId={'test'}
		/>
	</div>
));

describe('Select', () => {
	it('renders', () => {
		const h = harness(() => (
			<Select onValue={() => {}} resource={createTestResource(options)} />
		));
		h.expect(baseTemplate);
	});

	it('takes optional properties', () => {
		const h = harness(
			() => (
				<Select
					onValue={() => {}}
					resource={createTestResource(options)}
					itemsInView={10}
					position="above"
					placeholder="test"
					helperText="test-helper"
					required={true}
				>
					{{ label: 'test-label' }}
				</Select>
			),
			[compareForId]
		);

		const optionalPropertyTemplate = baseTemplate
			.prepend('@root', () => [
				<Label
					theme={{}}
					classes={undefined}
					variant={undefined}
					disabled={undefined}
					forId={'id'}
					valid={undefined}
					required={true}
					active={false}
					focused={false}
				>
					test-label
				</Label>
			])

			.setProperty('@popup', 'position', 'above')
			.setProperty('@helperText', 'text', 'test-helper');

		h.expect(optionalPropertyTemplate);
	});

	it('calls toggle open on trigger click', () => {
		const toggleOpenStub = stub();

		const h = harness(
			() => <Select onValue={() => {}} resource={createTestResource(options)} />,
			[compareAriaControls, compareId]
		);

		const triggerRenderResult = h.trigger(
			'@popup',
			(node) => (node.children as any)[0].trigger,
			toggleOpenStub
		);
		h.expect(buttonTemplate, () => triggerRenderResult);
		triggerRenderResult.properties.onclick();
		assert.isTrue(toggleOpenStub.calledOnce);
	});

	it('does not call toggle open on trigger click when disabled', () => {
		const toggleOpenStub = stub();

		const h = harness(
			() => <Select disabled onValue={() => {}} resource={createTestResource(options)} />,
			[compareAriaControls, compareId]
		);

		const triggerRenderResult = h.trigger(
			'@popup',
			(node) => (node.children as any)[0].trigger,
			toggleOpenStub
		);

		const disabledButtonTemplate = buttonTemplate.setProperty('@trigger', 'disabled', true);
		h.expect(disabledButtonTemplate, () => triggerRenderResult);
		triggerRenderResult.properties.onclick();
		assert.isTrue(toggleOpenStub.notCalled);
	});

	it('opens menu on down/space/enter', () => {
		const toggleOpenStub = stub();

		const h = harness(
			() => <Select onValue={() => {}} resource={createTestResource(options)} />,
			[compareAriaControls, compareId]
		);

		const triggerRenderResult = h.trigger(
			'@popup',
			(node) => (node.children as any)[0].trigger,
			toggleOpenStub
		);

		triggerRenderResult.properties.onkeydown({ which: Keys.Down, preventDefault: stub() });
		assert.isTrue(toggleOpenStub.calledOnce);
		toggleOpenStub.resetHistory();

		triggerRenderResult.properties.onkeydown({ which: Keys.Space, preventDefault: stub() });
		assert.isTrue(toggleOpenStub.calledOnce);
		toggleOpenStub.resetHistory();

		triggerRenderResult.properties.onkeydown({ which: Keys.Enter, preventDefault: stub() });
		assert.isTrue(toggleOpenStub.calledOnce);
		toggleOpenStub.resetHistory();

		triggerRenderResult.properties.onkeydown({ which: Keys.Left });
		triggerRenderResult.properties.onkeydown({ which: Keys.Right });
		triggerRenderResult.properties.onkeydown({ which: 'a' });
		triggerRenderResult.properties.onkeydown({ which: 'z' });
		assert.isTrue(toggleOpenStub.notCalled);
	});

	it('creates menu content and closes on blur', () => {
		const closeMenuStub = stub();

		const h = harness(
			() => <Select onValue={() => {}} resource={createTestResource(options)} />,
			[compareWidgetId, ignoreMenuTheme]
		);

		const menuRenderResult = h.trigger(
			'@popup',
			(node) => (node.children as any)[0].content,
			closeMenuStub
		);

		h.expect(menuTemplate, () => menuRenderResult);
		const [menu] = select('@menu', menuRenderResult);

		menu.properties.onBlur();
		assert.isTrue(closeMenuStub.calledOnce);
	});

	it('calls onValue when a menu item is selected', () => {
		const onValueStub = stub();
		const closeMenuStub = stub();

		const h = harness(
			() => <Select onValue={onValueStub} resource={createTestResource(options)} />,
			[compareWidgetId, ignoreMenuTheme]
		);

		const menuRenderResult = h.trigger(
			'@popup',
			(node) => (node.children as any)[0].content,
			closeMenuStub
		);

		h.expect(menuTemplate, () => menuRenderResult);
		const [menu] = select('@menu', menuRenderResult);

		menu.properties.onValue('cat');
		assert.isTrue(closeMenuStub.calledOnce);
		assert.isTrue(onValueStub.calledOnceWith('cat'));
	});

	it('displays an optional label when available', async () => {
		const onValueStub = stub();
		const toggleOpenStub = stub();

		const data = [{ value: 'dog', label: 'Dog' }, { value: 'cat' }, { value: 'fish' }];

		let res: any;
		const testResource = {
			template: {
				id: 'test',
				template: createResourceTemplate<any>({
					find: defaultFind,
					read: (req, { put }) => {
						new Promise((r) => {
							res = r;
						}).then(() => {
							put({ data, total: data.length }, req);
						});
					}
				})
			}
		};

		const h = harness(
			() => <Select onValue={onValueStub} resource={testResource} initialValue="dog" />,
			[compareAriaControls, compareId]
		);
		h.trigger('@popup', (node) => (node.children as any)[0].trigger, toggleOpenStub);
		await res();
		const triggerRenderResult = h.trigger(
			'@popup',
			(node) => (node.children as any)[0].trigger,
			toggleOpenStub
		);
		h.expect(
			buttonTemplate.setProperty('@trigger', 'value', 'dog').setChildren('@trigger', () => [
				<span classes={[css.value, false]}>Dog</span>,
				<span classes={css.arrow}>
					<Icon type="downIcon" theme={{}} classes={undefined} variant={undefined} />
				</span>
			]),
			() => triggerRenderResult
		);
	});

	it('renders with a value property', () => {
		const onValueStub = stub();
		const toggleOpenStub = stub();

		const options = [{ value: 'dog', label: 'Dog' }, { value: 'cat' }, { value: 'fish' }];

		const h = harness(
			() => (
				<Select onValue={onValueStub} resource={createTestResource(options)} value="dog" />
			),
			[compareAriaControls, compareId]
		);

		const triggerRenderResult = h.trigger(
			'@popup',
			(node) => (node.children as any)[0].trigger,
			toggleOpenStub
		);

		h.expect(
			buttonTemplate.setProperty('@trigger', 'value', 'dog').setChildren('@trigger', () => [
				<span classes={[css.value, undefined]}>Dog</span>,
				<span classes={css.arrow}>
					<Icon type="downIcon" theme={{}} classes={undefined} variant={undefined} />
				</span>
			]),
			() => triggerRenderResult
		);
	});

	it('invalidates correctly', () => {
		const onValidate = stub();
		const h = harness(() => (
			<Select
				onValue={() => {}}
				resource={createTestResource(options)}
				required={true}
				onValidate={onValidate}
			/>
		));
		h.expect(baseTemplate);

		h.trigger('@popup', 'onClose');
		h.expect(
			baseTemplate
				.setProperty(':root', 'classes', [
					undefined,
					css.root,
					undefined,
					false,
					css.invalid,
					false,
					false
				])
				.setProperty('@helperText', 'text', messages.requiredMessage)
				.setProperty('@helperText', 'valid', false)
		);

		assert.isTrue(onValidate.calledWith(false));
	});
});
