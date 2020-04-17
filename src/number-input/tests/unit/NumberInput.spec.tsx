const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import * as sinon from 'sinon';

import { tsx } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import { harness } from '@dojo/framework/testing/harness/harness';

import TextInput, { BaseInputProperties } from '../../../text-input';
import * as textInputCss from '../../../theme/default/text-input.m.css';
import { compareTheme } from '../../../common/tests/support/test-helpers';

import NumberInput from '../..';

const noop = () => {};

const baseTemplate = assertionTemplate(() => (
	<TextInput
		type="number"
		theme={{ '@dojo/widgets/text-input': textInputCss }}
		onValue={noop}
		initialValue={undefined}
		value={undefined}
	/>
));

registerSuite('NumberInput', {
	tests: {
		'default properties'() {
			const h = harness(() => <NumberInput />, [compareTheme]);
			h.expect(baseTemplate);
		},
		'can take controlled property'() {
			const h = harness(() => <NumberInput value={42} />, [compareTheme]);
			h.expect(baseTemplate.setProperty(':root', 'value', '42'));
		},
		'passes expected properties to underlying TextInput'() {
			const baseProperties: BaseInputProperties<{ value: number }> = {
				aria: { foo: 'bar' },
				autocomplete: true,
				disabled: true,
				helperText: 'helper text',
				labelHidden: true,
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
				initialValue: 42,
				widgetId: 'widgetId',
				value: undefined
			};

			const h = harness(
				() => (
					<NumberInput {...baseProperties}>
						{{ label: 'label', leading: <div />, trailing: <div /> }}
					</NumberInput>
				),
				[compareTheme]
			);
			h.expect(
				baseTemplate
					.setProperties(':root', {
						...baseProperties,
						initialValue: baseProperties.initialValue!.toString(),
						type: 'number',
						theme: { '@dojo/widgets/text-input': textInputCss }
					})
					.setChildren(':root', [
						{ label: 'label', leading: <div />, trailing: <div /> }
					] as any)
			);
		},
		'passes correct value to underlying TextInput'() {
			const value = 42;
			const h = harness(() => <NumberInput initialValue={value} />, [compareTheme]);
			h.expect(baseTemplate.setProperty(':root', 'initialValue', value.toString()));
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
