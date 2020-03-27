import { create, tsx } from '@dojo/framework/core/vdom';
import BreadcrumbGroup from '@dojo/widgets/breadcrumb-group';

const factory = create();

const App = factory(function() {
	const items = [
		{ label: 'Home', href: '/' },
		{
			label: 'Overview',
			href: '/#widget/breadcrumb/overview',
			title: 'Breadcrumb Overview'
		},
		{
			label: 'Tests',
			href: '/#widget/breadcrumb/tests',
			title: 'Breadcrumb Tests'
		}
	];

	return <BreadcrumbGroup label="breadcrumb" items={items} />;
});

export default App;
