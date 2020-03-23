import { create, tsx } from '@dojo/framework/core/vdom';
import Breadcrumb from '@dojo/widgets/breadcrumb';

const factory = create();

const App = factory(function() {
	return <Breadcrumb current="step" item={{ label: 'Step 1' }} />;
});

export default App;
