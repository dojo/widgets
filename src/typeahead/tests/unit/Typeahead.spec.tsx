import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import * as themedCss from '../../../theme/default/typeahead.m.css';
import TriggerPopup from '../../../trigger-popup';
import HelperText from '../../../helper-text';
import { tsx } from '@dojo/framework/core/vdom';
import { compareTheme, createHarness } from '../../../common/tests/support/test-helpers';
import Typeahead from '../../../typeahead';
import List, { defaultTransform, ListOption } from '../../../list';
import { createMemoryTemplate } from '../../../examples/src/widgets/list/memoryTemplate';
import { createResource } from '@dojo/framework/core/resource';
import { stub } from 'sinon';
import TextInput from '../../../text-input';
import * as listCss from '../../../theme/default/list.m.css';
import * as inputCss from '../../../theme/default/text-input.m.css';
import { Keys } from '../../../common/util';

const { assert } = intern.getPlugin('chai');

const harness = createHarness([compareTheme]);

const { registerSuite } = intern.getInterface('object');
const noop = stub();

const animalOptions: ListOption[] = [
	{ value: 'dog' },
	{ value: 'cat', label: 'Cat' },
	{ value: 'fish', disabled: true }
];

const memoryTemplate = createMemoryTemplate();

const resource = {
	resource: () => createResource(memoryTemplate),
	data: animalOptions
};

const baseAssertion = assertionTemplate(() => (
	<div key="root" classes={[undefined, themedCss.root, undefined, false, false]}>
		<TriggerPopup key="popup" onOpen={noop} onClose={noop} position={undefined}>
			{{
				trigger: noop,
				content: noop
			}}
		</TriggerPopup>
		<HelperText key="helperText" text={undefined} valid={undefined} />
	</div>
));

const inputTemplate = assertionTemplate(() => (
	<TextInput
		onValue={noop}
		onBlur={noop}
		onFocus={noop}
		name={undefined}
		initialValue={undefined}
		focus={noop}
		aria={{
			controls: 'typeahead-list-test',
			haspopup: 'listbox',
			expanded: 'false'
		}}
		key="trigger"
		widgetId="typeahead-trigger-test"
		disabled={undefined}
		classes={{
			'@dojo/widgets/text-input': {
				root: [themedCss.trigger]
			}
		}}
		onClick={noop}
		onKeyDown={noop}
		valid={undefined}
		theme={{ '@dojo/widgets/text-input': inputCss }}
	>
		{{ label: 'Test', leading: undefined }}
	</TextInput>
));

const listTemplate = assertionTemplate(() => (
	<div key="menu-wrapper" classes={themedCss.menuWrapper}>
		<List
			key="menu"
			focusable={false}
			activeIndex={undefined}
			resource={{ resource: resource.resource(), createOptionsWrapper: noop }}
			transform={defaultTransform}
			onValue={noop}
			onRequestClose={noop}
			onBlur={noop}
			initialValue={undefined}
			itemsInView={undefined}
			theme={{ '@dojo/widgets/list': listCss }}
			widgetId={'typeahead-list-test'}
		>
			{}
		</List>
	</div>
));

registerSuite('Typeahead', {
	tests: {
		'renders a typeahead'() {
			const h = harness(() => (
				<Typeahead resource={resource} transform={defaultTransform} onValue={noop}>
					{{ label: 'Test' }}
				</Typeahead>
			));

			h.expect(baseAssertion);
		},

		'renders the typeahead trigger'() {
			const h = harness(() => (
				<Typeahead resource={resource} transform={defaultTransform} onValue={noop}>
					{{ label: 'Test' }}
				</Typeahead>
			));

			const toggleOpenStub = stub();

			const triggerRenderResult = h.trigger(
				'@popup',
				(node) => (node.children as any)[0].trigger,
				toggleOpenStub
			);

			h.expect(inputTemplate, () => triggerRenderResult);
		},

		'renders the typeahead content'() {
			const h = harness(() => (
				<Typeahead resource={resource} transform={defaultTransform} onValue={noop}>
					{{ label: 'Test' }}
				</Typeahead>
			));

			const toggleCloseStub = stub();

			const contentRenderResult = h.trigger(
				'@popup',
				(node) => (node.children as any)[0].content,
				toggleCloseStub
			);

			h.expect(listTemplate, () => contentRenderResult);
		},

		'opens the typeahead on input value'() {
			const h = harness(() => (
				<Typeahead resource={resource} transform={defaultTransform} onValue={noop}>
					{{ label: 'Test' }}
				</Typeahead>
			));

			const toggleOpenStub = stub();

			const triggerRenderResult = h.trigger(
				'@popup',
				(node) => (node.children as any)[0].trigger,
				toggleOpenStub
			);

			triggerRenderResult.properties.onValue('value');

			assert.isTrue(toggleOpenStub.calledOnce);
		},

		'opens the typeahead on input click'() {
			const h = harness(() => (
				<Typeahead resource={resource} transform={defaultTransform} onValue={noop}>
					{{ label: 'Test' }}
				</Typeahead>
			));

			const toggleOpenStub = stub();

			const triggerRenderResult = h.trigger(
				'@popup',
				(node) => (node.children as any)[0].trigger,
				toggleOpenStub
			);

			triggerRenderResult.properties.onClick();

			assert.isTrue(toggleOpenStub.calledOnce);
		},

		'opens the typeahead on down press'() {
			const h = harness(() => (
				<Typeahead resource={resource} transform={defaultTransform} onValue={noop}>
					{{ label: 'Test' }}
				</Typeahead>
			));

			const toggleOpenStub = stub();

			const triggerRenderResult = h.trigger(
				'@popup',
				(node) => (node.children as any)[0].trigger,
				toggleOpenStub
			);

			const preventDefaultStub = stub();

			triggerRenderResult.properties.onKeyDown(Keys.Down, preventDefaultStub);

			assert.isTrue(preventDefaultStub.calledOnce);
			assert.isTrue(toggleOpenStub.calledOnce);
		},
		'opens the typeahead on up press'() {
			const h = harness(() => (
				<Typeahead resource={resource} transform={defaultTransform} onValue={noop}>
					{{ label: 'Test' }}
				</Typeahead>
			));

			const toggleOpenStub = stub();

			const triggerRenderResult = h.trigger(
				'@popup',
				(node) => (node.children as any)[0].trigger,
				toggleOpenStub
			);

			const preventDefaultStub = stub();

			triggerRenderResult.properties.onKeyDown(Keys.Up, preventDefaultStub);

			assert.isTrue(preventDefaultStub.calledOnce);
			assert.isTrue(toggleOpenStub.calledOnce);
		},
		'controls the list with keyboard events'() {
			const h = harness(() => (
				<Typeahead resource={resource} transform={defaultTransform} onValue={noop}>
					{{ label: 'Test' }}
				</Typeahead>
			));

			const toggleOpenStub = stub();
			const toggleCloseStub = stub();
			const preventDefaultStub = stub();

			const triggerRenderResult = h.trigger(
				'@popup',
				(node) => (node.children as any)[0].trigger,
				toggleOpenStub
			);

			// first to open the popup
			triggerRenderResult.properties.onKeyDown(Keys.Down, preventDefaultStub);
			// next to move the active index
			triggerRenderResult.properties.onKeyDown(Keys.Down, preventDefaultStub);

			const contentRenderResult = h.trigger(
				'@popup',
				(node) => (node.children as any)[0].content,
				toggleCloseStub
			);

			h.expect(
				listTemplate.setProperty('@menu', 'activeIndex', 1),
				() => contentRenderResult
			);
		},
		'wraps list items when gets to the top'() {
			const h = harness(() => (
				<Typeahead resource={resource} transform={defaultTransform} onValue={noop}>
					{{ label: 'Test' }}
				</Typeahead>
			));

			const toggleOpenStub = stub();
			const toggleCloseStub = stub();
			const preventDefaultStub = stub();

			const triggerRenderResult = h.trigger(
				'@popup',
				(node) => (node.children as any)[0].trigger,
				toggleOpenStub
			);

			// first to open the popup
			triggerRenderResult.properties.onKeyDown(Keys.Up, preventDefaultStub);
			// second to wrap from the top ot the bottom
			triggerRenderResult.properties.onKeyDown(Keys.Up, preventDefaultStub);

			const contentRenderResult = h.trigger(
				'@popup',
				(node) => (node.children as any)[0].content,
				toggleCloseStub
			);

			h.expect(
				listTemplate.setProperty('@menu', 'activeIndex', 2),
				() => contentRenderResult
			);
		},
		'wraps list items when gets to the bottom'() {
			const h = harness(() => (
				<Typeahead resource={resource} transform={defaultTransform} onValue={noop}>
					{{ label: 'Test' }}
				</Typeahead>
			));

			const toggleOpenStub = stub();
			const toggleCloseStub = stub();
			const preventDefaultStub = stub();

			const triggerRenderResult = h.trigger(
				'@popup',
				(node) => (node.children as any)[0].trigger,
				toggleOpenStub
			);

			// first to open the popup
			triggerRenderResult.properties.onKeyDown(Keys.Down, preventDefaultStub);

			// loop through all options to wrap back to the top
			animalOptions.forEach(() => {
				triggerRenderResult.properties.onKeyDown(Keys.Down, preventDefaultStub);
			});

			const contentRenderResult = h.trigger(
				'@popup',
				(node) => (node.children as any)[0].content,
				toggleCloseStub
			);

			h.expect(
				listTemplate.setProperty('@menu', 'activeIndex', 0),
				() => contentRenderResult
			);
		},
		'selects a value on enter'() {
			const onValue = stub();

			const h = harness(() => (
				<Typeahead resource={resource} transform={defaultTransform} onValue={onValue}>
					{{ label: 'Test' }}
				</Typeahead>
			));

			const toggleOpenStub = stub();
			const preventDefaultStub = stub();

			const triggerRenderResult = h.trigger(
				'@popup',
				(node) => (node.children as any)[0].trigger,
				toggleOpenStub
			);

			// first to open the popup
			triggerRenderResult.properties.onKeyDown(Keys.Down, preventDefaultStub);
			triggerRenderResult.properties.onKeyDown(Keys.Enter, preventDefaultStub);

			assert.isTrue(onValue.calledWith(animalOptions[0].value));
		},
		'does not select a value on escape'() {
			const onValue = stub();

			const h = harness(() => (
				<Typeahead resource={resource} transform={defaultTransform} onValue={onValue}>
					{{ label: 'Test' }}
				</Typeahead>
			));

			const toggleOpenStub = stub();
			const preventDefaultStub = stub();

			const triggerRenderResult = h.trigger(
				'@popup',
				(node) => (node.children as any)[0].trigger,
				toggleOpenStub
			);

			// first to open the popup
			triggerRenderResult.properties.onKeyDown(Keys.Down, preventDefaultStub);
			triggerRenderResult.properties.onKeyDown(Keys.Escape, preventDefaultStub);

			assert.isFalse(onValue.called);
		},

		'allows manual control of values'() {
			const properties = {
				value: 'value'
			};

			const h = harness(() => (
				<Typeahead
					resource={resource}
					transform={defaultTransform}
					onValue={stub}
					{...properties}
				>
					{{ label: 'Test' }}
				</Typeahead>
			));

			let triggerRenderResult = h.trigger(
				'@popup',
				(node) => (node.children as any)[0].trigger,
				stub
			);

			h.expect(
				inputTemplate.setProperty('@trigger', 'initialValue', 'value'),
				() => triggerRenderResult
			);

			properties.value = 'another value';

			triggerRenderResult = h.trigger(
				'@popup',
				(node) => (node.children as any)[0].trigger,
				stub
			);

			h.expect(
				inputTemplate.setProperty('@trigger', 'initialValue', 'another value'),
				() => triggerRenderResult
			);
		},

		'tracks focus and blur'() {
			const onFocus = stub();
			const onBlur = stub();

			const h = harness(() => (
				<Typeahead
					resource={resource}
					transform={defaultTransform}
					onFocus={onFocus}
					onBlur={onBlur}
					onValue={stub()}
				>
					{{ label: 'Test' }}
				</Typeahead>
			));

			let triggerRenderResult = h.trigger(
				'@popup',
				(node) => (node.children as any)[0].trigger,
				stub
			);

			triggerRenderResult.properties.onFocus();

			assert.isTrue(onFocus.called);

			triggerRenderResult.properties.onBlur();

			assert.isTrue(onBlur.called);
		}
	}
});
