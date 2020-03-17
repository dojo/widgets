import { create, tsx } from '@dojo/framework/core/vdom';
import Breadcrumb from '@dojo/widgets/breadcrumb';

const factory = create();

const App = factory(function() {
	const items = [
		{ key: 'home', label: 'Home', href: '/' },
		{
			key: 'overview',
			label: 'Overview',
			href: '/#widget/breadcrumb/overview',
			title: 'Breadcrumb Overview'
		},
		{
			key: 'tests',
			label: 'Tests',
			href: '/#widget/breadcrumb/tests',
			title: 'Breadcrumb Tests'
		}
	];

	return <Breadcrumb label="breadcrumb" current={1} items={items} />;
});

export default App;
