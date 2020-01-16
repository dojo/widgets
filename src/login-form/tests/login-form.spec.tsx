import harness from '@dojo/framework/testing/harness';
import Button from '../../button';
import * as css from '../../theme/default/login-form.m.css';
import LoginForm from '../index';
import Form from '../../form';
import select from '@dojo/framework/testing/support/selector';
import { tsx } from '@dojo/framework/core/vdom';
import TextInput from '../../text-input';
import PasswordInput from '../../password-input';
import { stub } from 'sinon';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import bundle from '../nls';
const { describe, it, beforeEach } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

describe('Login Form', () => {
	const onSubmitStub = stub();
	const formRenderStub = {
		field: stub().returns({
			valid: stub(),
			value: stub(),
			required: stub().returns(true)
		}),
		valid: stub()
	};

	const { messages } = bundle;

	const baseTemplate = assertionTemplate(() => (
		<div classes={css.root}>
			<Form key="form" onSubmit={() => {}} initialValue={undefined}>
				{() => <div />}
			</Form>
		</div>
	));

	const formRenderTemplate = assertionTemplate(() => (
		<virtual>
			<div classes={css.field}>
				<TextInput
					key="username"
					label={messages.username}
					name="username"
					required={true}
					value={undefined}
					valid={undefined}
					onValue={() => {}}
					onValidate={() => {}}
				/>
			</div>
			<div classes={css.field}>
				<PasswordInput
					key="password"
					label={messages.password}
					name="password"
					required={true}
					value={undefined}
					onValue={() => {}}
					onValidate={() => {}}
				/>
			</div>
			<div key="buttonHolder" classes={css.buttonHolder}>
				<Button key="loginButton" type="submit" disabled={true}>
					{messages.login}
				</Button>
			</div>
		</virtual>
	));

	beforeEach(() => {
		onSubmitStub.resetHistory();
	});

	it('renders with default properties', () => {
		const h = harness(() => <LoginForm onSubmit={onSubmitStub} />);
		h.expect(baseTemplate);
	});

	it('form renders default inputs', () => {
		const h = harness(() => <LoginForm onSubmit={onSubmitStub} />);

		const formRenderResult = h.trigger(
			'@form',
			(node) => (node.children as any)[0],
			formRenderStub
		);
		h.expect(formRenderTemplate, () => formRenderResult);
	});

	it('shows forgot passsword link with callback', () => {
		const onForgotPasswordStub = stub();
		const h = harness(() => (
			<LoginForm onForgotPassword={onForgotPasswordStub} onSubmit={onSubmitStub} />
		));

		const formRenderResult = h.trigger(
			'@form',
			(node) => (node.children as any)[0],
			formRenderStub
		);

		const forgotPasswordTemplate = formRenderTemplate.insertAfter('@buttonHolder', [
			<div classes={css.forgotPassword}>
				<a key="forgotPasswordLink" classes={css.forgotPasswordLink} onclick={() => {}}>
					{messages.forgot}
				</a>
			</div>
		]);
		h.expect(forgotPasswordTemplate, () => formRenderResult);

		const [forgotPasswordLink] = select('@forgotPasswordLink', formRenderResult);

		forgotPasswordLink.properties.onclick({ preventDefault: stub(), stopPropagation: stub() });
		assert.isTrue(onForgotPasswordStub.calledOnce);
	});

	it('calls onSubmit callback when form is submitted', () => {
		const h = harness(() => <LoginForm onSubmit={onSubmitStub} />);
		h.trigger('@form', 'onSubmit', { username: 'test-user', password: 'test-password' });
		assert.isTrue(
			onSubmitStub.calledWith({ username: 'test-user', password: 'test-password' })
		);
	});
});
