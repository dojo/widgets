import { createHarness, compareTheme } from '../../../common/tests/support/test-helpers';
import * as textInputCss from '../../../theme/default/text-input.m.css';
import Button from '../../../button';
import Icon from '../../../icon';
import ConstrainedInput from '../../../constrained-input';
import PasswordInput from '../..';

import { tsx } from '@dojo/framework/core/vdom';
import TextInput from '../../../text-input';

const { describe, it } = intern.getInterface('bdd');
const harness = createHarness([compareTheme]);
const rules = { length: { min: 1 } };

describe('PasswordInput', () => {
	it('renders with default properties', () => {
		const h = harness(() => <PasswordInput rules={rules} />);
		h.expect(() => (
			<ConstrainedInput
				rules={rules}
				key="root"
				type={'password'}
				theme={{ '@dojo/widgets/text-input': textInputCss }}
			/>
		));
	});

	it('renders a textinput when no rules are passed', () => {
		const h = harness(() => <PasswordInput />);
		h.expect(() => (
			<TextInput
				key="root"
				type={'password'}
				theme={{ '@dojo/widgets/text-input': textInputCss }}
				onValidate={() => undefined}
				valid={undefined}
			/>
		));
	});

	it('handles required validation when no rules are passed', () => {
		const h = harness(() => <PasswordInput required />);
		h.trigger('@root', 'onValidate', false, 'this is required');
		h.expect(() => (
			<TextInput
				key="root"
				type={'password'}
				theme={{ '@dojo/widgets/text-input': textInputCss }}
				onValidate={() => undefined}
				required
				valid={{ valid: false, message: 'this is required' }}
			/>
		));
	});

	it('renders as a text input after click', () => {
		const h = harness(() => <PasswordInput rules={rules} />);
		h.expect(() => (
			<ConstrainedInput
				rules={rules}
				key="root"
				type={'password'}
				theme={{ '@dojo/widgets/text-input': textInputCss }}
			/>
		));

		const eyeRender = h.trigger('@root', 'trailing');
		h.expect(
			() => (
				<Button onClick={() => {}} theme={{}}>
					<Icon type="eyeIcon" />
				</Button>
			),
			() => eyeRender
		);

		h.trigger('@root', (node: any) => node.properties.trailing().properties.onClick);

		h.expect(() => (
			<ConstrainedInput
				rules={rules}
				key="root"
				type={'text'}
				theme={{ '@dojo/widgets/text-input': textInputCss }}
			/>
		));

		const slashRender = h.trigger('@root', 'trailing');
		h.expect(
			() => (
				<Button onClick={() => {}} theme={{}}>
					<Icon type="eyeSlashIcon" />
				</Button>
			),
			() => slashRender
		);
	});
});
