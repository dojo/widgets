import { create, tsx } from '@dojo/framework/core/vdom';
import Pagination from '@dojo/widgets/pagination';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import Slider from '@dojo/widgets/slider';
import Example from '../../Example';

interface BasicCache {
	currentPage: number;
}

const icache = createICacheMiddleware<BasicCache>();
const factory = create({ icache });

export default factory(function Controlled({ middleware: { icache } }) {
	const currentPage = icache.getOrSet('currentPage', 8);

	return (
		<Example>
			<Pagination
				page={currentPage}
				pageSize={10}
				total={25}
				onPage={(value) => {
					icache.set('currentPage', value);
				}}
			/>
			<Slider
				initialValue={currentPage}
				min={1}
				max={25}
				onValue={(value) => icache.set('currentPage', value || 1)}
			>
				{{ label: 'Current Page: ' }}
			</Slider>
		</Example>
	);
});
