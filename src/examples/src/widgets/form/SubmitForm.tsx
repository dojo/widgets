import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';

import Button from '@dojo/widgets/button';
import TextInput from '@dojo/widgets/text-input';
import Form from '@dojo/widgets/form';
import { FormMiddleware } from '@dojo/widgets/form/middleware';

const icache = createICacheMiddleware<{
	basic?: Partial<Fields>;
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

	return (
		<virtual>
			<Form onSubmit={(values) => icache.set('basic', values)}>
				{({ valid, field }: FormMiddleware<Fields>) => {
					const firstName = field('firstName', true);
					const middleName = field('middleName');
					const lastName = field('lastName', true);
					const email = field('email');

					return (
						<virtual>
							<TextInput
								key="firstName"
								label="First Name"
								placeholder="Enter first name (must be Billy)"
								required={true}
								initialValue={firstName.value()}
								valid={firstName.valid()}
								onValue={firstName.value}
								onValidate={firstName.valid}
							/>
							<TextInput
								key="middleName"
								label="Middle Name"
								placeholder="Enter a middle name"
								initialValue={middleName.value()}
								onValue={middleName.value}
							/>
							<TextInput
								key="lastName"
								label="Last Name"
								placeholder="Enter a last name"
								required={true}
								initialValue={lastName.value()}
								valid={lastName.valid()}
								onValue={lastName.value}
								onValidate={lastName.valid}
							/>
							<TextInput
								key="email"
								label="Email"
								placeholder="Enter an email address"
								initialValue={email.value()}
								onValue={email.value}
								type="email"
							/>
							<Button key="submit" type="submit" disabled={!valid()}>
								Submit
							</Button>
						</virtual>
					);
				}}
			</Form>
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
