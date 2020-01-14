const { describe, it } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import { stub } from 'sinon';
import { tsx } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import select from '@dojo/framework/testing/support/selector';
import { Keys } from '../../common/util';
import {
	compareAriaControls,
	compareForId,
	compareId,
	compareTheme,
	compareWidgetId,
	createHarness
} from '../../common/tests/support/test-helpers';
import HelperText from '../../helper-text';
import Icon from '../../icon';
import Label from '../../label';
import Menu from '../../menu';
import TriggerPopup from '../../trigger-popup';
import * as css from '../../theme/default/select.m.css';
import Select from '../index';

const options = [{ value: 'dog' }, { value: 'cat' }, { value: 'fish' }];

const harness = createHarness([compareTheme]);

const baseTemplate = assertionTemplate(() => (
	<div classes={[css.root, undefined, false, false]} key="root">
		<TriggerPopup key="popup" onClose={() => {}} onOpen={() => {}} position={undefined}>
			{{ trigger: () => <button />, content: () => <div /> }}
		</TriggerPopup>
		<HelperText key="helperText" text={undefined} valid={undefined} />
	</div>
));

const buttonTemplate = assertionTemplate(() => (
	<button
		focus={() => false}
		aria-controls="anything"
		id="something"
		aria-haspopup="listbox"
		aria-expanded={false}
		key="trigger"
		type="button"
		disabled={undefined}
		classes={css.trigger}
		onclick={() => {}}
		onkeydown={() => {}}
	>
		<span classes={css.value}>
			<span classes={css.placeholder} />
		</span>
		<span classes={css.arrow}>
			<Icon type="downIcon" theme={undefined} classes={undefined} />
		</span>
	</button>
));

const menuTemplate = assertionTemplate(() => (
	<div key="menu-wrapper" classes={css.menuWrapper}>
		<Menu
			key="menu"
			focus={() => false}
			options={options}
			onValue={() => {}}
			onRequestClose={() => {}}
			onBlur={() => {}}
			initialValue={undefined}
			itemsInView={6}
			itemRenderer={undefined}
			theme={{}}
			classes={undefined}
			listBox
			widgetId={'test'}
			total={options.length}
		/>
	</div>
));

describe('Select', () => {
	it('renders', () => {
		const h = harness(() => <Select onValue={() => {}} options={[]} />);
		h.expect(baseTemplate);
	});

	it('takes optional properties', () => {
		const h = harness(
			() => (
				<Select
					onValue={() => {}}
					options={[]}
					itemsInView={10}
					position="above"
					placeholder="test"
					helperText="test-helper"
					label="test-label"
					required={true}
				/>
			),
			[compareForId]
		);

		const optionalPropertyTemplate = baseTemplate
			.prepend('@root', () => [
				<Label
					theme={undefined}
					classes={undefined}
					disabled={undefined}
					forId={'id'}
					valid={undefined}
					required={true}
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

		const h = harness(() => <Select onValue={() => {}} options={[]} />, [
			compareAriaControls,
			compareId
		]);

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

		const h = harness(() => <Select disabled onValue={() => {}} options={[]} />, [
			compareAriaControls,
			compareId
		]);

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

		const h = harness(() => <Select onValue={() => {}} options={[]} />, [
			compareAriaControls,
			compareId
		]);

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

		const ignoreMenuTheme = {
			selector: '@menu',
			property: 'theme',
			comparator: () => true
		};

		const h = harness(() => <Select onValue={() => {}} options={options} />, [
			compareWidgetId,
			ignoreMenuTheme
		]);

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

		const ignoreMenuTheme = {
			selector: '@menu',
			property: 'theme',
			comparator: () => true
		};

		const h = harness(() => <Select onValue={onValueStub} options={options} />, [
			compareWidgetId,
			ignoreMenuTheme
		]);

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
});
