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
	firstName?: string;
	middleName?: string;
	lastName?: string;
	email?: string;
}

const App = factory(function({ middleware: { icache } }) {
	const results = icache.get('basic');

	return (
		<virtual>
			<Form onValue={(values) => icache.set('basic', { ...icache.get('basic'), ...values })}>
				{({ disabled, field }: FormMiddleware<Fields>) => {
					const firstName = field('firstName');
					const middleName = field('middleName');
					const lastName = field('lastName');
					const email = field('email');

					return (
						<virtual>
							<TextInput
								key="firstName"
								label="First Name"
								placeholder="Enter first name"
								initialValue={firstName.value()}
								onValue={firstName.value}
								disabled={firstName.disabled()}
							/>
							<TextInput
								key="middleName"
								label="Middle Name"
								placeholder="Enter a middle name"
								initialValue={middleName.value()}
								onValue={middleName.value}
								disabled={middleName.disabled()}
							/>
							<TextInput
								key="lastName"
								label="Last Name"
								placeholder="Enter a last name"
								initialValue={lastName.value()}
								onValue={lastName.value}
								disabled={lastName.disabled()}
							/>
							<TextInput
								key="email"
								label="Email"
								placeholder="Enter an email address"
								initialValue={email.value()}
								onValue={email.value}
								type="email"
								disabled={email.disabled()}
							/>
							<Button
								key="disableForm"
								type="button"
								onClick={() => disabled(!disabled())}
							>
								{`${disabled() ? 'Enable' : 'Disable'} Form`}
							</Button>
						</virtual>
					);
				}}
			</Form>
			{results && (
				<div key="onValueResults">
					<h2>onValue Results</h2>
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
