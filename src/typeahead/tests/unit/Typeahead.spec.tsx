import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import * as themedCss from '../../../theme/default/typeahead.m.css';
import TriggerPopup from '../../../trigger-popup';
import HelperText from '../../../helper-text';
import { tsx } from '@dojo/framework/core/vdom';
import {
	compareTheme,
	createHarness,
	compareResource
} from '../../../common/tests/support/test-helpers';
import Typeahead from '../../../typeahead';
import List, { ListOption } from '../../../list';
import { stub } from 'sinon';
import TextInput from '../../../text-input';
import * as listCss from '../../../theme/default/list.m.css';
import * as inputCss from '../../../theme/default/text-input.m.css';
import { Keys } from '../../../common/util';
import { createMemoryResourceTemplate } from '@dojo/framework/core/middleware/resources';

const { assert } = intern.getPlugin('chai');

const harness = createHarness([compareTheme, compareResource]);

const { registerSuite } = intern.getInterface('object');
const noop = stub();

const animalOptions: ListOption[] = [
	{ value: 'dog' },
	{ value: 'cat', label: 'Cat' },
	{ value: 'fish', disabled: true }
];

const memoryTemplate = createMemoryResourceTemplate<ListOption>();

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
			activeIndex={0}
			focusable={false}
			disabled={undefined}
			resource={{} as any}
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
				<Typeahead
					resource={{
						template: {
							id: 'test',
							template: memoryTemplate,
							initOptions: { id: '', data: animalOptions }
						}
					}}
					onValue={noop}
				>
					{{ label: 'Test' }}
				</Typeahead>
			));

			h.expect(baseAssertion);
		},

		'renders the typeahead trigger'() {
			const h = harness(() => (
				<Typeahead
					resource={{
						template: {
							id: 'test',
							template: memoryTemplate,
							initOptions: { id: '', data: animalOptions }
						}
					}}
					onValue={noop}
				>
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
				<Typeahead
					resource={{
						template: {
							id: 'test',
							template: memoryTemplate,
							initOptions: { id: '', data: animalOptions }
						}
					}}
					onValue={noop}
				>
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
				<Typeahead
					resource={{
						template: {
							id: 'test',
							template: memoryTemplate,
							initOptions: { id: '', data: animalOptions }
						}
					}}
					onValue={noop}
				>
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

		'shows an option label when the value is entered'() {
			const h = harness(() => (
				<Typeahead
					initialValue="cat"
					resource={{
						template: {
							id: 'test',
							template: memoryTemplate,
							initOptions: { id: '', data: animalOptions }
						}
					}}
					onValue={noop}
				>
					{{ label: 'Test' }}
				</Typeahead>
			));

			h.expect(inputTemplate.setProperty('@trigger', 'initialValue', 'Cat'), () =>
				h.trigger('@popup', (node) => (node.children as any)[0].trigger, stub)
			);
		},

		'shows an option value when the value is entered and there is no label'() {
			const h = harness(() => (
				<Typeahead
					initialValue="dog"
					resource={{
						template: {
							id: 'test',
							template: memoryTemplate,
							initOptions: { id: '', data: animalOptions }
						}
					}}
					onValue={noop}
				>
					{{ label: 'Test' }}
				</Typeahead>
			));

			h.expect(inputTemplate.setProperty('@trigger', 'initialValue', 'dog'), () =>
				h.trigger('@popup', (node) => (node.children as any)[0].trigger, stub)
			);
		},

		'opens the typeahead on input click'() {
			const h = harness(() => (
				<Typeahead
					resource={{
						template: {
							id: 'test',
							template: memoryTemplate,
							initOptions: { id: '', data: animalOptions }
						}
					}}
					onValue={noop}
				>
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
				<Typeahead
					resource={{
						template: {
							id: 'test',
							template: memoryTemplate,
							initOptions: { id: '', data: animalOptions }
						}
					}}
					onValue={noop}
				>
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
				<Typeahead
					resource={{
						template: {
							id: 'test',
							template: memoryTemplate,
							initOptions: { id: '', data: animalOptions }
						}
					}}
					onValue={noop}
				>
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
				<Typeahead
					resource={{
						template: {
							id: 'test',
							template: memoryTemplate,
							initOptions: { id: '', data: animalOptions }
						}
					}}
					onValue={noop}
				>
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
				<Typeahead
					resource={{
						template: {
							id: 'test',
							template: memoryTemplate,
							initOptions: { id: '', data: animalOptions }
						}
					}}
					onValue={noop}
				>
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
				<Typeahead
					resource={{
						template: {
							id: 'test',
							template: memoryTemplate,
							initOptions: { id: '', data: animalOptions }
						}
					}}
					onValue={noop}
				>
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
				<Typeahead
					resource={{
						template: {
							id: 'test',
							template: memoryTemplate,
							initOptions: { id: '', data: animalOptions }
						}
					}}
					onValue={onValue}
				>
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

			h.expect(baseAssertion);

			assert.isTrue(onValue.calledWith(animalOptions[0].value));
		},
		'does not call on value if option is disabled'() {
			const onValue = stub();

			const h = harness(() => (
				<Typeahead
					resource={{
						template: {
							id: 'test',
							template: memoryTemplate,
							initOptions: { id: '', data: animalOptions }
						}
					}}
					strict={false}
					onValue={onValue}
				>
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
			triggerRenderResult.properties.onKeyDown(Keys.Down, preventDefaultStub);
			triggerRenderResult.properties.onKeyDown(Keys.Down, preventDefaultStub);
			triggerRenderResult.properties.onKeyDown(Keys.Enter, preventDefaultStub);

			assert.isTrue(onValue.notCalled);
		},
		'does not call on value if option is disabled and in strict mode'() {
			const onValue = stub();

			const h = harness(() => (
				<Typeahead
					resource={{
						template: {
							id: 'test',
							template: memoryTemplate,
							initOptions: { id: '', data: animalOptions }
						}
					}}
					onValue={onValue}
				>
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
			triggerRenderResult.properties.onKeyDown(Keys.Down, preventDefaultStub);
			triggerRenderResult.properties.onKeyDown(Keys.Down, preventDefaultStub);
			triggerRenderResult.properties.onKeyDown(Keys.Enter, preventDefaultStub);

			assert.isTrue(onValue.notCalled);
		},
		'allows free text when not in strict mode'() {
			const onValue = stub();
			const onValidate = stub();

			const h = harness(() => (
				<Typeahead
					strict={false}
					resource={{
						template: {
							id: 'test',
							template: memoryTemplate,
							initOptions: { id: '', data: animalOptions }
						}
					}}
					onValue={onValue}
					onValidate={onValidate}
				>
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

			triggerRenderResult.properties.onValue('abc');
			triggerRenderResult.properties.onKeyDown(Keys.Enter, preventDefaultStub);

			h.expect(baseAssertion);

			assert.isTrue(onValue.calledWith('abc'));

			onValue.resetHistory();
			triggerRenderResult.properties.onValue('xyz');
			triggerRenderResult.properties.onBlur();

			assert.isTrue(onValue.calledOnceWith('xyz'));

			onValue.resetHistory();
			triggerRenderResult.properties.onValue('');
			triggerRenderResult.properties.onBlur();

			assert.isTrue(onValue.notCalled);
			assert.isTrue(onValidate.calledWith(undefined));
		},
		'validates when using free text and required'() {
			const onValue = stub();
			const onValidate = stub();

			const h = harness(() => (
				<Typeahead
					strict={false}
					required
					resource={{
						template: {
							id: 'test',
							template: memoryTemplate,
							initOptions: { id: '', data: animalOptions }
						}
					}}
					onValue={onValue}
					onValidate={onValidate}
				>
					{{ label: 'Test' }}
				</Typeahead>
			));

			const toggleOpenStub = stub();

			const triggerRenderResult = h.trigger(
				'@popup',
				(node) => (node.children as any)[0].trigger,
				toggleOpenStub
			);

			triggerRenderResult.properties.onValue('');
			triggerRenderResult.properties.onBlur();

			assert.isTrue(onValue.notCalled);
			assert.isTrue(onValidate.calledWith(false));
		},
		'does not select a value on escape'() {
			const onValue = stub();

			const h = harness(() => (
				<Typeahead
					resource={{
						template: {
							id: 'test',
							template: memoryTemplate,
							initOptions: { id: '', data: animalOptions }
						}
					}}
					onValue={onValue}
				>
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
					resource={{
						template: {
							id: 'test',
							template: memoryTemplate,
							initOptions: { id: '', data: animalOptions }
						}
					}}
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
					resource={{
						template: {
							id: 'test',
							template: memoryTemplate,
							initOptions: { id: '', data: animalOptions }
						}
					}}
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
