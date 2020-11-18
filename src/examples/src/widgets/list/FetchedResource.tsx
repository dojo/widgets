import { create, tsx } from '@dojo/framework/core/vdom';
import List from '@dojo/widgets/list';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import {
	createResourceTemplate,
	createResourceMiddleware,
	defaultFind
} from '@dojo/framework/core/middleware/resources';

interface User {
	id: string;
	firstName: string;
	lastName: string;
}

const template = createResourceTemplate<User>({
	find: defaultFind,
	read: async (request, { put }) => {
		const { offset, size, query } = request;
		let url = `https://mixolydian-appendix.glitch.me/user?`;

		const pageNumber = offset / size + 1;
		url = `${url}page=${pageNumber}&size=${size}`;

		if (query) {
			Object.keys(query).forEach((key) => {
				if (query[key as keyof User]) {
					url = `${url}&${key}=${query[key as keyof User]}`;
				}
			});
		}

		const response = await fetch(url, {
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const data: {
			data: User[];
			total: number;
		} = await response.json();

		put(
			{
				data: data.data,
				total: data.total
			},
			request
		);
	}
});

const resource = createResourceMiddleware();
const factory = create({ icache, resource });

export default factory(function FetchedResource({ middleware: { icache, resource } }) {
	return (
		<Example>
			<List
				resource={resource({
					template,
					transform: { value: 'id', label: 'firstName' }
				})}
				onValue={(value) => {
					icache.set('value', value);
				}}
				itemsInView={10}
			/>
			<p>{`Clicked on: ${JSON.stringify(icache.getOrSet('value', ''))}`}</p>
		</Example>
	);
});
