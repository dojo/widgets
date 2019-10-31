const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import * as sinon from 'sinon';

import { tsx } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import { harness } from '@dojo/framework/testing/harness';

import TextInput, { BaseInputProperties } from '../../../text-input';
import * as textInputCss from '../../../theme/text-input.m.css';
import { compareTheme } from '../../../common/tests/support/test-helpers';

import NumberInput from '../..';

const noop = () => {};

const baseTemplate = assertionTemplate(() => (
	<TextInput
		type="number"
		theme={{ '@dojo/widgets/text-input': textInputCss }}
		onValue={noop}
		value={undefined}
	/>
));

registerSuite('NumberInput', {
	tests: {
		'default properties'() {
			const h = harness(() => <NumberInput />, [compareTheme(textInputCss)]);
			h.expect(baseTemplate);
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

			const h = harness(() => <NumberInput {...baseProperties} />, [
				compareTheme(textInputCss)
			]);
			h.expect(
				baseTemplate.setProperties(':root', {
					...baseProperties,
					value: baseProperties.value!.toString(),
					type: 'number',
					theme: { '@dojo/widgets/text-input': textInputCss }
				})
			);
		},
		'passes correct value to underlying TextInput'() {
			const value = 42;
			const h = harness(() => <NumberInput value={value} />, [compareTheme(textInputCss)]);
			h.expect(baseTemplate.setProperty(':root', 'value', value.toString()));
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
