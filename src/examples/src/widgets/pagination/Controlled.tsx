import { create, tsx } from '@dojo/framework/core/vdom';
import Pagination from '@dojo/widgets/pagination';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import Slider from '@dojo/widgets/slider';

interface BasicCache {
	currentPage: number;
}

const icache = createICacheMiddleware<BasicCache>();
const factory = create({ icache });

const Example = factory(function Example({ middleware: { icache } }) {
	const currentPage = icache.getOrSet('currentPage', 8);

	return (
		<div>
			<div>
				<label>Current Page:</label>
				<Slider
					initialValue={currentPage}
					min={1}
					max={25}
					onValue={(value) => icache.set('currentPage', value || 1)}
				/>
			</div>

			<Pagination
				initialPage={currentPage}
				total={25}
				onPageChange={(value) => {
					icache.set('currentPage', value);
				}}
			/>
		</div>
	);
});

export default Example;
