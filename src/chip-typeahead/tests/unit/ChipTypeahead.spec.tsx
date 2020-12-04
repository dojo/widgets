import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import * as themeCss from '../../../theme/default/chip-typeahead.m.css';
import { tsx } from '@dojo/framework/core/vdom';
import {
	compareTheme,
	createHarness,
	compareResource,
	createTestResource
} from '../../../common/tests/support/test-helpers';
import Typeahead from '../../../typeahead';
import { stub } from 'sinon';
import { ListOption, ListItem } from '../../../list';
import ChipTypeahead from '../..';
import * as typeaheadCss from '../../../theme/default/typeahead.m.css';
import * as chipCss from '../../../theme/default/chip.m.css';
import * as labelCss from '../../../theme/default/label.m.css';
import Chip from '../../../chip/index';
import Label from '../../../label';

const { assert } = intern.getPlugin('chai');

const harness = createHarness([compareTheme, compareResource]);

const { registerSuite } = intern.getInterface('object');
const noop = stub();

const animalOptions: ListOption[] = [
	{ value: '1', label: 'Dog' },
	{ value: '2', label: 'Cat' },
	{ value: '3', label: 'Fish', disabled: true }
];

const baseAssertion = assertionTemplate(() => (
	<div key="root" classes={[undefined, themeCss.root, null, null, null]}>
		<Typeahead
			strict={undefined}
			key="typeahead"
			theme={{
				'@dojo/widgets/typeahead': typeaheadCss
			}}
			itemsInView={undefined}
			position={undefined}
			name={undefined}
			focus={() => false}
			itemDisabled={stub()}
			disabled={undefined}
			resource={{} as any}
			onValue={stub}
			value=""
			onFocus={stub}
			onBlur={stub}
			variant={undefined}
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
			key="value-2"
			classes={{ '@dojo/widgets/chip': { root: [themeCss.value] } }}
			onClose={stub}
			variant={undefined}
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
			variant={undefined}
		>
			Label
		</Label>
	]);

registerSuite('ChipTypeahead', {
	tests: {
		'renders empty'() {
			const h = harness(() => (
				<ChipTypeahead resource={createTestResource(animalOptions)} onValue={noop}>
					{}
				</ChipTypeahead>
			));

			h.expect(baseAssertion);
		},

		'renders with an initial value'() {
			const h = harness(() => (
				<ChipTypeahead
					resource={createTestResource(animalOptions)}
					onValue={noop}
					initialValue={['2']}
				>
					{}
				</ChipTypeahead>
			));

			h.expect(hasValueAssertion);

			const chips = h.trigger('@typeahead', (node: any) => () => node.children[0].leading);
			h.expect(
				() => [
					<Chip
						theme={{ '@dojo/widgets/chip': chipCss }}
						key="value-2"
						classes={{ '@dojo/widgets/chip': { root: [themeCss.value] } }}
						onClose={stub}
						variant={undefined}
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
				value: ['2']
			};

			const h = harness(() => (
				<ChipTypeahead
					resource={createTestResource(animalOptions)}
					onValue={noop}
					{...properties}
				>
					{}
				</ChipTypeahead>
			));

			h.expect(hasValueAssertion);

			let chips = h.trigger('@typeahead', (node: any) => () => node.children[0].leading);
			h.expect(
				() => [
					<Chip
						theme={{ '@dojo/widgets/chip': chipCss }}
						key="value-2"
						classes={{ '@dojo/widgets/chip': { root: [themeCss.value] } }}
						onClose={stub}
						variant={undefined}
					>
						{{ label: 'Cat' }}
					</Chip>
				],
				() => chips
			);

			assert.isTrue(chips[0].children[0].label === 'Cat');

			properties.value = ['1'];

			h.expect(hasValueAssertion);

			chips = h.trigger('@typeahead', (node: any) => () => node.children[0].leading);
			h.expect(
				() => [
					<Chip
						theme={{ '@dojo/widgets/chip': chipCss }}
						key="value-1"
						classes={{ '@dojo/widgets/chip': { root: [themeCss.value] } }}
						onClose={stub}
						variant={undefined}
					>
						{{ label: 'Dog' }}
					</Chip>
				],
				() => chips
			);
		},

		'renders chips with custom renderer'() {
			const h = harness(() => (
				<ChipTypeahead
					resource={createTestResource(animalOptions)}
					onValue={noop}
					initialValue={['2']}
				>
					{{
						selected: (_, label) => label.toUpperCase()
					}}
				</ChipTypeahead>
			));

			h.expect(hasValueAssertion);

			const chips = h.trigger('@typeahead', (node: any) => () => node.children[0].leading);
			h.expect(
				() => [
					<Chip
						theme={{ '@dojo/widgets/chip': chipCss }}
						key="value-2"
						classes={{ '@dojo/widgets/chip': { root: [themeCss.value] } }}
						onClose={stub}
						variant={undefined}
					>
						{{ label: 'Cat' }}
					</Chip>
				],
				() => chips
			);

			assert.strictEqual(chips[0].children[0].label, 'CAT');
		},

		'closing a chip removes the selection'() {
			const valueStub = stub();

			const h = harness(() => (
				<ChipTypeahead
					resource={createTestResource(animalOptions)}
					onValue={valueStub}
					initialValue={['cat']}
				>
					{{
						selected: (value) => value.toUpperCase()
					}}
				</ChipTypeahead>
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
				<ChipTypeahead resource={createTestResource(animalOptions)} onValue={valueStub}>
					{{
						selected: (value) => value && value.toUpperCase()
					}}
				</ChipTypeahead>
			));

			h.trigger('@typeahead', 'onValue', { value: '2', label: 'Cat' });

			assert.isTrue(valueStub.calledWith([{ value: '2', label: 'Cat' }]));

			h.expect(hasValueAssertion);

			const chips = h.trigger('@typeahead', (node: any) => () => node.children[0].leading);
			h.expect(
				() => [
					<Chip
						theme={{ '@dojo/widgets/chip': chipCss }}
						key="value-2"
						classes={{ '@dojo/widgets/chip': { root: [themeCss.value] } }}
						onClose={stub}
						variant={undefined}
					>
						{{ label: 'Cat' }}
					</Chip>
				],
				() => chips
			);
		},

		'tracks focus'() {
			const h = harness(() => (
				<ChipTypeahead resource={createTestResource(animalOptions)}>{}</ChipTypeahead>
			));

			h.trigger('@typeahead', 'onFocus');
			h.expect(focusedAssertion);

			h.trigger('@typeahead', 'onBlur');
			h.expect(baseAssertion);
		},

		'the default item renderer shows selected items'() {
			const h = harness(() => (
				<ChipTypeahead resource={createTestResource(animalOptions)} initialValue={['2']}>
					{}
				</ChipTypeahead>
			));

			const itemRenderer = h.trigger('@typeahead', (node: any) => () =>
				node.children[0].items
			);

			h.expect(
				() => (
					<ListItem
						onSelect={stub()}
						onRequestActive={stub()}
						widgetId=""
						selected={true}
					>
						<div classes={[themeCss.item, themeCss.selected]}>Cat</div>
					</ListItem>
				),
				() =>
					itemRenderer(
						{ value: '2', label: 'Cat' },
						{ onSelect: stub(), onRequestActive: stub(), widgetId: '' }
					)
			);

			h.expect(
				() => (
					<ListItem
						onSelect={stub()}
						onRequestActive={stub()}
						widgetId=""
						selected={false}
					>
						<div classes={[themeCss.item, null]}>Dog</div>
					</ListItem>
				),
				() =>
					itemRenderer(
						{ value: '1', label: 'Dog' },
						{ onSelect: stub(), onRequestActive: stub(), widgetId: '' }
					)
			);
		},

		'uses a custom item renderer'() {
			const h = harness(() => (
				<ChipTypeahead resource={createTestResource(animalOptions)} initialValue={['2']}>
					{{
						items: (item: any) =>
							`Item ${item.label}, selected = ${item.selected ? 'true' : 'false'}`
					}}
				</ChipTypeahead>
			));

			const itemRenderer = h.trigger('@typeahead', (node: any) => () =>
				node.children[0].items
			);

			assert.strictEqual(
				itemRenderer({ value: '2', label: 'Cat' }),
				'Item Cat, selected = true'
			);
		},

		'can place chips on the bottom instead of inline'() {
			const h = harness(() => (
				<ChipTypeahead
					resource={createTestResource(animalOptions)}
					initialValue={['2']}
					placement="bottom"
				>
					{}
				</ChipTypeahead>
			));

			h.expect(bottomAssertion);

			const leading = h.trigger('@typeahead', (node: any) => () => node.children[0].leading);
			assert.isUndefined(leading);
		},

		'renders as disabled'() {
			const h = harness(() => (
				<ChipTypeahead
					resource={createTestResource(animalOptions)}
					initialValue={['2']}
					disabled
				>
					{}
				</ChipTypeahead>
			));

			h.expect(disabledAssertion);

			const chips = h.trigger('@typeahead', (node: any) => () => node.children[0].leading);
			h.expect(
				() => [
					<Chip
						theme={{ '@dojo/widgets/chip': chipCss }}
						key="value-2"
						classes={{ '@dojo/widgets/chip': { root: [themeCss.value] } }}
						onClose={undefined}
						variant={undefined}
					>
						{{ label: 'Cat' }}
					</Chip>
				],
				() => chips
			);
		},

		'renders with labels'() {
			const h = harness(() => (
				<ChipTypeahead resource={createTestResource(animalOptions)}>
					{{
						label: 'Label'
					}}
				</ChipTypeahead>
			));

			h.expect(labeledAssertion);
		},

		'disables items that are selected'() {
			const h = harness(() => (
				<ChipTypeahead resource={createTestResource(animalOptions)} initialValue={['2']}>
					{}
				</ChipTypeahead>
			));

			const disabled = h.trigger('@typeahead', (node: any) => () =>
				node.properties.itemDisabled
			);

			assert.isTrue(disabled({ value: '2', label: 'Cat' }));
			assert.isFalse(disabled({ value: '1', label: 'Dog' }));
		},

		'allows duplicate values if duplicates are allowed'() {
			const h = harness(() => (
				<ChipTypeahead
					resource={createTestResource(animalOptions)}
					initialValue={['cat']}
					duplicates
				>
					{}
				</ChipTypeahead>
			));

			const disabled = h.trigger('@typeahead', (node: any) => () =>
				node.properties.itemDisabled
			);

			assert.isFalse(disabled({ value: '2', label: 'Cat' }));
			assert.isFalse(disabled({ value: '1', label: 'Dog' }));
		},

		'allows duplicate values if not strict'() {
			const h = harness(() => (
				<ChipTypeahead
					resource={createTestResource(animalOptions)}
					initialValue={['cat']}
					strict={false}
					duplicates
				>
					{}
				</ChipTypeahead>
			));

			const disabled = h.trigger('@typeahead', (node: any) => () =>
				node.properties.itemDisabled
			);

			assert.isFalse(disabled({ value: '2', label: 'Cat' }));
			assert.isFalse(disabled({ value: '1', label: 'Dog' }));
		},

		'allows free text values if strict is set to false'() {
			const onValueStub = stub();
			const h = harness(() => (
				<ChipTypeahead
					resource={createTestResource(animalOptions)}
					onValue={onValueStub}
					strict={false}
				>
					{}
				</ChipTypeahead>
			));

			h.trigger('@typeahead', (node: any) => () => {
				node.properties.onValue('abc');
			});

			assert.isTrue(onValueStub.calledWith(['abc']));
		}
	}
});
