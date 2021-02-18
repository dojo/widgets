import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { create, tsx } from '@dojo/framework/core/vdom';
import Button from '@dojo/widgets/button';
import Form, { FormField, FormGroup } from '@dojo/widgets/form';
import TextInput from '@dojo/widgets/text-input';
import TimePicker from '@dojo/widgets/time-picker';
import DateInput from '@dojo/widgets/date-input';

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
	time: string;
	date: string;
}

const App = factory(function({ middleware: { icache } }) {
	const results = icache.get('basic');

	return (
		<Example>
			<virtual>
				<Form
					onSubmit={(values) => {
						icache.set('basic', values);
					}}
				>
					{(form) => {
						const { valid, field } = form<Fields>();
						const firstName = field('firstName');
						const middleName = field('middleName');
						const lastName = field('lastName');
						const email = field('email');
						const time = field('time');
						const date = field('date');

						return (
							<virtual>
								<FormGroup>
									<FormField>
										<TextInput
											key="firstName"
											placeholder="Enter first name (must be Billy)"
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
									<FormField>
										<TimePicker
											itemsInView={5}
											format="12"
											step={900}
											value={time.value()}
											onValue={(value) => {
												time.value(value);
											}}
											onValidate={time.valid}
										>
											{{
												label: 'Time'
											}}
										</TimePicker>
									</FormField>
									<FormField>
										<DateInput
											value={date.value()}
											onValue={(value) => {
												date.value(value);
											}}
											onValidate={date.valid}
										>
											{{ label: 'Date' }}
										</DateInput>
									</FormField>
								</FormGroup>
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
						<pre>{JSON.stringify(results, null, 4)}</pre>
					</div>
				)}
			</virtual>
		</Example>
	);
});

export default App;
