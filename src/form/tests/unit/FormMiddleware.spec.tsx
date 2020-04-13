const { describe, it, beforeEach } = intern.getInterface('bdd');
import { assert } from 'chai';
import { assert as sinonAssert, mock, sandbox, match } from 'sinon';

import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';

import createFormMiddleware, { State } from '../../middleware';

interface Fields {
	firstName: string;
	middleName?: string;
	lastName: string;
	email?: string;
}

const sb = sandbox.create();
const invalidatorStub = sb.stub();

describe('Form Middleware', () => {
	const onSubmit = mock();
	const onValue = mock();
	const formMiddleware = createFormMiddleware<Fields>();
	let form: ReturnType<typeof formMiddleware>['api'];

	beforeEach(() => {
		onSubmit.resetHistory();
		onValue.resetHistory();

		const { callback: iCacheCallback } = createICacheMiddleware<State<Fields>>()();
		const icache = iCacheCallback({
			id: 'test',
			middleware: {
				destroy: sb.stub(),
				invalidator: invalidatorStub
			},
			properties: () => ({}),
			children: () => []
		});

		const { callback } = formMiddleware();
		form = callback({
			id: 'test',
			middleware: { icache },
			properties: () => ({}),
			children: () => []
		});
	});

	describe('value', () => {
		it('updates individual field values', () => {
			const firstName = form.field('firstName');
			firstName.value('New Value');

			const values = form.value();

			assert.strictEqual(
				values.firstName,
				'New Value',
				"First name value should equal 'New Value'"
			);
			assert.strictEqual(
				firstName.value(),
				'New Value',
				"First name value should equal 'New Value'"
			);
		});

		it('updates multiple field values', () => {
			form.value({
				firstName: 'New First Name',
				lastName: 'New Last Name'
			});

			const values = form.value();

			const firstName = form.field('firstName');
			const lastName = form.field('lastName');

			assert.strictEqual(
				values.firstName,
				'New First Name',
				"First name value should equal 'New First Name'"
			);
			assert.strictEqual(
				firstName.value(),
				'New First Name',
				"First name value should equal 'New First Name'"
			);
			assert.strictEqual(
				values.lastName,
				'New Last Name',
				"Last name value should equal 'New Last Name'"
			);
			assert.strictEqual(
				lastName.value(),
				'New Last Name',
				"Last name value should equal 'New Last Name'"
			);
		});

		it('calls onValue when values change', () => {
			const firstName = form.field('firstName');
			const lastName = form.field('lastName');

			onValue.atMost(3);

			form.onValue(onValue);

			firstName.value('New Value');
			sinonAssert.calledWith(onValue.lastCall, match({ firstName: 'New Value' }));

			lastName.value('New Value');
			sinonAssert.calledWith(onValue.lastCall, match({ lastName: 'New Value' }));

			form.value({
				firstName: 'New First Name',
				lastName: 'New Last Name'
			});
			sinonAssert.calledWith(
				onValue.lastCall,
				match({
					firstName: 'New First Name',
					lastName: 'New Last Name'
				})
			);
		});
	});

	describe('required', () => {
		it('uses default required', () => {
			const firstName = form.field('firstName', true);
			const middleName = form.field('middleName');

			assert.strictEqual(firstName.required(), true, 'First name should be required');
			assert.strictEqual(middleName.required(), false, 'Middle name should not be required');
		});

		it('overrides default required', () => {
			const firstName = form.field('firstName', true);
			const middleName = form.field('middleName');

			firstName.required(false);
			middleName.required(true);

			assert.strictEqual(firstName.required(), false, 'First name should not be required');
			assert.strictEqual(middleName.required(), true, 'Middle name should be required');
		});

		it('handles toggling required', () => {
			const email = form.field('email');

			assert.strictEqual(form.valid(), true, 'Form should be valid');
			assert.strictEqual(email.required(), false, 'Email should be required');

			email.required(true);

			assert.strictEqual(form.valid(), false, 'Form should be invalid');
			assert.strictEqual(email.required(), true, 'Email should be required');

			email.required(false);

			assert.strictEqual(form.valid(), true, 'Form should be valid');
			assert.strictEqual(email.required(), false, 'Email should be required');
		});
	});

	describe('disabled', () => {
		it('disables a field', () => {
			const middleName = form.field('middleName');
			assert.strictEqual(middleName.disabled(), false, 'Middle name should not be disabled');

			middleName.disabled(true);
			assert.strictEqual(middleName.disabled(), true, 'Middle name should be disabled');

			middleName.disabled(false);
			assert.strictEqual(middleName.disabled(), false, 'Middle name should not be disabled');
		});

		it('disables a form', () => {
			const middleName = form.field('middleName');
			assert.strictEqual(form.disabled(), false, 'Form should not be disabled');

			form.disabled(true);
			assert.strictEqual(form.disabled(), true, 'Form should be disabled');
			assert.strictEqual(middleName.disabled(), true, 'Middle name should be disabled');

			form.disabled(false);
			assert.strictEqual(form.disabled(), false, 'Form should not be disabled');
			assert.strictEqual(middleName.disabled(), false, 'Middle name should not be disabled');
		});
	});

	describe('valid', () => {
		it('handles validity for required field', () => {
			const firstName = form.field('firstName', true);

			assert.strictEqual(form.valid(), false, 'Form should be invalid');
			assert.deepEqual(
				firstName.valid(),
				{ valid: undefined, message: '' },
				'First name validity should not yet be set'
			);

			firstName.valid(true, undefined);

			assert.strictEqual(form.valid(), true, 'Form should be valid');
			assert.strictEqual(firstName.valid(), true, 'First name should be valid');
		});

		it('handles validity for non-required field', () => {
			const email = form.field('email');

			assert.strictEqual(form.valid(), true, 'Form should be valid');
			assert.deepEqual(
				email.valid(),
				{ valid: undefined, message: '' },
				'Email validity should not yet be set'
			);

			email.valid(true, undefined);

			assert.strictEqual(form.valid(), true, 'Form should be valid');
			assert.strictEqual(email.valid(), true, 'Email should be valid');

			email.valid(false, 'Not a valid email');

			assert.strictEqual(form.valid(), false, 'Form should be invalid');
			assert.deepEqual(
				email.valid(),
				{ valid: false, message: 'Not a valid email' },
				'Email should be invalid'
			);
		});
	});

	describe('onSubmit', () => {
		it('returns values from form', () => {
			form.value({
				firstName: 'First Name',
				middleName: 'Middle Name'
			});

			form.submit(onSubmit);

			sinonAssert.calledWith(onSubmit, {
				firstName: 'First Name',
				middleName: 'Middle Name'
			});
		});

		it('returns values from form with defaults', () => {
			form.value({
				firstName: 'First Name',
				middleName: 'Middle Name'
			});

			form.submit(onSubmit, {
				firstName: 'Default First Name',
				lastName: 'Default Last Name'
			});

			sinonAssert.calledWith(onSubmit, {
				firstName: 'First Name',
				middleName: 'Middle Name',
				lastName: 'Default Last Name'
			});
		});

		it('does not call onSubmit if form is invalid', () => {
			const lastName = form.field('lastName');
			form.value({
				firstName: 'First Name',
				middleName: 'Middle Name'
			});

			lastName.valid(false, 'Required!');

			form.submit(onSubmit);

			sinonAssert.notCalled(onSubmit);
		});
	});

	describe('reset', () => {
		it('resets the form', () => {
			const firstName = form.field('firstName', true);
			const middleName = form.field('middleName');
			form.value({
				firstName: 'First Name'
			});

			form.disabled(true);
			firstName.disabled(true);
			firstName.valid(true);
			middleName.required(true);
			middleName.valid(false, 'Required!');

			assert.strictEqual(form.valid(), false, 'Form should be invalid');
			assert.strictEqual(form.disabled(), true, 'Form should be disabled');
			assert.strictEqual(firstName.disabled(), true, 'First name should be disabled');
			assert.strictEqual(firstName.required(), true, 'First name should be required');
			assert.strictEqual(firstName.valid(), true, 'First name should be valid');
			assert.strictEqual(
				firstName.value(),
				'First Name',
				"First name value should equal 'First Name'"
			);
			assert.strictEqual(middleName.required(), true, 'Middle name should be required');
			assert.deepEqual(
				middleName.valid(),
				{ valid: false, message: 'Required!' },
				'Middle name should be invalid'
			);

			form.reset();

			assert.strictEqual(form.valid(), true, 'Form should be valid');
			assert.strictEqual(form.disabled(), false, 'Form should not be disabled');
			assert.strictEqual(firstName.disabled(), false, 'First name should not be disabled');
			assert.strictEqual(firstName.required(), false, 'First name should not be required');
			assert.deepEqual(
				firstName.valid(),
				{ valid: undefined, message: '' },
				'First name validity should not yet be set'
			);
			assert.isUndefined(firstName.value(), 'First name value should be undefined');
			assert.strictEqual(middleName.required(), false, 'Middle name should not be required');
			assert.deepEqual(
				middleName.valid(),
				{ valid: undefined, message: '' },
				'First name validity should not yet be set'
			);
		});
	});
});
