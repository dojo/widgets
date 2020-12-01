import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { create, tsx } from '@dojo/framework/core/vdom';
import Button from '@dojo/widgets/button';
import Form, { FormField, FormGroup } from '@dojo/widgets/form';
import TextInput from '@dojo/widgets/text-input';

import Example from '../../Example';

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
		<Example>
			<Form onValue={(values) => icache.set('basic', { ...icache.get('basic'), ...values })}>
				{(form) => {
					const { field } = form<Fields>();
					const firstName = field('firstName', true);
					const middleName = field('middleName');
					const lastName = field('lastName', true);
					const email = field('email');

					return (
						<virtual>
							<FormGroup>
								<FormField>
									<TextInput
										key="firstName"
										placeholder="Enter first name (must be Billy)"
										required={true}
										initialValue={firstName.value()}
										valid={firstName.valid()}
										onValue={firstName.value}
										onValidate={firstName.valid}
									>
										{{ label: 'First Name' }}
									</TextInput>
								</FormField>
								<FormField>
									<TextInput
										key="middleName"
										placeholder="Enter a middle name"
										required={middleName.required()}
										initialValue={middleName.value()}
										valid={middleName.valid()}
										onValue={middleName.value}
										onValidate={middleName.valid}
									>
										{{ label: 'Middle Name' }}
									</TextInput>
								</FormField>
								<FormField>
									<TextInput
										key="lastName"
										placeholder="Enter a last name"
										required={true}
										initialValue={lastName.value()}
										valid={lastName.valid()}
										onValue={lastName.value}
										onValidate={lastName.valid}
									>
										{{ label: 'Last Name' }}
									</TextInput>
								</FormField>
							</FormGroup>
							<FormGroup>
								<FormField>
									<TextInput
										key="email"
										placeholder="Enter an email address"
										initialValue={email.value()}
										onValue={email.value}
										type="email"
									>
										{{ label: 'Email' }}
									</TextInput>
								</FormField>
							</FormGroup>
							<Button
								key="requireMiddleName"
								type="button"
								onClick={() => middleName.required(!middleName.required())}
							>
								{`Make middle name ${
									middleName.required() ? 'optional' : 'required'
								}`}
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
		</Example>
	);
});

export default App;
