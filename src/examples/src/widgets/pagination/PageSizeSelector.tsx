import { create, tsx } from '@dojo/framework/core/vdom';
import Pagination from '@dojo/widgets/pagination';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';

interface BasicCache {
	pageSize: number;
}

const icache = createICacheMiddleware<BasicCache>();
const factory = create({ icache });

const Example = factory(function Example({ middleware: { icache } }) {
	const pageSize = icache.getOrSet('pageSize', 20);

	return (
		<div>
			<Pagination
				initialPage={8}
				initialPageSize={pageSize}
				total={25}
				onPage={() => {}}
				onPageSize={(value) => {
					icache.set('pageSize', value);
				}}
				pageSizes={[10, 20, 30]}
			/>
			<div>Current page size is: {pageSize.toString()}</div>
		</div>
	);
});

export default Example;
