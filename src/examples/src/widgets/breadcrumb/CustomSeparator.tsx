import icache from '@dojo/framework/core/middleware/icache';
import { create, tsx } from '@dojo/framework/core/vdom';
import Breadcrumb from '@dojo/widgets/breadcrumb';
import Icon from '@dojo/widgets/icon';
import RadioGroup from '@dojo/widgets/radio-group';

const factory = create({ icache });

const App = factory(function({ middleware: { icache } }) {
	const items = [{ label: 'Home' }, { label: 'Widgets' }, { label: 'Breadcrumb' }];

	const separator = icache.get('separator-type') === 'icon' ? <Icon type="rightIcon" /> : '>';

	return (
		<virtual>
			<RadioGroup
				initialValue="text"
				label="Separator Type"
				name="separator-type"
				options={[{ value: 'text' }, { value: 'icon' }]}
				onValue={(value) => {
					icache.set('separator-type', value);
				}}
			/>

			<Breadcrumb label="breadcrumb" current={2} items={items} separator={separator} />
		</virtual>
	);
});

export default App;
