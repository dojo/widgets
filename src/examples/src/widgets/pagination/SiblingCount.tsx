import { create, tsx } from '@dojo/framework/core/vdom';
import Pagination from '@dojo/widgets/pagination';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';

interface BasicCache {
	currentPage: number;
}

const icache = createICacheMiddleware<BasicCache>();
const factory = create({ icache });

export default factory(function Sibling({ middleware: { icache } }) {
	const currentPage = icache.getOrSet('currentPage', 8);

	return (
		<Example>
			<Pagination
				initialPage={8}
				total={25}
				siblingCount={2}
				onPage={(value) => {
					icache.set('currentPage', value);
				}}
			/>
			<div>Current page is: {currentPage.toString()}</div>
		</Example>
	);
});
