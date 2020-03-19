import { create, tsx } from '@dojo/framework/core/vdom';
import Breadcrumb from '@dojo/widgets/breadcrumb';

const factory = create();

const App = factory(function() {
	const items = [{ label: 'Home' }, { label: 'Overview' }, { label: 'Tests' }];

	return <Breadcrumb label="breadcrumb" current={1} items={items} />;
});

export default App;
