import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';

import Button from '@dojo/widgets/button';
import TextInput from '@dojo/widgets/text-input';
import Form from '@dojo/widgets/form';
import { FormMiddleware } from '@dojo/widgets/form/middleware';

const icache = createICacheMiddleware<{
	basic: Partial<Fields>;
	basicOnValue: Partial<Fields>;
	dirty: boolean;
}>();

const factory = create({ icache });

interface Fields {
	firstName: string;
	middleName?: string;
	lastName: string;
	email?: string;
}

const App = factory(function({ middleware: { icache } }) {
	const results = icache.get('basic');
	const onValueResults = icache.get('basicOnValue');

	return (
		<virtual>
			<Form
				initialValue={{
					firstName: 'Billy'
				}}
				onSubmit={(values) => icache.set('basic', values)}
				onValue={(values) =>
					icache.set('basicOnValue', { ...icache.get('basicOnValue'), ...values })
				}
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
						<Button
							key="reset"
							type="button"
							disabled={disabled()}
							onClick={() => reset()}
						>
							Reset
						</Button>,
						<Button
							key="disableForm"
							type="button"
							onClick={() => disabled(!disabled())}
						>
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
			{}
			{onValueResults && (
				<div key="onValueResults">
					<h2>onValue Results</h2>
					<ul>
						<li>First Name: {onValueResults.firstName}</li>
						<li>Middle Name: {onValueResults.middleName}</li>
						<li>Last Name: {onValueResults.lastName}</li>
						<li>Email: {onValueResults.email}</li>
					</ul>
				</div>
			)}
			{results && (
				<div key="onSubmitResults">
					<h2>onSubmit Results</h2>
					<ul>
						<li>First Name: {results.firstName}</li>
						<li>Middle Name: {results.middleName}</li>
						<li>Last Name: {results.lastName}</li>
						<li>Email: {results.email}</li>
					</ul>
				</div>
			)}
		</virtual>
	);
});

export default App;
