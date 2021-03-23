import { create, tsx } from '@dojo/framework/core/vdom';
import List, { ListItem } from '@dojo/widgets/list';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import { listOptionTemplate } from '../../template';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	return (
		<Example>
			<virtual>
				<div styles={{ height: '250px' }}>
					<List
						itemsInView="fill"
						resource={{ template: listOptionTemplate }}
						onValue={(value) => {
							icache.set('value', value);
						}}
					>
						{({ label, selected }, props) => {
							return (
								<ListItem {...props} selected={selected}>
									<h1>{label}</h1>
								</ListItem>
							);
						}}
					</List>
				</div>
				<p>{`Clicked on: ${JSON.stringify(icache.getOrSet('value', ''))}`}</p>
			</virtual>
		</Example>
	);
});
