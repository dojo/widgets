import LoadingIndicator from '@dojo/widgets/loading-indicator';
import Switch from '@dojo/widgets/switch';
import icache from '@dojo/framework/core/middleware/icache';
import { create, tsx } from '@dojo/framework/core/vdom';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const active = icache.getOrSet('active', true);
	return (
		<Example>
			<virtual>
				<LoadingIndicator active={active} />
				<div styles={{ marginTop: '20px' }}>
					<Switch
						value={active}
						name="Active"
						onValue={(value) => {
							icache.set('active', value);
						}}
					>
						{{ label: 'Active' }}
					</Switch>
				</div>
			</virtual>
		</Example>
	);
});
