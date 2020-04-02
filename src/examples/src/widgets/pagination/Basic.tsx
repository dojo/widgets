import { create, tsx } from '@dojo/framework/core/vdom';
import Pagination from '@dojo/widgets/pagination';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';

interface BasicCache {
	currentPage: number;
}

const icache = createICacheMiddleware<BasicCache>();
const factory = create({ icache });

const Example = factory(function Example({ middleware: { icache } }) {
	const currentPage = icache.getOrSet('currentPage', 8);

	return (
		<div>
			<Pagination
				initialPage={8}
				total={25}
				onPage={(value) => {
					icache.set('currentPage', value);
				}}
			/>
			<div>Current page is: {currentPage.toString()}</div>
		</div>
	);
});

export default Example;
