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
	firstName?: string;
	middleName?: string;
	lastName?: string;
	email?: string;
}

const App = factory(function({ middleware: { icache } }) {
	const results = icache.get('basic');

	return (
		<Example>
			<Form onValue={(values) => icache.set('basic', { ...icache.get('basic'), ...values })}>
				{(form) => {
					const { field, reset } = form<Fields>();
					const firstName = field('firstName');
					const middleName = field('middleName');
					const lastName = field('lastName');
					const email = field('email');

					return (
						<virtual>
							<FormGroup>
								<FormField>
									<TextInput
										key="firstName"
										placeholder="Enter first name"
										initialValue={firstName.value()}
										onValue={firstName.value}
									>
										{{ label: 'First Name' }}
									</TextInput>
								</FormField>
								<FormField>
									<TextInput
										key="middleName"
										placeholder="Enter a middle name"
										initialValue={middleName.value()}
										onValue={middleName.value}
									>
										{{ label: 'Middle Name' }}
									</TextInput>
								</FormField>
								<FormField>
									<TextInput
										key="lastName"
										placeholder="Enter a last name"
										initialValue={lastName.value()}
										onValue={lastName.value}
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
							<Button key="reset" type="button" onClick={() => reset()}>
								Reset
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
		</Example>
	);
});

export default App;
