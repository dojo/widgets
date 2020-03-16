import Rate from '@dojo/widgets/rate';
import { create, tsx } from '@dojo/framework/core/vdom';
import { icache } from '@dojo/framework/core/middleware/icache';
import Icon from '@dojo/widgets/icon';

const factory = create({ icache });

const App = factory(function({ properties, middleware: { icache } }) {
	const { get, set } = icache;

	return (
		<virtual>
			<Rate
				name="custom"
				onValue={(value) => {
					set('custom', value);
				}}
			>
				{(fill, index) => (fill ? <Icon type="upIcon" /> : <Icon type="downIcon" />)}
			</Rate>
			<pre>{`${get('custom')}`}</pre>
		</virtual>
	);
});

export default App;
