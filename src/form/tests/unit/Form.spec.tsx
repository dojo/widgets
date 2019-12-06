const { describe, it, beforeEach } = intern.getInterface('bdd');
import { assert } from 'chai';
import { stub } from 'sinon';

import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import harness from '@dojo/framework/testing/harness';
import { tsx } from '@dojo/framework/core/vdom';

import Button from '../../../button';
import TextInput from '../../../text-input';

import { stubEvent } from '../../../common/tests/support/test-helpers';

import * as css from '../../../theme/form.m.css';
import { FormMiddleware } from '../../middleware';
import Form from '../../index';

interface Fields {
	firstName: string;
	middleName?: string;
	lastName: string;
	email?: string;
}

describe('Form', () => {
	const noop = () => {};
	const baseAssertion = assertionTemplate(() => (
		<form classes={css.root} onsubmit={noop}>
			<TextInput
				key="firstName"
				label="First Name"
				placeholder="Enter first name (must be Billy)"
				pattern="Billy"
				required={true}
				value="Billy"
				valid={{
					valid: undefined,
					message: ''
				}}
				onValue={noop}
				onValidate={noop}
				disabled={false}
			/>
			<TextInput
				key="middleName"
				label="Middle Name"
				placeholder="Enter a middle name"
				required={false}
				value={undefined}
				valid={{
					valid: undefined,
					message: ''
				}}
				onValue={noop}
				onValidate={noop}
				maxLength={5}
				disabled={false}
			/>
			<TextInput
				key="lastName"
				label="Last Name"
				placeholder="Enter a last name"
				required={true}
				value={undefined}
				valid={{
					valid: undefined,
					message: ''
				}}
				onValue={noop}
				onValidate={noop}
				minLength={2}
				disabled={false}
			/>
			<TextInput
				key="email"
				label="Email"
				placeholder="Enter an email address"
				required={false}
				value={undefined}
				valid={{
					valid: undefined,
					message: ''
				}}
				onValue={noop}
				onValidate={noop}
				type="email"
				pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$"
				disabled={false}
			/>
			<Button key="fill" type="button" disabled={false} onClick={noop}>
				Fill
			</Button>
			<Button key="requireMiddleName" type="button" disabled={false} onClick={noop}>
				Make middle name required
			</Button>
			<Button key="reset" type="button" disabled={false} onClick={noop}>
				Reset
			</Button>
			<Button key="disableForm" type="button" onClick={noop}>
				Disable Form
			</Button>
			<Button key="disableEmail" type="button" disabled={false} onClick={noop}>
				Disable Email
			</Button>
			<Button key="submit" type="submit" disabled={true}>
				Submit
			</Button>
		</form>
	));

	const onSubmit = stub();
	const onValue = stub();
	const form = () => (
		<Form
			initialValue={{
				firstName: 'Billy'
			}}
			onSubmit={onSubmit}
			onValue={onValue}
		>
			{({ value, valid, disabled, field, reset }: FormMiddleware<Fields>) => {
				const firstName = field('firstName', true);
				const middleName = field('middleName');
				const lastName = field('lastName', true);
				const email = field('email');

				return [
					<TextInput
						key="firstName"
						label="First Name"
						placeholder="Enter first name (must be Billy)"
						pattern="Billy"
						required={true}
						value={firstName.value()}
						valid={firstName.valid()}
						onValue={firstName.value}
						onValidate={firstName.valid}
						disabled={firstName.disabled()}
					/>,
					<TextInput
						key="middleName"
						label="Middle Name"
						placeholder="Enter a middle name"
						required={middleName.required()}
						value={middleName.value()}
						valid={middleName.valid()}
						onValue={middleName.value}
						onValidate={middleName.valid}
						maxLength={5}
						disabled={middleName.disabled()}
					/>,
					<TextInput
						key="lastName"
						label="Last Name"
						placeholder="Enter a last name"
						required={true}
						value={lastName.value()}
						valid={lastName.valid()}
						onValue={lastName.value}
						onValidate={lastName.valid}
						minLength={2}
						disabled={lastName.disabled()}
					/>,
					<TextInput
						key="email"
						label="Email"
						placeholder="Enter an email address"
						required={false}
						value={email.value()}
						valid={email.valid()}
						onValue={email.value}
						onValidate={email.valid}
						type="email"
						pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$"
						disabled={email.disabled()}
					/>,
					<Button
						key="fill"
						type="button"
						disabled={disabled()}
						onClick={() => {
							value({
								firstName: 'Billy',
								middleName: '',
								lastName: 'Bob'
							});
						}}
					>
						Fill
					</Button>,
					<Button
						key="requireMiddleName"
						type="button"
						disabled={disabled()}
						onClick={() => middleName.required(!middleName.required())}
					>
						{`Make middle name ${middleName.required() ? 'optional' : 'required'}`}
					</Button>,
					<Button key="reset" type="button" disabled={disabled()} onClick={() => reset()}>
						Reset
					</Button>,
					<Button key="disableForm" type="button" onClick={() => disabled(!disabled())}>
						{`${disabled() ? 'Enable' : 'Disable'} Form`}
					</Button>,
					<Button
						key="disableEmail"
						type="button"
						disabled={disabled()}
						onClick={() => email.disabled(!email.disabled())}
					>
						{`${email.disabled() ? 'Enable' : 'Disable'} Email`}
					</Button>,
					<Button key="submit" type="submit" disabled={!valid() || disabled()}>
						Submit
					</Button>
				];
			}}
		</Form>
	);

	beforeEach(() => {
		onSubmit.reset();
	});

	it('renders', () => {
		const h = harness(form);

		h.expect(baseAssertion);
	});

	it('properly handles onValue and onValidate', () => {
		const h = harness(form);

		h.expect(baseAssertion);
		assert.isTrue(onValue.calledWith({ firstName: 'Billy' }), 'onValue called');

		h.trigger('@firstName', 'onValidate', undefined);
		h.trigger('@middleName', 'onValidate', undefined);
		h.trigger('@lastName', 'onValidate', undefined);
		h.trigger('@email', 'onValidate', undefined);

		let assertion = baseAssertion;
		h.expect(assertion);

		h.trigger('@firstName', 'onValidate', undefined);
		h.trigger('@middleName', 'onValidate', undefined);
		h.trigger('@lastName', 'onValidate', undefined);
		h.trigger('@email', 'onValidate', undefined);

		h.expect(assertion);

		h.trigger('@firstName', 'onValue', 'Bobby');
		assert.isTrue(onValue.calledWith({ firstName: 'Bobby' }), 'onValue called');
		h.trigger('@middleName', 'onValue', 'Bo');
		assert.isTrue(onValue.calledWith({ middleName: 'Bo' }), 'onValue called');
		h.trigger('@lastName', 'onValue', 'Bob');
		assert.isTrue(onValue.calledWith({ lastName: 'Bob' }), 'onValue called');
		h.trigger('@email', 'onValue', 'test@example.com');
		assert.isTrue(onValue.calledWith({ email: 'test@example.com' }), 'onValue called');

		assertion = assertion
			.setProperty('@firstName', 'value', 'Bobby')
			.setProperty('@middleName', 'value', 'Bo')
			.setProperty('@lastName', 'value', 'Bob')
			.setProperty('@email', 'value', 'test@example.com');
		h.expect(assertion);

		h.trigger('@firstName', 'onValidate', false, 'Not Billy');
		h.trigger('@middleName', 'onValidate', true);
		h.trigger('@lastName', 'onValidate', true);
		h.trigger('@email', 'onValidate', true);

		assertion = assertion
			.setProperty('@firstName', 'valid', { valid: false, message: 'Not Billy' })
			.setProperty('@middleName', 'valid', true)
			.setProperty('@lastName', 'valid', true)
			.setProperty('@email', 'valid', true);
		h.expect(assertion);

		h.trigger('@firstName', 'onValue', 'Billy');
		assert.isTrue(onValue.calledWith({ firstName: 'Billy' }), 'onValue called');

		assertion = assertion.setProperty('@firstName', 'value', 'Billy');
		h.expect(assertion);

		h.trigger('@firstName', 'onValidate', true);

		assertion = assertion
			.setProperty('@firstName', 'valid', true)
			.setProperty('@submit', 'disabled', false);
		h.expect(assertion);

		h.trigger('@firstName', 'onValidate', true);
		h.trigger('@middleName', 'onValidate', true);
		h.trigger('@lastName', 'onValidate', true);
		h.trigger('@email', 'onValidate', true);

		h.expect(assertion);

		h.trigger('@firstName', 'onValue', 'Buddy');
		h.trigger('@middleName', 'onValue', '');
		h.trigger('@lastName', 'onValue', 'Bob');
		h.trigger('@email', 'onValue', 'notanemail');

		assertion = assertion
			.setProperty('@firstName', 'value', 'Buddy')
			.setProperty('@middleName', 'value', '')
			.setProperty('@lastName', 'value', 'Bob')
			.setProperty('@email', 'value', 'notanemail');
		h.expect(assertion);

		h.trigger('@firstName', 'onValidate', false, 'Not Billy');
		h.trigger('@middleName', 'onValidate', true);
		h.trigger('@lastName', 'onValidate', true);
		h.trigger('@email', 'onValidate', false, 'Not an email');

		assertion = assertion
			.setProperty('@firstName', 'valid', { valid: false, message: 'Not Billy' })
			.setProperty('@email', 'valid', { valid: false, message: 'Not an email' })
			.setProperty('@submit', 'disabled', true);
		h.expect(assertion);

		h.trigger('@firstName', 'onValue', '');

		assertion = assertion.setProperty('@firstName', 'value', '');
		h.expect(assertion);

		h.trigger('@firstName', 'onValidate', false, 'Required');

		assertion = assertion.setProperty('@firstName', 'valid', {
			valid: false,
			message: 'Required'
		});
		h.expect(assertion);
	});

	it('properly handles disabling single input', () => {
		const h = harness(form);

		h.trigger('@disableEmail', 'onClick');

		h.expect(
			baseAssertion
				.setProperty('@email', 'disabled', true)
				.setChildren('@disableEmail', () => ['Enable Email'])
		);

		h.trigger('@disableEmail', 'onClick');
		h.expect(baseAssertion);
	});

	it('properly handles disabling form', () => {
		const h = harness(form);

		h.trigger('@disableForm', 'onClick');

		h.expect(
			baseAssertion
				.setProperty('@firstName', 'disabled', true)
				.setProperty('@middleName', 'disabled', true)
				.setProperty('@lastName', 'disabled', true)
				.setProperty('@email', 'disabled', true)
				.setProperty('@requireMiddleName', 'disabled', true)
				.setProperty('@fill', 'disabled', true)
				.setProperty('@reset', 'disabled', true)
				.setProperty('@disableEmail', 'disabled', true)
				.setProperty('@submit', 'disabled', true)
				.setChildren('@disableForm', () => ['Enable Form'])
				.setChildren('@disableEmail', () => ['Enable Email'])
		);

		h.trigger('@disableForm', 'onClick');
		h.expect(baseAssertion);
	});

	it('toggles required flag on input', () => {
		const h = harness(form);

		h.trigger('@requireMiddleName', 'onClick');

		h.expect(
			baseAssertion
				.setProperty('@middleName', 'required', true)
				.setChildren('@requireMiddleName', () => ['Make middle name optional'])
		);

		h.trigger('@requireMiddleName', 'onClick');
		h.expect(baseAssertion);
	});

	it('calls onSubmit on form onsubmit', () => {
		const h = harness(form);

		h.expect(baseAssertion);

		h.trigger('@firstName', 'onValue', 'Billy');
		h.trigger('@middleName', 'onValue', 'Bo');
		h.trigger('@lastName', 'onValue', 'Bob');
		h.trigger('@email', 'onValue', 'test@example.com');
		h.trigger('@firstName', 'onValidate', true);
		h.trigger('@middleName', 'onValidate', true);
		h.trigger('@lastName', 'onValidate', true);
		h.trigger('@email', 'onValidate', true);

		h.expect(
			baseAssertion
				.setProperty('@firstName', 'value', 'Billy')
				.setProperty('@middleName', 'value', 'Bo')
				.setProperty('@lastName', 'value', 'Bob')
				.setProperty('@email', 'value', 'test@example.com')
				.setProperty('@firstName', 'valid', true)
				.setProperty('@middleName', 'valid', true)
				.setProperty('@lastName', 'valid', true)
				.setProperty('@email', 'valid', true)
				.setProperty('@submit', 'disabled', false)
		);

		h.trigger(':root', 'onsubmit', stubEvent);

		assert.isTrue(
			onSubmit.calledWith({
				firstName: 'Billy',
				middleName: 'Bo',
				lastName: 'Bob',
				email: 'test@example.com'
			})
		);
	});

	it('does not call onSubmit if form is invalid', () => {
		const h = harness(form);

		h.expect(baseAssertion);

		h.trigger('@firstName', 'onValue', 'Billy');
		h.trigger('@middleName', 'onValue', 'Bo');
		h.trigger('@firstName', 'onValidate', true);
		h.trigger('@middleName', 'onValidate', true);
		h.trigger('@lastName', 'onValidate', undefined, '');
		h.trigger('@email', 'onValidate', undefined, '');

		h.expect(
			baseAssertion
				.setProperty('@firstName', 'value', 'Billy')
				.setProperty('@middleName', 'value', 'Bo')
				.setProperty('@firstName', 'valid', true)
				.setProperty('@middleName', 'valid', true)
				.setProperty('@submit', 'disabled', true)
		);

		h.trigger(':root', 'onsubmit', stubEvent);

		assert.isFalse(onSubmit.called);
	});

	it('resets the form', () => {
		const h = harness(form);

		h.expect(baseAssertion);

		h.trigger('@firstName', 'onValue', 'Billy');
		h.trigger('@middleName', 'onValue', 'Bo');
		h.trigger('@lastName', 'onValue', 'Bob');
		h.trigger('@email', 'onValue', 'test@example.com');
		h.trigger('@firstName', 'onValidate', true);
		h.trigger('@middleName', 'onValidate', true);
		h.trigger('@lastName', 'onValidate', true);
		h.trigger('@email', 'onValidate', true);

		h.expect(
			baseAssertion
				.setProperty('@firstName', 'value', 'Billy')
				.setProperty('@middleName', 'value', 'Bo')
				.setProperty('@lastName', 'value', 'Bob')
				.setProperty('@email', 'value', 'test@example.com')
				.setProperty('@firstName', 'valid', true)
				.setProperty('@middleName', 'valid', true)
				.setProperty('@lastName', 'valid', true)
				.setProperty('@email', 'valid', true)
				.setProperty('@submit', 'disabled', false)
		);

		h.trigger('@reset', 'onClick');

		h.expect(
			baseAssertion
				.setProperty('@firstName', 'value', undefined)
				.setProperty('@submit', 'disabled', true)
		);
	});

	it('sets the values of the form', () => {
		const h = harness(form);

		h.expect(baseAssertion);

		h.trigger('@fill', 'onClick');

		h.expect(
			baseAssertion
				.setProperty('@firstName', 'value', 'Billy')
				.setProperty('@middleName', 'value', '')
				.setProperty('@lastName', 'value', 'Bob')
		);
	});
});
