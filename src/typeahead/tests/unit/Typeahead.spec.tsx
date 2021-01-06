const { describe, it, afterEach } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import { sandbox } from 'sinon';
import { tsx } from '@dojo/framework/core/vdom';
import { renderer, assertion, wrap } from '@dojo/framework/testing/renderer';
import { createResourceTemplate, memoryTemplate } from '@dojo/framework/core/middleware/resources';

import Typeahead from '../../index';
import TriggerPopup from '../../../trigger-popup';
import HelperText from '../../../helper-text';
import TextInput from '../../../text-input';
import { noop } from '../../../common/tests/support/test-helpers';

import * as css from '../../../theme/default/typeahead.m.css';
import * as inputCss from '../../../theme/default/text-input.m.css';
import * as listCss from '../../../theme/default/list.m.css';
import List from '../../../list';
import { Keys } from '../../../common/util';

const { ' _key': key, ...inputTheme } = inputCss as any;
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

const template = createResourceTemplate<{
	value: string;
	label: string;
	disabled?: boolean;
}>();
const WrappedRoot = wrap('div');
const WrappedTrigger = wrap(TextInput);
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
		{{ label: undefined, leading: undefined }}
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
			initialValue={undefined}
			itemsInView={undefined}
			key="menu"
			onBlur={noop}
			onRequestClose={noop}
			onValue={noop}
			widgetId="typeahead-list-test"
			theme={{
				'@dojo/widgets/list': {
					...listTheme,
					wrapper: css.menuWrapper
				}
			}}
			resource={{
				options: noop,
				template: {
					template,
					id: 'test',
					initOptions: {
						id: 'test',
						data: [...data]
					}
				}
			}}
		/>
	</div>
));

const nonStrictModeContent = contentAssertion.setProperty(WrappedList, 'activeIndex', -1);

const baseAssertion = assertion(() => (
	<WrappedRoot classes={[null, css.root, null, false, false]} key="root">
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
	<WrappedRoot classes={[null, css.root, null, false, false]} key="root">
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
			<Typeahead
				resource={{ template: { template, id: 'test', initOptions: { data, id: 'test' } } }}
				onValue={onValueStub}
			/>
		));
		r.child(WrappedPopup, {
			trigger: [() => {}]
		});
		r.expect(baseAssertion);
	});

	it('Should render the typeahead with an initial value', () => {
		const r = renderer(() => (
			<Typeahead
				resource={{ template: { template, id: 'test', initOptions: { data, id: 'test' } } }}
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
				resource={{ template: { template, id: 'test', initOptions: { data, id: 'test' } } }}
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
			baseAssertion.replaceChildren(WrappedPopup, () => ({
				trigger: triggerAssertion.setProperty(WrappedTrigger, 'value', 'Dog'),
				content: contentAssertion.setProperty(WrappedList, 'initialValue', '1')
			}))
		);
	});

	it('Should show validation and call validate callback when required depending on typeahead state', () => {
		const onValidateStub = sb.stub();
		const r = renderer(() => (
			<Typeahead
				resource={{ template: { template, id: 'test', initOptions: { data, id: 'test' } } }}
				required={true}
				onValidate={onValidateStub}
				onValue={onValidateStub}
			/>
		));
		r.child(WrappedPopup, {
			trigger: [() => {}],
			content: [() => {}, 'below']
		});
		r.expect(baseAssertion);
		// open the drop down
		r.property(WrappedTrigger, 'onClick');
		// focus second item from the drop down, `cat`
		r.property(WrappedTrigger, 'onKeyDown', Keys.Down, () => {});
		r.expect(
			baseAssertion.replaceChildren(WrappedPopup, () => ({
				trigger: expandedTriggerAssertion,
				content: contentAssertion.setProperty(WrappedList, 'activeIndex', 1)
			}))
		);
		// select second item from the drop down, `cat`
		r.property(WrappedTrigger, 'onKeyDown', Keys.Enter, () => {});
		// simulate `cat` value being selected on the list
		r.property(WrappedList, 'onValue', { value: 'cat', label: 'Cat' });
		// call `onClose` on the popup to simulate the dropdown closing
		r.property(WrappedPopup, 'onClose');
		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'classes', [null, css.root, null, css.valid, false])
				.setProperty(WrappedHelperText, 'valid', true)
				.replaceChildren(WrappedPopup, () => ({
					trigger: triggerAssertion
						.setProperty(WrappedTrigger, 'value', 'Cat')
						.setProperty(WrappedTrigger, 'valid', true),
					content: contentAssertion
						.setProperty(WrappedList, 'initialValue', '2')
						.setProperty(WrappedList, 'activeIndex', 1)
				}))
		);
		r.property(WrappedTrigger, 'onValue', '');
		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'classes', [null, css.root, null, false, css.invalid])
				.setProperty(WrappedHelperText, 'valid', false)
				.setProperty(WrappedHelperText, 'text', 'Please select a value.')
				.replaceChildren(WrappedPopup, () => ({
					trigger: expandedTriggerAssertion
						.setProperty(WrappedTrigger, 'valid', false)
						.setProperty(WrappedTrigger, 'value', ''),
					content: contentAssertion.setProperty(WrappedList, 'initialValue', undefined)
				}))
		);
	});

	it('Should show validation and call validate callback when required depending on typeahead state in strict mode', () => {
		const onValidateStub = sb.stub();
		const r = renderer(() => (
			<Typeahead
				resource={{ template: { template, id: 'test', initOptions: { data, id: 'test' } } }}
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
		r.expect(baseAssertion);
		// open the drop down
		r.property(WrappedTrigger, 'onValue', 'unknown');
		r.property(WrappedList, 'onValue', { value: 'unknown', label: 'unknown' });
		// focus second item from the drop down, `cat`
		r.property(WrappedTrigger, 'onKeyDown', Keys.Enter, () => {});
		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'classes', [null, css.root, null, false, css.invalid])
				.setProperty(WrappedHelperText, 'valid', false)
				.setProperty(WrappedHelperText, 'text', 'Please select a value.')
				.replaceChildren(WrappedPopup, () => ({
					trigger: triggerAssertion.setProperty(WrappedTrigger, 'valid', false),
					content: contentAssertion.setProperty(WrappedList, 'initialValue', 'unknown')
				}))
		);
	});

	it('Should open dropdown on click ', () => {
		const r = renderer(() => (
			<Typeahead
				resource={{ template: { template, id: 'test', initOptions: { data, id: 'test' } } }}
				onValue={onValueStub}
			/>
		));
		r.child(WrappedPopup, {
			trigger: [() => {}]
		});
		r.expect(baseAssertion);
		r.property(WrappedTrigger, 'onClick');
		r.expect(
			baseAssertion.replaceChildren(WrappedPopup, () => ({
				trigger: expandedTriggerAssertion,
				content: contentAssertion
			}))
		);
	});

	it('Should open dropdown on down key', () => {
		const r = renderer(() => (
			<Typeahead
				resource={{ template: { template, id: 'test', initOptions: { data, id: 'test' } } }}
				onValue={onValueStub}
			/>
		));
		r.child(WrappedPopup, {
			trigger: [() => {}]
		});
		r.expect(baseAssertion);
		r.property(WrappedTrigger, 'onKeyDown', Keys.Down, () => {});
		r.expect(
			baseAssertion.replaceChildren(WrappedPopup, () => ({
				trigger: expandedTriggerAssertion,
				content: contentAssertion
			}))
		);
		assert.strictEqual(onValueStub.callCount, 0);
	});

	it('Should open dropdown on up key', () => {
		const r = renderer(() => (
			<Typeahead
				resource={{ template: { template, id: 'test', initOptions: { data, id: 'test' } } }}
				onValue={onValueStub}
			/>
		));
		r.child(WrappedPopup, {
			trigger: [() => {}]
		});
		r.expect(baseAssertion);
		r.property(WrappedTrigger, 'onKeyDown', Keys.Up, () => {});
		r.property(WrappedPopup, 'onOpen');
		r.expect(
			baseAssertion.replaceChildren(WrappedPopup, () => ({
				trigger: expandedTriggerAssertion,
				content: contentAssertion
			}))
		);
		assert.strictEqual(onValueStub.callCount, 0);
	});

	it('Should close the list on escape ', () => {
		const r = renderer(() => (
			<Typeahead
				resource={{ template: { template, id: 'test', initOptions: { data, id: 'test' } } }}
				onValue={onValueStub}
			/>
		));
		r.child(WrappedPopup, {
			trigger: [() => {}]
		});
		r.expect(baseAssertion);
		// open the drop down
		r.property(WrappedTrigger, 'onKeyDown', Keys.Down, () => {});
		r.expect(
			baseAssertion.replaceChildren(WrappedPopup, () => ({
				trigger: expandedTriggerAssertion,
				content: contentAssertion
			}))
		);
		// close the drop down
		r.property(WrappedTrigger, 'onKeyDown', Keys.Escape, () => {});
		r.expect(baseAssertion);
		assert.strictEqual(onValueStub.callCount, 0);
	});

	it('Should select item on enter ', () => {
		const r = renderer(() => (
			<Typeahead
				resource={{ template: { template, id: 'test', initOptions: { data, id: 'test' } } }}
				onValue={onValueStub}
			/>
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
		r.property(WrappedTrigger, 'onKeyDown', Keys.Enter, () => {});
		r.expect(
			baseAssertion.replaceChildren(WrappedPopup, () => ({
				trigger: triggerAssertion.setProperty(WrappedTrigger, 'value', 'Cat'),
				content: contentAssertion
					.setProperty(WrappedList, 'initialValue', '2')
					.setProperty(WrappedList, 'activeIndex', 1)
			}))
		);
		assert.strictEqual(onValueStub.callCount, 1);
	});

	it('Should select value on blur in non-strict mode', () => {
		const r = renderer(() => (
			<Typeahead
				resource={{ template: { template, id: 'test', initOptions: { data, id: 'test' } } }}
				onValue={onValueStub}
				strict={false}
			/>
		));
		r.child(WrappedPopup, {
			trigger: [() => {}]
		});
		r.expect(nonStrictModeBaseAssertion);
		// open the drop down
		r.property(WrappedTrigger, 'onClick');
		// focus second item from the drop down, `cat`
		r.property(WrappedTrigger, 'onValue', 'c');
		// blur to select the second item from the drop down, `cat`
		r.property(WrappedTrigger, 'onBlur');
		r.expect(
			nonStrictModeBaseAssertion.replaceChildren(WrappedPopup, () => ({
				trigger: triggerAssertion.setProperty(WrappedTrigger, 'value', 'c'),
				content: nonStrictModeContent.setProperty(WrappedList, 'initialValue', 'c')
			}))
		);
		assert.strictEqual(onValueStub.callCount, 1);
		assert.deepEqual(onValueStub.firstCall.args, [{ value: 'c', label: 'c' }]);
	});

	it('Should not be able to select a disabled item', () => {
		const r = renderer(() => (
			<Typeahead
				resource={{ template: { template, id: 'test', initOptions: { data, id: 'test' } } }}
				onValue={onValueStub}
			/>
		));
		r.child(WrappedPopup, {
			trigger: [() => {}]
		});
		r.expect(baseAssertion);
		// open the drop down
		r.property(WrappedTrigger, 'onClick');
		// focus second item from the drop down, `cat`
		r.property(WrappedTrigger, 'onKeyDown', Keys.Down, () => {});
		// focus third item from the drop down, `dog`
		r.property(WrappedTrigger, 'onKeyDown', Keys.Down, () => {});
		// try to select disabled third item from the drop down, `dog`
		r.property(WrappedTrigger, 'onKeyDown', Keys.Enter, () => {});
		r.expect(
			baseAssertion.replaceChildren(WrappedPopup, () => ({
				trigger: triggerAssertion,
				content: contentAssertion.setProperty(WrappedList, 'activeIndex', 2)
			}))
		);
		assert.strictEqual(onValueStub.callCount, 0);
	});

	it('Should not be able to select an item that is considered disabled by the `itemDisabled` property', () => {
		const r = renderer(() => (
			<Typeahead
				resource={{ template: { template, id: 'test', initOptions: { data, id: 'test' } } }}
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
		r.property(WrappedTrigger, 'onClick');
		r.property(WrappedTrigger, 'onKeyDown', Keys.Down, () => {});
		r.property(WrappedTrigger, 'onKeyDown', Keys.Enter, () => {});
		r.expect(
			disabledAssertion.replaceChildren(WrappedPopup, () => ({
				trigger: triggerAssertion,
				content: disabledContentAssertion.setProperty(WrappedList, 'activeIndex', 1)
			}))
		);
		assert.strictEqual(onValueStub.callCount, 0);
	});

	it('Should not be able to select an invalid item', () => {
		const r = renderer(() => (
			<Typeahead
				resource={{ template: { template, id: 'test', initOptions: { data, id: 'test' } } }}
				onValue={onValueStub}
			/>
		));
		r.child(WrappedPopup, {
			trigger: [() => {}]
		});
		r.expect(baseAssertion);
		r.property(WrappedTrigger, 'onClick');
		r.property(WrappedTrigger, 'onValue', 'Unknown');
		r.property(WrappedTrigger, 'onKeyDown', Keys.Enter, () => {});
		r.expect(baseAssertion);
		assert.strictEqual(onValueStub.callCount, 0);
	});

	it('Should be able to select a free text value in non-strict mode', () => {
		const r = renderer(() => (
			<Typeahead
				resource={{ template: { template, id: 'test', initOptions: { data, id: 'test' } } }}
				onValue={onValueStub}
				strict={false}
			/>
		));
		r.child(WrappedPopup, {
			trigger: [() => {}]
		});
		r.expect(nonStrictModeBaseAssertion);
		r.property(WrappedTrigger, 'onClick');
		r.property(WrappedTrigger, 'onValue', 'Unknown');
		r.property(WrappedTrigger, 'onKeyDown', Keys.Enter, () => {});
		r.expect(
			nonStrictModeBaseAssertion.replaceChildren(WrappedPopup, () => ({
				trigger: triggerAssertion.setProperty(WrappedTrigger, 'value', 'Unknown'),
				content: nonStrictModeContent.setProperty(WrappedList, 'initialValue', 'Unknown')
			}))
		);
		assert.strictEqual(onValueStub.callCount, 1);
	});

	it('Required typeahead should be validated when item is selected and then the typeahead blurred', () => {
		const toggleClosedStub = sb.stub();
		const r = renderer(() => (
			<Typeahead
				resource={{ template: { template, id: 'test', initOptions: { data, id: 'test' } } }}
				onValue={onValueStub}
				strict={false}
				required={true}
			/>
		));
		r.child(WrappedPopup, {
			trigger: [() => {}],
			content: [toggleClosedStub, 'above']
		});
		r.expect(nonStrictModeBaseAssertion);
		r.property(WrappedPopup, 'onClose');
		r.property(WrappedList, 'onValue', {
			value: '1',
			label: 'Dog'
		});
		const validatedAssertion = nonStrictModeBaseAssertion
			.setProperty(WrappedHelperText, 'valid', true)
			.setProperty(WrappedRoot, 'classes', [null, css.root, null, css.valid, false])
			.replaceChildren(WrappedPopup, () => ({
				trigger: triggerAssertion
					.setProperty(WrappedTrigger, 'value', 'Dog')
					.setProperty(WrappedTrigger, 'valid', true),
				content: nonStrictModeContent.setProperty(WrappedList, 'initialValue', '1')
			}));
		r.expect(validatedAssertion);
		r.property(WrappedTrigger, 'onBlur');
		r.expect(validatedAssertion);
	});

	it('Typeahead onValue should not be called with an empty value', () => {
		const toggleClosedStub = sb.stub();
		const r = renderer(() => (
			<Typeahead
				resource={{ template: { template, id: 'test', initOptions: { data, id: 'test' } } }}
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
			.setProperty(WrappedRoot, 'classes', [null, css.root, null, false, false])
			.replaceChildren(WrappedPopup, () => ({
				trigger: triggerAssertion.setProperties(WrappedTrigger, (current: any) => {
					return {
						...current,
						value: 'free text',
						aria: { ...current.aria, expanded: 'true' }
					};
				}),
				content: nonStrictModeContent.setProperty(WrappedList, 'initialValue', undefined)
			}));
		r.expect(expandedAssertion);
		r.property(WrappedTrigger, 'onValue', '');
		r.property(WrappedTrigger, 'onBlur');
		r.expect(
			expandedAssertion.replaceChildren(WrappedPopup, () => ({
				trigger: triggerAssertion.setProperties(WrappedTrigger, (current: any) => {
					return { ...current, value: '', aria: { ...current.aria, expanded: 'false' } };
				}),
				content: nonStrictModeContent.setProperty(WrappedList, 'initialValue', '')
			}))
		);
		assert.strictEqual(onValueStub.callCount, 0);
	});

	it('deals with loading items in non strict mode', async () => {
		const resolvers: any[] = [];
		const promises: any[] = [];
		const template = createResourceTemplate<any, any>({
			read: (req, controls) => {
				const prom = new Promise((res) => {
					resolvers.push(res);
				});
				promises.push(prom);
				return prom.then(() => {
					memoryTemplate.read(req, controls);
				});
			},
			find: memoryTemplate.find,
			init: memoryTemplate.init
		});
		const toggleClosedStub = sb.stub();
		const r = renderer(() => (
			<Typeahead
				resource={{ template: { template, id: 'test', initOptions: { data, id: 'test' } } }}
				onValue={onValueStub}
				strict={false}
			/>
		));
		r.child(WrappedPopup, {
			trigger: [() => {}],
			content: [toggleClosedStub, 'above']
		});
		r.expect(nonStrictModeBaseAssertion);
		let resolver = resolvers.shift();
		let promise = promises.shift();
		resolver && resolver();
		await promise;
		r.expect(nonStrictModeBaseAssertion);
		r.property(WrappedTrigger, 'onValue', 'dog');
		const expandedAssertion = nonStrictModeBaseAssertion.replaceChildren(WrappedPopup, () => ({
			trigger: expandedTriggerAssertion.setProperty(WrappedTrigger, 'value', 'dog'),
			content: nonStrictModeContent
		}));
		r.expect(expandedAssertion);
		resolver = resolvers.shift();
		promise = promises.shift();
		resolver();
		await promise;
		const expandedSelectedAssertion = nonStrictModeBaseAssertion.replaceChildren(
			WrappedPopup,
			() => ({
				trigger: expandedTriggerAssertion.setProperty(WrappedTrigger, 'value', 'dog'),
				content: nonStrictModeContent.setProperty(WrappedList, 'activeIndex', 0)
			})
		);
		r.expect(expandedSelectedAssertion);
	});
});
