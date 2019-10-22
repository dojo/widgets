import { tsx } from '@dojo/framework/core/vdom';
const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import * as sinon from 'sinon';

import { harness } from '@dojo/framework/testing/harness';
import NumberInput from '../../NumberInput';
import TextInput, { BaseInputProperties } from '../../../../text-input';

const noop = () => {};

const expected = function(
	{
		value,
		baseProperties
	}: {
		value?: string;
		baseProperties?: BaseInputProperties<{ value: number }>;
	} = {
		value: undefined,
		baseProperties: undefined
	}
) {
	return function() {
		return (
			<TextInput
				{...baseProperties}
				assertion-key="textInput"
				type="number"
				value={value}
				onValue={() => {}}
			/>
		);
	};
};

registerSuite('NumberInput', {
	tests: {
		'default properties'() {
			const h = harness(() => <NumberInput />);
			h.expect(expected());
		},
		'passes expected properties to underlying TextInput'() {
			const baseProperties: BaseInputProperties<{ value: number }> = {
				aria: { foo: 'bar' },
				autocomplete: true,
				disabled: true,
				helperText: 'helper text',
				label: 'label',
				labelHidden: true,
				leading: () => <div />,
				name: 'name',
				onBlur: noop,
				onFocus: noop,
				onKeyDown: noop,
				onKeyUp: noop,
				onValidate: noop,
				onClick: noop,
				onOver: noop,
				onOut: noop,
				onValue: noop,
				readOnly: true,
				trailing: () => <div />,
				value: 42,
				widgetId: 'widgetId'
			};

			const h = harness(() => <NumberInput {...baseProperties} />);
			h.expect(expected({ value: baseProperties.value!.toString(), baseProperties }));
		},
		'passes correct value to underlying TextInput'() {
			const value = 42;
			const h = harness(() => <NumberInput value={value} />);
			h.expect(expected({ value: value.toString() }));
		},
		'calls onValue with correct value'() {
			const value = 42;
			const onValue = sinon.stub();

			const h = harness(() => <NumberInput onValue={onValue} />);
			h.trigger(':root', 'onValue', value.toString());
			assert.isTrue(onValue.calledWith(value));
		}
	}
});
