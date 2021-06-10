const { describe, it, afterEach } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import { sandbox } from 'sinon';
import { tsx } from '@dojo/framework/core/vdom';
import { renderer, assertion, wrap, compare } from '@dojo/framework/testing/renderer';

import Typeahead from '../../index';
import TriggerPopup from '../../../trigger-popup';
import HelperText from '../../../helper-text';
import TextInput from '../../../text-input';
import Icon from '../../../icon';
import { noop } from '../../../common/tests/support/test-helpers';

import * as css from '../../../theme/default/typeahead.m.css';
import * as inputCss from '../../../theme/default/text-input.m.css';
import * as listCss from '../../../theme/default/list.m.css';
import * as iconCss from '../../../theme/default/icon.m.css';
import List from '../../../list';
import { Keys } from '../../../common/util';
import { createResourceTemplate } from '@dojo/framework/core/middleware/resources';

const { ' _key': key, ...inputTheme } = inputCss as any;
const { ' _key': iconKey, ...iconTheme } = iconCss as any;
const { ' _key': listKey, ...listTheme } = listCss as any;

const data = [
	{
		value: '1',
		label: 'Dog'
	},
	{
		value: '2',
		label: 'Cat'
	},
	{
		value: '3',
		label: 'Fish',
		disabled: true
	}
];

const WrappedRoot = wrap('div');
const WrappedTrigger = wrap(TextInput);
const WrappedButton = wrap('button');
const WrappedPopup = wrap(TriggerPopup);
const WrappedList = wrap(List);
const WrappedHelperText = wrap(HelperText);

const sb = sandbox.create();
const onValueStub = sb.stub();

const triggerAssertion = assertion(() => (
	<WrappedTrigger
		autocomplete={false}
		onValue={noop}
		onKeyDown={noop}
		onBlur={noop}
		aria={{
			controls: 'typeahead-list-test',
			expanded: 'false',
			haspopup: 'listbox'
		}}
		disabled={undefined}
		focus={noop}
		value=""
		key={'trigger'}
		name={undefined}
		onClick={noop}
		onFocus={noop}
		valid={undefined}
		widgetId={'typeahead-trigger-test'}
		theme={{
			'@dojo/widgets/text-input': inputTheme
		}}
		classes={{
			'@dojo/widgets/text-input': {
				root: [css.trigger]
			}
		}}
		variant={undefined}
	>
		{{ label: undefined, leading: undefined, trailing: undefined }}
	</WrappedTrigger>
));

const expandedTriggerAssertion = triggerAssertion.setProperty(WrappedTrigger, 'aria', {
	controls: 'typeahead-list-test',
	expanded: 'true',
	haspopup: 'listbox'
});

const contentAssertion = assertion(() => (
	<div key="menu-wrapper" classes={css.menuWrapper}>
		<WrappedList
			height="auto"
			classes={undefined}
			variant={undefined}
			activeIndex={0}
			disabled={undefined}
			focusable={false}
			initialValue=""
			itemsInView={undefined}
			key="menu"
			onBlur={noop}
			onRequestClose={noop}
			onValue={noop}
			widgetId="typeahead-list-test"
			staticOption={{
				label: '',
				value: ''
			}}
			theme={{
				'@dojo/widgets/list': {
					...listTheme,
					wrapper: css.menuWrapper
				}
			}}
			resource={compare(() => {
				return true;
			})}
		/>
	</div>
));

const nonStrictModeContent = contentAssertion.setProperty(WrappedList, 'activeIndex', -1);

const baseAssertion = assertion(() => (
	<WrappedRoot classes={[null, css.root, null, false, false, null, null]} key="root">
		<WrappedPopup
			variant={undefined}
			classes={undefined}
			theme={undefined}
			key="popup"
			onClose={noop}
			onOpen={noop}
			position={undefined}
		>
			{{
				trigger: triggerAssertion,
				content: contentAssertion
			}}
		</WrappedPopup>
		<WrappedHelperText
			variant={undefined}
			classes={undefined}
			theme={undefined}
			key="helperText"
			text={undefined}
			valid={undefined}
		/>
	</WrappedRoot>
));

const nonStrictModeBaseAssertion = assertion(() => (
	<WrappedRoot classes={[null, css.root, null, false, false, null, null]} key="root">
		<WrappedPopup
			variant={undefined}
			classes={undefined}
			theme={undefined}
			key="popup"
			onClose={noop}
			onOpen={noop}
			position={undefined}
		>
			{{
				trigger: triggerAssertion,
				content: nonStrictModeContent
			}}
		</WrappedPopup>
		<WrappedHelperText
			variant={undefined}
			classes={undefined}
			theme={undefined}
			key="helperText"
			text={undefined}
			valid={undefined}
		/>
	</WrappedRoot>
));

describe('Typeahead', () => {
	afterEach(() => {
		sb.reset();
	});

	it('Should render the typeahead in closed state', () => {
		const r = renderer(() => (
			<Typeahead resource={{ data, id: 'test', idKey: 'value' }} onValue={onValueStub} />
		));
		r.child(WrappedPopup, {
			trigger: [() => {}]
		});
		r.expect(baseAssertion);
	});

	it('Should render the typeahead with an initial value', () => {
		const r = renderer(() => (
			<Typeahead
				resource={{ data, id: 'test', idKey: 'value' }}
				onValue={onValueStub}
				initialValue="2"
			/>
		));
		r.child(WrappedPopup, {
			trigger: [() => {}]
		});
		r.expect(
			baseAssertion.replaceChildren(WrappedPopup, () => ({
				trigger: triggerAssertion.setProperty(WrappedTrigger, 'value', 'Cat'),
				content: contentAssertion.setProperty(WrappedList, 'initialValue', '2')
			}))
		);
	});

	it('Should render the typeahead with a controlled value', () => {
		const properties: any = {
			value: '2'
		};
		const r = renderer(() => (
			<Typeahead
				resource={{ data, id: 'test', idKey: 'value' }}
				onValue={onValueStub}
				value={properties.value}
			/>
		));
		r.child(WrappedPopup, {
			trigger: [() => {}]
		});
		r.expect(
			baseAssertion.replaceChildren(WrappedPopup, () => ({
				trigger: triggerAssertion.setProperty(WrappedTrigger, 'value', 'Cat'),
				content: contentAssertion.setProperty(WrappedList, 'initialValue', '2')
			}))
		);
		properties.value = '1';
		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'classes', [
					null,
					css.root,
					null,
					false,
					false,
					false,
					null
				])
				.replaceChildren(WrappedPopup, () => ({
					trigger: triggerAssertion.setProperty(WrappedTrigger, 'value', 'Dog'),
					content: contentAssertion.setProperty(WrappedList, 'initialValue', '1')
				}))
		);
	});

	it('Should show validation and call validate callback when required depending on typeahead state', () => {
		const onValidateStub = sb.stub();
		const r = renderer(() => (
			<Typeahead
				resource={{ data, id: 'test', idKey: 'value' }}
				required={true}
				onValidate={onValidateStub}
				onValue={onValidateStub}
			/>
		));
		r.child(WrappedPopup, {
			trigger: [() => {}],
			content: [() => {}, 'below']
		});
		r.expect(
			baseAssertion.replaceChildren(WrappedPopup, () => ({
				trigger: triggerAssertion,
				content: contentAssertion
					.setProperty(WrappedList, 'initialValue', undefined)
					.setProperty(WrappedList, 'staticOption', undefined)
			}))
		);
		// open the drop down
		r.property(WrappedTrigger, 'onClick');
		// focus second item from the drop down, `cat`
		r.property(WrappedTrigger, 'onKeyDown', Keys.Down, () => {});
		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'classes', [
					null,
					css.root,
					null,
					false,
					false,
					css.expanded,
					null
				])
				.replaceChildren(WrappedPopup, () => ({
					trigger: expandedTriggerAssertion,
					content: contentAssertion
						.setProperty(WrappedList, 'activeIndex', 1)
						.setProperty(WrappedList, 'initialValue', undefined)
						.setProperty(WrappedList, 'staticOption', undefined)
				}))
		);
		// select second item from the drop down, `cat`
		r.property(WrappedTrigger, 'onKeyDown', Keys.Enter, () => {});
		// call `onClose` on the popup to simulate the dropdown closing
		r.property(WrappedPopup, 'onClose');
		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'classes', [
					null,
					css.root,
					null,
					css.valid,
					false,
					false,
					null
				])
				.setProperty(WrappedHelperText, 'valid', true)
				.replaceChildren(WrappedPopup, () => ({
					trigger: triggerAssertion
						.setProperty(WrappedTrigger, 'value', 'Cat')
						.setProperty(WrappedTrigger, 'valid', true),
					content: contentAssertion
						.setProperty(WrappedList, 'initialValue', '2')
						.setProperty(WrappedList, 'activeIndex', 1)
						.setProperty(WrappedList, 'staticOption', undefined)
				}))
		);
		r.property(WrappedTrigger, 'onValue', '');
		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'classes', [
					null,
					css.root,
					null,
					false,
					css.invalid,
					css.expanded,
					null
				])
				.setProperty(WrappedHelperText, 'valid', false)
				.setProperty(WrappedHelperText, 'text', 'Please select a value.')
				.replaceChildren(WrappedPopup, () => ({
					trigger: expandedTriggerAssertion
						.setProperty(WrappedTrigger, 'valid', false)
						.setProperty(WrappedTrigger, 'value', ''),
					content: contentAssertion
						.setProperty(WrappedList, 'initialValue', undefined)
						.setProperty(WrappedList, 'staticOption', undefined)
				}))
		);
	});

	it('Should show validation and call validate callback when required depending on typeahead state in strict mode', () => {
		const onValidateStub = sb.stub();
		const r = renderer(() => (
			<Typeahead
				resource={{ data, id: 'test', idKey: 'value' }}
				required={true}
				strict={true}
				onValidate={onValidateStub}
				onValue={onValidateStub}
			/>
		));
		r.child(WrappedPopup, {
			trigger: [() => {}],
			content: [() => {}, 'below']
		});
		r.expect(
			baseAssertion.replaceChildren(WrappedPopup, () => ({
				trigger: triggerAssertion,
				content: contentAssertion
					.setProperty(WrappedList, 'initialValue', undefined)
					.setProperty(WrappedList, 'staticOption', undefined)
			}))
		);
		// open the drop down
		r.property(WrappedTrigger, 'onValue', 'unknown');
		// focus second item from the drop down, `cat`
		r.property(WrappedTrigger, 'onKeyDown', Keys.Enter, () => {});
		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'classes', [
					null,
					css.root,
					null,
					false,
					css.invalid,
					false,
					null
				])
				.setProperty(WrappedHelperText, 'valid', false)
				.setProperty(WrappedHelperText, 'text', 'Please select a value.')
				.replaceChildren(WrappedPopup, () => ({
					trigger: triggerAssertion.setProperty(WrappedTrigger, 'valid', false),
					content: contentAssertion
						.setProperty(WrappedList, 'initialValue', undefined)
						.setProperty(WrappedList, 'staticOption', undefined)
				}))
		);
	});

	it('Should open dropdown on click ', () => {
		const r = renderer(() => (
			<Typeahead resource={{ data, id: 'test', idKey: 'value' }} onValue={onValueStub} />
		));
		r.child(WrappedPopup, {
			trigger: [() => {}]
		});
		r.expect(baseAssertion);
		r.property(WrappedTrigger, 'onClick');
		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'classes', [
					null,
					css.root,
					null,
					false,
					false,
					css.expanded,
					null
				])
				.replaceChildren(WrappedPopup, () => ({
					trigger: expandedTriggerAssertion,
					content: contentAssertion
				}))
		);
	});

	it('Should open dropdown on down key', () => {
		const r = renderer(() => (
			<Typeahead resource={{ data, id: 'test', idKey: 'value' }} onValue={onValueStub} />
		));
		r.child(WrappedPopup, {
			trigger: [() => {}]
		});
		r.expect(baseAssertion);
		assert.strictEqual(onValueStub.callCount, 1);
		r.property(WrappedTrigger, 'onKeyDown', Keys.Down, () => {});
		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'classes', [
					null,
					css.root,
					null,
					false,
					false,
					css.expanded,
					null
				])
				.replaceChildren(WrappedPopup, () => ({
					trigger: expandedTriggerAssertion,
					content: contentAssertion
				}))
		);
		assert.strictEqual(onValueStub.callCount, 1);
	});

	it('Should open dropdown on up key', () => {
		const r = renderer(() => (
			<Typeahead resource={{ data, id: 'test', idKey: 'value' }} onValue={onValueStub} />
		));
		r.child(WrappedPopup, {
			trigger: [() => {}]
		});
		r.expect(baseAssertion);
		assert.strictEqual(onValueStub.callCount, 1);
		r.property(WrappedTrigger, 'onKeyDown', Keys.Up, () => {});
		r.property(WrappedPopup, 'onOpen');
		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'classes', [
					null,
					css.root,
					null,
					false,
					false,
					css.expanded,
					null
				])
				.replaceChildren(WrappedPopup, () => ({
					trigger: expandedTriggerAssertion,
					content: contentAssertion
				}))
		);
		assert.strictEqual(onValueStub.callCount, 1);
	});

	it('Should close the list on escape ', () => {
		const r = renderer(() => (
			<Typeahead resource={{ data, id: 'test', idKey: 'value' }} onValue={onValueStub} />
		));
		r.child(WrappedPopup, {
			trigger: [() => {}]
		});
		r.expect(baseAssertion);
		assert.strictEqual(onValueStub.callCount, 1);
		// open the drop down
		r.property(WrappedTrigger, 'onKeyDown', Keys.Down, () => {});
		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'classes', [
					null,
					css.root,
					null,
					false,
					false,
					css.expanded,
					null
				])
				.replaceChildren(WrappedPopup, () => ({
					trigger: expandedTriggerAssertion,
					content: contentAssertion
				}))
		);
		// close the drop down
		r.property(WrappedTrigger, 'onKeyDown', Keys.Escape, () => {});
		r.expect(
			baseAssertion.setProperty(WrappedRoot, 'classes', [
				null,
				css.root,
				null,
				false,
				false,
				false,
				null
			])
		);
		assert.strictEqual(onValueStub.callCount, 1);
	});

	it('Should select item on enter ', () => {
		const r = renderer(() => (
			<Typeahead resource={{ data, id: 'test', idKey: 'value' }} onValue={onValueStub} />
		));
		r.child(WrappedPopup, {
			trigger: [() => {}]
		});
		r.expect(baseAssertion);
		assert.strictEqual(onValueStub.callCount, 1);
		// open the drop down
		r.property(WrappedTrigger, 'onClick');
		// focus second item from the drop down, `cat`
		r.property(WrappedTrigger, 'onKeyDown', Keys.Down, () => {});
		// select second item from the drop down, `cat`
		r.property(WrappedTrigger, 'onKeyDown', Keys.Enter, () => {});
		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'classes', [
					null,
					css.root,
					null,
					false,
					false,
					false,
					null
				])
				.replaceChildren(WrappedPopup, () => ({
					trigger: triggerAssertion.setProperty(WrappedTrigger, 'value', 'Cat'),
					content: contentAssertion
						.setProperty(WrappedList, 'initialValue', '2')
						.setProperty(WrappedList, 'activeIndex', 1)
				}))
		);
		assert.strictEqual(onValueStub.callCount, 2);
	});

	it('Should select item on tab ', () => {
		const r = renderer(() => (
			<Typeahead resource={{ data, id: 'test', idKey: 'value' }} onValue={onValueStub} />
		));
		r.child(WrappedPopup, {
			trigger: [() => {}]
		});
		r.expect(baseAssertion);
		// open the drop down
		r.property(WrappedTrigger, 'onClick');
		// focus second item from the drop down, `cat`
		r.property(WrappedTrigger, 'onKeyDown', Keys.Down, () => {});
		// select second item from the drop down, `cat`
		r.property(WrappedTrigger, 'onKeyDown', Keys.Tab, () => {});
		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'classes', [
					null,
					css.root,
					null,
					false,
					false,
					false,
					null
				])
				.replaceChildren(WrappedPopup, () => ({
					trigger: triggerAssertion.setProperty(WrappedTrigger, 'value', 'Cat'),
					content: contentAssertion
						.setProperty(WrappedList, 'initialValue', '2')
						.setProperty(WrappedList, 'activeIndex', 1)
				}))
		);
		assert.strictEqual(onValueStub.callCount, 2);
	});

	it('Should select value on blur in non-strict mode', () => {
		const r = renderer(() => (
			<Typeahead
				resource={{ data, id: 'test', idKey: 'value' }}
				onValue={onValueStub}
				strict={false}
			/>
		));
		r.child(WrappedPopup, {
			trigger: [() => {}]
		});
		r.expect(nonStrictModeBaseAssertion);
		assert.strictEqual(onValueStub.callCount, 1);
		assert.deepEqual(onValueStub.firstCall.args, [{ value: '', label: '' }]);
		// open the drop down
		r.property(WrappedTrigger, 'onClick');
		// focus second item from the drop down, `cat`
		r.property(WrappedTrigger, 'onValue', 'c');
		// blur to select the second item from the drop down, `cat`
		r.property(WrappedTrigger, 'onBlur');
		r.expect(
			nonStrictModeBaseAssertion
				.setProperty(WrappedRoot, 'classes', [
					null,
					css.root,
					null,
					false,
					false,
					false,
					false
				])
				.replaceChildren(WrappedPopup, () => ({
					trigger: triggerAssertion.setProperty(WrappedTrigger, 'value', 'c'),
					content: nonStrictModeContent.setProperty(WrappedList, 'initialValue', 'c')
				}))
		);
		assert.strictEqual(onValueStub.callCount, 2);
		assert.deepEqual(onValueStub.secondCall.args, [{ value: 'c', label: 'c' }]);
	});

	it('Should not be able to select a disabled item', () => {
		const r = renderer(() => (
			<Typeahead resource={{ data, id: 'test', idKey: 'value' }} onValue={onValueStub} />
		));
		r.child(WrappedPopup, {
			trigger: [() => {}]
		});
		r.expect(baseAssertion);
		assert.strictEqual(onValueStub.callCount, 1);
		// open the drop down
		r.property(WrappedTrigger, 'onClick');
		// focus second item from the drop down, `cat`
		r.property(WrappedTrigger, 'onKeyDown', Keys.Down, () => {});
		// focus third item from the drop down, `dog`
		r.property(WrappedTrigger, 'onKeyDown', Keys.Down, () => {});
		// try to select disabled third item from the drop down, `dog`
		r.property(WrappedTrigger, 'onKeyDown', Keys.Enter, () => {});
		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'classes', [
					null,
					css.root,
					null,
					false,
					false,
					false,
					null
				])
				.replaceChildren(WrappedPopup, () => ({
					trigger: triggerAssertion,
					content: contentAssertion.setProperty(WrappedList, 'activeIndex', 2)
				}))
		);
		assert.strictEqual(onValueStub.callCount, 1);
	});

	it('Should not be able to select an item that is considered disabled by the `itemDisabled` property', () => {
		const r = renderer(() => (
			<Typeahead
				resource={{ data, id: 'test', idKey: 'value' }}
				itemDisabled={(item) => item.value === '2'}
				onValue={onValueStub}
			/>
		));
		const disabledContentAssertion = contentAssertion.setProperty(
			WrappedList,
			'disabled',
			noop
		);
		const disabledAssertion = baseAssertion.replaceChildren(WrappedPopup, () => ({
			trigger: triggerAssertion,
			content: disabledContentAssertion
		}));

		r.child(WrappedPopup, {
			trigger: [() => {}]
		});
		r.expect(disabledAssertion);
		assert.strictEqual(onValueStub.callCount, 1);
		r.property(WrappedTrigger, 'onClick');
		r.property(WrappedTrigger, 'onKeyDown', Keys.Down, () => {});
		r.property(WrappedTrigger, 'onKeyDown', Keys.Enter, () => {});
		r.expect(
			disabledAssertion
				.setProperty(WrappedRoot, 'classes', [
					null,
					css.root,
					null,
					false,
					false,
					false,
					null
				])
				.replaceChildren(WrappedPopup, () => ({
					trigger: triggerAssertion,
					content: disabledContentAssertion.setProperty(WrappedList, 'activeIndex', 1)
				}))
		);
		assert.strictEqual(onValueStub.callCount, 1);
	});

	it('Should not be able to select an invalid item', () => {
		const r = renderer(() => (
			<Typeahead resource={{ data, id: 'test', idKey: 'value' }} onValue={onValueStub} />
		));
		r.child(WrappedPopup, {
			trigger: [() => {}]
		});
		r.expect(baseAssertion);
		assert.strictEqual(onValueStub.callCount, 1);
		r.property(WrappedTrigger, 'onClick');
		r.property(WrappedTrigger, 'onValue', 'Unknown');
		r.property(WrappedTrigger, 'onKeyDown', Keys.Enter, () => {});
		r.expect(
			baseAssertion.setProperty(WrappedRoot, 'classes', [
				null,
				css.root,
				null,
				false,
				false,
				false,
				null
			])
		);
		assert.strictEqual(onValueStub.callCount, 1);
	});

	it('Should be able to select a free text value in non-strict mode', () => {
		const r = renderer(() => (
			<Typeahead
				resource={{ data, id: 'test', idKey: 'value' }}
				onValue={onValueStub}
				strict={false}
			/>
		));
		r.child(WrappedPopup, {
			trigger: [() => {}]
		});
		r.expect(nonStrictModeBaseAssertion);
		assert.strictEqual(onValueStub.callCount, 1);
		r.property(WrappedTrigger, 'onClick');
		r.property(WrappedTrigger, 'onValue', 'Unknown');
		r.property(WrappedTrigger, 'onKeyDown', Keys.Enter, () => {});
		r.expect(
			nonStrictModeBaseAssertion
				.setProperty(WrappedRoot, 'classes', [
					null,
					css.root,
					null,
					false,
					false,
					false,
					null
				])
				.replaceChildren(WrappedPopup, () => ({
					trigger: triggerAssertion.setProperty(WrappedTrigger, 'value', 'Unknown'),
					content: nonStrictModeContent.setProperty(
						WrappedList,
						'initialValue',
						'Unknown'
					)
				}))
		);
		assert.strictEqual(onValueStub.callCount, 2);
	});

	it('Required typeahead should be validated when item is selected and then the typeahead blurred', () => {
		const toggleClosedStub = sb.stub();
		const r = renderer(() => (
			<Typeahead
				resource={{ data, id: 'test', idKey: 'value' }}
				onValue={onValueStub}
				strict={false}
				required={true}
			/>
		));
		r.child(WrappedPopup, {
			trigger: [() => {}],
			content: [toggleClosedStub, 'above']
		});
		r.expect(
			nonStrictModeBaseAssertion.replaceChildren(WrappedPopup, () => ({
				trigger: triggerAssertion,
				content: nonStrictModeContent
					.setProperty(WrappedList, 'initialValue', undefined)
					.setProperty(WrappedList, 'staticOption', undefined)
			}))
		);
		r.property(WrappedPopup, 'onClose');
		r.property(WrappedList, 'onValue', {
			value: '1',
			label: 'Dog'
		});
		const validatedAssertion = nonStrictModeBaseAssertion
			.setProperty(WrappedHelperText, 'valid', true)
			.setProperty(WrappedRoot, 'classes', [
				null,
				css.root,
				null,
				css.valid,
				false,
				false,
				null
			])
			.replaceChildren(WrappedPopup, () => ({
				trigger: triggerAssertion
					.setProperty(WrappedTrigger, 'value', 'Dog')
					.setProperty(WrappedTrigger, 'valid', true),
				content: nonStrictModeContent
					.setProperty(WrappedList, 'staticOption', undefined)
					.setProperty(WrappedList, 'initialValue', '1')
			}));
		r.expect(validatedAssertion);
		r.property(WrappedTrigger, 'onBlur');
		r.expect(
			validatedAssertion.setProperty(WrappedRoot, 'classes', [
				null,
				css.root,
				null,
				css.valid,
				false,
				false,
				false
			])
		);
	});

	it('Typeahead onValue should not be called with an empty value', () => {
		const toggleClosedStub = sb.stub();
		const r = renderer(() => (
			<Typeahead
				resource={{ data, id: 'test', idKey: 'value' }}
				onValue={onValueStub}
				strict={false}
			/>
		));
		r.child(WrappedPopup, {
			trigger: [() => {}],
			content: [toggleClosedStub, 'above']
		});
		r.expect(nonStrictModeBaseAssertion);
		r.property(WrappedTrigger, 'onValue', 'free text');
		const expandedAssertion = nonStrictModeBaseAssertion
			.setProperty(WrappedRoot, 'classes', [
				null,
				css.root,
				null,
				false,
				false,
				css.expanded,
				null
			])
			.replaceChildren(WrappedPopup, () => ({
				trigger: triggerAssertion.setProperties(WrappedTrigger, (current: any) => {
					return {
						...current,
						value: 'free text',
						aria: { ...current.aria, expanded: 'true' }
					};
				}),
				content: nonStrictModeContent
			}));
		r.expect(expandedAssertion);
		assert.strictEqual(onValueStub.callCount, 1);
		r.property(WrappedTrigger, 'onValue', '');
		r.property(WrappedTrigger, 'onBlur');
		r.expect(
			expandedAssertion
				.setProperty(WrappedRoot, 'classes', [
					null,
					css.root,
					null,
					false,
					false,
					false,
					false
				])
				.replaceChildren(WrappedPopup, () => ({
					trigger: triggerAssertion.setProperties(WrappedTrigger, (current: any) => {
						return {
							...current,
							value: '',
							aria: { ...current.aria, expanded: 'false' }
						};
					}),
					content: nonStrictModeContent.setProperty(WrappedList, 'initialValue', '')
				}))
		);
		assert.strictEqual(onValueStub.callCount, 1);
	});

	// it('deals with loading items in non strict mode', async () => {
	// 	const resolvers: any[] = [];
	// 	const promises: any[] = [];
	// 	const template = createResourceTemplate<any, any>({
	// 		read: (req, controls) => {
	// 			const prom = new Promise((res) => {
	// 				resolvers.push(res);
	// 			});
	// 			promises.push(prom);
	// 			return prom.then(() => {
	// 				memoryTemplate.read(req, controls);
	// 			});
	// 		},
	// 		find: memoryTemplate.find,
	// 		init: memoryTemplate.init
	// 	});
	// 	const toggleClosedStub = sb.stub();
	// 	const r = renderer(() => (
	// 		<Typeahead
	// 			resource={{ template: { template, id: 'test', initOptions: { data, id: 'test' } } }}
	// 			onValue={onValueStub}
	// 			strict={false}
	// 		/>
	// 	));
	// 	r.child(WrappedPopup, {
	// 		trigger: [() => {}],
	// 		content: [toggleClosedStub, 'above']
	// 	});
	// 	r.expect(nonStrictModeBaseAssertion);
	// 	let resolver = resolvers.shift();
	// 	let promise = promises.shift();
	// 	resolver && resolver();
	// 	await promise;
	// 	r.expect(nonStrictModeBaseAssertion);
	// 	r.property(WrappedTrigger, 'onValue', 'dog');
	// 	const expandedAssertion = nonStrictModeBaseAssertion.replaceChildren(WrappedPopup, () => ({
	// 		trigger: expandedTriggerAssertion.setProperty(WrappedTrigger, 'value', 'dog'),
	// 		content: nonStrictModeContent
	// 	}));
	// 	r.expect(expandedAssertion);
	// 	resolver = resolvers.shift();
	// 	promise = promises.shift();
	// 	resolver();
	// 	await promise;
	// 	const expandedSelectedAssertion = nonStrictModeBaseAssertion.replaceChildren(
	// 		WrappedPopup,
	// 		() => ({
	// 			trigger: expandedTriggerAssertion.setProperty(WrappedTrigger, 'value', 'dog'),
	// 			content: nonStrictModeContent.setProperty(WrappedList, 'activeIndex', 0)
	// 		})
	// 	);
	// 	r.expect(expandedSelectedAssertion);
	// });

	it('applies focused flag on focus and blur', () => {
		const r = renderer(() => (
			<Typeahead
				resource={{ data, id: 'test', idKey: 'value' }}
				onValue={onValueStub}
				value="2"
			/>
		));

		r.expect(
			baseAssertion.replaceChildren(WrappedPopup, () => ({
				trigger: triggerAssertion.setProperty(WrappedTrigger, 'value', 'Cat'),
				content: contentAssertion.setProperty(WrappedList, 'initialValue', '2')
			}))
		);

		r.child(WrappedPopup, {
			trigger: [() => {}],
			content: [() => {}, 'below']
		});
		r.property(WrappedTrigger, 'onValue', '');

		r.expect(
			baseAssertion.replaceChildren(WrappedPopup, () => ({
				trigger: triggerAssertion.setProperty(WrappedTrigger, 'value', 'Cat'),
				content: contentAssertion.setProperty(WrappedList, 'initialValue', '2')
			}))
		);

		r.property(WrappedTrigger, 'onFocus');

		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'classes', [
					null,
					css.root,
					null,
					false,
					false,
					false,
					css.focused
				])
				.replaceChildren(WrappedPopup, () => ({
					trigger: triggerAssertion.setProperty(WrappedTrigger, 'value', 'Cat'),
					content: contentAssertion.setProperty(WrappedList, 'initialValue', '2')
				}))
		);

		r.property(WrappedTrigger, 'onBlur');

		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'classes', [
					null,
					css.root,
					null,
					false,
					false,
					false,
					false
				])
				.replaceChildren(WrappedPopup, () => ({
					trigger: triggerAssertion.setProperty(WrappedTrigger, 'value', 'Cat'),
					content: contentAssertion.setProperty(WrappedList, 'initialValue', '2')
				}))
		);
	});

	it('shows dropdown button', () => {
		const r = renderer(() => (
			<Typeahead
				resource={{ data, id: 'test', idKey: 'value' }}
				onValue={onValueStub}
				hasDownArrow
			/>
		));

		const withArrowAssertion = baseAssertion.replaceChildren(WrappedPopup, () => ({
			trigger: triggerAssertion.replaceChildren(WrappedTrigger, () => ({
				label: undefined,
				leading: undefined,
				trailing: (
					<WrappedButton
						type="button"
						disabled={undefined}
						classes={css.arrow}
						onclick={noop}
						onkeydown={noop}
					>
						<Icon
							type="downIcon"
							theme={{
								'@dojo/widgets/icon': iconTheme
							}}
							classes={undefined}
							variant={undefined}
						/>
					</WrappedButton>
				)
			})),
			content: contentAssertion
		}));

		r.expect(withArrowAssertion);
	});

	it('should disable dropdown button', () => {
		const r = renderer(() => (
			<Typeahead
				resource={{ data, id: 'test', idKey: 'value' }}
				onValue={onValueStub}
				hasDownArrow
				disabled
			/>
		));

		const withArrowAssertion = baseAssertion
			.setProperty(WrappedRoot, 'classes', [
				null,
				css.root,
				css.disabled,
				false,
				false,
				null,
				null
			])
			.replaceChildren(WrappedPopup, () => ({
				trigger: triggerAssertion.replaceChildren(WrappedTrigger, () => ({
					label: undefined,
					leading: undefined,
					trailing: (
						<WrappedButton
							type="button"
							disabled={true}
							classes={css.arrow}
							onclick={noop}
							onkeydown={noop}
						>
							<Icon
								type="downIcon"
								theme={{
									'@dojo/widgets/icon': iconTheme
								}}
								classes={undefined}
								variant={undefined}
							/>
						</WrappedButton>
					)
				})),
				content: contentAssertion
			}));

		r.expect(withArrowAssertion);
	});

	const testDownArrowOpening = (propKey: string, ...params: any[]) => {
		const r = renderer(() => (
			<Typeahead
				resource={{ data, id: 'test', idKey: 'value' }}
				onValue={onValueStub}
				hasDownArrow
			/>
		));

		const triggerWithDownArrow = triggerAssertion.replaceChildren(WrappedTrigger, () => ({
			label: undefined,
			leading: undefined,
			trailing: (
				<WrappedButton
					type="button"
					disabled={undefined}
					classes={css.arrow}
					onclick={noop}
					onkeydown={noop}
				>
					<Icon
						type="downIcon"
						theme={{
							'@dojo/widgets/icon': iconTheme
						}}
						classes={undefined}
						variant={undefined}
					/>
				</WrappedButton>
			)
		}));

		const withArrowAssertion = baseAssertion.replaceChildren(WrappedPopup, () => ({
			trigger: triggerWithDownArrow,
			content: contentAssertion
		}));

		r.child(WrappedPopup, {
			trigger: [() => {}],
			content: [() => {}, 'below']
		});

		r.expect(withArrowAssertion);
		r.property(WrappedButton, propKey, ...params);

		r.expect(
			withArrowAssertion
				.replaceChildren(WrappedPopup, () => ({
					trigger: triggerWithDownArrow.setProperties(WrappedTrigger, (current: any) => ({
						...current,
						aria: { ...current.aria, expanded: 'true' }
					})),
					content: contentAssertion
				}))
				.setProperty(WrappedRoot, 'classes', [
					null,
					css.root,
					null,
					false,
					false,
					css.expanded,
					null
				])
		);
	};

	it('opens typeahead on down arrow click', () => {
		testDownArrowOpening('onclick');
	});

	it('opens typeahead onkeydown `Down` on down arrow', () => {
		testDownArrowOpening('onkeydown', { which: Keys.Down, preventDefault: noop });
	});

	it('opens typeahead onkeydown `Enter` on down arrow', () => {
		testDownArrowOpening('onkeydown', { which: Keys.Enter, preventDefault: noop });
	});

	it('opens typeahead onkeydown `Space` on down arrow', () => {
		testDownArrowOpening('onkeydown', { which: Keys.Space, preventDefault: noop });
	});

	it('should create placeholder object when not required and no placeholder provided', () => {
		const toggleClosedStub = sb.stub();
		const r = renderer(() => (
			<Typeahead
				resource={{ data, id: 'test', idKey: 'value' }}
				onValue={onValueStub}
				strict={false}
			/>
		));
		r.child(WrappedPopup, {
			trigger: [() => {}],
			content: [toggleClosedStub, 'above']
		});
		r.expect(nonStrictModeBaseAssertion);

		assert.strictEqual(onValueStub.callCount, 1);
		assert.deepEqual(onValueStub.firstCall.args, [{ value: '', label: '' }]);
	});

	it('should should use provided placeholder', () => {
		const toggleClosedStub = sb.stub();
		const r = renderer(() => (
			<Typeahead
				resource={{ data, id: 'test', idKey: 'value' }}
				onValue={onValueStub}
				strict={false}
				placeholder={{ value: 'placeholder', label: 'This is a placeholder' }}
			/>
		));

		r.child(WrappedPopup, {
			trigger: [() => {}],
			content: [toggleClosedStub, 'above']
		});
		r.expect(
			nonStrictModeBaseAssertion.replaceChildren(WrappedPopup, () => ({
				trigger: triggerAssertion.setProperty(
					WrappedTrigger,
					'value',
					'This is a placeholder'
				),
				content: nonStrictModeContent
					.setProperty(WrappedList, 'initialValue', 'placeholder')
					.setProperty(WrappedList, 'staticOption', {
						value: 'placeholder',
						label: 'This is a placeholder'
					})
			}))
		);

		assert.strictEqual(onValueStub.callCount, 1);
		assert.deepEqual(onValueStub.firstCall.args, [
			{ value: 'placeholder', label: 'This is a placeholder' }
		]);
	});

	it('should not create placeholder object when required and no placeholder provided', () => {
		const toggleClosedStub = sb.stub();
		const r = renderer(() => (
			<Typeahead
				resource={{ data, id: 'test', idKey: 'value' }}
				onValue={onValueStub}
				strict={false}
				required
			/>
		));
		r.child(WrappedPopup, {
			trigger: [() => {}],
			content: [toggleClosedStub, 'above']
		});
		r.expect(
			nonStrictModeBaseAssertion.replaceChildren(WrappedPopup, () => ({
				trigger: triggerAssertion,
				content: nonStrictModeContent
					.setProperty(WrappedList, 'initialValue', undefined)
					.setProperty(WrappedList, 'staticOption', undefined)
			}))
		);

		assert.strictEqual(onValueStub.callCount, 0);
	});

	it('queries for matching value if not found', () => {
		const onValueStub = sb.stub();
		const toggleClosedStub = sb.stub();

		const readSub = sb.stub();
		readSub.callsFake((req, { put }) => {
			if (req.query.value === '4') {
				put({ data: [{ value: '4', label: 'Frog' }], total: 1 }, req);
			} else {
				put({ data, total: data.length }, req);
			}
		});

		const template = createResourceTemplate<any>({
			idKey: 'value',
			read: readSub
		});

		const r = renderer(() => (
			<Typeahead
				resource={{ template }}
				onValue={onValueStub}
				strict={false}
				value="4"
				required
			/>
		));

		r.child(WrappedPopup, {
			trigger: [() => {}],
			content: [toggleClosedStub, 'above']
		});
		r.expect(
			nonStrictModeBaseAssertion.replaceChildren(WrappedPopup, () => ({
				trigger: triggerAssertion.setProperty(WrappedTrigger, 'value', 'Frog'),
				content: nonStrictModeContent
					.setProperty(WrappedList, 'initialValue', '4')
					.setProperty(WrappedList, 'staticOption', undefined)
			}))
		);
	});

	it('pulls value from current data', () => {
		const onValueStub = sb.stub();
		const toggleClosedStub = sb.stub();

		const readSub = sb.stub();
		readSub.callsFake((req, { put }) => {
			put({ data, total: data.length }, req);
		});

		const template = createResourceTemplate<any>({
			idKey: 'value',
			read: readSub
		});

		const r = renderer(() => (
			<Typeahead
				resource={{ template }}
				onValue={onValueStub}
				strict={false}
				value="2"
				required
			/>
		));

		r.child(WrappedPopup, {
			trigger: [() => {}],
			content: [toggleClosedStub, 'above']
		});
		r.expect(
			nonStrictModeBaseAssertion.replaceChildren(WrappedPopup, () => ({
				trigger: triggerAssertion.setProperty(WrappedTrigger, 'value', 'Cat'),
				content: nonStrictModeContent
					.setProperty(WrappedList, 'initialValue', '2')
					.setProperty(WrappedList, 'staticOption', undefined)
			}))
		);
	});

	it('handles when no data is returned', () => {
		const onValueStub = sb.stub();
		const toggleClosedStub = sb.stub();

		const readSub = sb.stub();
		readSub.callsFake((req, { put }) => {
			put({ data: [], total: data.length }, req);
		});

		const template = createResourceTemplate<any>({
			idKey: 'value',
			read: readSub
		});

		const r = renderer(() => (
			<Typeahead
				resource={{ template }}
				onValue={onValueStub}
				strict={false}
				value="2"
				required
			/>
		));

		r.child(WrappedPopup, {
			trigger: [() => {}],
			content: [toggleClosedStub, 'above']
		});
		r.expect(
			nonStrictModeBaseAssertion.replaceChildren(WrappedPopup, () => ({
				trigger: triggerAssertion.setProperty(WrappedTrigger, 'value', ''),
				content: nonStrictModeContent
					.setProperty(WrappedList, 'initialValue', '2')
					.setProperty(WrappedList, 'staticOption', undefined)
			}))
		);
	});
});
