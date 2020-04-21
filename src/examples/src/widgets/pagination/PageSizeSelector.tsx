import { create, tsx } from '@dojo/framework/core/vdom';
import Pagination from '@dojo/widgets/pagination';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';

interface BasicCache {
	pageSize: number;
}

const icache = createICacheMiddleware<BasicCache>();
const factory = create({ icache });

export default factory(function Pagesize({ middleware: { icache } }) {
	const pageSize = icache.getOrSet('pageSize', 20);

	return (
		<Example>
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
		</Example>
	);
});
