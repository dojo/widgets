import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import * as themeCss from '../../../theme/default/multi-select-typeahead.m.css';
import { tsx } from '@dojo/framework/core/vdom';
import { compareTheme, createHarness } from '../../../common/tests/support/test-helpers';
import Typeahead from '../../../typeahead';
import { createMemoryTemplate } from '../../../examples/src/widgets/list/memoryTemplate';
import { createResource } from '@dojo/framework/core/resource';
import { stub } from 'sinon';
import { defaultTransform, ListOption, ListItem } from '../../../list';
import MultiSelectTypeahead from '../../../multi-select-typeahead';
import * as typeaheadCss from '../../../theme/default/typeahead.m.css';
import * as chipCss from '../../../theme/default/chip.m.css';
import * as iconCss from '../../../theme/default/icon.m.css';
import * as labelCss from '../../../theme/default/label.m.css';
import Chip from '../../../chip/index';
import Icon from '../../../icon';
import Label from '../../../label';

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
	<div key="root" classes={[undefined, themeCss.root, null, null, null]}>
		<Typeahead
			key="typeahead"
			theme={{
				'@dojo/widgets/typeahead': typeaheadCss
			}}
			itemsInView={undefined}
			position={undefined}
			name={undefined}
			focus={() => false}
			disabled={undefined}
			resource={resource}
			onValue={stub}
			transform={defaultTransform}
			value=""
			onFocus={stub}
			onBlur={stub}
			classes={{
				'@dojo/widgets/text-input': {
					inputWrapper: [themeCss.inputWrapper],
					input: [themeCss.input],
					wrapper: [themeCss.wrapper]
				}
			}}
		>
			{{
				items: stub as any,
				leading: ['test']
			}}
		</Typeahead>
	</div>
));

const hasValueAssertion = baseAssertion.setProperty('@root', 'classes', [
	undefined,
	themeCss.root,
	themeCss.hasValue,
	null,
	null
]);

const disabledAssertion = hasValueAssertion.setProperty('@typeahead', 'disabled', true);

const focusedAssertion = baseAssertion.setProperty('@root', 'classes', [
	undefined,
	themeCss.root,
	null,
	themeCss.focused,
	null
]);

const bottomAssertion = hasValueAssertion.insertAfter('@typeahead', () => [
	<div classes={themeCss.values}>
		<Chip
			theme={{ '@dojo/widgets/chip': chipCss }}
			key="value-cat"
			classes={{ '@dojo/widgets/chip': { root: [themeCss.value] } }}
			onClose={stub}
		>
			{{ label: 'Cat' }}
		</Chip>
	</div>
]);

const labeledAssertion = baseAssertion
	.setProperty('@root', 'classes', [undefined, themeCss.root, null, null, themeCss.hasLabel])
	.insertBefore('@typeahead', () => [
		<Label
			focused={false}
			active={false}
			theme={{ '@dojo/widgets/Label': labelCss }}
			classes={{
				'@dojo/widgets/label': {
					root: [themeCss.label]
				}
			}}
		>
			Label
		</Label>
	]);

registerSuite('MultiSelectTypeahead', {
	tests: {
		'renders an empty multiselecttypeahead'() {
			const h = harness(() => (
				<MultiSelectTypeahead
					resource={resource}
					transform={defaultTransform}
					onValue={noop}
				>
					{}
				</MultiSelectTypeahead>
			));

			h.expect(baseAssertion);
		},

		'renders with an initial value'() {
			const h = harness(() => (
				<MultiSelectTypeahead
					resource={resource}
					transform={defaultTransform}
					onValue={noop}
					initialValue={['cat']}
				>
					{}
				</MultiSelectTypeahead>
			));

			h.expect(hasValueAssertion);

			const chips = h.trigger('@typeahead', (node: any) => () => node.children[0].leading);
			h.expect(
				() => [
					<Chip
						theme={{ '@dojo/widgets/chip': chipCss }}
						key="value-cat"
						classes={{ '@dojo/widgets/chip': { root: [themeCss.value] } }}
						onClose={stub}
					>
						{{ label: 'Cat' }}
					</Chip>
				],
				() => chips
			);

			assert.isTrue(chips[0].children[0].label === 'Cat');
		},

		'renders with controlled values'() {
			const properties = {
				value: ['cat']
			};

			const h = harness(() => (
				<MultiSelectTypeahead
					resource={resource}
					transform={defaultTransform}
					onValue={noop}
					{...properties}
				>
					{}
				</MultiSelectTypeahead>
			));

			h.expect(hasValueAssertion);

			let chips = h.trigger('@typeahead', (node: any) => () => node.children[0].leading);
			h.expect(
				() => [
					<Chip
						theme={{ '@dojo/widgets/chip': chipCss }}
						key="value-cat"
						classes={{ '@dojo/widgets/chip': { root: [themeCss.value] } }}
						onClose={stub}
					>
						{{ label: 'Cat' }}
					</Chip>
				],
				() => chips
			);

			assert.isTrue(chips[0].children[0].label === 'Cat');

			properties.value = ['dog'];

			h.expect(hasValueAssertion);

			chips = h.trigger('@typeahead', (node: any) => () => node.children[0].leading);
			h.expect(
				() => [
					<Chip
						theme={{ '@dojo/widgets/chip': chipCss }}
						key="value-dog"
						classes={{ '@dojo/widgets/chip': { root: [themeCss.value] } }}
						onClose={stub}
					>
						{{ label: 'dog' }}
					</Chip>
				],
				() => chips
			);
		},

		'renders chips with custom renderer'() {
			const h = harness(() => (
				<MultiSelectTypeahead
					resource={resource}
					transform={defaultTransform}
					onValue={noop}
					initialValue={['cat']}
				>
					{{
						selected: (value) => value.toUpperCase()
					}}
				</MultiSelectTypeahead>
			));

			h.expect(hasValueAssertion);

			const chips = h.trigger('@typeahead', (node: any) => () => node.children[0].leading);
			h.expect(
				() => [
					<Chip
						theme={{ '@dojo/widgets/chip': chipCss }}
						key="value-cat"
						classes={{ '@dojo/widgets/chip': { root: [themeCss.value] } }}
						onClose={stub}
					>
						{{ label: 'Cat' }}
					</Chip>
				],
				() => chips
			);

			assert.isTrue(chips[0].children[0].label === 'CAT');
		},

		'closing a chip removes the selection'() {
			const valueStub = stub();

			const h = harness(() => (
				<MultiSelectTypeahead
					resource={resource}
					transform={defaultTransform}
					onValue={valueStub}
					initialValue={['cat']}
				>
					{{
						selected: (value) => value.toUpperCase()
					}}
				</MultiSelectTypeahead>
			));

			h.expect(hasValueAssertion);

			h.trigger('@typeahead', (node: any) => node.children[0].leading[0].properties.onClose);

			assert.isTrue(valueStub.calledWith([]));

			h.expect(baseAssertion);

			const chips = h.trigger('@typeahead', (node: any) => () => node.children[0].leading);
			assert.isTrue(chips.length === 0);
		},

		'selecting a value from the typeahead selects a value'() {
			const valueStub = stub();

			const h = harness(() => (
				<MultiSelectTypeahead
					resource={resource}
					transform={defaultTransform}
					onValue={valueStub}
				>
					{{
						selected: (value) => value.toUpperCase()
					}}
				</MultiSelectTypeahead>
			));

			h.trigger('@typeahead', 'onValue', 'cat');

			assert.isTrue(valueStub.calledWith(['cat']));

			h.expect(hasValueAssertion);

			const chips = h.trigger('@typeahead', (node: any) => () => node.children[0].leading);
			h.expect(
				() => [
					<Chip
						theme={{ '@dojo/widgets/chip': chipCss }}
						key="value-cat"
						classes={{ '@dojo/widgets/chip': { root: [themeCss.value] } }}
						onClose={stub}
					>
						{{ label: 'Cat' }}
					</Chip>
				],
				() => chips
			);
		},

		'selecting a selected value deselects the value'() {
			const valueStub = stub();

			const h = harness(() => (
				<MultiSelectTypeahead
					resource={resource}
					transform={defaultTransform}
					onValue={valueStub}
					initialValue={['cat']}
				>
					{{
						selected: (value) => value.toUpperCase()
					}}
				</MultiSelectTypeahead>
			));

			h.trigger('@typeahead', 'onValue', 'cat');

			assert.isTrue(valueStub.calledWith([]));

			h.expect(baseAssertion);
		},

		'tracks focus'() {
			const h = harness(() => (
				<MultiSelectTypeahead resource={resource} transform={defaultTransform}>
					{}
				</MultiSelectTypeahead>
			));

			h.trigger('@typeahead', 'onFocus');
			h.expect(focusedAssertion);

			h.trigger('@typeahead', 'onBlur');
			h.expect(baseAssertion);
		},

		'the default item renderer shows selected items'() {
			const h = harness(() => (
				<MultiSelectTypeahead
					resource={resource}
					transform={defaultTransform}
					initialValue={['cat']}
				>
					{}
				</MultiSelectTypeahead>
			));

			const itemRenderer = h.trigger('@typeahead', (node: any) => () =>
				node.children[0].items
			);

			h.expect(
				() => (
					<ListItem onSelect={stub()} onRequestActive={stub()} widgetId="">
						<div classes={[themeCss.item, themeCss.selected]}>
							<Icon
								type="checkIcon"
								theme={{ '@dojo/widgets/Icon': iconCss }}
								classes={{
									'@dojo/widgets/icon': {
										icon: [themeCss.selectedIcon]
									}
								}}
							/>
							Cat
						</div>
					</ListItem>
				),
				() =>
					itemRenderer(
						{ value: 'cat', label: 'Cat' },
						{ onSelect: stub(), onRequestActive: stub(), widgetId: '' }
					)
			);

			h.expect(
				() => (
					<ListItem onSelect={stub()} onRequestActive={stub()} widgetId="">
						<div classes={[themeCss.item, null]}>dog</div>
					</ListItem>
				),
				() =>
					itemRenderer(
						{ value: 'dog' },
						{ onSelect: stub(), onRequestActive: stub(), widgetId: '' }
					)
			);
		},

		'uses a custom item renderer'() {
			const h = harness(() => (
				<MultiSelectTypeahead
					resource={resource}
					transform={defaultTransform}
					initialValue={['cat']}
				>
					{{
						items: (item: any) =>
							`Item ${item.value}, selected = ${item.selected ? 'true' : 'false'}`
					}}
				</MultiSelectTypeahead>
			));

			const itemRenderer = h.trigger('@typeahead', (node: any) => () =>
				node.children[0].items
			);

			assert.isTrue(itemRenderer({ value: 'cat' }) === 'Item cat, selected = true');
		},

		'can place chips on the bottom instead of inline'() {
			const h = harness(() => (
				<MultiSelectTypeahead
					resource={resource}
					transform={defaultTransform}
					initialValue={['cat']}
					placement="bottom"
				>
					{}
				</MultiSelectTypeahead>
			));

			h.expect(bottomAssertion);

			const leading = h.trigger('@typeahead', (node: any) => () => node.children[0].leading);
			assert.isUndefined(leading);
		},

		'renders as disabled'() {
			const h = harness(() => (
				<MultiSelectTypeahead
					resource={resource}
					transform={defaultTransform}
					initialValue={['cat']}
					disabled
				>
					{}
				</MultiSelectTypeahead>
			));

			h.expect(disabledAssertion);

			const chips = h.trigger('@typeahead', (node: any) => () => node.children[0].leading);
			h.expect(
				() => [
					<Chip
						theme={{ '@dojo/widgets/chip': chipCss }}
						key="value-cat"
						classes={{ '@dojo/widgets/chip': { root: [themeCss.value] } }}
						onClose={undefined}
					>
						{{ label: 'Cat' }}
					</Chip>
				],
				() => chips
			);
		},

		'renders with labels'() {
			const h = harness(() => (
				<MultiSelectTypeahead resource={resource} transform={defaultTransform}>
					{{
						label: 'Label'
					}}
				</MultiSelectTypeahead>
			));

			h.expect(labeledAssertion);
		}
	}
});
