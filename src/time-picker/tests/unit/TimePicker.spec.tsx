import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import { tsx } from '@dojo/framework/core/vdom';
import TimePicker from '../../index';
import Select from '../../../select';
import harness from '@dojo/framework/testing/harness';
import { MenuOption } from '@dojo/widgets/menu';
import { padStart } from '@dojo/framework/shim/string';
import { compareTheme } from '../../../common/tests/support/test-helpers';
import * as selectCss from '../../../theme/default/select.m.css';

const { registerSuite } = intern.getInterface('object');

function generateOptions(step: number, dateOptions: Intl.DateTimeFormatOptions = {}) {
	const options: MenuOption[] = [];

	const dt = new Date(1970, 0, 1, 0, 0, 0, 0);
	while (dt.getDate() === 1) {
		const value = `${padStart(String(dt.getHours()), 2, '0')}:${padStart(
			String(dt.getMinutes()),
			2,
			'0'
		)}:${padStart(String(dt.getSeconds()), 2, '0')}`;

		options.push({
			label: dt.toLocaleTimeString(undefined, dateOptions),
			value,
			disabled: false
		});

		dt.setSeconds(dt.getSeconds() + step);
	}

	return options;
}

const options30Minutes = generateOptions(1800, {
	hour12: false,
	hour: 'numeric',
	minute: 'numeric'
});

const baseAssertion = assertionTemplate(() => (
	<Select
		key="root"
		initialValue={undefined}
		options={options30Minutes}
		onValue={() => undefined}
		required={undefined}
		disabled={undefined}
		label={undefined}
		name={undefined}
		focus={undefined}
		onValidate={undefined}
		theme={{ '@dojo/widgets/select': selectCss }}
	/>
));

registerSuite('TimePicker', {
	'renders options'() {
		const h = harness(() => <TimePicker />, [compareTheme]);

		h.expect(baseAssertion);
	},

	'passes properties down to Select'() {
		const focus = () => false;
		const onValue = () => {};
		const onValidate = () => {};

		const h = harness(
			() => (
				<TimePicker
					disabled
					label="Test"
					initialValue={'one'}
					name={'name'}
					required={true}
					focus={focus}
					onValue={onValue}
					onValidate={onValidate}
				/>
			),
			[compareTheme]
		);

		h.expect(
			baseAssertion.setProperties('@root', {
				key: 'root',
				initialValue: 'one',
				options: options30Minutes,
				onValue,
				required: true,
				disabled: true,
				label: 'Test',
				name: 'name',
				focus,
				onValidate,
				theme: { '@dojo/widgets/select': selectCss }
			})
		);
	},

	'disables items'() {
		const h = harness(() => <TimePicker timeDisabled={(date) => date.getHours() === 1} />, [
			compareTheme
		]);

		h.expect(
			baseAssertion.setProperty(
				'@root',
				'options',
				options30Minutes.map((opt) =>
					opt.value.indexOf('01') === 0 ? { ...opt, disabled: true } : opt
				)
			)
		);
	},

	'uses min and max'() {
		const h = harness(() => <TimePicker min="12:00:00" max="21:00:00" />, [compareTheme]);

		h.expect(
			baseAssertion.setProperty(
				'@root',
				'options',
				options30Minutes.filter((opt) => {
					const parts = opt.value.split(':');

					const h = parseInt(parts[0], 10);
					const m = parseInt(parts[1], 10);

					return (h >= 12 && h <= 20) || (h === 21 && !m);
				})
			)
		);
	}
});
